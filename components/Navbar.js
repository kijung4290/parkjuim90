'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Globe, Menu, X, ArrowUpRight } from 'lucide-react';

export default function Navbar({ domain = "parkjuim90.cloud" }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: '핵심 가치', href: '#philosophy' },
    { label: '아카이브 (프로젝트)', href: '#archive' },
    { label: '이력 & 발자취', href: '#experience' },
    { label: '게시판 & 스토리', href: '#stories' },
    { label: '방명록', href: '#guestbook' },
  ];

  return (
    <nav className="toss-nav">
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        {/* Brand Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #3182F6 0%, #1B64DA 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: '900',
            fontSize: '1.1rem',
            boxShadow: '0 4px 12px rgba(49, 130, 246, 0.3)'
          }}>
            P
          </div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '1.1rem', letterSpacing: '-0.02em', color: '#191F28' }}>
              박주임 <span style={{ color: '#3182F6', fontSize: '0.85rem', fontWeight: '700', marginLeft: '2px' }}>.cloud</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#8B95A1', fontWeight: '500' }}>
              스마트워커 & 복지 개발자
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="desktop-menu">
          <div style={{ display: 'flex', gap: '24px' }}>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: '#4E5968',
                  transition: 'color 0.2s ease',
                  padding: '8px 4px'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#3182F6')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#4E5968')}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <a
              href="#contact"
              className="btn-toss btn-toss-primary"
              style={{ padding: '10px 18px', fontSize: '0.9rem', borderRadius: '10px' }}
            >
              함께하기 / 문의
            </a>
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="mobile-hamburger"
          style={{
            display: 'none',
            padding: '8px',
            color: '#191F28'
          }}
          aria-label="메뉴 열기"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          background: '#ffffff',
          borderBottom: '1px solid #E5E8EB',
          padding: '20px 24px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: '1.05rem',
                fontWeight: '700',
                color: '#191F28',
                padding: '8px 0'
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="btn-toss btn-toss-primary"
            style={{ width: '100%', marginTop: '8px' }}
          >
            함께하기 / 문의
          </a>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-menu {
            display: none !important;
          }
          .mobile-hamburger {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
}
