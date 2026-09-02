import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { readPortfolio, savePortfolioData } from '@/lib/data';

const MAX_AUTHOR = 30;
const MAX_MESSAGE = 300;

const formatDate = (date) =>
    `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;

export async function POST(request) {
    try {
        const { author, emoji, message } = await request.json();

        if (typeof author !== 'string' || typeof message !== 'string' || !author.trim() || !message.trim()) {
            return NextResponse.json({ error: '이름과 메시지를 모두 입력해주세요.' }, { status: 400 });
        }

        const { content, readable } = await readPortfolio();

        // DB를 못 읽은 상태에서 저장하면 번들 JSON이 실제 데이터를 덮어씁니다.
        if (!readable) {
            return NextResponse.json({ error: '지금은 저장할 수 없습니다. 잠시 후 다시 시도해주세요.' }, { status: 503 });
        }

        const entry = {
            id: Date.now(),
            author: author.trim().slice(0, MAX_AUTHOR),
            emoji: typeof emoji === 'string' && emoji ? emoji.slice(0, 4) : '💬',
            message: message.trim().slice(0, MAX_MESSAGE),
            date: formatDate(new Date()),
        };

        const success = await savePortfolioData({
            ...content,
            guestbook: [entry, ...(content.guestbook || [])],
        });

        if (!success) {
            return NextResponse.json({ error: '저장에 실패했습니다.' }, { status: 500 });
        }

        revalidatePath('/');
        return NextResponse.json({ success: true, entry });
    } catch (error) {
        console.error('방명록 오류:', error);
        return NextResponse.json({ error: '메시지를 등록하지 못했습니다.' }, { status: 500 });
    }
}
