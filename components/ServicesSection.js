import { ArrowUpRight, ClipboardCheck, CodeXml, GraduationCap, Laptop, Users } from 'lucide-react';
import { SERVICES } from '@/lib/seo';

/**
 * 어떤 교육과 컨설팅을 하는지 알려주는 영역입니다.
 *
 * 검색 엔진은 메타태그보다 화면에 실제로 보이는 제목과 문장을 훨씬 크게 보기 때문에,
 * 노리는 검색어를 숨겨두지 않고 이렇게 방문자에게도 쓸모 있는 안내로 보여줍니다.
 * 내용은 lib/seo.js 한 곳에서 가져오므로 메타태그·구조화 데이터와 항상 같습니다.
 */
const ICONS = {
  'staff-training': GraduationCap,
  competency: Users,
  'smartwork-training': Laptop,
  'smartwork-consulting': ClipboardCheck,
  'vibe-coding': CodeXml,
};

export default function ServicesSection() {
  return (
    <section className="section section--white" id="services" aria-labelledby="services-title">
      <div className="container">
        <header className="section-head">
          <span className="eyebrow">
            <span className="eyebrow-ko">교육·컨설팅 안내</span>
            <span className="eyebrow-divider" aria-hidden="true">/</span>
            <span className="eyebrow-en" lang="en">Training &amp; consulting</span>
          </span>
          <h2 className="section-title" id="services-title">현장에서 바로 쓰는 교육과 컨설팅을 진행합니다.</h2>
          <p className="section-description">
            사회복지 직원교육과 직원역량강화교육부터 스마트워크 교육·컨설팅, 바이브코딩 교육까지
            기관의 상황을 먼저 듣고 필요한 만큼만 구성합니다.
          </p>
        </header>

        <ul className="service-grid">
          {SERVICES.map((service) => {
            const Icon = ICONS[service.id] || GraduationCap;

            return (
              <li className="service-card" key={service.id}>
                <span className="service-card__icon" aria-hidden="true">
                  <Icon size={24} strokeWidth={1.75} />
                </span>
                <h3 className="service-card__title">{service.name}</h3>
                <p className="service-card__tagline">{service.tagline}</p>
                <p className="service-card__description">{service.description}</p>
              </li>
            );
          })}

          <li className="service-card service-card--cta">
            <h3 className="service-card__title">어떤 교육이 맞을지 모르겠다면</h3>
            <p className="service-card__description">
              기관의 상황과 인원, 원하는 일정만 알려주시면 맞는 방식을 함께 찾아드립니다.
            </p>
            <a className="button button--primary button--small" href="#contact">
              교육·컨설팅 문의하기 <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
