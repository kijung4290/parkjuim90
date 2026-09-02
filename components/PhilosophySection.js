'use client';

import { HeartHandshake, Wrench, Zap, Share2 } from 'lucide-react';

export default function PhilosophySection({ philosophy = [] }) {
  const icons = [
    <HeartHandshake size={28} color="#3182F6" key="1" />,
    <Wrench size={28} color="#3182F6" key="2" />,
    <Zap size={28} color="#3182F6" key="3" />,
    <Share2 size={28} color="#3182F6" key="4" />
  ];

  return (
    <section id="philosophy" style={{ padding: '100px 0', background: '#F2F4F6' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 60px' }}>
          <div className="toss-badge-gray toss-badge" style={{ marginBottom: '16px' }}>
            핵심 철학과 원칙
          </div>
          <h2 className="title-section">
            단순한 코딩이 아닌,<br />
            현장의 변화를 만드는 4가지 원칙
          </h2>
          <p className="subtitle-section">
            사회복지 실천의 깊은 이해와 현대적 기술의 결합으로 실질적인 현장 혁신을 지향합니다.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px'
        }}>
          {philosophy.map((item, idx) => (
            <div
              key={item.id || idx}
              className="toss-card"
              style={{
                padding: '36px 28px',
                background: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: '24px'
              }}
            >
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '24px'
                }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    background: '#E8F3FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {icons[idx % icons.length]}
                  </div>
                  <span style={{
                    fontSize: '1.2rem',
                    fontWeight: '800',
                    color: '#B0B8C1'
                  }}>
                    0{idx + 1}
                  </span>
                </div>

                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#3182F6', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {item.subtitle}
                </div>

                <h3 style={{
                  fontSize: '1.35rem',
                  fontWeight: '800',
                  color: '#191F28',
                  letterSpacing: '-0.02em',
                  marginBottom: '14px',
                  lineHeight: '1.35'
                }}>
                  {item.title}
                </h3>

                <p style={{
                  fontSize: '0.95rem',
                  color: '#6B7684',
                  lineHeight: '1.65'
                }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
