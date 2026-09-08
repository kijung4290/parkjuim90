import { NextResponse } from 'next/server';

const ALLOWED_IMAGE_HOSTS = new Set([
  'blogthumb.pstatic.net',
  'postfiles.pstatic.net',
  'blogpfthumb.phinf.naver.net',
]);
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export async function GET(request) {
  const source = request.nextUrl.searchParams.get('url');

  try {
    const imageUrl = new URL(source || '');
    if (imageUrl.protocol !== 'https:' || !ALLOWED_IMAGE_HOSTS.has(imageUrl.hostname)) {
      return NextResponse.json({ error: '허용되지 않은 이미지 주소입니다.' }, { status: 400 });
    }

    const response = await fetch(imageUrl, {
      headers: {
        Referer: 'https://blog.naver.com/parkjuim90',
        'User-Agent': 'Mozilla/5.0 (compatible; Parkjuim90Portfolio/1.0)',
      },
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      return NextResponse.json({ error: '블로그 이미지를 불러오지 못했습니다.' }, { status: 502 });
    }

    const contentType = response.headers.get('content-type') || '';
    const contentLength = Number(response.headers.get('content-length') || 0);
    if (!contentType.startsWith('image/') || contentLength > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: '올바른 이미지가 아닙니다.' }, { status: 415 });
    }

    const body = await response.arrayBuffer();
    if (body.byteLength > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: '이미지 용량이 너무 큽니다.' }, { status: 413 });
    }

    return new NextResponse(body, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return NextResponse.json({ error: '이미지 주소가 올바르지 않습니다.' }, { status: 400 });
  }
}
