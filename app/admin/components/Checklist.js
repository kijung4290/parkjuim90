'use client';

import { CircleCheck, Lightbulb, TriangleAlert } from 'lucide-react';

/**
 * 저장 전에 빠진 곳을 짚어주는 점검 목록입니다.
 *
 * '꼭 고칠 것'은 그대로 두면 사이트에서 내용이 숨겨지거나 비어 보이는 항목,
 * '이렇게 하면 더 좋아요'는 있어도 되고 없어도 되는 제안입니다.
 */
export function Checklist({ issues = [] }) {
    const problems = issues.filter((issue) => issue.level === 'problem');
    const hints = issues.filter((issue) => issue.level === 'hint');

    if (issues.length === 0) {
        return (
            <p className="admin-checklist-ok">
                <CircleCheck size={16} aria-hidden="true" /> 빠진 곳 없이 잘 채워져 있습니다.
            </p>
        );
    }

    return (
        <details className={`admin-checklist${problems.length > 0 ? ' has-problem' : ''}`} open={problems.length > 0}>
            <summary>
                {problems.length > 0
                    ? <><TriangleAlert size={16} aria-hidden="true" /> 꼭 고칠 것 {problems.length}개</>
                    : <><Lightbulb size={16} aria-hidden="true" /> 이렇게 하면 더 좋아요 {hints.length}개</>}
                {problems.length > 0 && hints.length > 0 && <em>· 제안 {hints.length}개</em>}
            </summary>

            <ul>
                {problems.map((issue, index) => (
                    <li className="is-problem" key={`problem-${index}`}>
                        <TriangleAlert size={14} aria-hidden="true" /> {issue.text}
                    </li>
                ))}
                {hints.map((issue, index) => (
                    <li key={`hint-${index}`}>
                        <Lightbulb size={14} aria-hidden="true" /> {issue.text}
                    </li>
                ))}
            </ul>
        </details>
    );
}
