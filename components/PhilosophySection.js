import { Accessibility, HeartHandshake, Share2, Wrench } from 'lucide-react';

const ICONS = [HeartHandshake, Wrench, Accessibility, Share2];

export default function PhilosophySection({ philosophy = [] }) {
  if (philosophy.length === 0) return null;

  return (
    <section className="section section--sage" id="philosophy" aria-labelledby="philosophy-title">
      <div className="container">
        <header className="section-head">
          <span className="eyebrow">
            <span className="eyebrow-ko">일하는 원칙</span>
            <span className="eyebrow-divider" aria-hidden="true">/</span>
            <span className="eyebrow-en" lang="en">Working principles</span>
          </span>
          <h2 className="section-title" id="philosophy-title">좋은 도구는 현장을 이해하는 태도에서 시작합니다.</h2>
          <p className="section-description">사회복지 실천의 맥락을 놓치지 않으면서, 배우기 쉽고 실제로 시간을 돌려주는 도구를 만듭니다.</p>
        </header>

        <ol className="principle-grid principle-flow">
          {philosophy.map((item, index) => {
            const Icon = ICONS[index % ICONS.length];
            const step = String(index + 1).padStart(2, '0');

            return (
              <li className="principle principle-flow-item" key={item.id || item.title}>
                <div className="principle-rail" aria-hidden="true">
                  <span className="principle-index">{step}</span>
                  <span className="principle-flow-track" />
                </div>
                <div className="principle-icon-wrap" aria-hidden="true">
                  <Icon className="principle-icon" size={30} strokeWidth={1.7} />
                </div>
                <div className="principle-copy">
                  <div className="principle-kicker">{item.subtitle}</div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
