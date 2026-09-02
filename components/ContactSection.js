'use client';

import { useState } from 'react';
import { Check, Copy, Globe2, Mail, MapPin } from 'lucide-react';

export default function ContactSection({ profile }) {
  const [copied, setCopied] = useState(false);
  const email = profile?.email;

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // http 환경이나 권한 거부로 복사가 막히면 메일 앱을 대신 엽니다.
      window.location.href = `mailto:${email}`;
    }
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
                <a className="contact-value contact-value--link" href={`mailto:${email}`}>{email}</a>
              </span>
              <button className="contact-action" type="button" onClick={copyEmail} aria-live="polite">
                {copied ? <><Check size={12} aria-hidden="true" /> 복사됨</> : <><Copy size={12} aria-hidden="true" /> 복사</>}
              </button>
            </div>

            <div className="contact-item">
              <span className="contact-icon"><MapPin size={18} aria-hidden="true" /></span>
              <span>
                <span className="contact-label">활동 지역</span>
                <span className="contact-value">{profile?.location}</span>
              </span>
              <span className="contact-action">지역사회 기반</span>
            </div>

            {profile?.blog && (
              <div className="contact-item">
                <span className="contact-icon"><Globe2 size={18} aria-hidden="true" /></span>
                <span>
                  <span className="contact-label">블로그</span>
                  <span className="contact-value">사회복지 DX & 실무 기록</span>
                </span>
                <a className="contact-action" href={profile.blog} target="_blank" rel="noreferrer">방문하기 ↗</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
