import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const MAX_FAILURES = 2;
const BLOCK_DURATION_MS = 5 * 60 * 1000;
const attempts = globalThis.__parkjuimAdminLoginAttempts || new Map();
globalThis.__parkjuimAdminLoginAttempts = attempts;

const getClientIp = (request) => {
  const forwarded = request.headers.get('x-vercel-forwarded-for')
    || request.headers.get('cf-connecting-ip')
    || request.headers.get('x-real-ip')
    || request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || 'unknown';
};

const blockedResponse = (blockedUntil) => {
  const retryAfter = Math.max(1, Math.ceil((blockedUntil - Date.now()) / 1000));
  return NextResponse.json(
    { error: `로그인 실패 횟수를 초과했습니다. ${Math.ceil(retryAfter / 60)}분 후 다시 시도해주세요.` },
    { status: 429, headers: { 'Retry-After': String(retryAfter) } },
  );
};

const currentAttempt = (ip, now) => {
  const saved = attempts.get(ip);
  if (!saved) return null;
  if (saved.blockedUntil > now) return saved;
  if (now - saved.firstFailedAt < BLOCK_DURATION_MS) return saved;
  attempts.delete(ip);
  return null;
};

const trimExpiredAttempts = (now) => {
  if (attempts.size < 5000) return;
  for (const [ip, saved] of attempts) {
    if (saved.blockedUntil <= now && now - saved.firstFailedAt >= BLOCK_DURATION_MS) attempts.delete(ip);
  }
  if (attempts.size >= 5000) attempts.delete(attempts.keys().next().value);
};

export async function POST(request) {
  const ip = getClientIp(request);
  const now = Date.now();
  trimExpiredAttempts(now);
  const existing = currentAttempt(ip, now);

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

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
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
    attempts.set(ip, next);

    if (next.blockedUntil) return blockedResponse(next.blockedUntil);
    return NextResponse.json(
      { error: '이메일 또는 비밀번호가 올바르지 않습니다. 한 번 더 실패하면 5분간 차단됩니다.' },
      { status: 401 },
    );
  }

  attempts.delete(ip);
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
