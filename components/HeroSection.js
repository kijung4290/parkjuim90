'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Pause, Play, Quote } from 'lucide-react';
import { DEFAULT_HERO } from '@/lib/defaults';
import { getVideoEmbedUrl } from '@/lib/heroMedia';

const TYPE_LABELS = {
  image: 'FIELD PHOTO',
  video: 'FIELD FILM',
  quote: 'FIELD NOTE',
};

function SlideMedia({ slide, shouldPlay }) {
  if (slide.type === 'quote') {
    return (
      <div className="hero-slide-quote-mark" aria-hidden="true">
        <Quote size={92} strokeWidth={1.1} />
      </div>
    );
  }

  if (slide.type === 'image') {
    return <img className="hero-slide-asset" src={slide.url} alt={slide.alt || ''} fetchPriority="high" />;
  }

  const embedUrl = getVideoEmbedUrl(slide.url, { autoplay: shouldPlay, loop: true, controls: false });
  if (embedUrl) {
    return (
      <iframe
        className="hero-slide-asset hero-slide-embed"
        src={embedUrl}
        title={slide.alt || slide.title || '소개 영상'}
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
      aria-label={slide.alt || slide.title || '소개 영상'}
    >
      브라우저에서 동영상 재생을 지원하지 않습니다.
    </video>
  );
}

export default function HeroSection({ profile, hero }) {
  const slides = useMemo(() => {
    const configured = Array.isArray(hero?.slides) ? hero.slides : [];
    const visible = configured.filter((slide) => (
      slide?.type === 'quote'
        ? Boolean(slide.title || slide.description)
        : Boolean(slide?.url)
    ));
    return visible.length ? visible : [DEFAULT_HERO.slides[0]];
  }, [hero?.slides]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(Boolean(hero?.autoplay));
  const activeSlide = slides[activeIndex] || slides[0];
  const interval = Math.max(4000, Number(hero?.interval) || DEFAULT_HERO.interval);
  const shouldAutoPlay = playing && slides.length > 1;

  useEffect(() => {
    setPlaying(Boolean(hero?.autoplay));
  }, [hero?.autoplay]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setPlaying(false);
  }, []);

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

  return (
    <section className="hero hero--slider" aria-label="주요 활동 소개">
      <div className={`hero-stage hero-stage--${activeSlide.type}`}>
        <SlideMedia key={`${activeSlide.id}-${playing}`} slide={activeSlide} shouldPlay={playing} />
        <div className="hero-slide-wash" aria-hidden="true" />

        <div className="container hero-slide-content">
          <div className="hero-slide-copy" key={activeSlide.id}>
            <span className="hero-slide-kicker">
              {activeSlide.eyebrow || TYPE_LABELS[activeSlide.type]}
            </span>
            <h1 id="hero-title">{activeSlide.title}</h1>
            {activeSlide.description && <p>{activeSlide.description}</p>}
            <div className="hero-slide-actions">
              <a className="button button--hero" href="#archive">만든 도구 살펴보기 <ArrowRight size={17} /></a>
              <a className="button button--hero-quiet" href="#contact">협업 문의하기</a>
            </div>
          </div>

          <div className="hero-slider-controls" aria-label="슬라이드 이동">
            <div className="hero-slide-progress" aria-hidden="true">
              <span>{String(activeIndex + 1).padStart(2, '0')}</span>
              <div className="hero-progress-track">
                <span key={`${activeIndex}-${playing}`} className={shouldAutoPlay ? 'is-running' : ''} style={{ '--slide-duration': `${interval}ms` }} />
              </div>
              <span>{String(slides.length).padStart(2, '0')}</span>
            </div>

            {slides.length > 1 && (
              <div className="hero-slide-buttons">
                <button type="button" onClick={() => showSlide(activeIndex - 1)} aria-label="이전 슬라이드"><ArrowLeft size={18} /></button>
                <button type="button" onClick={() => setPlaying((current) => !current)} aria-label={playing ? '자동 슬라이드 일시정지' : '자동 슬라이드 재생'}>
                  {playing ? <Pause size={17} /> : <Play size={17} />}
                </button>
                <button type="button" onClick={() => showSlide(activeIndex + 1)} aria-label="다음 슬라이드"><ArrowRight size={18} /></button>
              </div>
            )}
          </div>
        </div>
      </div>

      {profile?.stats?.length > 0 && (
        <div className="container">
          <div className="stats-strip" aria-label="주요 활동 지표">
            {profile.stats.map((stat) => (
              <div className="stat" key={stat.label}>
                <div className="stat-value">{stat.value}<span className="stat-unit">{stat.unit}</span></div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
