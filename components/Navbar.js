'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { NAV_LINKS } from '@/lib/navigation';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 18);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 화면 가운데에 걸린 섹션을 현재 위치로 표시합니다.
  useEffect(() => {
    const sections = NAV_LINKS.map((link) => document.getElementById(link.id)).filter(Boolean);
    if (sections.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // 모바일 메뉴는 Esc로도 닫히게 합니다.
  useEffect(() => {
    if (!mobileMenuOpen) return undefined;
    const closeWithEscape = (event) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', closeWithEscape);
    return () => window.removeEventListener('keydown', closeWithEscape);
  }, [mobileMenuOpen]);

  const closeMenu = () => setMobileMenuOpen(false);

  const renderLinks = (onClick) =>
    NAV_LINKS.map((link) => (
      <a
        className={`nav-link${activeSection === link.id ? ' is-active' : ''}`}
        href={`#${link.id}`}
        key={link.id}
        aria-current={activeSection === link.id ? 'true' : undefined}
        onClick={onClick}
      >
        {link.label}
      </a>
    ));

  return (
    <nav className={`site-nav${scrolled ? ' is-scrolled' : ''}`} aria-label="주요 메뉴">
      <div className="container nav-inner">
        <Link className="brand" href="/" aria-label="박주임 포트폴리오 홈">
          <span className="brand-mark" aria-hidden="true">P/J</span>
          <span className="brand-copy">
            <span className="brand-name">박주임의 현장 도구</span>
            <span className="brand-role">Social worker · Practical builder</span>
          </span>
        </Link>

        <div className="desktop-nav">
          <div className="nav-links">{renderLinks()}</div>
          <a className="button button--primary button--small" href="#contact">
            협업 문의 <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>

        <button
          className="nav-toggle"
          type="button"
          aria-label={mobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-nav" id="mobile-navigation">
          {renderLinks(closeMenu)}
          <a className="button button--primary" href="#contact" onClick={closeMenu}>
            협업 문의 <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      )}
    </nav>
  );
}
