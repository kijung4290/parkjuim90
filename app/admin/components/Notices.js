'use client';

import { Check, History, X } from 'lucide-react';

/** 화면 위쪽에 잠깐 뜨는 알림입니다. 오류는 직접 닫을 때까지 남습니다. */
export function Toast({ message, onDismiss }) {
    if (!message) return null;

    return (
        <div className={`admin-toast admin-toast--${message.type}`} role="status">
            {message.type === 'ok' && <Check size={17} aria-hidden="true" />}
            <span>{message.text}</span>
            <button type="button" aria-label="알림 닫기" onClick={onDismiss}>
                <X size={15} aria-hidden="true" />
            </button>
        </div>
    );
}

const formatSavedAt = (savedAt) => {
    try {
        return new Date(savedAt).toLocaleString('ko-KR', {
            month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
        });
    } catch {
        return '';
    }
};

/**
 * 저장하지 않고 창을 닫았을 때 브라우저에 남겨둔 편집 내용을 되살릴지 물어봅니다.
 * 실수로 창을 닫아도 처음부터 다시 쓰지 않아도 됩니다.
 */
export function RecoveryBanner({ recovered, onApply, onDismiss }) {
    if (!recovered) return null;

    return (
        <div className="admin-recovery" role="status">
            <History size={18} aria-hidden="true" />
            <div>
                <strong>저장하지 않은 편집 내용이 남아 있습니다.</strong>
                <span>{formatSavedAt(recovered.savedAt)}에 이 브라우저에 임시 보관된 내용입니다.</span>
            </div>
            <div className="admin-recovery-actions">
                <button className="button button--primary button--small" type="button" onClick={onApply}>
                    이어서 편집하기
                </button>
                <button className="button button--ghost button--small" type="button" onClick={onDismiss}>
                    버리기
                </button>
            </div>
        </div>
    );
}
