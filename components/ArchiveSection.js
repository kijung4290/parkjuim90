'use client';

import { useState } from 'react';
import {
  Search,
  ExternalLink,
  Sparkles,
  Network,
  FolderHeart,
  Activity,
  Users,
  BookOpen,
  LayoutGrid,
  Bot,
  ShieldAlert,
  CheckCircle2,
  X
} from 'lucide-react';

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

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Network': return <Network size={24} color="#3182F6" />;
      case 'FolderHeart': return <FolderHeart size={24} color="#3182F6" />;
      case 'Activity': return <Activity size={24} color="#3182F6" />;
      case 'Users': return <Users size={24} color="#3182F6" />;
      case 'BookOpen': return <BookOpen size={24} color="#3182F6" />;
      case 'LayoutGrid': return <LayoutGrid size={24} color="#3182F6" />;
      case 'Bot': return <Bot size={24} color="#3182F6" />;
      case 'ShieldAlert': return <ShieldAlert size={24} color="#3182F6" />;
      default: return <Sparkles size={24} color="#3182F6" />;
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesCategory = activeCategory === 'all' || project.category === activeCategory;
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.techStack && project.techStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="archive" style={{ padding: '100px 0', background: '#ffffff' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
          <div className="toss-badge" style={{ marginBottom: '16px' }}>
            개발 아카이브 &middot; Projects
          </div>
          <h2 className="title-section">
            현장의 문제를 직접 해결한<br />
            실무형 소프트웨어 아카이브
          </h2>
          <p className="subtitle-section">
            사회복지 현장에서 반복되는 비효율을 걷어내고, 더 나은 서비스를 전달하기 위해 직접 기획하고 개발한 솔루션들입니다.
          </p>
        </div>

        {/* Filter Controls: Tabs & Search */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '40px'
        }}>
          {/* Category Tabs */}
          <div style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '4px',
            maxWidth: '100%'
          }}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '999px',
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  whiteSpace: 'nowrap',
                  background: activeCategory === cat.id ? '#191F28' : '#F2F4F6',
                  color: activeCategory === cat.id ? '#FFFFFF' : '#4E5968',
                  transition: 'all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  boxShadow: activeCategory === cat.id ? '0 4px 12px rgba(25, 31, 40, 0.2)' : 'none'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div style={{
            position: 'relative',
            minWidth: '260px',
            width: '100%',
            maxWidth: '300px'
          }}>
            <Search size={18} color="#8B95A1" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="프로젝트명, 기술 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 16px 11px 40px',
                borderRadius: '12px',
                border: '1px solid #E5E8EB',
                background: '#F9FAFB',
                fontSize: '0.9rem',
                outline: 'none',
                color: '#191F28'
              }}
            />
          </div>
        </div>

        {/* Project Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="toss-card"
              onClick={() => setSelectedProject(project)}
              style={{
                padding: '32px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: '#ffffff',
                border: '1px solid #F2F4F6'
              }}
            >
              <div>
                {/* Card Top: Icon & Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: '#E8F3FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {getIcon(project.icon)}
                  </div>
                  {project.badge && (
                    <span style={{
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      background: project.badge.includes('★') ? '#FFF0D4' : '#F2F4F6',
                      color: project.badge.includes('★') ? '#E57A00' : '#4E5968'
                    }}>
                      {project.badge}
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#8B95A1', marginBottom: '4px' }}>
                  {project.categoryLabel}
                </div>

                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '800',
                  color: '#191F28',
                  marginBottom: '10px',
                  letterSpacing: '-0.02em',
                  lineHeight: '1.3'
                }}>
                  {project.title}
                </h3>

                <p style={{
                  fontSize: '0.92rem',
                  color: '#4E5968',
                  lineHeight: '1.6',
                  marginBottom: '20px',
                  minHeight: '44px'
                }}>
                  {project.summary}
                </p>

                {/* Highlights preview */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
                  {project.highlights?.slice(0, 2).map((hl, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#6B7684' }}>
                      <CheckCircle2 size={14} color="#3182F6" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer: Tech Stack Chips & Action */}
              <div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                  {project.techStack?.map((tech, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: '#F2F4F6',
                        color: '#4E5968'
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px solid #F2F4F6',
                  fontSize: '0.88rem',
                  fontWeight: '700',
                  color: '#3182F6'
                }}>
                  <span>자세히 보기</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#8B95A1' }}>
            검색 결과와 일치하는 프로젝트가 없습니다.
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(8px)',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
        onClick={() => setSelectedProject(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '28px',
              maxWidth: '640px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '36px',
              position: 'relative',
              boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProject(null)}
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                padding: '8px',
                color: '#8B95A1'
              }}
            >
              <X size={24} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: '#E8F3FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {getIcon(selectedProject.icon)}
              </div>
              <div>
                <span className="toss-badge" style={{ fontSize: '0.75rem', padding: '3px 8px' }}>
                  {selectedProject.categoryLabel}
                </span>
                <div style={{ fontSize: '0.85rem', color: '#8B95A1', marginTop: '2px' }}>
                  {selectedProject.subtitle}
                </div>
              </div>
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: '900', color: '#191F28', marginBottom: '16px', letterSpacing: '-0.02em' }}>
              {selectedProject.title}
            </h2>

            <p style={{ fontSize: '1.02rem', color: '#4E5968', lineHeight: '1.7', marginBottom: '24px' }}>
              {selectedProject.description}
            </p>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#191F28', marginBottom: '12px' }}>
                주요 기능 & 특징
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedProject.highlights?.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.92rem', color: '#333D4B' }}>
                    <CheckCircle2 size={16} color="#3182F6" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#191F28', marginBottom: '10px' }}>
                기술 스택
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {selectedProject.techStack?.map((tech, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      background: '#F2F4F6',
                      color: '#191F28'
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setSelectedProject(null)}
                className="btn-toss btn-toss-secondary"
                style={{ flex: 1 }}
              >
                닫기
              </button>
              <a
                href="#contact"
                onClick={() => setSelectedProject(null)}
                className="btn-toss btn-toss-primary"
                style={{ flex: 1 }}
              >
                도입 및 협업 문의
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
