import { NextResponse } from 'next/server';
import { getPortfolioData, savePortfolioData } from '@/lib/data';

export async function POST(request) {
    try {
        const body = await request.json();
        const { author, emoji, message } = body;

        if (!author || !message) {
            return NextResponse.json({ error: 'Author and message are required' }, { status: 400 });
        }

        const data = await getPortfolioData();
        const guestbook = data.guestbook || [];

        const now = new Date();
        const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;

        const newEntry = {
            id: Date.now(),
            author: author.trim().slice(0, 30),
            emoji: emoji || '💬',
            message: message.trim().slice(0, 300),
            date: dateStr
        };

        const updatedData = {
            ...data,
            guestbook: [newEntry, ...guestbook]
        };

        await savePortfolioData(updatedData);

        return NextResponse.json({ success: true, entry: newEntry });
    } catch (error) {
        console.error("Guestbook error:", error);
        return NextResponse.json({ error: 'Failed to add guestbook entry' }, { status: 500 });
    }
}
