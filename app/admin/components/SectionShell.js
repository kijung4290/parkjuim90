'use client';

import { Eye } from 'lucide-react';
import { Checklist } from './Checklist';

/**
 * 모든 편집 화면이 같은 뼈대를 쓰도록 감싸는 껍데기입니다.
 * 제목 · 이 내용이 사이트 어디에 보이는지 안내 · 사이트에서 확인 버튼 · 점검 목록을 담습니다.
 */
export function SectionShell({ section, active, issues, actions, danger = false, children }) {
    return (
        <section
            className={`admin-card${danger ? ' admin-danger-zone' : ''}${active ? ' is-active' : ''}`}
            id={section.id}
            aria-labelledby={`${section.id}-heading`}
        >
            <div className="admin-card-head">
                <div>
                    <h2 id={`${section.id}-heading`}>{section.label}</h2>
                    <p>{section.guide}</p>
                </div>
                <div className="admin-card-tools">
                    {actions}
                    <a
                        className="button button--ghost button--small"
                        href={section.preview}
                        target="_blank"
                        rel="noreferrer"
                        title="새 탭에서 실제 화면을 확인합니다"
                    >
                        <Eye size={15} aria-hidden="true" /> 사이트에서 확인
                    </a>
                </div>
            </div>

            {issues && <Checklist issues={issues} />}

            {children}
        </section>
    );
}
