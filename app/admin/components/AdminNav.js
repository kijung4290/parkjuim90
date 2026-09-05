'use client';

import { SECTIONS } from '../constants';
import { getSectionCount } from '../lib/portfolio';
import { countProblems } from '../lib/checklist';

/**
 * 왼쪽(작은 화면에서는 위쪽) 항목 메뉴입니다.
 * 항목 개수와 함께 '고칠 곳이 있는지'를 빨간 점으로 알려줘서
 * 어디부터 손대야 할지 바로 알 수 있게 했습니다.
 */
export function AdminNav({ data, issues, activeSection, onSelect }) {
    return (
        <nav className="admin-nav" aria-label="관리 항목">
            {SECTIONS.map((section) => {
                const count = getSectionCount(data, section.id);
                const problems = countProblems(issues[section.id]);
                const active = activeSection === section.id;

                return (
                    <button
                        className={active ? 'is-active' : ''}
                        type="button"
                        key={section.id}
                        aria-current={active ? 'true' : undefined}
                        onClick={() => onSelect(section.id)}
                    >
                        <section.icon size={19} aria-hidden="true" />
                        <span>
                            <strong>
                                {section.label}
                                {problems > 0 && (
                                    <i className="admin-nav-alert" title={`고칠 곳 ${problems}개`} aria-label={`고칠 곳 ${problems}개`} />
                                )}
                            </strong>
                            <small>{section.description}</small>
                        </span>
                        {count !== null && <b>{count}</b>}
                    </button>
                );
            })}
        </nav>
    );
}
