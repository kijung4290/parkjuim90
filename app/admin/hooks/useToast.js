'use client';

import { useCallback, useRef, useState } from 'react';

/** 화면 위쪽에 잠깐 떴다 사라지는 알림 문구를 관리합니다. */
export function useToast() {
    const [message, setMessage] = useState(null); // { type: 'ok' | 'error', text }
    const timerRef = useRef(null);

    const notify = useCallback((type, text) => {
        window.clearTimeout(timerRef.current);
        setMessage({ type, text });
        // 성공 알림만 자동으로 사라집니다. 오류는 직접 읽고 닫도록 남겨둡니다.
        if (type === 'ok') timerRef.current = window.setTimeout(() => setMessage(null), 3200);
    }, []);

    const dismiss = useCallback(() => {
        window.clearTimeout(timerRef.current);
        setMessage(null);
    }, []);

    return { message, notify, dismiss };
}
