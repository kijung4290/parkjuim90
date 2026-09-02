'use client';

import { Briefcase, Calendar, Award } from 'lucide-react';

export default function ExperienceSection({ experiences = [] }) {
  return (
    <section id="experience" style={{ padding: '100px 0', background: '#F9FAFB' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 60px' }}>
          <div className="toss-badge-gray toss-badge" style={{ marginBottom: '16px' }}>
            경력 &middot; Experience
          </div>
          <h2 className="title-section">
            사회복지 실천과 IT 개발의 융합,<br />
            현장에서 걸어온 길
          </h2>
          <p className="subtitle-section">
            지역사회 문제 해결의 현장 경험을 바탕으로 실효성 있는 디지털 도구를 만듭니다.
          </p>
        </div>

        {/* Timeline Layout */}
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {experiences.map((exp, idx) => (
            <div
              key={exp.id || idx}
              className="toss-card"
              style={{
                padding: '32px',
                background: '#ffffff',
                border: '1px solid #E5E8EB',
                display: 'flex',
                gap: '24px',
                alignItems: 'flex-start'
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: '#E8F3FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Briefcase size={22} color="#3182F6" />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#3182F6', background: '#E8F3FF', padding: '4px 10px', borderRadius: '6px' }}>
                    {exp.period}
                  </span>
                  <span style={{ fontSize: '0.9rem', color: '#8B95A1', fontWeight: '600' }}>
                    {exp.company}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#191F28', marginBottom: '10px' }}>
                  {exp.role}
                </h3>

                <p style={{ fontSize: '0.95rem', color: '#4E5968', lineHeight: '1.65', marginBottom: '16px' }}>
                  {exp.description}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {exp.tags?.map((tag, tagIdx) => (
                    <span
                      key={tagIdx}
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: '600',
                        color: '#6B7684',
                        background: '#F2F4F6',
                        padding: '3px 8px',
                        borderRadius: '6px'
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
