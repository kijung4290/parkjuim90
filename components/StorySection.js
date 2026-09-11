'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, Heart, Images } from 'lucide-react';
import { getStoryImages, getStoryPreview } from '@/lib/stories';
import { getStoryPath } from '@/lib/storyRoutes';

const previewLimit = (index) => (index === 0 ? 190 : 105);

export default function StorySection({ stories = [], blogUrl, showAllLink = true, archive = false }) {
  const [likedIds, setLikedIds] = useState(() => new Set());
  const SectionTitle = archive ? 'h1' : 'h2';
  const CardTitle = archive ? 'h2' : 'h3';

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
    <section className="section section--white" id="notes" aria-labelledby="stories-title">
      <div className="container">
        <header className="section-head section-head--center">
          <span className="eyebrow">
            <span className="eyebrow-ko">일잘알 기록소</span>
            <span className="eyebrow-divider" aria-hidden="true">/</span>
            <span className="eyebrow-en" lang="en">SMARTWORKLAB Notes</span>
          </span>
          <SectionTitle className="section-title" id="stories-title">일을 더 잘하는 방법을<br />기록하고 나눕니다</SectionTitle>
          <p className="section-description">AI 활용 이야기, 도구 제작 과정, 현장에서 발견한 업무혁신 인사이트를 꾸준히 기록합니다.</p>
        </header>

        <div className="notes-topics" aria-label="기록 주제">
          <Link id="notes-blog" href="/stories">전체 글 <ArrowRight size={15} aria-hidden="true" /></Link>
          <span id="notes-ai">AI 활용 이야기</span>
          <span id="notes-build">제작 과정</span>
          <span id="notes-insight">업무혁신 인사이트</span>
        </div>

        <div className="story-grid">
          {stories.map((story, index) => {
            const liked = likedIds.has(story.id);
            const likeCount = (story.likes || 0) + (liked ? 1 : 0);
            const images = getStoryImages(story);
            const cover = images[0];
            const preview = getStoryPreview(story, previewLimit(index));

            return (
              <article className="story-card" key={story.id || story.slug}>
                {cover && (
                  <Link className="story-thumb" href={getStoryPath(story)} tabIndex={-1} aria-hidden="true">
                    <img src={cover.url} alt="" loading="lazy" />
                    {images.length > 1 && <span className="story-thumb-count"><Images size={13} aria-hidden="true" /> {images.length}</span>}
                  </Link>
                )}
                <div className="story-card-head">
                  <div className="story-log-index">
                    <span className="story-log-label">현장 기록</span>
                    <span className="story-log-number">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="story-meta">
                    {story.tag && <span className="story-tag">{story.tag}</span>}
                    <span className="story-date"><Clock size={12} aria-hidden="true" /> {[story.readTime && `${story.readTime} 읽기`, story.date].filter(Boolean).join(' · ')}</span>
                  </div>
                </div>

                <Link className="story-copy story-open" href={getStoryPath(story)} aria-label={`${story.title} 전문 읽기`}>
                  <CardTitle>{story.title}</CardTitle>
                  {preview && <p>{preview}</p>}
                  <span className="story-more">전문 읽기 <ArrowRight size={14} aria-hidden="true" /></span>
                </Link>

                <div className="story-footer">
                  <button
                    className={`like-button${liked ? ' is-liked' : ''}`}
                    type="button"
                    aria-label={`${story.title} 공감 ${likeCount}개`}
                    aria-pressed={liked}
                    onClick={() => toggleLike(story.id)}
                  >
                    <Heart size={14} fill={liked ? 'currentColor' : 'none'} aria-hidden="true" /> {likeCount}
                  </button>
                  <Link className="read-label" href={getStoryPath(story)}>기록 읽기 <ArrowRight size={14} aria-hidden="true" /></Link>
                </div>
              </article>
            );
          })}
        </div>

        {showAllLink && (
          <div className="story-list-actions">
            <Link className="button button--secondary" href="/stories">전체 글 목록 보기 <ArrowRight size={15} aria-hidden="true" /></Link>
            {blogUrl && <a className="story-source-link" href={blogUrl} target="_blank" rel="noreferrer">네이버 블로그도 보기</a>}
          </div>
        )}
      </div>
    </section>
  );
}
