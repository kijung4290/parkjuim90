import { ArrowDownRight, Compass, Lightbulb, UserRound } from 'lucide-react';

const PILLARS = [
  {
    id: 'park-intro',
    icon: UserRound,
    index: '01',
    title: '스마트워커 박주임 소개',
    english: 'Smart Worker Park',
    description: '사회복지 현장에서 발견한 문제를 교육, 컨설팅, 디지털 도구로 해결합니다. 실무를 아는 사람의 언어로 변화를 설계합니다.',
    link: '#experience',
    linkLabel: '활동 이력 보기',
  },
  {
    id: 'lab-philosophy',
    icon: Compass,
    index: '02',
    title: '연구소 철학',
    english: 'Lab Philosophy',
    description: '기술보다 사람의 일을 먼저 봅니다. 누구나 배우고 바로 적용하며 함께 나눌 수 있는 실용적인 방법을 연구합니다.',
  },
  {
    id: 'innovation-direction',
    icon: Lightbulb,
    index: '03',
    title: '업무혁신 방향',
    english: 'Innovation Direction',
    description: '반복은 자동화하고 판단과 관계에는 더 많은 시간을 씁니다. 작은 개선을 조직의 지속 가능한 일하는 방식으로 연결합니다.',
  },
];

export default function BrandOverviewSection() {
  return (
    <section className="section lab-about" id="about" aria-labelledby="about-title">
      <div className="container">
        <div className="lab-about-lead" id="lab-intro">
          <div className="lab-about-logo">
            <img src="/images/smartworklab-logo.png" alt="일잘알랩 SMARTWORK LAB" />
          </div>
          <div className="lab-about-copy">
            <span className="lab-section-code">ABOUT / SMARTWORKLAB</span>
            <h2 id="about-title">일을 더 잘 아는 사람의<br />더 스마트한 방법</h2>
            <p>일잘알랩은 현장의 경험과 AI, 자동화 기술을 연결하는 업무혁신 연구소입니다. 배움이 실제 변화로 이어지도록 교육하고, 함께 진단하고, 바로 쓰는 도구를 만듭니다.</p>
            <div className="lab-about-manifesto">
              <span>사람의 일에,</span>
              <strong>더 나은 가능성을.</strong>
            </div>
          </div>
        </div>

        <div className="lab-pillar-grid">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <article className="lab-pillar" id={pillar.id} key={pillar.id}>
                <div className="lab-pillar-head">
                  <span>{pillar.index}</span>
                  <Icon size={25} strokeWidth={1.6} aria-hidden="true" />
                </div>
                <p className="lab-pillar-en" lang="en">{pillar.english}</p>
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
                {pillar.link && (
                  <a href={pillar.link}>{pillar.linkLabel} <ArrowDownRight size={16} aria-hidden="true" /></a>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
