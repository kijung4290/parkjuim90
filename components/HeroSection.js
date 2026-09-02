'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';
import { DEFAULT_HERO, DEFAULT_PROFILE } from '@/lib/defaults';
import { getVideoEmbedUrl } from '@/lib/heroMedia';

const TYPE_LABELS = {
  image: 'FIELD PHOTO',
  video: 'FIELD FILM',
  quote: 'FIELD NOTE',
};

const WORKFLOW_STEPS = [
  {
    index: '01',
    title: '현장 불편',
    note: '반복 입력과 흩어진 기록',
  },
  {
    index: '02',
    title: '관찰',
    note: '실제 업무 흐름을 따라가기',
  },
  {
    index: '03',
    title: '작은 실험',
    note: '가볍게 만들고 바로 검증',
  },
  {
    index: '04',
    title: '동료 사용',
    note: '함께 써 보고 다시 다듬기',
  },
];

const WORKBENCH_TOOLS = [
  {
    status: 'USE 01',
    name: '사례관리 가계도',
    note: '관계 기록을 3분 안에',
  },
  {
    status: 'USE 02',
    name: '통합 출석체크',
    note: '한 번 입력해 명단 정리',
  },
  {
    status: 'USE 03',
    name: '차량일지',
    note: '운행·주유 기록 자동 집계',
  },
  {
    status: 'USE 04',
    name: '실적 대시보드',
    note: '흩어진 숫자를 한 화면에',
  },
];

function SlideMedia({ slide, shouldPlay }) {
  if (slide.type === 'quote') return null;

  if (slide.type === 'image') {
    return (
      <img
        className="hero-slide-asset"
        src={slide.url}
        alt={slide.alt || ''}
        fetchPriority="high"
      />
    );
  }

  const embedUrl = getVideoEmbedUrl(slide.url, {
    autoplay: shouldPlay,
    loop: true,
    controls: false,
  });

  if (embedUrl) {
    return (
      <iframe
        className="hero-slide-asset hero-slide-embed"
        src={embedUrl}
        title={slide.alt || slide.title || '포트폴리오 소개 영상'}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <video
      className="hero-slide-asset"
      src={slide.url}
      poster={slide.poster || undefined}
      autoPlay={shouldPlay}
      muted
      loop
      playsInline
      preload={shouldPlay ? 'auto' : 'metadata'}
      aria-label={slide.alt || slide.title || '포트폴리오 소개 영상'}
    >
      브라우저에서 동영상 재생을 지원하지 않습니다.
    </video>
  );
}

function WorkbenchBoard({ projectCount }) {
  const parsedProjectCount = Number(projectCount);
  const visibleProjectCount = (
    projectCount !== null
    && projectCount !== undefined
    && Number.isFinite(parsedProjectCount)
  ) ? Math.max(0, parsedProjectCount) : null;

  return (
    <figure className="hero-workbench-board" aria-labelledby="hero-workbench-board-title">
      <figcaption className="hero-workbench-board-head">
        <span className="hero-workbench-board-serial">FIELD-TO-TOOL / WORKBENCH</span>
        <strong id="hero-workbench-board-title" className="hero-workbench-board-title">
          불편을 발견하고, 쓸 수 있는 도구로
        </strong>
        {visibleProjectCount !== null && (
          <span className="hero-workbench-project-count">
            현재 {visibleProjectCount}개 프로젝트
          </span>
        )}
      </figcaption>

      <div className="hero-workbench-canvas">
        <span className="hero-workbench-grid" aria-hidden="true" />
        <svg
          className="hero-workbench-connectors"
          viewBox="0 0 720 360"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <marker
              id="hero-workbench-arrow"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="4"
              orient="auto"
            >
              <path d="M0,0 L8,4 L0,8 Z" />
            </marker>
          </defs>
          <path
            className="hero-workbench-connector hero-workbench-connector--flow"
            d="M72 78 H632"
            markerEnd="url(#hero-workbench-arrow)"
          />
          <path
            className="hero-workbench-connector hero-workbench-connector--branch"
            d="M632 78 C632 142 112 142 112 238"
          />
          <path
            className="hero-workbench-connector hero-workbench-connector--branch"
            d="M632 78 C632 158 278 158 278 238"
          />
          <path
            className="hero-workbench-connector hero-workbench-connector--branch"
            d="M632 78 C632 174 444 174 444 238"
          />
          <path
            className="hero-workbench-connector hero-workbench-connector--branch"
            d="M632 78 V238"
          />
        </svg>

        <ol className="hero-workbench-flow" aria-label="현장의 불편을 도구로 바꾸는 과정">
          {WORKFLOW_STEPS.map((step) => (
            <li className="hero-workbench-step" key={step.index}>
              <span className="hero-workbench-step-index" aria-hidden="true">{step.index}</span>
              <span className="hero-workbench-step-copy">
                <strong className="hero-workbench-step-title">{step.title}</strong>
                <span className="hero-workbench-step-note">{step.note}</span>
              </span>
            </li>
          ))}
        </ol>

        <div className="hero-workbench-output">
          <span className="hero-workbench-output-label">TOOLS IN USE</span>
          <ul className="hero-workbench-tools" aria-label="현장에서 사용하는 도구">
            {WORKBENCH_TOOLS.map((tool) => (
              <li className="hero-workbench-tool" key={tool.name}>
                <span className="hero-workbench-tool-status" aria-hidden="true">{tool.status}</span>
                <strong className="hero-workbench-tool-name">{tool.name}</strong>
                <span className="hero-workbench-tool-note">{tool.note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </figure>
  );
}

function HeroActions() {
  return (
    <div className="hero-slide-actions">
      <a className="button button--hero" href="#archive">
        만든 도구 둘러보기 <ArrowRight size={17} aria-hidden="true" />
      </a>
      <a className="button button--hero-quiet" href="#contact">협업 문의하기</a>
    </div>
  );
}

function SliderControls({ activeIndex, interval, playing, setPlaying, showSlide, slideCount }) {
  const shouldAutoPlay = playing && slideCount > 1;

  if (slideCount <= 1) return null;

  return (
    <div className="hero-slider-controls" aria-label="슬라이드 제어">
      <div className="hero-slide-progress" aria-hidden="true">
        <span>{String(activeIndex + 1).padStart(2, '0')}</span>
        <div className="hero-progress-track">
          <span
            key={`${activeIndex}-${playing}`}
            className={shouldAutoPlay ? 'is-running' : ''}
            style={{ '--slide-duration': `${interval}ms` }}
          />
        </div>
        <span>{String(slideCount).padStart(2, '0')}</span>
      </div>

      {slideCount > 1 && (
        <div className="hero-slide-buttons">
          <button type="button" onClick={() => showSlide(activeIndex - 1)} aria-label="이전 슬라이드">
            <ArrowLeft size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setPlaying((current) => !current)}
            aria-label={playing ? '자동 슬라이드 일시 정지' : '자동 슬라이드 재생'}
          >
            {playing
              ? <Pause size={17} aria-hidden="true" />
              : <Play size={17} aria-hidden="true" />}
          </button>
          <button type="button" onClick={() => showSlide(activeIndex + 1)} aria-label="다음 슬라이드">
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function HeroSection({ hero, profile, projectCount }) {
  const slides = useMemo(() => {
    const configured = Array.isArray(hero?.slides) ? hero.slides : [];
    const visible = configured.filter((slide) => (
      slide?.type === 'quote'
        ? Boolean(slide.title || slide.description)
        : Boolean(slide?.url)
    ));
    return visible.length ? visible : [DEFAULT_HERO.slides[0]];
  }, [hero?.slides]);

  const resolvedProfile = { ...DEFAULT_PROFILE, ...(profile || {}) };
  const stats = Array.isArray(resolvedProfile.stats)
    ? resolvedProfile.stats.filter((stat) => stat?.label || stat?.value).slice(0, 4)
    : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(Boolean(hero?.autoplay));
  const activeSlide = slides[activeIndex] || slides[0];
  const interval = Math.max(4000, Number(hero?.interval) || DEFAULT_HERO.interval);
  const shouldAutoPlay = playing && slides.length > 1;
  const isWorkbenchSlide = activeSlide.type === 'quote';

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPlayback = () => {
      setPlaying(motionPreference.matches ? false : Boolean(hero?.autoplay));
    };

    syncPlayback();

    if (motionPreference.addEventListener) {
      motionPreference.addEventListener('change', syncPlayback);
      return () => motionPreference.removeEventListener('change', syncPlayback);
    }

    motionPreference.addListener(syncPlayback);
    return () => motionPreference.removeListener(syncPlayback);
  }, [hero?.autoplay]);

  useEffect(() => {
    if (activeIndex >= slides.length) setActiveIndex(0);
  }, [activeIndex, slides.length]);

  useEffect(() => {
    if (!shouldAutoPlay) return undefined;
    const timer = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, interval);
    return () => window.clearTimeout(timer);
  }, [activeIndex, interval, shouldAutoPlay, slides.length]);

  const showSlide = (index) => setActiveIndex((index + slides.length) % slides.length);
  const slideKey = activeSlide.id || `${activeSlide.type}-${activeIndex}`;

  return (
    <section
      className={`hero hero--slider${isWorkbenchSlide ? ' hero--workbench' : ''}`}
      aria-labelledby="hero-title"
      aria-roledescription="carousel"
    >
      <div className={`hero-stage hero-stage--${activeSlide.type}`}>
        <SlideMedia key={`${slideKey}-${playing}`} slide={activeSlide} shouldPlay={playing} />
        <div className="hero-slide-wash" aria-hidden="true" />

        <div
          className={`container hero-slide-content${isWorkbenchSlide ? ' hero-slide-content--workbench' : ''}`}
          role="group"
          aria-roledescription="slide"
          aria-label={`${activeIndex + 1} / ${slides.length}`}
        >
          {isWorkbenchSlide ? (
            <>
              <div className="hero-workbench-layout">
                <div className="hero-slide-copy hero-workbench-copy" key={slideKey}>
                  <span className="hero-slide-kicker">
                    {activeSlide.eyebrow || TYPE_LABELS.quote}
                  </span>
                  <div className="hero-workbench-identity">
                    <strong className="hero-workbench-name">{resolvedProfile.name}</strong>
                    <span className="hero-workbench-role">{resolvedProfile.role}</span>
                  </div>
                  <h1 id="hero-title">{activeSlide.title}</h1>
                  {activeSlide.description && (
                    <p className="hero-slide-lead">{activeSlide.description}</p>
                  )}
                  {resolvedProfile.introduction && (
                    <p className="hero-workbench-introduction">{resolvedProfile.introduction}</p>
                  )}
                  <HeroActions />
                </div>

                <WorkbenchBoard projectCount={projectCount} />
              </div>

              {stats.length > 0 && (
                <ul className="hero-workbench-stats" aria-label="주요 활동 지표">
                  {stats.map((stat, index) => (
                    <li className="hero-workbench-stat" key={`${stat.label}-${index}`}>
                      <strong className="hero-workbench-stat-value">
                        {stat.value}
                        {stat.unit && <small className="hero-workbench-stat-unit">{stat.unit}</small>}
                      </strong>
                      <span className="hero-workbench-stat-label">{stat.label}</span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <div className="hero-slide-copy" key={slideKey}>
              <span className="hero-slide-kicker">
                {activeSlide.eyebrow || TYPE_LABELS[activeSlide.type]}
              </span>
              <h1 id="hero-title">{activeSlide.title}</h1>
              {activeSlide.description && <p className="hero-slide-lead">{activeSlide.description}</p>}
              <HeroActions />
            </div>
          )}

          <SliderControls
            activeIndex={activeIndex}
            interval={interval}
            playing={playing}
            setPlaying={setPlaying}
            showSlide={showSlide}
            slideCount={slides.length}
          />
        </div>
      </div>
    </section>
  );
}
