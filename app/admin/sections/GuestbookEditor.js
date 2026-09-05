'use client';

import { useMemo, useState } from 'react';
import { Search, Trash2, X } from 'lucide-react';
import { SectionShell } from '../components/SectionShell';

/** 방문자가 남긴 방명록을 확인하고 지웁니다. */
export function GuestbookEditor({ section, active, entries, mutations }) {
    const { list } = mutations;
    const [query, setQuery] = useState('');

    const normalized = query.trim().toLowerCase();
    const visible = useMemo(() => {
        const withIndex = entries.map((entry, index) => ({ entry, index }));
        if (!normalized) return withIndex;
        return withIndex.filter(({ entry }) =>
            `${entry.author || ''} ${entry.message || ''}`.toLowerCase().includes(normalized));
    }, [entries, normalized]);

    const remove = (index) => {
        const entry = entries[index];
        if (!window.confirm(`‘${entry.author || '익명'}’님이 남긴 글을 삭제할까요?\n삭제한 뒤 [저장하기]를 누르면 되돌릴 수 없습니다.`)) return;
        list.remove('guestbook', index);
    };

    return (
        <SectionShell section={section} active={active}>
            <p className="admin-slide-guide">
                방명록은 방문자가 직접 남기는 글이라 여기에서는 <strong>확인과 삭제만</strong> 할 수 있습니다.
                부적절한 글을 지운 뒤에는 반드시 위쪽 <strong>[저장하기]</strong>를 눌러야 사이트에 반영됩니다.
            </p>

            {entries.length > 5 && (
                <div className="admin-list-toolbar">
                    <div className="admin-search">
                        <Search size={16} aria-hidden="true" />
                        <input
                            type="search"
                            value={query}
                            placeholder="작성자·내용으로 검색"
                            aria-label="방명록 검색"
                            onChange={(event) => setQuery(event.target.value)}
                        />
                        {query && (
                            <button type="button" aria-label="검색어 지우기" onClick={() => setQuery('')}>
                                <X size={15} aria-hidden="true" />
                            </button>
                        )}
                    </div>
                    <div className="admin-list-toolbar-right">
                        <span className="admin-search-count">전체 {entries.length}개 중 {visible.length}개</span>
                    </div>
                </div>
            )}

            <div className="admin-list">
                {visible.map(({ entry, index }) => (
                    <div className="admin-item" key={entry.id || index}>
                        <div className="admin-item-head">
                            <span className="admin-item-heading">
                                <span className="admin-item-label">{entry.emoji || '💬'} {entry.author || '익명'}</span>
                                <strong>{entry.date}</strong>
                            </span>
                            <div className="admin-item-tools">
                                <button
                                    type="button"
                                    className="is-danger"
                                    title="삭제"
                                    aria-label={`${entry.author || '익명'}님의 방명록 삭제`}
                                    onClick={() => remove(index)}
                                >
                                    <Trash2 size={15} aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                        <p className="admin-guest-message">{entry.message}</p>
                    </div>
                ))}

                {entries.length === 0 && <p className="admin-empty">아직 남겨진 메시지가 없습니다.</p>}
                {entries.length > 0 && visible.length === 0 && (
                    <p className="admin-empty">‘{query}’과(와) 맞는 방명록이 없습니다.</p>
                )}
            </div>
        </SectionShell>
    );
}
