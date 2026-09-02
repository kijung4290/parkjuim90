'use client';

import Link from 'next/link';
import { Globe, Heart, Shield, Lock } from 'lucide-react';

export default function Footer({ profile }) {
  return (
    <footer style={{
      background: '#191F28',
      color: '#8B95A1',
      padding: '60px 0 40px',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '32px',
          paddingBottom: '40px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          {/* Left Brand */}
          <div style={{ maxWidth: '400px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#3182F6',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '900',
                fontSize: '0.95rem'
              }}>
                P
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                박주임 <span style={{ color: '#3182F6', fontSize: '0.9rem' }}>.cloud</span>
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#8B95A1', lineHeight: '1.6' }}>
              사회복지 현장의 목소리를 기술로 담아내는 스마트워크 소프트웨어 크리에이터 포트폴리오입니다.
            </p>
          </div>

          {/* Quick Links */}
          <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '12px' }}>
                바로가기
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
                <a href="#philosophy" style={{ color: '#8B95A1' }}>핵심 철학</a>
                <a href="#archive" style={{ color: '#8B95A1' }}>개발 아카이브</a>
                <a href="#experience" style={{ color: '#8B95A1' }}>이력 & 발자취</a>
                <a href="#stories" style={{ color: '#8B95A1' }}>게시판 & 스토리</a>
                <a href="#guestbook" style={{ color: '#8B95A1' }}>방명록</a>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '12px' }}>
                관리 및 도메인
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
                <span style={{ color: '#3182F6', fontWeight: '600' }}>parkjuim90.cloud</span>
                <Link href="/admin" style={{ color: '#8B95A1', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Lock size={12} />
                  <span>관리자 모드</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          paddingTop: '24px',
          fontSize: '0.82rem',
          color: '#6B7684'
        }}>
          <div>
            &copy; {new Date().getFullYear()} {profile?.name || '박주임'}. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Crafted with</span>
            <Heart size={12} color="#e11d48" fill="#e11d48" />
            <span>for Social Workers & Communities</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
