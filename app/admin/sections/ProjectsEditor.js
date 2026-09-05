'use client';

import { Plus } from 'lucide-react';
import { PROJECT_CATEGORIES } from '@/lib/projectMeta';
import { createProject, LENGTH_HINTS, PROJECT_LINK_FIELDS } from '../constants';
import { countItemProblems } from '../lib/checklist';
import { getProjectLinkValue, withProjectCategory } from '../lib/portfolio';
import { EditorList } from '../components/EditorList';
import { Field, LineListField } from '../components/Field';
import { IconPicker } from '../components/IconPicker';
import { SectionShell } from '../components/SectionShell';

/** ‘만든 도구’ 카드를 편집합니다. */
export function ProjectsEditor({ section, active, issues, items, mutations }) {
    const { list, updateProjectLink } = mutations;
    const patch = (index, changes) => list.update('projects', index, changes);

    return (
        <SectionShell section={section} active={active} issues={issues}>
            <EditorList
                sectionId="projects"
                itemLabel="프로젝트"
                items={items}
                getTitle={(project) => project.title}
                getSubtitle={(project) => project.categoryLabel}
                getProblemCount={(project) => countItemProblems('projects', project)}
                getSearchText={(project) => `${project.title} ${project.summary} ${project.categoryLabel} ${(project.techStack || []).join(' ')}`}
                searchPlaceholder="제목·요약·기술로 검색"
                emptyText="등록된 프로젝트가 없습니다. 아래 [프로젝트 추가]를 눌러 시작해보세요."
                addButtons={[{ label: '프로젝트 추가', icon: Plus, create: createProject }]}
                onAdd={(item) => list.add('projects', item)}
                onMove={(index, delta) => list.move('projects', index, delta)}
                onMoveTop={(index) => list.moveTop('projects', index)}
                onDuplicate={(index) => list.duplicate('projects', index, 'project')}
                onRemove={(index) => list.remove('projects', index)}
                renderItem={(project, index) => (
                    <div className="admin-grid">
                        <Field label="제목" required>
                            <input value={project.title || ''} onChange={(event) => patch(index, { title: event.target.value })} />
                        </Field>
                        <Field label="부제">
                            <input value={project.subtitle || ''} onChange={(event) => patch(index, { subtitle: event.target.value })} />
                        </Field>

                        <Field label="카테고리" required hint="(방문자가 이 분류로 걸러 봅니다)">
                            <select
                                value={project.category || ''}
                                onChange={(event) => patch(index, withProjectCategory(project, event.target.value))}
                            >
                                {PROJECT_CATEGORIES.map((category) => (
                                    <option value={category.id} key={category.id}>{category.label}</option>
                                ))}
                            </select>
                        </Field>
                        <Field label="배지" hint="(카드 오른쪽 위 라벨 · 비워도 됩니다)">
                            <input
                                value={project.badge || ''}
                                onChange={(event) => patch(index, { badge: event.target.value })}
                                placeholder="실무 도입 완료"
                            />
                        </Field>

                        <Field label="한 줄 요약" required limit={LENGTH_HINTS.projectSummary} value={project.summary || ''} wide>
                            <textarea
                                value={project.summary || ''}
                                onChange={(event) => patch(index, { summary: event.target.value })}
                                placeholder="카드에 보이는 한 문장입니다. 누가, 어떤 문제를, 어떻게 줄였는지 적어주세요."
                            />
                        </Field>
                        <Field label="상세 설명" hint="(‘자세히’ 창에 표시)" wide>
                            <textarea
                                value={project.description || ''}
                                onChange={(event) => patch(index, { description: event.target.value })}
                            />
                        </Field>

                        <LineListField
                            label="주요 기능"
                            value={project.highlights}
                            onChange={(highlights) => patch(index, { highlights })}
                            placeholder={'문서 자동 생성\n엑셀로 내보내기'}
                        />
                        <LineListField
                            label="기술 스택"
                            value={project.techStack}
                            onChange={(techStack) => patch(index, { techStack })}
                            placeholder={'Next.js\nSupabase'}
                        />

                        <IconPicker value={project.icon} onChange={(icon) => patch(index, { icon })} />

                        <div className="admin-span-all admin-link-group">
                            <span className="admin-group-label">
                                바로가기 버튼<em>(주소를 넣은 버튼만 카드에 보입니다)</em>
                            </span>
                            <div className="admin-grid admin-grid--three">
                                {PROJECT_LINK_FIELDS.map((linkField) => (
                                    <Field label={linkField.label} key={linkField.id}>
                                        <input
                                            type="url"
                                            value={getProjectLinkValue(project, linkField.id)}
                                            onChange={(event) => updateProjectLink(index, linkField, event.target.value)}
                                            placeholder="https://..."
                                        />
                                    </Field>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            />
        </SectionShell>
    );
}
