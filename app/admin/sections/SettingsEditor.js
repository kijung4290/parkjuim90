'use client';

import { CircleCheck, RotateCcw, TriangleAlert } from 'lucide-react';
import { SECTIONS } from '../constants';
import { countProblems } from '../lib/checklist';
import { SectionShell } from '../components/SectionShell';

const SHORTCUTS = [
    ['Ctrl + S (Mac ⌘ + S)', '지금까지 고친 내용을 저장합니다.'],
    ['위 / 아래 화살표 버튼', '항목의 순서를 바꿉니다. 위에 있을수록 사이트에서 먼저 보입니다.'],
    ['복제 버튼', '비슷한 항목을 만들 때 기존 항목을 그대로 베껴 시작합니다.'],
];

/**
 * 전체 점검 요약과 초기화 기능이 함께 있는 화면입니다.
 * 처음 쓰는 사람이 "지금 무엇부터 고쳐야 하는지" 한 곳에서 볼 수 있게 했습니다.
 */
export function SettingsEditor({ section, active, issues, busy, onReset, onSelectSection }) {
    const summary = SECTIONS
        .filter((item) => issues[item.id])
        .map((item) => ({ ...item, problems: countProblems(issues[item.id]) }));
    const totalProblems = summary.reduce((sum, item) => sum + item.problems, 0);

    return (
        <>
            <SectionShell
                section={{ ...section, label: '전체 점검', guide: '저장하기 전에 빠진 곳이 없는지 항목별로 확인합니다.' }}
                active={active}
            >
                {totalProblems === 0 ? (
                    <p className="admin-checklist-ok">
                        <CircleCheck size={16} aria-hidden="true" /> 모든 항목이 빠진 곳 없이 채워져 있습니다.
                    </p>
                ) : (
                    <p className="admin-checklist-ok has-problem">
                        <TriangleAlert size={16} aria-hidden="true" /> 꼭 고칠 것이 모두 {totalProblems}개 있습니다. 아래에서 항목을 눌러 이동하세요.
                    </p>
                )}

                <ul className="admin-summary-list">
                    {summary.map((item) => (
                        <li key={item.id}>
                            <button type="button" onClick={() => onSelectSection(item.id)}>
                                <item.icon size={17} aria-hidden="true" />
                                <span>{item.label}</span>
                                {item.problems > 0
                                    ? <b className="is-problem">고칠 곳 {item.problems}</b>
                                    : <b>완료</b>}
                            </button>
                        </li>
                    ))}
                </ul>

                <div className="admin-shortcuts">
                    <h3>알아두면 편한 조작</h3>
                    <dl>
                        {SHORTCUTS.map(([term, description]) => (
                            <div key={term}>
                                <dt>{term}</dt>
                                <dd>{description}</dd>
                            </div>
                        ))}
                    </dl>
                    <p className="admin-note">
                        편집하던 내용은 이 브라우저에 자동으로 임시 보관됩니다.
                        실수로 창을 닫아도 다시 들어오면 이어서 편집할 수 있지만,
                        <strong> 사이트에 반영되는 것은 [저장하기]를 누른 뒤</strong>입니다.
                    </p>
                </div>
            </SectionShell>

            <section className={`admin-card admin-danger-zone${active ? ' is-active' : ''}`} id="settings-reset">
                <div className="admin-card-head">
                    <div>
                        <h2>기본 데이터로 초기화</h2>
                        <p>저장된 내용을 모두 지우고 코드에 들어 있는 처음 데이터로 되돌립니다.</p>
                    </div>
                    <button className="button button--secondary button--small" type="button" onClick={onReset} disabled={busy}>
                        <RotateCcw size={16} aria-hidden="true" /> 기본 데이터로 되돌리기
                    </button>
                </div>
                <p className="admin-note">
                    되돌린 내용은 복구할 수 없습니다. 방명록·기록·프로젝트에 직접 쓴 내용도 함께 사라지니 주의해주세요.
                </p>
            </section>
        </>
    );
}
