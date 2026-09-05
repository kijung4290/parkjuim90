'use client';

import { useMemo, useState } from 'react';
import { ChevronsDownUp, ChevronsUpDown, Search, X } from 'lucide-react';
import { ItemCard } from './ItemCard';

const keyOf = (item, index) => String(item?.id ?? `index-${index}`);

/**
 * 반복 항목을 다루는 목록 화면입니다.
 * 추가·검색·펼침·순서·복제·삭제처럼 어느 항목에서나 똑같이 필요한 일을 여기서 한 번만 처리합니다.
 *
 * 새로 추가한 항목은 자동으로 펼쳐지고 화면 가운데로 스크롤됩니다.
 * "추가 버튼을 눌렀는데 아무 일도 안 일어난 것처럼 보이는" 상황을 막기 위해서입니다.
 */
export function EditorList({
    sectionId,
    itemLabel,
    items = [],
    getTitle = (item) => item?.title,
    getSubtitle,
    getProblemCount,
    getSearchText,
    searchPlaceholder,
    emptyText,
    addButtons = [],
    onAdd,
    onMove,
    onMoveTop,
    onDuplicate,
    onRemove,
    renderItem,
    listClassName = '',
}) {
    // 처음 들어오면 첫 항목만 펼쳐 보여줍니다.
    const [openKeys, setOpenKeys] = useState(() => new Set(items.length ? [keyOf(items[0], 0)] : []));
    const [query, setQuery] = useState('');

    const searchable = Boolean(getSearchText) && items.length > 5;
    const normalizedQuery = query.trim().toLowerCase();

    // 걸러 보여줄 때도 원래 순번을 함께 들고 다녀야 순서 이동·삭제가 어긋나지 않습니다.
    const visible = useMemo(() => {
        const withIndex = items.map((item, index) => ({ item, index }));
        if (!searchable || !normalizedQuery) return withIndex;
        return withIndex.filter(({ item }) =>
            String(getSearchText(item) || '').toLowerCase().includes(normalizedQuery));
    }, [getSearchText, items, normalizedQuery, searchable]);

    const setOpen = (key, open) => setOpenKeys((previous) => {
        const next = new Set(previous);
        if (open) next.add(key);
        else next.delete(key);
        return next;
    });

    const handleAdd = (create) => {
        const item = create();
        const key = keyOf(item, items.length);
        onAdd(item);
        setQuery('');
        setOpenKeys(new Set([key]));
        // 새 항목이 화면에 그려진 뒤에 스크롤해야 위치가 맞습니다.
        window.requestAnimationFrame(() => {
            document.getElementById(`${sectionId}-${key}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    };

    const handleRemove = (index) => {
        const name = getTitle(items[index]) || `${index + 1}번째 ${itemLabel}`;
        if (!window.confirm(`‘${name}’ 항목을 삭제할까요?\n삭제한 뒤 [저장하기]를 누르면 되돌릴 수 없습니다.`)) return;
        onRemove(index);
    };

    const handleDuplicate = onDuplicate
        ? (index) => {
            onDuplicate(index);
            setOpenKeys(new Set());
        }
        : undefined;

    return (
        <>
            {(searchable || (items.length > 1 && addButtons.length === 0)) && (
                <div className="admin-list-toolbar">
                    {searchable && (
                        <div className="admin-search">
                            <Search size={16} aria-hidden="true" />
                            <input
                                type="search"
                                value={query}
                                placeholder={searchPlaceholder || `${itemLabel} 검색`}
                                aria-label={`${itemLabel} 검색`}
                                onChange={(event) => setQuery(event.target.value)}
                            />
                            {query && (
                                <button type="button" aria-label="검색어 지우기" onClick={() => setQuery('')}>
                                    <X size={15} aria-hidden="true" />
                                </button>
                            )}
                        </div>
                    )}
                    <div className="admin-list-toolbar-right">
                        {normalizedQuery && <span className="admin-search-count">{visible.length}개 찾음</span>}
                        <button
                            className="button button--ghost button--small"
                            type="button"
                            onClick={() => setOpenKeys(new Set(items.map(keyOf)))}
                        >
                            <ChevronsUpDown size={15} aria-hidden="true" /> 모두 펼치기
                        </button>
                        <button
                            className="button button--ghost button--small"
                            type="button"
                            onClick={() => setOpenKeys(new Set())}
                        >
                            <ChevronsDownUp size={15} aria-hidden="true" /> 모두 접기
                        </button>
                    </div>
                </div>
            )}

            <div className={`admin-list ${listClassName}`.trim()}>
                {visible.map(({ item, index }) => {
                    const key = keyOf(item, index);
                    return (
                        <ItemCard
                            key={key}
                            domId={`${sectionId}-${key}`}
                            label={itemLabel}
                            title={getTitle(item)}
                            subtitle={getSubtitle?.(item)}
                            problemCount={getProblemCount?.(item, index) || 0}
                            index={index}
                            total={items.length}
                            open={openKeys.has(key)}
                            onToggle={(open) => setOpen(key, open)}
                            onMove={onMove}
                            onMoveTop={onMoveTop}
                            onDuplicate={handleDuplicate}
                            onRemove={handleRemove}
                        >
                            {renderItem(item, index)}
                        </ItemCard>
                    );
                })}

                {items.length === 0 && <p className="admin-empty">{emptyText}</p>}
                {items.length > 0 && visible.length === 0 && (
                    <p className="admin-empty">‘{query}’과(와) 맞는 {itemLabel}이(가) 없습니다.</p>
                )}
            </div>

            {addButtons.length > 0 && (
                <div className="admin-add-footer">
                    {addButtons.map((action) => (
                        <button
                            className="button button--soft button--small"
                            type="button"
                            key={action.label}
                            onClick={() => handleAdd(action.create)}
                        >
                            {action.icon && <action.icon size={16} aria-hidden="true" />} {action.label}
                        </button>
                    ))}
                </div>
            )}
        </>
    );
}
