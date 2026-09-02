'use client';

import { useState } from 'react';
import { Check, Copy, Globe2, Mail, MapPin } from 'lucide-react';

export default function ContactSection({ profile }) {
  const [copied, setCopied] = useState(false);
  const email = profile?.email || 'parkjuim90@gmail.com';

  const copyEmail = async () => {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="section section--white" id="contact" aria-labelledby="contact-title">
      <div className="container">
        <div className="contact-panel">
          <div className="contact-copy">
            <span className="eyebrow">Let&apos;s work together</span>
            <h2 id="contact-title">복지 현장의 더 나은 일하는 방식을 함께 만들어요.</h2>
            <p className="section-description">프로그램 도입, 디지털 전환 교육, 현장 중심의 협업 제안을 기다립니다.</p>
          </div>

          <div className="contact-list">
            <div className="contact-item">
              <span className="contact-icon"><Mail size={18} aria-hidden="true" /></span>
              <span>
                <span className="contact-label">이메일</span>
                <span className="contact-value">{email}</span>
              </span>
              <button className="contact-action" type="button" onClick={copyEmail}>
                {copied ? <><Check size={12} /> 복사됨</> : <><Copy size={12} /> 복사</>}
              </button>
            </div>

            <div className="contact-item">
              <span className="contact-icon"><MapPin size={18} aria-hidden="true" /></span>
              <span>
                <span className="contact-label">활동 지역</span>
                <span className="contact-value">{profile?.location || '강원특별자치도 원주시'}</span>
              </span>
              <span className="contact-action">지역사회 기반</span>
            </div>

            <div className="contact-item">
              <span className="contact-icon"><Globe2 size={18} aria-hidden="true" /></span>
              <span>
                <span className="contact-label">블로그</span>
                <span className="contact-value">사회복지 DX & 실무 기록</span>
              </span>
              <a className="contact-action" href={profile?.blog || 'https://blog.naver.com'} target="_blank" rel="noreferrer">방문하기 ↗</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
