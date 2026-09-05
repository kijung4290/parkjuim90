'use client';

import { Plus } from 'lucide-react';
import { createPhilosophy, LENGTH_HINTS } from '../constants';
import { countItemProblems } from '../lib/checklist';
import { EditorList } from '../components/EditorList';
import { Field } from '../components/Field';
import { SectionShell } from '../components/SectionShell';

/** 나를 설명하는 원칙 카드를 편집합니다. */
export function PhilosophyEditor({ section, active, issues, items, mutations }) {
    const { list } = mutations;

    return (
        <SectionShell section={section} active={active} issues={issues}>
            <EditorList
                sectionId="philosophy"
                itemLabel="원칙"
                items={items}
                getTitle={(item) => item.title}
                getSubtitle={(item) => item.subtitle}
                getProblemCount={(item) => countItemProblems('philosophy', item)}
                emptyText="등록된 원칙이 없습니다. 아래 [원칙 추가]를 눌러 시작해보세요."
                addButtons={[{ label: '원칙 추가', icon: Plus, create: createPhilosophy }]}
                onAdd={(item) => list.add('philosophy', item)}
                onMove={(index, delta) => list.move('philosophy', index, delta)}
                onMoveTop={(index) => list.moveTop('philosophy', index)}
                onDuplicate={(index) => list.duplicate('philosophy', index, 'philosophy')}
                onRemove={(index) => list.remove('philosophy', index)}
                renderItem={(item, index) => (
                    <div className="admin-grid">
                        <Field label="제목" required>
                            <input
                                value={item.title || ''}
                                onChange={(event) => list.update('philosophy', index, { title: event.target.value })}
                                placeholder="행정을 줄여 사람을 봅니다"
                            />
                        </Field>
                        <Field label="영문 소제목" hint="(제목 위에 작게 표시)">
                            <input
                                value={item.subtitle || ''}
                                onChange={(event) => list.update('philosophy', index, { subtitle: event.target.value })}
                                placeholder="Human-First Efficiency"
                            />
                        </Field>
                        <Field label="설명" limit={LENGTH_HINTS.philosophyDesc} value={item.desc || ''} wide>
                            <textarea
                                value={item.desc || ''}
                                onChange={(event) => list.update('philosophy', index, { desc: event.target.value })}
                                placeholder="이 원칙을 실제로 어떻게 지키고 있는지 2~3문장으로 적어주세요."
                            />
                        </Field>
                    </div>
                )}
            />
        </SectionShell>
    );
}
