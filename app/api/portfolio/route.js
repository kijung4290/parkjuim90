import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getPortfolioData, savePortfolioData } from '@/lib/data';
import { getRequestUser } from '@/lib/supabaseServer';

export async function GET() {
    const data = await getPortfolioData();
    return NextResponse.json(data);
}

export async function POST(request) {
    // 로그인한 관리자만 전체 내용을 덮어쓸 수 있습니다.
    const user = await getRequestUser(request);
    if (!user) {
        return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    try {
        const body = await request.json();

        if (!body || typeof body !== 'object' || Array.isArray(body)) {
            return NextResponse.json({ error: '잘못된 형식입니다.' }, { status: 400 });
        }

        const success = await savePortfolioData(body);
        if (!success) {
            return NextResponse.json({ error: '저장에 실패했습니다.' }, { status: 500 });
        }

        // 홈 화면 캐시를 비워 수정 내용이 바로 보이게 합니다.
        revalidatePath('/');
        return NextResponse.json({ message: 'Saved successfully' });
    } catch (error) {
        console.error('포트폴리오 저장 오류:', error);
        return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
    }
}
