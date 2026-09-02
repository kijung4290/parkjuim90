import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { savePortfolioData } from '@/lib/data';
import { getRequestUser } from '@/lib/supabaseServer';
import initialPortfolioData from '@/data/portfolio.json';

/**
 * 코드에 포함된 포트폴리오와 현재 도구 목록을 Supabase에 덮어씁니다.
 * 저장된 내용을 모두 지우는 작업이므로 로그인한 관리자만 호출할 수 있습니다.
 */
export async function POST(request) {
    const user = await getRequestUser(request);
    if (!user) {
        return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const success = await savePortfolioData(initialPortfolioData);
    if (!success) {
        return NextResponse.json({ error: '초기 데이터 저장에 실패했습니다.' }, { status: 500 });
    }

    revalidatePath('/');
    return NextResponse.json({ message: '코드의 기본 포트폴리오 내용을 Supabase에 반영했습니다.' });
}
