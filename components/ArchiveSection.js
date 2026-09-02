'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, ExternalLink, Search, X } from 'lucide-react';
import { ProjectIcon } from '@/components/projectIcons';
import { PROJECT_CATEGORIES } from '@/lib/projectMeta';

const CATEGORIES = [{ id: 'all', label: '전체' }, ...PROJECT_CATEGORIES];

const FOCUSABLE = 'a[href], button:not(:disabled), input, textarea, [tabindex]:not([tabindex="-1"])';

const getProjectLinks = (project) => {
  const links = Array.isArray(project?.links)
    ? project.links.filter((item) => item?.url && item.url !== '#')
    : [];

  if (links.length > 0) return links;
  if (project?.link && project.link !== '#') {
    return [{ id: 'site', label: '사이트 열기', url: project.link }];
  }
  return [];
};

export default function ArchiveSection({ projects = [] }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const modalRef = useRef(null);
  const selectedProjectLinks = getProjectLinks(selectedProject);

  // 모달을 열면 포커스를 안으로 가두고, 닫으면 원래 자리로 되돌립니다.
  useEffect(() => {
    if (!selectedProject) return undefined;

    const previouslyFocused = document.activeElement;
    modalRef.current?.querySelector(FOCUSABLE)?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedProject(null);
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = Array.from(modalRef.current?.querySelectorAll(FOCUSABLE) || []);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus?.();
    };
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

  return (
    <section className="section section--white" id="archive" aria-labelledby="archive-title">
      <div className="container">
        <header className="section-head">
          <span className="eyebrow">Smart work education & tools</span>
          <h2 className="section-title" id="archive-title">스마트워크 교육에서 바로 쓰는 현장 도구</h2>
          <p className="section-description">스마트워커 박주임이 스마트워크 교육, 직원역량강화교육, 바이브코딩 교육과 스마트워크 컨설팅 현장에서 활용하는 도구입니다. 반복되는 기록과 행정을 줄이는 실무형 웹앱을 직접 기획하고 개발했습니다.</p>
        </header>

        <div className="archive-toolbar">
          <div className="filter-tabs" role="group" aria-label="프로젝트 카테고리">
            {CATEGORIES.map((category) => (
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

        {/* 목록 전체가 아니라 결과 개수만 읽어주도록 합니다. */}
        <p className="sr-only" role="status">{filteredProjects.length}개의 프로젝트가 있습니다.</p>

        <div className="project-grid">
          {filteredProjects.map((project) => {
            const isFeatured = project.featured ?? Boolean(project.badge?.includes('★'));
            return (
              <article className={`project-card${isFeatured ? ' project-card--featured' : ''}`} key={project.id}>
                <div className="project-top">
                  <span className="icon-box"><ProjectIcon name={project.icon} /></span>
                  {project.badge && <span className="project-badge">{project.badge}</span>}
                </div>

                <p className="project-category">{project.categoryLabel}</p>
                <h3>{project.title}</h3>
                <p className="project-summary">{project.summary}</p>

                <ul className="highlight-list">
                  {project.highlights?.slice(0, 2).map((highlight) => (
                    <li className="highlight" key={highlight}>
                      <CheckCircle2 size={14} aria-hidden="true" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>

                <div className="project-bottom">
                  <div className="tag-row">
                    {project.techStack?.map((tech) => <span className="tag" key={tech}>{tech}</span>)}
                  </div>
                  <button
                    className="project-action"
                    type="button"
                    onClick={() => setSelectedProject(project)}
                    aria-label={`${project.title} 자세히 보기`}
                  >
                    프로젝트 살펴보기 <ArrowRight size={16} aria-hidden="true" />
                  </button>
                </div>
              </article>
            );
          })}

          {filteredProjects.length === 0 && (
            <p className="empty-state">조건에 맞는 프로젝트가 없습니다. 검색어 또는 카테고리를 바꿔보세요.</p>
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
            ref={modalRef}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className="modal-close" type="button" aria-label="프로젝트 상세 닫기" onClick={() => setSelectedProject(null)}>
              <X size={20} />
            </button>

            <div className="modal-intro">
              <span className="icon-box"><ProjectIcon name={selectedProject.icon} size={22} /></span>
              <div>
                <div className="modal-kicker">{selectedProject.categoryLabel}</div>
                <div className="modal-subtitle">{selectedProject.subtitle}</div>
              </div>
            </div>

            <h2 id="project-modal-title">{selectedProject.title}</h2>
            <p className="modal-description">{selectedProject.description}</p>

            {selectedProject.highlights?.length > 0 && (
              <section className="modal-section" aria-labelledby="feature-title">
                <h3 id="feature-title">주요 기능과 특징</h3>
                <ul className="highlight-list">
                  {selectedProject.highlights.map((item) => (
                    <li className="highlight" key={item}>
                      <CheckCircle2 size={15} aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {selectedProject.techStack?.length > 0 && (
              <section className="modal-section" aria-labelledby="stack-title">
                <h3 id="stack-title">기술 스택</h3>
                <div className="tag-row">
                  {selectedProject.techStack.map((tech) => <span className="tag" key={tech}>{tech}</span>)}
                </div>
              </section>
            )}

            <div className="modal-actions">
              {selectedProjectLinks.length > 0 ? (
                selectedProjectLinks.map((link) => (
                  <a
                    className="button button--secondary"
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={link.id || link.url}
                  >
                    {link.label} <ExternalLink size={15} aria-hidden="true" />
                  </a>
                ))
              ) : (
                <button className="button button--secondary" type="button" onClick={() => setSelectedProject(null)}>닫기</button>
              )}
              <a className="button button--primary" href="#contact" onClick={() => setSelectedProject(null)}>도입 및 협업 문의</a>
            </div>
          </article>
        </div>
      )}
    </section>
  );
}
