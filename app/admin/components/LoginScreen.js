'use client';

import { useState } from 'react';
import Link from 'next/link';

/** 관리자 로그인 화면입니다. */
export function LoginScreen({ busy, errorText, onSubmit }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className="admin-login">
            <div className="admin-login-card">
                <span className="brand-mark" aria-hidden="true">P/J</span>
                <h1>포트폴리오 관리자</h1>
                <p>Supabase 계정으로 로그인하면 사이트 내용을 수정할 수 있습니다.</p>

                {errorText && (
                    <div className="form-status form-status--error" role="status"><span>{errorText}</span></div>
                )}

                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        onSubmit(email, password);
                    }}
                >
                    <div className="form-field">
                        <label htmlFor="admin-email">이메일</label>
                        <input
                            id="admin-email"
                            type="email"
                            autoComplete="username"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="admin@example.com"
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor="admin-password">비밀번호</label>
                        <input
                            id="admin-password"
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button className="button button--primary" type="submit" disabled={busy}>
                        {busy ? '로그인 중…' : '로그인'}
                    </button>
                </form>

                <Link className="admin-back" href="/">사이트로 돌아가기</Link>
            </div>
        </div>
    );
}
