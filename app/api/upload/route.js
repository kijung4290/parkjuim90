import { NextResponse } from 'next/server';
import { writeClient, getRequestUser } from '@/lib/supabaseServer';

/** 사진을 보관하는 Supabase Storage 버킷 이름입니다(supabase_schema.sql 참고). */
export const MEDIA_BUCKET = 'portfolio-media';

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/avif': 'avif',
};

const safeFolder = (value) => (/^[a-z0-9-]{1,32}$/.test(value || '') ? value : 'uploads');

/**
 * 관리자가 고른 사진 파일을 Supabase Storage에 올리고 공개 주소를 돌려줍니다.
 * 로그인한 관리자만 올릴 수 있고, 이미지 형식과 용량을 서버에서 다시 확인합니다.
 */
export async function POST(request) {
    const user = await getRequestUser(request);
    if (!user) {
        return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    let form;
    try {
        form = await request.formData();
    } catch {
        return NextResponse.json({ error: '파일을 읽지 못했습니다.' }, { status: 400 });
    }

    const file = form.get('file');
    if (!file || typeof file.arrayBuffer !== 'function') {
        return NextResponse.json({ error: '올릴 파일이 없습니다.' }, { status: 400 });
    }

    const extension = ALLOWED_TYPES[file.type];
    if (!extension) {
        return NextResponse.json({ error: 'JPG · PNG · WEBP · GIF · AVIF 이미지만 올릴 수 있습니다.' }, { status: 415 });
    }
    if (file.size > MAX_BYTES) {
        return NextResponse.json({ error: '사진 한 장은 5MB까지 올릴 수 있습니다.' }, { status: 413 });
    }

    const folder = safeFolder(form.get('folder'));
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;

    try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const { error } = await writeClient.storage
            .from(MEDIA_BUCKET)
            .upload(path, buffer, { contentType: file.type, cacheControl: '31536000', upsert: false });

        if (error) {
            console.warn('사진 업로드 실패:', error.message);
            const notFound = /bucket/i.test(error.message) && /not found|does not exist/i.test(error.message);
            return NextResponse.json({
                error: notFound
                    ? `Supabase에 '${MEDIA_BUCKET}' 저장소가 없습니다. supabase_schema.sql의 저장소 설정을 먼저 실행해주세요.`
                    : `사진을 저장하지 못했습니다: ${error.message}`,
            }, { status: 502 });
        }

        const { data } = writeClient.storage.from(MEDIA_BUCKET).getPublicUrl(path);
        return NextResponse.json({ url: data.publicUrl, path });
    } catch (error) {
        console.error('사진 업로드 중 오류:', error);
        return NextResponse.json({ error: '서버 오류로 사진을 올리지 못했습니다.' }, { status: 500 });
    }
}
