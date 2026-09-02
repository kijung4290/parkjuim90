'use client';

export default function ExperienceSection({ experiences = [] }) {
  return (
    <section className="section section--soft" id="experience" aria-labelledby="experience-title">
      <div className="container experience-layout">
        <header className="section-head">
          <span className="eyebrow">Experience</span>
          <h2 className="section-title" id="experience-title">복지 현장과 개발을 함께 걸어온 시간</h2>
          <p className="section-description">지역사회에서 쌓은 경험을 바탕으로, 실제 업무에 오래 남는 디지털 도구를 만듭니다.</p>
        </header>

        <div className="timeline">
          {experiences.map((experience, index) => (
            <article className="timeline-item" key={experience.id || `${experience.company}-${index}`}>
              <div className="timeline-period">{experience.period}</div>
              <div>
                <div className="timeline-company">{experience.company}</div>
                <h3>{experience.role}</h3>
                <p>{experience.description}</p>
                <div className="tag-row">
                  {experience.tags?.map((tag) => <span className="tag" key={tag}>#{tag}</span>)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
