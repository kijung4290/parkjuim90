import { NextResponse } from 'next/server';
import { SERVICES } from '@/lib/seo';

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REQUEST_LABELS = {
  ...Object.fromEntries(SERVICES.map((service) => [service.id, service.name])),
  collaboration: '도구 도입·협업',
  other: '기타 문의',
};
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 3;
const rateLimitStore = globalThis.__contactRateLimitStore || new Map();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__contactRateLimitStore = rateLimitStore;
}

function normalizeText(value, maxLength) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function getClientIp(request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
}

function isRateLimited(ip) {
  const now = Date.now();
  const attempts = (rateLimitStore.get(ip) || []).filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);

  if (attempts.length >= RATE_LIMIT_MAX) {
    rateLimitStore.set(ip, attempts);
    return true;
  }

  attempts.push(now);
  rateLimitStore.set(ip, attempts);
  return false;
}

function hasValidOrigin(request) {
  const origin = request.headers.get('origin');
  if (!origin) return true;

  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

export async function POST(request) {
  if (!hasValidOrigin(request)) {
    return NextResponse.json({ error: '허용되지 않은 요청입니다.' }, { status: 403 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: '잘못된 요청 형식입니다.' }, { status: 400 });
  }

  // 화면에는 보이지 않는 필드입니다. 자동 입력 봇이면 성공처럼 응답하되 메일은 보내지 않습니다.
  if (normalizeText(body?.website, 200)) {
    return NextResponse.json({ ok: true });
  }

  const requestType = normalizeText(body?.requestType, 50);
  const name = normalizeText(body?.name, 60);
  const organization = normalizeText(body?.organization, 100);
  const replyEmail = normalizeText(body?.replyEmail, 254).toLowerCase();
  const message = normalizeText(body?.message, 3000);
  const startedAt = Number(body?.startedAt);

  if (!REQUEST_LABELS[requestType] || !name || !message || !EMAIL_PATTERN.test(replyEmail)) {
    return NextResponse.json({ error: '입력 내용을 다시 확인해주세요.' }, { status: 400 });
  }

  if (!Number.isFinite(startedAt) || Date.now() - startedAt < 2000 || Date.now() - startedAt > 24 * 60 * 60 * 1000) {
    return NextResponse.json({ error: '페이지를 새로고침한 뒤 다시 시도해주세요.' }, { status: 400 });
  }

  if (isRateLimited(getClientIp(request))) {
    return NextResponse.json({ error: '문의가 연속으로 접수되었습니다. 15분 뒤 다시 시도해주세요.' }, { status: 429 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || 'parkjuim90@gmail.com';
  const from = process.env.CONTACT_FROM_EMAIL || '일잘알랩 <contact@parkjuim90.cloud>';

  if (!apiKey) {
    console.error('문의 메일 발송 실패: RESEND_API_KEY가 설정되지 않았습니다.');
    return NextResponse.json({ error: '메일 발송 설정이 완료되지 않았습니다.' }, { status: 503 });
  }

  const label = REQUEST_LABELS[requestType];
  const subject = `[포트폴리오] ${label} 문의 - ${organization || name}`;
  const plainText = [
    `[문의 종류] ${label}`,
    `[이름] ${name}`,
    `[소속·기관] ${organization || '미입력'}`,
    `[회신 이메일] ${replyEmail}`,
    '',
    '[문의 내용]',
    message,
    '',
    '---',
    'parkjuim90.cloud에서 접수된 문의입니다.',
  ].join('\n');
  const safeMessage = escapeHtml(message).replaceAll('\n', '<br>');
  const html = `
    <div style="font-family:Arial,'Apple SD Gothic Neo',sans-serif;max-width:640px;margin:0 auto;color:#17201f;line-height:1.7">
      <h1 style="font-size:22px;margin:0 0 20px">새로운 협업 문의가 도착했습니다.</h1>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
        <tbody>
          <tr><th style="width:110px;padding:9px;text-align:left;background:#f0f4f1">문의 종류</th><td style="padding:9px;border-bottom:1px solid #e5e7eb">${escapeHtml(label)}</td></tr>
          <tr><th style="padding:9px;text-align:left;background:#f0f4f1">이름</th><td style="padding:9px;border-bottom:1px solid #e5e7eb">${escapeHtml(name)}</td></tr>
          <tr><th style="padding:9px;text-align:left;background:#f0f4f1">소속·기관</th><td style="padding:9px;border-bottom:1px solid #e5e7eb">${escapeHtml(organization || '미입력')}</td></tr>
          <tr><th style="padding:9px;text-align:left;background:#f0f4f1">회신 이메일</th><td style="padding:9px;border-bottom:1px solid #e5e7eb">${escapeHtml(replyEmail)}</td></tr>
        </tbody>
      </table>
      <h2 style="font-size:16px;margin:0 0 8px">문의 내용</h2>
      <div style="padding:16px;background:#f7f8fa;border-radius:8px">${safeMessage}</div>
      <p style="margin-top:24px;color:#6b7280;font-size:12px">parkjuim90.cloud에서 접수된 문의입니다. 이 메일에 답장하면 문의자의 이메일로 전송됩니다.</p>
    </div>`;

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to: [to], reply_to: replyEmail, subject, text: plainText, html }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error('문의 메일 발송 실패:', response.status, detail);
      return NextResponse.json({ error: '메일을 보내지 못했습니다. 잠시 뒤 다시 시도해주세요.' }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('문의 메일 발송 오류:', error);
    return NextResponse.json({ error: '메일을 보내지 못했습니다. 잠시 뒤 다시 시도해주세요.' }, { status: 502 });
  }
}
