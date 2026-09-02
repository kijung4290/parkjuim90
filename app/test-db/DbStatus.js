'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function DbStatus() {
    const [status, setStatus] = useState('확인 중…');
    const [envInfo, setEnvInfo] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        setEnvInfo({
            url: url ? `설정됨 ${url.includes('supabase.co') ? '(형식 정상)' : '(형식 확인 필요)'}` : '없음',
            key: key ? `설정됨 (길이 ${key.length})` : '없음',
        });

        if (!url || !key) {
            setStatus('실패: 환경변수가 없습니다.');
            return;
        }

        supabase
            .from('portfolio')
            .select('id', { count: 'exact', head: true })
            .then(({ error: queryError }) => {
                if (queryError) {
                    setStatus('실패: Supabase 오류');
                    setError(queryError.message + (queryError.hint ? ` (${queryError.hint})` : ''));
                } else {
                    setStatus('성공: Supabase에 연결되었습니다.');
                }
            });
    }, []);

    const ok = status.startsWith('성공');

    return (
        <div style={{ fontFamily: 'var(--font-mono)', margin: '0 auto', maxWidth: '640px', padding: '50px 24px' }}>
            <h1 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>Supabase 연결 테스트 (개발 모드 전용)</h1>
            <div style={{ background: 'var(--sage-soft)', borderRadius: '10px', margin: '20px 0', padding: '20px' }}>
                <p><strong>상태:</strong> <span style={{ color: ok ? 'var(--forest)' : 'var(--danger)', fontWeight: 700 }}>{status}</span></p>
                {error && <p style={{ color: 'var(--danger)', marginTop: '8px' }}><strong>오류:</strong> {error}</p>}
            </div>

            <h2 style={{ fontSize: '1rem', marginBottom: '8px' }}>환경변수</h2>
            <ul style={{ lineHeight: 1.9 }}>
                <li>NEXT_PUBLIC_SUPABASE_URL: {envInfo.url}</li>
                <li>NEXT_PUBLIC_SUPABASE_ANON_KEY: {envInfo.key}</li>
            </ul>

            <p style={{ color: 'var(--muted)', marginTop: '20px' }}>
                값이 없다면 <code>.env.local</code> 파일을 확인하고 개발 서버를 다시 실행해주세요.
            </p>
        </div>
    );
}
