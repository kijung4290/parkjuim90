'use client';

import { Plus } from 'lucide-react';
import { createExperience } from '../constants';
import { countItemProblems } from '../lib/checklist';
import { EditorList } from '../components/EditorList';
import { Field, LineListField } from '../components/Field';
import { SectionShell } from '../components/SectionShell';

/** 소속과 역할을 편집합니다. */
export function ExperiencesEditor({ section, active, issues, items, mutations }) {
    const { list } = mutations;
    const patch = (index, changes) => list.update('experiences', index, changes);

    return (
        <SectionShell section={section} active={active} issues={issues}>
            <EditorList
                sectionId="experiences"
                itemLabel="경력"
                items={items}
                getTitle={(experience) => experience.company || experience.role}
                getSubtitle={(experience) => experience.period}
                getProblemCount={(experience) => countItemProblems('experiences', experience)}
                getSearchText={(experience) => `${experience.company} ${experience.role} ${experience.period}`}
                searchPlaceholder="소속·역할로 검색"
                emptyText="등록된 경력이 없습니다. 아래 [경력 추가]를 눌러 시작해보세요."
                addButtons={[{ label: '경력 추가', icon: Plus, create: createExperience }]}
                onAdd={(item) => list.add('experiences', item)}
                onMove={(index, delta) => list.move('experiences', index, delta)}
                onMoveTop={(index) => list.moveTop('experiences', index)}
                onDuplicate={(index) => list.duplicate('experiences', index, 'experience')}
                onRemove={(index) => list.remove('experiences', index)}
                renderItem={(experience, index) => (
                    <div className="admin-grid">
                        <Field label="소속" required>
                            <input
                                value={experience.company || ''}
                                onChange={(event) => patch(index, { company: event.target.value })}
                                placeholder="○○종합사회복지관"
                            />
                        </Field>
                        <Field label="기간" required hint="(적은 그대로 화면에 보입니다)">
                            <input
                                value={experience.period || ''}
                                onChange={(event) => patch(index, { period: event.target.value })}
                                placeholder="2018 - 현재"
                            />
                        </Field>
                        <Field label="역할" wide>
                            <input
                                value={experience.role || ''}
                                onChange={(event) => patch(index, { role: event.target.value })}
                                placeholder="사례관리 · 스마트워크 담당"
                            />
                        </Field>
                        <Field label="설명" wide>
                            <textarea
                                value={experience.description || ''}
                                onChange={(event) => patch(index, { description: event.target.value })}
                                placeholder="맡았던 일과 남긴 성과를 적어주세요."
                            />
                        </Field>
                        <LineListField
                            label="태그"
                            value={experience.tags}
                            onChange={(tags) => patch(index, { tags })}
                            placeholder={'사례관리\n스마트워크'}
                            wide
                        />
                    </div>
                )}
            />
        </SectionShell>
    );
}
