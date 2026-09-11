'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react';
import { NAV_LINKS } from '@/lib/navigation';
import { BrandLockup } from '@/components/BrandLogo';

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

  const renderMobileLinks = (onClick) =>
    NAV_LINKS.map((link) => (
      <div className="mobile-nav-group" key={link.id}>
        <a className={`nav-link${activeSection === link.id ? ' is-active' : ''}`} href={`/#${link.id}`} onClick={onClick}>
          <strong>{link.label}</strong><span>{link.english}</span>
        </a>
        <div className="mobile-nav-children">
          {link.children?.map((child) => <a href={`/#${child.id}`} key={child.id} onClick={onClick}>{child.label}</a>)}
        </div>
      </div>
    ));

  return (
    <nav className={`site-nav${scrolled ? ' is-scrolled' : ''}`} aria-label="주요 메뉴">
      <div className="container nav-inner">
        <Link className="brand" href="/" aria-label="일잘알랩 홈">
          <BrandLockup compact />
        </Link>

        <div className="desktop-nav">
          <div className="nav-groups">
            {NAV_LINKS.map((link) => (
              <div className="nav-group" key={link.id}>
                <a className={`nav-group-trigger${activeSection === link.id ? ' is-active' : ''}`} href={`/#${link.id}`}>
                  {link.label}<ChevronDown size={13} aria-hidden="true" />
                </a>
                <div className="nav-dropdown">
                  <p>{link.english}</p>
                  {link.children?.map((child) => <a href={`/#${child.id}`} key={child.id}>{child.label}</a>)}
                </div>
              </div>
            ))}
          </div>
          <a className="button button--primary button--small" href="/#contact">
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
          {mobileMenuOpen
            ? <X size={21} aria-hidden="true" />
            : <Menu size={21} aria-hidden="true" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-nav" id="mobile-navigation">
          {renderMobileLinks(closeMenu)}
          <a className="button button--primary" href="/#contact" onClick={closeMenu}>
            협업 문의 <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      )}
    </nav>
  );
}
