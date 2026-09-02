'use client';

import { useState } from 'react';
import { ArrowRight, Clock, Heart } from 'lucide-react';

export default function StorySection({ stories = [] }) {
  const [likedIds, setLikedIds] = useState(() => new Set());

  const toggleLike = (id) => {
    setLikedIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (stories.length === 0) return null;

  return (
    <section className="section section--white" id="stories" aria-labelledby="stories-title">
      <div className="container">
        <header className="section-head section-head--center">
          <span className="eyebrow">Field stories</span>
          <h2 className="section-title" id="stories-title">만드는 과정과 현장에서 배운 것들</h2>
          <p className="section-description">복지 현장의 고민, 도구 개발의 뒷이야기, 동료들과 나누고 싶은 스마트워크 경험을 기록합니다.</p>
        </header>

        <div className="story-grid">
          {stories.map((story) => {
            const liked = likedIds.has(story.id);
            const likeCount = (story.likes || 0) + (liked ? 1 : 0);
            return (
              <article className="story-card" key={story.id}>
                <div className="story-meta">
                  <span className="story-tag">{story.tag}</span>
                  <span className="story-date">
                    <Clock size={12} aria-hidden="true" /> {story.readTime} 읽기 · {story.date}
                  </span>
                </div>
                <h3>{story.title}</h3>
                <p>{story.content}</p>
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
    </section>
  );
}
