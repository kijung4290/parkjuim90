'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * 로그인 상태를 지켜보고, 서버에 보낼 때 쓸 인증 요청 함수를 만들어줍니다.
 * 화면(page.js)은 "로그인했는지"만 알면 되도록 나머지는 여기에 모았습니다.
 */
export function useAdminSession() {
    const [session, setSession] = useState(null);
    const [checked, setChecked] = useState(false);
    const [signingIn, setSigningIn] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session: current } }) => {
            setSession(current);
            setChecked(true);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, current) => {
            setSession(current);
            setChecked(true);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signIn = useCallback(async (email, password) => {
        setSigningIn(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setSigningIn(false);
        return error ? error.message : null;
    }, []);

    const signOut = useCallback(async () => {
        await supabase.auth.signOut();
        setSession(null);
    }, []);

    /** 저장·초기화·파일 올리기 요청에 로그인 토큰을 함께 보냅니다. */
    const authorizedFetch = useCallback(async (url, options = {}) => {
        const { data: { session: current } } = await supabase.auth.getSession();
        if (!current?.access_token) throw new Error('로그인이 만료되었습니다. 다시 로그인해주세요.');

        // 파일 전송(FormData)은 브라우저가 경계 문자열까지 포함해 헤더를 만들어야 하므로 직접 지정하지 않습니다.
        const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
        return fetch(url, {
            ...options,
            headers: {
                ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
                Authorization: `Bearer ${current.access_token}`,
                ...options.headers,
            },
        });
    }, []);

    return {
        session,
        checked,
        signingIn,
        isLoggedIn: Boolean(session),
        signIn,
        signOut,
        authorizedFetch,
    };
}
