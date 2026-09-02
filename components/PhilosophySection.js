'use client';

import { Accessibility, HeartHandshake, Share2, Wrench } from 'lucide-react';

export default function PhilosophySection({ philosophy = [] }) {
  const icons = [HeartHandshake, Wrench, Accessibility, Share2];

  return (
    <section className="section section--sage" id="philosophy" aria-labelledby="philosophy-title">
      <div className="container">
        <header className="section-head">
          <span className="eyebrow">Working principles</span>
          <h2 className="section-title" id="philosophy-title">좋은 도구는 현장을 이해하는 태도에서 시작합니다.</h2>
          <p className="section-description">사회복지 실천의 맥락을 놓치지 않으면서, 배우기 쉽고 실제로 시간을 돌려주는 도구를 만듭니다.</p>
        </header>

        <div className="principle-grid">
          {philosophy.map((item, index) => {
            const Icon = icons[index % icons.length];
            return (
              <article className="principle" key={item.id || item.title}>
                <Icon className="principle-icon" size={30} strokeWidth={1.7} aria-hidden="true" />
                <div className="principle-kicker">{item.subtitle}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
