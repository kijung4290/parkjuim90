'use client';

import { ArrowRight, Globe2, MessageCircle } from 'lucide-react';

export default function HeroSection({ profile }) {
  const stats = profile?.stats || [
    { label: '자체 개발 복지 솔루션', value: '10+', unit: '개' },
    { label: '행정 소요시간 단축', value: '70', unit: '%' },
    { label: '사회복지 실천 경력', value: '10', unit: '년차' },
    { label: '스마트워크 강의 & 멘토링', value: '20+', unit: '회' },
  ];

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="hero-domain">
              <Globe2 size={15} aria-hidden="true" />
              {profile?.domain || 'parkjuim90.cloud'}
            </div>
            <h1 className="hero-title" id="hero-title">
              사람에게 쓰는 시간은 늘리고,<br />
              <strong>반복 행정은 줄입니다.</strong>
            </h1>
            <p className="hero-intro">
              {profile?.introduction || '10년 차 현직 사회복지사이자 실무 문제를 코딩으로 직접 해결하는 빌더입니다. 현장의 반복 행정을 줄여 복지사가 사람에 온전히 집중할 수 있는 실용적인 웹 도구를 만듭니다.'}
            </p>
            <div className="hero-actions">
              <a className="button button--primary" href="#archive">
                만든 도구 살펴보기 <ArrowRight size={17} aria-hidden="true" />
              </a>
              <a className="button button--secondary" href="#guestbook">
                방명록 남기기 <MessageCircle size={17} aria-hidden="true" />
              </a>
            </div>
          </div>

          <aside className="field-note" aria-label="도구를 만드는 업무 흐름">
            <div className="field-note-header">
              <span>Field note</span>
              <span>WONJU · 2026</span>
            </div>
            <h2 className="field-note-title">현장에서 발견한 불편을 작동하는 도구로 바꿉니다.</h2>
            <div className="workflow">
              <div className="workflow-step"><span>01</span><span>현장의 문제를 가까이서 관찰</span></div>
              <div className="workflow-step"><span>02</span><span>복잡한 업무 흐름을 단순하게 정리</span></div>
              <div className="workflow-step"><span>03</span><span>누구나 바로 쓰는 도구로 구현</span></div>
              <div className="workflow-step"><span>04</span><span>사람에게 돌아가는 시간을 확인</span></div>
            </div>
            <span className="field-note-stamp">BUILT FOR CARE</span>
          </aside>
        </div>

        <div className="stats-strip" aria-label="주요 활동 지표">
          {stats.map((stat) => (
            <div className="stat" key={stat.label}>
              <div className="stat-value">{stat.value}<span className="stat-unit">{stat.unit}</span></div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
