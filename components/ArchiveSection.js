'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, ExternalLink, Search, X } from 'lucide-react';
import { ProjectIcon } from '@/components/projectIcons';
import { PROJECT_CATEGORIES } from '@/lib/projectMeta';

const CATEGORIES = [{ id: 'all', label: '전체' }, ...PROJECT_CATEGORIES];
const INITIAL_INDEX_SIZE = 11;

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

function ProjectDirectLinks({ project, className }) {
  const links = getProjectLinks(project);

  if (links.length === 0) return null;

  return (
    <div className={className} role="group" aria-label={`${project.title} 바로가기`}>
      {links.map((link) => (
        <a
          className="archive-direct-link"
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.title} ${link.label}, 새 탭에서 열기`}
          key={link.id || link.url}
        >
          <span>{link.label}</span>
          <ExternalLink size={14} aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}

export default function ArchiveSection({ projects = [] }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isIndexExpanded, setIsIndexExpanded] = useState(false);
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
  const isDefaultView = activeCategory === 'all' && normalizedQuery.length === 0;
  const activeCategoryLabel = CATEGORIES.find((category) => category.id === activeCategory)?.label || '전체';
  const spotlightProject = isDefaultView
    ? filteredProjects.find((project) => project.title?.includes('가계도'))
    : null;
  const indexProjects = spotlightProject
    ? filteredProjects.filter((project) => project !== spotlightProject)
    : filteredProjects;
  const remainingProjectCount = Math.max(indexProjects.length - INITIAL_INDEX_SIZE, 0);
  const visibleIndexProjects = isDefaultView && !isIndexExpanded
    ? indexProjects.slice(0, INITIAL_INDEX_SIZE)
    : indexProjects;

  const selectCategory = (categoryId) => {
    setActiveCategory(categoryId);
    setIsIndexExpanded(false);
  };

  const updateSearchQuery = (value) => {
    setSearchQuery(value);
    setIsIndexExpanded(false);
  };

  return (
    <section className="section section--white" id="archive" aria-labelledby="archive-title">
      <div className="container">
        <header className="section-head">
          <span className="eyebrow">
            <span className="eyebrow-ko">현장 도구 아카이브</span>
            <span className="eyebrow-divider" aria-hidden="true">/</span>
            <span className="eyebrow-en" lang="en">Smart work education & tools</span>
          </span>
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
                onClick={() => selectCategory(category.id)}
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
              onChange={(event) => updateSearchQuery(event.target.value)}
            />
          </label>
        </div>

        <div className="archive-summary" role="status" aria-live="polite" aria-atomic="true">
          <strong className="archive-summary__count">{filteredProjects.length}개 도구</strong>
          <span className="archive-summary__filter">
            현재 필터: {activeCategoryLabel}
            {normalizedQuery && ` · “${searchQuery.trim()}” 검색`}
          </span>
        </div>

        {spotlightProject && (
          <article className="archive-showcase" aria-labelledby="archive-showcase-title">
            <div className="archive-showcase__visual" aria-hidden="true">
              <ProjectIcon name={spotlightProject.icon} size={72} />
            </div>

            <div className="archive-showcase__body">
              <div className="archive-showcase__eyebrow">
                <span>Spotlight</span>
                {spotlightProject.badge && <span>{spotlightProject.badge}</span>}
              </div>
              <p className="archive-showcase__category">{spotlightProject.categoryLabel}</p>
              <h3 className="archive-showcase__title" id="archive-showcase-title">{spotlightProject.title}</h3>
              <p className="archive-showcase__summary">{spotlightProject.summary}</p>

              {spotlightProject.highlights?.length > 0 && (
                <ul className="archive-showcase__highlights">
                  {spotlightProject.highlights.slice(0, 3).map((highlight) => (
                    <li key={highlight}>
                      <CheckCircle2 size={15} aria-hidden="true" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="archive-showcase__actions">
                <ProjectDirectLinks project={spotlightProject} className="archive-showcase__links" />
                <button
                  className="project-detail-button project-detail-button--showcase"
                  type="button"
                  onClick={() => setSelectedProject(spotlightProject)}
                  aria-label={`${spotlightProject.title} 자세히 보기`}
                >
                  자세히 보기 <ArrowRight size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
          </article>
        )}

        {filteredProjects.length > 0 ? (
          <section className="archive-index" aria-labelledby="archive-index-title">
            <header className="archive-index__head">
              <div>
                <p className="archive-index__eyebrow">Tool index</p>
                <h3 className="archive-index__title" id="archive-index-title">
                  {isDefaultView ? '한눈에 찾는 실무 도구' : '검색 결과'}
                </h3>
              </div>
              <p className="archive-index__count">
                {visibleIndexProjects.length}개 표시 중 · 총 {indexProjects.length}개
              </p>
            </header>

            <ul className="archive-index__list" id="archive-project-list">
              {visibleIndexProjects.map((project) => (
                <li className="archive-item" key={project.id}>
                  <article className="archive-item__body" aria-labelledby={`archive-item-title-${project.id}`}>
                    <div className="archive-item__identity">
                      <span className="archive-item__icon"><ProjectIcon name={project.icon} size={20} /></span>
                      <div className="archive-item__content">
                        <p className="archive-item__category">{project.categoryLabel}</p>
                        <h4 className="archive-item__title" id={`archive-item-title-${project.id}`}>{project.title}</h4>
                      </div>
                    </div>

                    <p className="archive-item__summary">{project.summary}</p>

                    <div className="archive-item__footer">
                      {project.techStack?.length > 0 && (
                        <p className="archive-item__meta">{project.techStack.slice(0, 2).join(' · ')}</p>
                      )}
                      <div className="archive-item__actions">
                        <ProjectDirectLinks project={project} className="archive-item__links" />
                        <button
                          className="project-detail-button project-detail-button--compact"
                          type="button"
                          onClick={() => setSelectedProject(project)}
                          aria-label={`${project.title} 자세히 보기`}
                        >
                          자세히 <ArrowRight size={15} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </article>
                </li>
              ))}
            </ul>

            {isDefaultView && remainingProjectCount > 0 && (
              <button
                className="archive-toggle"
                type="button"
                aria-controls="archive-project-list"
                aria-expanded={isIndexExpanded}
                onClick={() => setIsIndexExpanded((isExpanded) => !isExpanded)}
              >
                {isIndexExpanded
                  ? `처음 ${INITIAL_INDEX_SIZE}개만 보기`
                  : `나머지 ${remainingProjectCount}개 더 보기`}
                <ArrowRight size={17} aria-hidden="true" />
              </button>
            )}
          </section>
        ) : (
          <p className="archive-empty">조건에 맞는 프로젝트가 없습니다. 검색어 또는 카테고리를 바꿔보세요.</p>
        )}
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
