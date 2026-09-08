export default function ExperienceSection({ experiences = [] }) {
  if (experiences.length === 0) return null;

  return (
    <section className="section section--soft" id="experience" aria-labelledby="experience-title">
      <div className="container experience-layout">
        <header className="section-head">
          <span className="eyebrow">
            <span className="eyebrow-ko">스마트워커 박주임</span>
            <span className="eyebrow-divider" aria-hidden="true">/</span>
            <span className="eyebrow-en" lang="en">People behind the lab</span>
          </span>
          <h2 className="section-title" id="experience-title">현장을 알고, 변화를 직접 만드는 사람</h2>
          <p className="section-description">사회복지 실무 경험을 바탕으로 교육하고, 업무를 진단하고, 필요한 도구를 직접 만듭니다.</p>
        </header>

        <div className="timeline" role="list" aria-label="경력 목록">
          {experiences.map((experience, index) => {
            const itemNumber = String(index + 1).padStart(2, '0');

            return (
              <article className="timeline-item" role="listitem" key={experience.id || `${experience.company}-${index}`}>
                <div className="timeline-item-meta">
                  <div className="timeline-item-marker" aria-hidden="true">
                    <span className="timeline-item-index">{itemNumber}</span>
                    <span className="timeline-item-line" />
                  </div>
                  <div className="timeline-period">{experience.period}</div>
                </div>
                <div className="timeline-item-content">
                  <div className="timeline-company">{experience.company}</div>
                  <h3>{experience.role}</h3>
                  <p>{experience.description}</p>
                  <div className="tag-row">
                    {experience.tags?.map((tag) => <span className="tag" key={tag}>#{tag}</span>)}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
