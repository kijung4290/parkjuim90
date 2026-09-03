'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Clock, Heart, Images, X } from 'lucide-react';
import { getStoryImages, getStoryParagraphs, getStoryPreview, hasMoreToRead } from '@/lib/stories';

const FOCUSABLE = 'a[href], button:not(:disabled), input, textarea, [tabindex]:not([tabindex="-1"])';

/** 첫 카드는 넓게 표시되므로 미리보기 글을 조금 더 길게 보여줍니다. */
const previewLimit = (index) => (index === 0 ? 190 : 105);

export default function StorySection({ stories = [] }) {
  const [likedIds, setLikedIds] = useState(() => new Set());
  const [selectedStory, setSelectedStory] = useState(null);
  const modalRef = useRef(null);

  const toggleLike = (id) => {
    setLikedIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // 전문 모달을 열면 포커스를 안에 가두고, 닫으면 원래 자리로 되돌립니다.
  useEffect(() => {
    if (!selectedStory) return undefined;

    const previouslyFocused = document.activeElement;
    modalRef.current?.querySelector(FOCUSABLE)?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedStory(null);
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = Array.from(modalRef.current?.querySelectorAll(FOCUSABLE) || []);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [selectedStory]);

  if (stories.length === 0) return null;

  const selectedImages = getStoryImages(selectedStory);
  const selectedParagraphs = getStoryParagraphs(selectedStory?.content);
  const selectedLiked = selectedStory ? likedIds.has(selectedStory.id) : false;
  const selectedLikeCount = (selectedStory?.likes || 0) + (selectedLiked ? 1 : 0);

  return (
    <section className="section section--white" id="stories" aria-labelledby="stories-title">
      <div className="container">
        <header className="section-head section-head--center">
          <span className="eyebrow">
            <span className="eyebrow-ko">현장 기록</span>
            <span className="eyebrow-divider" aria-hidden="true">/</span>
            <span className="eyebrow-en" lang="en">Field stories</span>
          </span>
          <h2 className="section-title" id="stories-title">만드는 과정과 현장에서 배운 것들</h2>
          <p className="section-description">복지 현장의 고민, 도구 개발의 뒷이야기, 동료들과 나누고 싶은 스마트워크 경험을 기록합니다.</p>
        </header>

        <div className="story-grid">
          {stories.map((story, index) => {
            const liked = likedIds.has(story.id);
            const likeCount = (story.likes || 0) + (liked ? 1 : 0);
            const logNumber = String(index + 1).padStart(2, '0');
            const images = getStoryImages(story);
            const cover = images[0];
            const limit = previewLimit(index);
            const preview = getStoryPreview(story, limit);
            const showsMore = hasMoreToRead(story, limit);

            return (
              <article className="story-card" key={story.id}>
                {cover && (
                  <div className="story-thumb">
                    <img src={cover.url} alt={cover.alt || `${story.title} 현장 사진`} loading="lazy" />
                    {images.length > 1 && (
                      <span className="story-thumb-count">
                        <Images size={13} aria-hidden="true" /> {images.length}
                      </span>
                    )}
                  </div>
                )}
                <div className="story-card-head">
                  <div className="story-log-index">
                    <span className="story-log-label">현장 기록</span>
                    <span className="story-log-number">{logNumber}</span>
                  </div>
                  <div className="story-meta">
                    <span className="story-tag">{story.tag}</span>
                    <span className="story-date">
                      <Clock size={12} aria-hidden="true" /> {story.readTime} 읽기 · {story.date}
                    </span>
                  </div>
                </div>
                {/* 카드 본문 전체가 전문 보기 버튼입니다(작은 링크를 겨냥하지 않아도 됩니다). */}
                <button
                  className="story-copy story-open"
                  type="button"
                  aria-label={`${story.title} 전문 보기`}
                  onClick={() => setSelectedStory(story)}
                >
                  <h3>{story.title}</h3>
                  <p>{preview}</p>
                  {showsMore && (
                    <span className="story-more">전문 보기 <ArrowRight size={14} aria-hidden="true" /></span>
                  )}
                </button>
                <div className="story-footer">
                  <button
                    className={`like-button${liked ? ' is-liked' : ''}`}
                    type="button"
                    aria-label={`${story.title} 공감 ${likeCount}개`}
                    aria-pressed={liked}
                    onClick={() => toggleLike(story.id)}
                  >
                    <Heart size={14} fill={liked ? 'currentColor' : 'none'} aria-hidden="true" />
                    {likeCount}
                  </button>
                  {/* 링크가 있을 때만 '읽기'를 노출합니다(눌리지 않는 안내는 혼란만 줍니다). */}
                  {story.link && (
                    <a className="read-label" href={story.link} target="_blank" rel="noreferrer">
                      기록 읽기 <ArrowRight size={14} aria-hidden="true" />
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {selectedStory && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setSelectedStory(null)}>
          <article
            className="project-modal story-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="story-modal-title"
            ref={modalRef}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className="modal-close" type="button" aria-label="기록 닫기" onClick={() => setSelectedStory(null)}>
              <X size={20} />
            </button>

            <div className="modal-intro">
              <div>
                <div className="modal-kicker">{selectedStory.tag}</div>
                <div className="modal-subtitle">
                  {[selectedStory.date, selectedStory.readTime && `${selectedStory.readTime} 읽기`]
                    .filter(Boolean)
                    .join(' · ')}
                </div>
              </div>
            </div>

            <h2 id="story-modal-title">{selectedStory.title}</h2>

            {selectedImages.length > 0 && (
              <div className="story-modal-gallery">
                {selectedImages.map((image, imageIndex) => (
                  <figure key={image.url}>
                    <img src={image.url} alt={image.alt || `${selectedStory.title} 사진 ${imageIndex + 1}`} loading="lazy" />
                    {image.alt && <figcaption>{image.alt}</figcaption>}
                  </figure>
                ))}
              </div>
            )}

            <div className="story-modal-body">
              {selectedParagraphs.length > 0
                ? selectedParagraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)
                : <p>아직 본문이 등록되지 않은 기록입니다.</p>}
            </div>

            <div className="story-modal-footer">
              <button
                className={`like-button${selectedLiked ? ' is-liked' : ''}`}
                type="button"
                aria-label={`${selectedStory.title} 공감 ${selectedLikeCount}개`}
                aria-pressed={selectedLiked}
                onClick={() => toggleLike(selectedStory.id)}
              >
                <Heart size={15} fill={selectedLiked ? 'currentColor' : 'none'} aria-hidden="true" />
                {selectedLikeCount}
              </button>
              {selectedStory.link ? (
                <a className="button button--primary" href={selectedStory.link} target="_blank" rel="noreferrer">
                  원문 보기 <ArrowRight size={15} aria-hidden="true" />
                </a>
              ) : (
                <button className="button button--secondary" type="button" onClick={() => setSelectedStory(null)}>닫기</button>
              )}
            </div>
          </article>
        </div>
      )}
    </section>
  );
}
