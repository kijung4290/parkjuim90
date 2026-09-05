'use client';

import { ArrowUpToLine, ChevronDown, ChevronUp, Copy, Trash2, TriangleAlert } from 'lucide-react';

/**
 * 반복 항목 하나를 감싸며 순서 이동·복제·삭제 버튼을 제공합니다.
 * 펼침 여부는 목록(EditorList)이 들고 있어서 새로 추가한 항목을 바로 열어줄 수 있습니다.
 */
export function ItemCard({
    domId,
    label,
    title,
    subtitle,
    problemCount = 0,
    index,
    total,
    open,
    onToggle,
    onMove,
    onMoveTop,
    onDuplicate,
    onRemove,
    children,
}) {
    const stop = (event) => event.stopPropagation();

    return (
        <details
            className={`admin-item${problemCount > 0 ? ' has-problem' : ''}`}
            id={domId}
            open={open}
            onToggle={(event) => onToggle(event.currentTarget.open)}
        >
            <summary className="admin-item-head">
                <span className="admin-item-heading">
                    <span className="admin-item-label">
                        {label} {index + 1}
                        {problemCount > 0 && (
                            <b className="admin-item-warn" title={`고칠 곳 ${problemCount}개`}>
                                <TriangleAlert size={12} aria-hidden="true" /> {problemCount}
                            </b>
                        )}
                    </span>
                    <strong>{title || `제목 없는 ${label}`}</strong>
                    {subtitle && <small>{subtitle}</small>}
                </span>

                <div className="admin-item-tools" onClick={stop}>
                    {onMoveTop && (
                        <button type="button" title="맨 위로" aria-label={`${label} ${index + 1} 맨 위로`}
                            disabled={index === 0} onClick={() => onMoveTop(index)}>
                            <ArrowUpToLine size={15} aria-hidden="true" />
                        </button>
                    )}
                    <button type="button" title="위로" aria-label={`${label} ${index + 1} 위로 이동`}
                        disabled={index === 0} onClick={() => onMove(index, -1)}>
                        <ChevronUp size={16} aria-hidden="true" />
                    </button>
                    <button type="button" title="아래로" aria-label={`${label} ${index + 1} 아래로 이동`}
                        disabled={index === total - 1} onClick={() => onMove(index, 1)}>
                        <ChevronDown size={16} aria-hidden="true" />
                    </button>
                    {onDuplicate && (
                        <button type="button" title="복제" aria-label={`${title || label} 복제`} onClick={() => onDuplicate(index)}>
                            <Copy size={15} aria-hidden="true" />
                        </button>
                    )}
                    <button type="button" className="is-danger" title="삭제" aria-label={`${title || label} 삭제`} onClick={() => onRemove(index)}>
                        <Trash2 size={15} aria-hidden="true" />
                    </button>
                </div>

                <ChevronDown className="admin-item-chevron" size={18} aria-hidden="true" />
            </summary>

            <div className="admin-item-content">{children}</div>
        </details>
    );
}
