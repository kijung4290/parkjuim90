'use client';

import { useState } from 'react';
import { BookOpen, Heart, Clock, ArrowRight } from 'lucide-react';

export default function StorySection({ stories = [] }) {
  const [likes, setLikes] = useState({});

  const handleLike = (id, currentLikes, e) => {
    e.stopPropagation();
    setLikes(prev => ({
      ...prev,
      [id]: (prev[id] !== undefined ? prev[id] : currentLikes) + 1
    }));
  };

  return (
    <section id="stories" style={{ padding: '100px 0', background: '#ffffff' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 60px' }}>
          <div className="toss-badge" style={{ marginBottom: '16px' }}>
            게시판 &middot; Stories & Tech
          </div>
          <h2 className="title-section">
            현장의 이야기와<br />
            스마트워크 인사이트
          </h2>
          <p className="subtitle-section">
            사회복지 실천 현장에서 겪은 고민, 도구 개발 비하인드 스토리, 실무 팁을 기록합니다.
          </p>
        </div>

        {/* Stories Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          {stories.map((story) => {
            const currentLikeCount = likes[story.id] !== undefined ? likes[story.id] : story.likes;
            return (
              <article
                key={story.id}
                className="toss-card"
                style={{
                  padding: '32px',
                  background: '#F9FAFB',
                  border: '1px solid #E5E8EB',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      color: '#3182F6',
                      background: '#E8F3FF',
                      padding: '4px 10px',
                      borderRadius: '6px'
                    }}>
                      {story.tag}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#8B95A1' }}>
                      <Clock size={12} />
                      <span>{story.readTime} 읽기 &middot; {story.date}</span>
                    </div>
                  </div>

                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '800',
                    color: '#191F28',
                    lineHeight: '1.4',
                    marginBottom: '14px',
                    letterSpacing: '-0.02em'
                  }}>
                    {story.title}
                  </h3>

                  <p style={{
                    fontSize: '0.93rem',
                    color: '#4E5968',
                    lineHeight: '1.65',
                    marginBottom: '24px'
                  }}>
                    {story.content}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '16px',
                  borderTop: '1px solid #E5E8EB'
                }}>
                  <button
                    onClick={(e) => handleLike(story.id, story.likes, e)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.88rem',
                      fontWeight: '700',
                      color: likes[story.id] !== undefined ? '#e11d48' : '#6B7684',
                      background: likes[story.id] !== undefined ? '#FFE4E6' : '#FFFFFF',
                      padding: '6px 14px',
                      borderRadius: '999px',
                      border: '1px solid #E5E8EB',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Heart size={14} fill={likes[story.id] !== undefined ? '#e11d48' : 'none'} />
                    <span>{currentLikeCount}</span>
                  </button>

                  <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#3182F6', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    읽기 <ArrowRight size={14} />
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
