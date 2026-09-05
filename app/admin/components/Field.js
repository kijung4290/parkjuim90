'use client';

import { useEffect, useState } from 'react';
import { fromLines, toLines } from '../lib/portfolio';

/**
 * 라벨과 입력칸을 함께 묶어주는 작은 헬퍼입니다.
 *
 * required — 비면 사이트에서 숨겨지는 칸에 '필수' 표시를 붙입니다.
 * limit    — 권장 글자 수. 넘어도 저장은 되지만 색으로 알려줍니다.
 */
export function Field({ label, hint, required = false, wide = false, limit, value, children }) {
    const length = typeof value === 'string' ? value.trim().length : null;
    const over = Boolean(limit && length !== null && length > limit);

    return (
        <label className={`admin-field${wide ? ' admin-span-all' : ''}`}>
            <span>
                {label}
                {required && <b className="admin-required">필수</b>}
                {hint && <em>{hint}</em>}
                {limit && length !== null && (
                    <i className={`admin-counter${over ? ' is-over' : ''}`}>
                        {length}/{limit}자
                    </i>
                )}
            </span>
            {children}
        </label>
    );
}

/**
 * '한 줄에 하나씩' 적는 목록 입력칸입니다.
 *
 * 입력한 글을 그때그때 배열로 바꿔 저장하면 줄 끝에서 Enter를 눌러도
 * 빈 줄이 곧바로 지워져 다음 줄로 넘어가지 않습니다.
 * 그래서 화면에 보이는 글자는 이 컴포넌트가 따로 들고 있습니다.
 */
export function LineListField({ label, hint = '한 줄에 하나씩', value, onChange, placeholder, wide = false }) {
    const items = Array.isArray(value) ? value : [];
    const [text, setText] = useState(() => toLines(items));

    // 바깥에서 값이 바뀐 경우(변경 취소·불러오기)에만 입력칸을 다시 맞춥니다.
    useEffect(() => {
        const current = Array.isArray(value) ? value : [];
        if (fromLines(text).join('\n') !== current.join('\n')) setText(toLines(current));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const handleChange = (nextText) => {
        setText(nextText);
        onChange(fromLines(nextText));
    };

    return (
        <div className={`admin-field${wide ? ' admin-span-all' : ''}`}>
            <span>
                {label}
                <em>{hint}</em>
                {items.length > 0 && <i className="admin-counter">{items.length}개</i>}
            </span>
            <textarea value={text} placeholder={placeholder} onChange={(event) => handleChange(event.target.value)} />
            {items.length > 0 && (
                <ul className="admin-chips" aria-label={`${label} 미리보기`}>
                    {items.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
                </ul>
            )}
        </div>
    );
}
