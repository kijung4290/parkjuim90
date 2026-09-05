'use client';

import { Film, Image as ImageIcon, Quote } from 'lucide-react';
import { createHeroSlide, HERO_INTERVALS, HERO_TYPE_LABELS, LENGTH_HINTS } from '../constants';
import { countItemProblems } from '../lib/checklist';
import { EditorList } from '../components/EditorList';
import { Field } from '../components/Field';
import { MediaInput } from '../components/MediaInput';
import { SectionShell } from '../components/SectionShell';
import { SlidePreview } from '../components/SlidePreview';

/** 첫 화면 슬라이드를 편집합니다. */
export function HeroEditor({ section, active, issues, hero, mutations, upload, notify }) {
    const slides = hero.slides || [];
    const { updateHero, heroSlides } = mutations;

    const busyFor = (index, field) => upload.busyKey === `hero-${index}-${field}`;

    const pickMedia = async (index, file, field) => {
        const url = await upload.uploadOne(`hero-${index}-${field}`, file, 'hero');
        if (!url) return;
        heroSlides.update(index, { [field]: url });
        notify('ok', `${field === 'poster' ? '표지 사진' : '미디어 파일'}을 올렸습니다. [저장하기]를 눌러야 사이트에 반영됩니다.`);
    };

    return (
        <SectionShell section={section} active={active} issues={issues}>
            <div className="admin-hero-settings">
                <label className="admin-check">
                    <input
                        type="checkbox"
                        checked={Boolean(hero.autoplay)}
                        onChange={(event) => updateHero('autoplay', event.target.checked)}
                    />
                    슬라이드 자동 재생
                </label>
                <Field label="슬라이드 전환 시간">
                    <select
                        value={Number(hero.interval) || 7000}
                        onChange={(event) => updateHero('interval', Number(event.target.value))}
                    >
                        {HERO_INTERVALS.map((option) => (
                            <option value={option.value} key={option.value}>{option.label}</option>
                        ))}
                    </select>
                </Field>
            </div>

            <p className="admin-slide-guide">
                이미지·영상은 <strong>주소</strong>를, 글귀는 <strong>내용</strong>을 넣어야 사이트에 표시됩니다.
                준비 중인 빈 슬라이드는 자동으로 숨겨지니 미리 만들어두어도 괜찮습니다.
            </p>

            <EditorList
                sectionId="hero"
                itemLabel="슬라이드"
                items={slides}
                listClassName="admin-slide-list"
                getTitle={(slide) => slide.title || slide.description}
                getSubtitle={(slide) => HERO_TYPE_LABELS[slide.type] || '일반'}
                getProblemCount={(slide) => countItemProblems('hero', slide)}
                emptyText="슬라이드가 없습니다. 아래 버튼에서 영상·이미지·글귀를 추가해주세요."
                addButtons={[
                    { label: '영상 추가', icon: Film, create: () => createHeroSlide('video') },
                    { label: '이미지 추가', icon: ImageIcon, create: () => createHeroSlide('image') },
                    { label: '글귀 추가', icon: Quote, create: () => createHeroSlide('quote') },
                ]}
                onAdd={heroSlides.add}
                onMove={heroSlides.move}
                onMoveTop={heroSlides.moveTop}
                onDuplicate={heroSlides.duplicate}
                onRemove={heroSlides.remove}
                renderItem={(slide, index) => (
                    <div className="admin-slide-editor">
                        <div className="admin-grid">
                            <Field label="슬라이드 종류">
                                <select
                                    value={slide.type || 'quote'}
                                    onChange={(event) => heroSlides.update(index, { type: event.target.value })}
                                >
                                    <option value="video">동영상</option>
                                    <option value="image">이미지</option>
                                    <option value="quote">글귀</option>
                                </select>
                            </Field>
                            <Field label="작은 분류 문구" hint="슬라이드 위쪽에 작게 표시">
                                <input
                                    value={slide.eyebrow || ''}
                                    onChange={(event) => heroSlides.update(index, { eyebrow: event.target.value })}
                                    placeholder="예: LECTURE & COMMUNITY"
                                />
                            </Field>

                            <Field
                                label={slide.type === 'quote' ? '글귀' : '제목'}
                                required={slide.type === 'quote'}
                                limit={LENGTH_HINTS.slideTitle}
                                value={slide.title || ''}
                                wide
                            >
                                <textarea
                                    value={slide.title || ''}
                                    onChange={(event) => heroSlides.update(index, { title: event.target.value })}
                                    placeholder={slide.type === 'quote'
                                        ? '첫 화면에 크게 보여줄 글귀를 입력해주세요.'
                                        : '사진이나 영상을 설명하는 제목'}
                                />
                            </Field>

                            <Field label="설명" limit={LENGTH_HINTS.slideDescription} value={slide.description || ''} wide>
                                <textarea
                                    value={slide.description || ''}
                                    onChange={(event) => heroSlides.update(index, { description: event.target.value })}
                                    placeholder="제목 아래에 표시할 짧은 설명"
                                />
                            </Field>

                            {slide.type === 'image' && (
                                <MediaInput
                                    kind="image"
                                    label="이미지 등록"
                                    hint="(사진 파일을 올리거나 이미지 주소를 붙여넣기)"
                                    value={slide.url}
                                    busy={busyFor(index, 'url')}
                                    placeholder="https://... 또는 /images/lecture.webp"
                                    onChange={(url) => heroSlides.update(index, { url })}
                                    onFile={(file) => pickMedia(index, file, 'url')}
                                />
                            )}

                            {slide.type === 'video' && (
                                <>
                                    <MediaInput
                                        kind="video"
                                        label="동영상 등록"
                                        hint="(동영상 파일을 올리거나 YouTube·Vimeo 링크 붙여넣기)"
                                        value={slide.url}
                                        busy={busyFor(index, 'url')}
                                        placeholder="YouTube·Vimeo 주소 또는 직접 영상 주소"
                                        onChange={(url) => heroSlides.update(index, { url })}
                                        onFile={(file) => pickMedia(index, file, 'url')}
                                    />
                                    <MediaInput
                                        kind="image"
                                        label="영상 표지 이미지 (선택)"
                                        hint="(직접 올린 동영상이 재생되기 전에 보이는 사진)"
                                        value={slide.poster}
                                        busy={busyFor(index, 'poster')}
                                        placeholder="/images/poster.webp 또는 https://..."
                                        onChange={(poster) => heroSlides.update(index, { poster })}
                                        onFile={(file) => pickMedia(index, file, 'poster')}
                                    />
                                </>
                            )}

                            {slide.type !== 'quote' && (
                                <Field label="대체 설명" hint="사진·영상을 볼 수 없는 방문자에게 전달" wide>
                                    <input
                                        value={slide.alt || ''}
                                        onChange={(event) => heroSlides.update(index, { alt: event.target.value })}
                                        placeholder="강의 중인 사회복지사와 참여자들의 모습"
                                    />
                                </Field>
                            )}
                        </div>

                        <div>
                            <span className="admin-preview-label">슬라이드 미리보기 · 가로 이미지 권장</span>
                            <SlidePreview slide={slide} />
                        </div>
                    </div>
                )}
            />
        </SectionShell>
    );
}
