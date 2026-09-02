'use client';

import { useEffect, useState } from 'react';
import {
  Activity,
  ArrowRight,
  Bot,
  BookOpen,
  CheckCircle2,
  FolderHeart,
  LayoutGrid,
  Network,
  Search,
  ShieldAlert,
  Sparkles,
  Users,
  X,
} from 'lucide-react';

const iconMap = {
  Network,
  FolderHeart,
  Activity,
  Users,
  BookOpen,
  LayoutGrid,
  Bot,
  ShieldAlert,
};

export default function ArchiveSection({ projects = [] }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);

  const categories = [
    { id: 'all', label: '전체' },
    { id: 'social', label: '사회복지 실무' },
    { id: 'ai', label: 'AI & 챗봇' },
    { id: 'community', label: '커뮤니티 & 돌봄' },
    { id: 'automation', label: '행정 자동화' },
    { id: 'smartwork', label: '스마트워크 & 교육' },
  ];

  useEffect(() => {
    if (!selectedProject) return undefined;
    const closeWithEscape = (event) => {
      if (event.key === 'Escape') setSelectedProject(null);
    };
    window.addEventListener('keydown', closeWithEscape);
    return () => window.removeEventListener('keydown', closeWithEscape);
  }, [selectedProject]);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredProjects = projects.filter((project) => {
    const matchesCategory = activeCategory === 'all' || project.category === activeCategory;
    const searchableText = [project.title, project.summary, ...(project.techStack || [])]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return matchesCategory && searchableText.includes(normalizedQuery);
  });

  const renderIcon = (iconName, size = 23) => {
    const Icon = iconMap[iconName] || Sparkles;
    return <Icon size={size} strokeWidth={1.8} aria-hidden="true" />;
  };

  return (
    <section className="section section--white" id="archive" aria-labelledby="archive-title">
      <div className="container">
        <header className="section-head">
          <span className="eyebrow">Selected work</span>
          <h2 className="section-title" id="archive-title">현장의 문제에서 출발한 실무형 소프트웨어</h2>
          <p className="section-description">반복되는 기록과 행정은 줄이고, 사례관리와 돌봄의 흐름은 더 선명하게 만드는 도구를 직접 기획하고 개발했습니다.</p>
        </header>

        <div className="archive-toolbar">
          <div className="filter-tabs" role="group" aria-label="프로젝트 카테고리">
            {categories.map((category) => (
              <button
                className={`filter-button${activeCategory === category.id ? ' is-active' : ''}`}
                type="button"
                key={category.id}
                aria-pressed={activeCategory === category.id}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>

          <label className="search-box">
            <Search size={18} aria-hidden="true" />
            <span className="sr-only">프로젝트 검색</span>
            <input
              type="search"
              placeholder="프로젝트 또는 기술 검색"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </label>
        </div>

        <div className="project-grid" aria-live="polite">
          {filteredProjects.map((project) => {
            const isFeatured = project.id === 'genogram' || project.badge?.includes('★');
            return (
              <article
                className={`project-card${isFeatured ? ' project-card--featured' : ''}`}
                key={project.id}
              >
                <span className="project-top">
                  <span className="icon-box">{renderIcon(project.icon)}</span>
                  {project.badge && <span className="project-badge">{project.badge}</span>}
                </span>

                <span className="project-category">{project.categoryLabel}</span>
                <h3>{project.title}</h3>
                <span className="project-summary">{project.summary}</span>

                <span className="highlight-list">
                  {project.highlights?.slice(0, 2).map((highlight) => (
                    <span className="highlight" key={highlight}>
                      <CheckCircle2 size={14} aria-hidden="true" />
                      <span>{highlight}</span>
                    </span>
                  ))}
                </span>

                <span className="project-bottom">
                  <span className="tag-row">
                    {project.techStack?.map((tech) => <span className="tag" key={tech}>{tech}</span>)}
                  </span>
                  <button
                    className="project-action"
                    type="button"
                    onClick={() => setSelectedProject(project)}
                    aria-label={`${project.title} 자세히 보기`}
                  >
                    프로젝트 살펴보기 <ArrowRight size={16} aria-hidden="true" />
                  </button>
                </span>
              </article>
            );
          })}

          {filteredProjects.length === 0 && (
            <div className="empty-state">조건에 맞는 프로젝트가 없습니다. 검색어 또는 카테고리를 바꿔보세요.</div>
          )}
        </div>
      </div>

      {selectedProject && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setSelectedProject(null)}>
          <article
            className="project-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className="modal-close" type="button" aria-label="프로젝트 상세 닫기" onClick={() => setSelectedProject(null)}>
              <X size={20} />
            </button>

            <div className="modal-intro">
              <span className="icon-box">{renderIcon(selectedProject.icon, 22)}</span>
              <div>
                <div className="modal-kicker">{selectedProject.categoryLabel}</div>
                <div className="modal-subtitle">{selectedProject.subtitle}</div>
              </div>
            </div>

            <h2 id="project-modal-title">{selectedProject.title}</h2>
            <p className="modal-description">{selectedProject.description}</p>

            <section className="modal-section" aria-labelledby="feature-title">
              <h3 id="feature-title">주요 기능과 특징</h3>
              <div className="highlight-list">
                {selectedProject.highlights?.map((item) => (
                  <div className="highlight" key={item}>
                    <CheckCircle2 size={15} aria-hidden="true" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="modal-section" aria-labelledby="stack-title">
              <h3 id="stack-title">기술 스택</h3>
              <div className="tag-row">
                {selectedProject.techStack?.map((tech) => <span className="tag" key={tech}>{tech}</span>)}
              </div>
            </section>

            <div className="modal-actions">
              <button className="button button--secondary" type="button" onClick={() => setSelectedProject(null)}>닫기</button>
              <a className="button button--primary" href="#contact" onClick={() => setSelectedProject(null)}>도입 및 협업 문의</a>
            </div>
          </article>
        </div>
      )}
    </section>
  );
}
