'use client';

import { useState } from 'react';
import { Mail, Phone, Globe, Github, Copy, Check, MessageCircle } from 'lucide-react';

export default function ContactSection({ profile }) {
  const [copiedKey, setCopiedKey] = useState(null);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const contactItems = [
    {
      key: 'email',
      icon: <Mail size={22} color="#3182F6" />,
      label: '이메일',
      value: profile?.email || 'parkjuim90@gmail.com',
      actionType: 'copy',
      actionText: '이메일 복사'
    },
    {
      key: 'phone',
      icon: <Phone size={22} color="#3182F6" />,
      label: '연락처 / 위치',
      value: `${profile?.location || '강원도 원주시'}`,
      actionType: 'text',
      actionText: '지역사회 기반'
    },
    {
      key: 'blog',
      icon: <Globe size={22} color="#3182F6" />,
      label: '블로그 / 스마트워크',
      value: '사회복지 DX & 실무 가이드',
      actionType: 'link',
      href: profile?.blog || 'https://blog.naver.com',
      actionText: '블로그 방문'
    }
  ];

  return (
    <section id="contact" style={{ padding: '100px 0', background: '#ffffff' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        {/* Section Header */}
        <div style={{ maxWidth: '640px', margin: '0 auto 50px' }}>
          <div className="toss-badge" style={{ marginBottom: '16px' }}>
            함께하기 &middot; Let's Connect
          </div>
          <h2 className="title-section">
            새로운 복지 도구와 스마트워크,<br />
            언제든 편하게 이야기 나눠요
          </h2>
          <p className="subtitle-section">
            현장 프로그램 도입 문의, 복지관 디지털 전환 교육 특강, 협업 프로젝트 제안을 환영합니다.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
          maxWidth: '900px',
          margin: '0 auto 40px'
        }}>
          {contactItems.map((item) => (
            <div
              key={item.key}
              className="toss-card"
              style={{
                padding: '32px 24px',
                background: '#F9FAFB',
                border: '1px solid #E5E8EB',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: '#E8F3FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                {item.icon}
              </div>

              <div style={{ fontSize: '0.85rem', color: '#8B95A1', fontWeight: '700', marginBottom: '6px' }}>
                {item.label}
              </div>

              <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#191F28', marginBottom: '16px' }}>
                {item.value}
              </div>

              {item.actionType === 'copy' && (
                <button
                  onClick={() => copyToClipboard(item.value, item.key)}
                  className="btn-toss btn-toss-light"
                  style={{ padding: '8px 16px', fontSize: '0.88rem' }}
                >
                  {copiedKey === item.key ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedKey === item.key ? '복사되었습니다' : item.actionText}</span>
                </button>
              )}

              {item.actionType === 'link' && (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-toss btn-toss-secondary"
                  style={{ padding: '8px 16px', fontSize: '0.88rem' }}
                >
                  {item.actionText} &rarr;
                </a>
              )}

              {item.actionType === 'text' && (
                <span style={{ fontSize: '0.85rem', color: '#6B7684', fontWeight: '600' }}>
                  {item.actionText}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
