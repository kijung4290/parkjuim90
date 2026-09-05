'use client';

import { Plus } from 'lucide-react';
import { getStoryImages } from '@/lib/stories';
import { createStory, LENGTH_HINTS } from '../constants';
import { countItemProblems } from '../lib/checklist';
import { EditorList } from '../components/EditorList';
import { Field } from '../components/Field';
import { SectionShell } from '../components/SectionShell';
import { StoryImageEditor } from '../components/StoryImageEditor';

/** 현장 기록(글)과 붙일 사진을 편집합니다. */
export function StoriesEditor({ section, active, issues, items, mutations, upload, notify }) {
    const { list, storyImages } = mutations;
    const patch = (index, changes) => list.update('stories', index, changes);

    const addImages = async (index, files) => {
        const uploaded = await upload.uploadMany(`story-${index}`, files, 'stories');
        if (uploaded.length === 0) return;
        storyImages.append(index, uploaded);
        notify('ok', `사진 ${uploaded.length}장을 붙였습니다. [저장하기]를 눌러야 사이트에 반영됩니다.`);
    };

    return (
        <SectionShell section={section} active={active} issues={issues}>
            <p className="admin-slide-guide">
                홈 화면 카드에는 <strong>앞부분만</strong> 보이고, 방문자가 카드를 누르면 사진과 전문이 열립니다.
                맨 위에 있는 기록이 두 칸 너비로 크게 표시됩니다.
            </p>

            <EditorList
                sectionId="stories"
                itemLabel="기록"
                items={items}
                getTitle={(story) => story.title}
                getSubtitle={(story) => [story.tag, story.date].filter(Boolean).join(' · ')}
                getProblemCount={(story) => countItemProblems('stories', story)}
                getSearchText={(story) => `${story.title} ${story.tag} ${story.summary} ${story.content}`}
                searchPlaceholder="제목·분류·내용으로 검색"
                emptyText="등록된 기록이 없습니다. 아래 [기록 추가]를 눌러 시작해보세요."
                addButtons={[{ label: '기록 추가', icon: Plus, create: createStory }]}
                onAdd={(item) => list.add('stories', item)}
                onMove={(index, delta) => list.move('stories', index, delta)}
                onMoveTop={(index) => list.moveTop('stories', index)}
                onDuplicate={(index) => list.duplicate('stories', index, 'story')}
                onRemove={(index) => list.remove('stories', index)}
                renderItem={(story, index) => (
                    <>
                        <div className="admin-grid admin-grid--three">
                            <Field label="분류" hint="(카드 위 작은 라벨)">
                                <input value={story.tag || ''} onChange={(event) => patch(index, { tag: event.target.value })} placeholder="개발기" />
                            </Field>
                            <Field label="날짜">
                                <input value={story.date || ''} onChange={(event) => patch(index, { date: event.target.value })} placeholder="2026.08" />
                            </Field>
                            <Field label="읽는 시간">
                                <input value={story.readTime || ''} onChange={(event) => patch(index, { readTime: event.target.value })} placeholder="3분" />
                            </Field>
                        </div>

                        <div className="admin-grid">
                            <Field label="제목" required wide>
                                <input value={story.title || ''} onChange={(event) => patch(index, { title: event.target.value })} />
                            </Field>

                            <Field
                                label="미리보기 문구"
                                hint="(비우면 본문 앞부분을 자동으로 보여줍니다)"
                                limit={LENGTH_HINTS.storySummary}
                                value={story.summary || ''}
                                wide
                            >
                                <input
                                    value={story.summary || ''}
                                    onChange={(event) => patch(index, { summary: event.target.value })}
                                    placeholder="홈 화면 카드에 보여줄 한 줄 요약"
                                />
                            </Field>

                            <Field label="내용" hint="(전문 화면에 보입니다 · 빈 줄 하나로 문단을 나눕니다)" wide>
                                <textarea
                                    className="admin-textarea--tall"
                                    value={story.content || ''}
                                    onChange={(event) => patch(index, { content: event.target.value })}
                                />
                            </Field>

                            <StoryImageEditor
                                images={getStoryImages(story)}
                                uploading={upload.busyKey === `story-${index}`}
                                onUpload={(files) => addImages(index, files)}
                                onUpdate={(imageIndex, changes) => storyImages.update(index, imageIndex, changes)}
                                onRemove={(imageIndex) => storyImages.remove(index, imageIndex)}
                                onMove={(imageIndex, delta) => storyImages.move(index, imageIndex, delta)}
                            />

                            <Field label="원문 링크" hint="(입력하면 ‘기록 읽기’ 버튼이 생깁니다)">
                                <input value={story.link || ''} onChange={(event) => patch(index, { link: event.target.value })} placeholder="https://..." />
                            </Field>
                            <Field label="공감 수" hint="(시작 숫자입니다)">
                                <input
                                    type="number"
                                    min="0"
                                    value={story.likes ?? 0}
                                    onChange={(event) => patch(index, { likes: Number(event.target.value) || 0 })}
                                />
                            </Field>
                        </div>
                    </>
                )}
            />
        </SectionShell>
    );
}
