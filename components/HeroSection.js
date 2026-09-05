'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Film,
  Image as ImageIcon,
  Pause,
  Play,
  Quote,
} from 'lucide-react';
import { DEFAULT_HERO, DEFAULT_PROFILE } from '@/lib/defaults';
import { getVideoEmbedUrl } from '@/lib/heroMedia';

const TYPE_LABELS = {
  quote: 'FIELD NOTE',
  image: 'FIELD PHOTO',
  video: 'FIELD FILM',
};

function SlideMedia({ slide, shouldPlay }) {
  if (slide.type === 'quote') {
    return (
      <div className="hero-slide-quote-decor" aria-hidden="true">
        <Quote className="hero-quote-watermark" size={280} />
        <div className="hero-quote-mesh" />
      </div>
    );
  }

  if (slide.type === 'image') {
    if (!slide.url) {
      return (
        <div className="hero-slide-placeholder" aria-hidden="true">
          <ImageIcon size={56} />
        </div>
      );
    }
    return (
      <img
        className="hero-slide-asset"
        src={slide.url}
        alt={slide.alt || slide.title || '포트폴리오 현장 사진'}
        fetchPriority="high"
      />
    );
  }

  // video slide
  if (!slide.url) {
    return (
      <div className="hero-slide-placeholder" aria-hidden="true">
        <Film size={56} />
      </div>
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

function SliderControls({ activeIndex, interval, playing, setPlaying, showSlide, slides }) {
  const slideCount = slides.length;
  const shouldAutoPlay = playing && slideCount > 1;

  if (slideCount <= 1) return null;

  return (
    <div className="hero-slider-controls" aria-label="슬라이드 제어">
      <div className="hero-slider-left">
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

        {/* 인디케이터 점 네비게이션 */}
        <div className="hero-slider-dots" role="tablist" aria-label="슬라이드 이동">
          {slides.map((s, idx) => (
            <button
              key={s.id || idx}
              type="button"
              role="tab"
              aria-selected={activeIndex === idx}
              className={`hero-slider-dot${activeIndex === idx ? ' is-active' : ''}`}
              onClick={() => showSlide(idx)}
              aria-label={`슬라이드 ${idx + 1} 이동: ${s.title || s.type}`}
            >
              <span className="hero-dot-pill" />
            </button>
          ))}
        </div>
      </div>

      <div className="hero-slide-buttons">
        <button type="button" onClick={() => showSlide(activeIndex - 1)} aria-label="이전 슬라이드">
          <ArrowLeft size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => setPlaying((current) => !current)}
          aria-label={playing ? '자동 슬라이드 일시 정지' : '자동 슬라이드 재생'}
          title={playing ? '일시 정지' : '자동 재생'}
        >
          {playing
            ? <Pause size={17} aria-hidden="true" />
            : <Play size={17} aria-hidden="true" />}
        </button>
        <button type="button" onClick={() => showSlide(activeIndex + 1)} aria-label="다음 슬라이드">
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default function HeroSection({ hero, profile }) {
  const slides = useMemo(() => {
    const configured = Array.isArray(hero?.slides) ? hero.slides : [];
    const visible = configured.filter((slide) => {
      if (!slide) return false;
      if (slide.type === 'quote') return Boolean(slide.title || slide.description);
      return Boolean(slide.url || slide.title || slide.description);
    });
    return visible.length ? visible : DEFAULT_HERO.slides;
  }, [hero?.slides]);

  const resolvedProfile = { ...DEFAULT_PROFILE, ...(profile || {}) };
  const stats = Array.isArray(resolvedProfile.stats)
    ? resolvedProfile.stats.filter((stat) => stat?.label || stat?.value).slice(0, 4)
    : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(Boolean(hero?.autoplay));
  const activeSlide = slides[activeIndex] || slides[0];
  const interval = Math.max(3000, Number(hero?.interval) || DEFAULT_HERO.interval);
  const shouldAutoPlay = playing && slides.length > 1;

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
      className="hero hero--slider"
      aria-labelledby="hero-title"
      aria-roledescription="carousel"
    >
      <div className={`hero-stage hero-stage--${activeSlide.type}`}>
        <SlideMedia key={`${slideKey}-${playing}`} slide={activeSlide} shouldPlay={playing} />
        <div className="hero-slide-wash" aria-hidden="true" />

        <div
          className="container hero-slide-content"
          role="group"
          aria-roledescription="slide"
          aria-label={`${activeIndex + 1} / ${slides.length}`}
        >
          <div className="hero-slide-copy" key={slideKey}>
            <div className="hero-slide-badges">
              <span className="hero-slide-kicker">
                {activeSlide.eyebrow || TYPE_LABELS[activeSlide.type] || 'FIELD NOTE'}
              </span>
              <span className="hero-type-pill">
                {activeSlide.type === 'video' && <Film size={12} aria-hidden="true" />}
                {activeSlide.type === 'image' && <ImageIcon size={12} aria-hidden="true" />}
                {activeSlide.type === 'quote' && <Quote size={12} aria-hidden="true" />}
                {activeSlide.type === 'video' ? '동영상' : activeSlide.type === 'image' ? '현장 사진' : '글귀'}
              </span>
            </div>

            {activeSlide.type === 'quote' && (
              <div className="hero-author-tag">
                <strong className="hero-author-name">{resolvedProfile.name}</strong>
                <span className="hero-author-role">{resolvedProfile.role}</span>
              </div>
            )}

            <h1 id="hero-title">{activeSlide.title}</h1>
            {activeSlide.description && (
              <p className="hero-slide-lead">{activeSlide.description}</p>
            )}

            <HeroActions />

            {activeSlide.type === 'quote' && stats.length > 0 && (
              <ul className="hero-quick-stats" aria-label="주요 활동 지표">
                {stats.map((stat, index) => (
                  <li className="hero-quick-stat" key={`${stat.label}-${index}`}>
                    <strong className="hero-quick-stat-value">
                      {stat.value}
                      {stat.unit && <small>{stat.unit}</small>}
                    </strong>
                    <span className="hero-quick-stat-label">{stat.label}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <SliderControls
            activeIndex={activeIndex}
            interval={interval}
            playing={playing}
            setPlaying={setPlaying}
            showSlide={showSlide}
            slides={slides}
          />
        </div>
      </div>
    </section>
  );
}
