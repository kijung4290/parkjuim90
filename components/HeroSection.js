import { ArrowRight, Globe2, MessageCircle } from 'lucide-react';

const WORKFLOW_STEPS = [
  '현장의 문제를 가까이서 관찰',
  '복잡한 업무 흐름을 단순하게 정리',
  '누구나 바로 쓰는 도구로 구현',
  '사람에게 돌아가는 시간을 확인',
];

export default function HeroSection({ profile }) {
  const stats = profile?.stats || [];

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="hero-domain">
              <Globe2 size={15} aria-hidden="true" />
              {profile?.domain}
            </p>
            <h1 className="hero-title" id="hero-title">
              사람에게 쓰는 시간은 늘리고,<br />
              <strong>반복 행정은 줄입니다.</strong>
            </h1>
            <p className="hero-intro">{profile?.introduction}</p>
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
            <ol className="workflow">
              {WORKFLOW_STEPS.map((step, index) => (
                <li className="workflow-step" key={step}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <span className="field-note-stamp">BUILT FOR CARE</span>
          </aside>
        </div>

        {stats.length > 0 && (
          <div className="stats-strip" aria-label="주요 활동 지표">
            {stats.map((stat) => (
              <div className="stat" key={stat.label}>
                <div className="stat-value">
                  {stat.value}
                  <span className="stat-unit">{stat.unit}</span>
                </div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
