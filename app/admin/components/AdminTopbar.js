'use client';

import Link from 'next/link';
import { Check, ExternalLink, LogOut, Save, TriangleAlert, Undo2 } from 'lucide-react';

const formatTime = (date) =>
    date?.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

/**
 * 화면 맨 위에 늘 붙어 있는 줄입니다.
 * "지금 저장됐는지 / 안 됐는지"를 한눈에 알 수 있게 하는 것이 가장 중요한 역할입니다.
 */
export function AdminTopbar({ isDirty, busy, problemCount, lastSavedAt, onSave, onDiscard, onLogout }) {
    return (
        <header className="admin-topbar">
            <div className="admin-topbar-inner">
                <div className="admin-title">
                    <span className="brand-mark" aria-hidden="true">P/J</span>
                    <strong>포트폴리오 관리자</strong>
                </div>

                <div className="admin-actions">
                    <span className={`admin-save-state${isDirty ? ' is-dirty' : ''}`} aria-live="polite">
                        {isDirty
                            ? <><span className="admin-status-dot" /> 저장하지 않은 변경사항</>
                            : <><Check size={15} aria-hidden="true" /> 모두 저장됨{lastSavedAt && ` · ${formatTime(lastSavedAt)}`}</>}
                    </span>

                    {problemCount > 0 && (
                        <span className="admin-problem-pill" title="왼쪽 메뉴에서 느낌표가 붙은 항목을 확인해주세요">
                            <TriangleAlert size={14} aria-hidden="true" /> 고칠 곳 {problemCount}
                        </span>
                    )}

                    <Link className="button button--secondary button--small" href="/" target="_blank" rel="noreferrer">
                        <ExternalLink size={16} aria-hidden="true" /> 사이트 보기
                    </Link>

                    {isDirty && (
                        <button className="button button--ghost button--small" type="button" onClick={onDiscard} disabled={busy}>
                            <Undo2 size={16} aria-hidden="true" /> 변경 취소
                        </button>
                    )}

                    <button
                        className="button button--primary button--small"
                        type="button"
                        onClick={onSave}
                        disabled={busy || !isDirty}
                        title="단축키: Ctrl + S"
                    >
                        <Save size={16} aria-hidden="true" /> {busy ? '저장 중…' : '저장하기'}
                    </button>

                    <button className="admin-icon-button" type="button" onClick={onLogout} title="로그아웃" aria-label="로그아웃">
                        <LogOut size={18} aria-hidden="true" />
                    </button>
                </div>
            </div>
        </header>
    );
}
