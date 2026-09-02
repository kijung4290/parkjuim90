'use client';

import { Sparkles, ArrowRight, Code, Heart, Clock, Layers, Globe } from 'lucide-react';

export default function HeroSection({ profile }) {
  const stats = profile?.stats || [
    { label: "자체 개발 복지 솔루션", value: "10+", unit: "개" },
    { label: "행정 소요시간 단축", value: "70", unit: "%" },
    { label: "사회복지 실천 경력", value: "10", unit: "년차" },
    { label: "스마트워크 강의 & 멘토링", value: "20+", unit: "회" }
  ];

  return (
    <section style={{
      padding: '80px 0 60px',
      position: 'relative',
      background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(49, 130, 246, 0.12), transparent)'
    }}>
      <div className="container" style={{ textAlign: 'center' }}>
        {/* Top Floating Badge */}
        <div style={{ display: 'inline-flex', marginBottom: '24px' }}>
          <div className="toss-badge animate-fade-up" style={{ padding: '8px 18px', fontSize: '0.95rem' }}>
            <Sparkles size={16} color="#3182F6" />
            <span>복지와 기술의 만남 &middot; 스마트워크 소프트웨어 크리에이터</span>
          </div>
        </div>

        {/* Toss Big Hero Headline */}
        <h1 className="title-hero animate-fade-up" style={{ maxWidth: '880px', margin: '0 auto 24px', animationDelay: '0.1s' }}>
          기술로 복지의 온도를 높이고,<br />
          <span style={{ color: '#3182F6' }}>행정의 부담</span>을 덜어냅니다
        </h1>

        {/* Intro Body */}
        <p style={{
          fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
          color: '#4E5968',
          maxWidth: '680px',
          margin: '0 auto 40px',
          lineHeight: '1.7',
          fontWeight: '500',
          animationDelay: '0.2s'
        }} className="animate-fade-up">
          {profile?.introduction ||
            "10년 차 현직 사회복지사이자 실무 문제를 코딩으로 직접 해결하는 빌더입니다. 현장의 반복 행정을 줄여 복지사가 사람에 온전히 집중할 수 있는 실용적인 웹 도구를 만듭니다."}
        </p>

        {/* Action Buttons & Domain Chip */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          marginBottom: '32px',
          animationDelay: '0.3s'
        }} className="animate-fade-up">
          <a href="#archive" className="btn-toss btn-toss-primary" style={{ padding: '16px 32px', fontSize: '1.05rem' }}>
            개발한 프로그램 둘러보기 <ArrowRight size={18} />
          </a>
          <a href="#guestbook" className="btn-toss btn-toss-secondary" style={{ padding: '16px 28px', fontSize: '1.05rem' }}>
            응원 방명록 남기기 💬
          </a>
        </div>

        {/* Custom Domain Highlight Tag */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: '#ffffff',
          border: '1px solid #E5E8EB',
          padding: '8px 16px',
          borderRadius: '999px',
          fontSize: '0.85rem',
          color: '#4E5968',
          boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
          marginBottom: '60px'
        }}>
          <Globe size={14} color="#3182F6" />
          <span>공식 도메인: <strong style={{ color: '#191F28' }}>{profile?.domain || "parkjuim90.cloud"}</strong></span>
        </div>

        {/* Toss Metric / Stat Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginTop: '10px'
        }}>
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="toss-card"
              style={{
                padding: '28px 24px',
                textAlign: 'center',
                background: '#ffffff',
                border: '1px solid rgba(0, 0, 0, 0.05)'
              }}
            >
              <div style={{
                fontSize: '2.5rem',
                fontWeight: '900',
                color: '#191F28',
                letterSpacing: '-0.03em',
                lineHeight: '1.2'
              }}>
                <span style={{ color: idx === 1 ? '#3182F6' : '#191F28' }}>{stat.value}</span>
                <span style={{ fontSize: '1.3rem', fontWeight: '700', marginLeft: '4px', color: '#6B7684' }}>{stat.unit}</span>
              </div>
              <div style={{
                fontSize: '0.95rem',
                fontWeight: '600',
                color: '#6B7684',
                marginTop: '8px'
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
