import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { createHmac } from 'node:crypto';

export const dynamic = 'force-dynamic';

const MAX_FAILURES = 2;
const BLOCK_DURATION_MS = 5 * 60 * 1000;
const ATTEMPTS_TABLE = 'admin_login_attempts';
const MEMORY_LIMIT = 5000;

const attempts = globalThis.__parkjuimAdminLoginAttempts || new Map();
globalThis.__parkjuimAdminLoginAttempts = attempts;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * 서버리스 환경에서는 요청마다 다른 인스턴스가 처리할 수 있어서, 메모리에만 둔
 * 실패 횟수는 쉽게 초기화됩니다(차단을 우회할 수 있습니다).
 * 서비스 롤 키가 있으면 실패 기록을 DB에 남겨 인스턴스 사이에서 공유하고,
 * 없으면(로컬 개발 등) 예전처럼 메모리로만 처리합니다.
 */
const rateLimitClient = supabaseUrl && serviceRoleKey
  ? createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })
  : null;

const getClientIp = (request) => {
  const forwarded = request.headers.get('x-vercel-forwarded-for')
    || request.headers.get('cf-connecting-ip')
    || request.headers.get('x-real-ip')
    || request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || 'unknown';
};

/** IP는 그대로 남기지 않고 서버 전용 키로 해시해서 저장합니다. */
const hashIp = (ip) => createHmac('sha256', serviceRoleKey).update(ip).digest('hex');

const blockedResponse = (blockedUntil) => {
  const retryAfter = Math.max(1, Math.ceil((blockedUntil - Date.now()) / 1000));
  return NextResponse.json(
    { error: `로그인 실패 횟수를 초과했습니다. ${Math.ceil(retryAfter / 60)}분 후 다시 시도해주세요.` },
    { status: 429, headers: { 'Retry-After': String(retryAfter) } },
  );
};

/** 차단이 남아 있거나 실패 묶음 시간(5분) 안이면 아직 살아 있는 기록입니다. */
const isLive = (saved, now) => Boolean(saved)
  && (saved.blockedUntil > now || now - saved.firstFailedAt < BLOCK_DURATION_MS);

const memoryAttempt = (ip, now) => {
  const saved = attempts.get(ip);
  if (!saved) return null;
  if (isLive(saved, now)) return saved;
  attempts.delete(ip);
  return null;
};

const trimExpiredAttempts = (now) => {
  if (attempts.size < MEMORY_LIMIT) return;
  for (const [ip, saved] of attempts) {
    if (!isLive(saved, now)) attempts.delete(ip);
  }
  if (attempts.size >= MEMORY_LIMIT) attempts.delete(attempts.keys().next().value);
};

const toAttempt = (row) => ({
  failedCount: Number(row.failed_count) || 0,
  firstFailedAt: Date.parse(row.first_failed_at) || 0,
  blockedUntil: row.blocked_until ? Date.parse(row.blocked_until) || 0 : 0,
});

/** 지나간 기록은 쌓아둘 이유가 없으므로 실패를 기록할 때 함께 지웁니다. */
const deleteExpiredRows = async (now) => {
  const nowIso = new Date(now).toISOString();
  const windowStartIso = new Date(now - BLOCK_DURATION_MS).toISOString();
  try {
    await rateLimitClient
      .from(ATTEMPTS_TABLE)
      .delete()
      .lt('first_failed_at', windowStartIso)
      .or(`blocked_until.is.null,blocked_until.lte.${nowIso}`);
  } catch {
    // 청소는 실패해도 로그인 처리에 영향이 없으므로 넘어갑니다.
  }
};

/**
 * 이 IP의 실패 기록을 읽고, 어디에 저장할지도 함께 알려줍니다.
 * DB 조회가 실패하면 메모리 기록으로 내려가 로그인 자체는 계속 되게 합니다.
 */
const loadAttempt = async (ip, now) => {
  // IP를 알 수 없으면(프록시 헤더가 없는 로컬 등) 모든 방문자가 한 칸을 공유하게 되므로
  // DB에 남기지 않습니다. 남기면 실패 두 번으로 모두가 함께 잠깁니다.
  if (!rateLimitClient || ip === 'unknown') {
    const saved = memoryAttempt(ip, now);
    return { store: 'memory', found: Boolean(saved), existing: saved };
  }

  try {
    const key = hashIp(ip);
    const { data, error } = await rateLimitClient
      .from(ATTEMPTS_TABLE)
      .select('failed_count, first_failed_at, blocked_until')
      .eq('ip_hash', key)
      .maybeSingle();
    if (error) throw error;

    const saved = data ? toAttempt(data) : null;
    return {
      store: 'database',
      key,
      // found는 "행이 있는지", existing은 "아직 유효한 기록인지"입니다.
      // 차단이 끝난 행도 지워야 하므로 둘을 나눠 둡니다.
      found: Boolean(data),
      existing: isLive(saved, now) ? saved : null,
    };
  } catch (error) {
    console.warn('로그인 실패 기록 조회 실패, 메모리 기록으로 대체합니다:', error?.message || error);
    const saved = memoryAttempt(ip, now);
    return { store: 'memory', found: Boolean(saved), existing: saved };
  }
};

/** next가 null이면 "기록 지우기"(로그인 성공)입니다. */
const saveAttempt = async (target, ip, next, now) => {
  // 지울 기록이 아예 없으면(대부분의 정상 로그인) 헛된 쓰기를 하지 않습니다.
  if (!next && !target.found) {
    attempts.delete(ip);
    return;
  }

  if (target.store === 'database') {
    try {
      const { error } = next
        ? await rateLimitClient.from(ATTEMPTS_TABLE).upsert({
          ip_hash: target.key,
          failed_count: next.failedCount,
          first_failed_at: new Date(next.firstFailedAt).toISOString(),
          blocked_until: next.blockedUntil ? new Date(next.blockedUntil).toISOString() : null,
        })
        : await rateLimitClient.from(ATTEMPTS_TABLE).delete().eq('ip_hash', target.key);
      if (error) throw error;

      if (next) await deleteExpiredRows(now);
      attempts.delete(ip);
      return;
    } catch (error) {
      console.warn('로그인 실패 기록 저장 실패, 메모리 기록으로 대체합니다:', error?.message || error);
    }
  }

  if (next) attempts.set(ip, next);
  else attempts.delete(ip);
};

export async function POST(request) {
  const ip = getClientIp(request);
  const now = Date.now();
  trimExpiredAttempts(now);
  const target = await loadAttempt(ip, now);
  const existing = target.existing;

  if (existing?.blockedUntil > now) return blockedResponse(existing.blockedUntil);

  let credentials;
  try {
    credentials = await request.json();
  } catch {
    return NextResponse.json({ error: '로그인 정보가 올바르지 않습니다.' }, { status: 400 });
  }

  const email = typeof credentials?.email === 'string' ? credentials.email.trim() : '';
  const password = typeof credentials?.password === 'string' ? credentials.password : '';
  if (!email || !password) {
    return NextResponse.json({ error: '이메일과 비밀번호를 입력해주세요.' }, { status: 400 });
  }
  if (email.length > 320 || password.length > 1024) {
    return NextResponse.json({ error: '로그인 정보가 올바르지 않습니다.' }, { status: 400 });
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ error: '로그인 서비스 설정을 확인해주세요.' }, { status: 503 });
  }

  let data;
  let error;
  try {
    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
    ({ data, error } = await authClient.auth.signInWithPassword({ email, password }));
  } catch {
    return NextResponse.json({ error: '로그인 서비스에 연결하지 못했습니다.' }, { status: 503 });
  }

  if (error || !data?.session) {
    const failedCount = (existing?.failedCount || 0) + 1;
    const next = {
      failedCount,
      firstFailedAt: existing?.firstFailedAt || now,
      blockedUntil: failedCount >= MAX_FAILURES ? now + BLOCK_DURATION_MS : 0,
    };
    await saveAttempt(target, ip, next, now);

    if (next.blockedUntil) return blockedResponse(next.blockedUntil);
    return NextResponse.json(
      { error: '이메일 또는 비밀번호가 올바르지 않습니다. 한 번 더 실패하면 5분간 차단됩니다.' },
      { status: 401 },
    );
  }

  await saveAttempt(target, ip, null, now);
  return NextResponse.json(
    {
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      },
    },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
