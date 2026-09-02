'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 18);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: '일하는 원칙', href: '#philosophy' },
    { label: '만든 도구', href: '#archive' },
    { label: '경력', href: '#experience' },
    { label: '기록', href: '#stories' },
    { label: '방명록', href: '#guestbook' },
  ];

  const closeMenu = () => setMobileMenuOpen(false);

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
          <div className="nav-links">
            {navLinks.map((link) => (
              <a className="nav-link" href={link.href} key={link.href}>{link.label}</a>
            ))}
          </div>
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
          {navLinks.map((link) => (
            <a className="nav-link" href={link.href} key={link.href} onClick={closeMenu}>{link.label}</a>
          ))}
          <a className="button button--primary" href="#contact" onClick={closeMenu}>
            협업 문의 <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      )}
    </nav>
  );
}
