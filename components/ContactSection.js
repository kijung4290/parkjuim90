'use client';

import { useState } from 'react';
import {
  Check,
  ClipboardCheck,
  CodeXml,
  Copy,
  FileSpreadsheet,
  Globe2,
  GraduationCap,
  Handshake,
  Laptop,
  Mail,
  MapPin,
  MessageSquareText,
  Send,
  Users,
} from 'lucide-react';
import { SERVICES } from '@/lib/seo';

const SERVICE_ICONS = {
  'staff-training': GraduationCap,
  competency: Users,
  'smartwork-training': Laptop,
  'smartwork-consulting': ClipboardCheck,
  'vibe-coding': CodeXml,
};

/**
 * 문의 종류는 실제로 제공하는 교육·컨설팅(lib/seo.js)과 같은 목록을 씁니다.
 * 안내 영역에서 본 이름 그대로 문의할 수 있고, 메일 제목도 자동으로 맞춰집니다.
 */
const REQUEST_TYPES = [
  ...SERVICES.map((service) => ({
    id: service.id,
    label: service.shortLabel,
    subject: `${service.name} 문의`,
    icon: SERVICE_ICONS[service.id] || GraduationCap,
    placeholder: service.placeholder,
  })),
  {
    id: 'template',
    label: '업무양식 제작',
    subject: '업무양식·자동화 제작 요청',
    icon: FileSpreadsheet,
    placeholder: '현재 반복하고 있는 업무, 필요한 양식이나 자동화 기능, 사용하는 프로그램을 알려주세요.',
  },
  {
    id: 'collaboration',
    label: '도구 도입·협업',
    subject: '도구 도입·협업 문의',
    icon: Handshake,
    placeholder: '관심 있는 도구와 활용하려는 기관·현장, 함께 논의하고 싶은 내용을 알려주세요.',
  },
  {
    id: 'other',
    label: '기타 문의',
    subject: '기타 문의',
    icon: MessageSquareText,
    placeholder: '문의하실 내용을 자유롭게 적어주세요.',
  },
];

export default function ContactSection({ profile }) {
  const [copied, setCopied] = useState(false);
  const [requestType, setRequestType] = useState(REQUEST_TYPES[0].id);
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [replyEmail, setReplyEmail] = useState('');
  const [message, setMessage] = useState('');
  const [mailOpened, setMailOpened] = useState(false);
  const email = profile?.email;
  const selectedRequest = REQUEST_TYPES.find((type) => type.id === requestType) || REQUEST_TYPES[0];

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  const openEmailDraft = (event) => {
    event.preventDefault();
    if (!email) return;

    const subject = `[포트폴리오] ${selectedRequest.subject} - ${organization || name}`;
    const body = [
      '안녕하세요. 포트폴리오를 보고 문의드립니다.',
      '',
      `[문의 종류] ${selectedRequest.label}`,
      `[이름] ${name}`,
      `[소속·기관] ${organization || '미입력'}`,
      `[회신 이메일] ${replyEmail}`,
      '',
      '[문의 내용]',
      message,
      '',
      '---',
      'parkjuim90.cloud에서 작성한 문의입니다.',
    ].join('\n');

    setMailOpened(true);
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section className="section section--white" id="contact" aria-labelledby="contact-title">
      <div className="container">
        <div className="contact-panel">
          <div className="contact-copy">
            <span className="eyebrow">
              <span className="eyebrow-ko">요청과 협업</span>
              <span className="eyebrow-divider" aria-hidden="true">/</span>
              <span className="eyebrow-en" lang="en">Request & collaboration</span>
            </span>
            <h2 id="contact-title">필요한 일을 알려주시면<br />함께 방법을 찾겠습니다.</h2>
            <p className="section-description">사회복지 직원교육과 직원역량강화교육, 스마트워크 교육·컨설팅, 바이브코딩 교육부터 반복 업무를 줄이는 양식·자동화 도구 제작까지 편하게 문의해주세요.</p>

            <div className="contact-list" role="list">
              <div className="contact-item" role="listitem">
                <span className="contact-icon"><Mail size={18} aria-hidden="true" /></span>
                <span>
                  <span className="contact-label">받는 이메일</span>
                  <a className="contact-value contact-value--link" href={`mailto:${email}`}>{email}</a>
                </span>
                <button className="contact-action" type="button" onClick={copyEmail} aria-live="polite">
                  {copied ? <><Check size={12} aria-hidden="true" /> 복사됨</> : <><Copy size={12} aria-hidden="true" /> 주소 복사</>}
                </button>
              </div>

              <div className="contact-item" role="listitem">
                <span className="contact-icon"><MapPin size={18} aria-hidden="true" /></span>
                <span>
                  <span className="contact-label">활동 지역</span>
                  <span className="contact-value">{profile?.location}</span>
                </span>
                <span className="contact-action">전국 강의·온라인 협업</span>
              </div>

              {profile?.blog && (
                <div className="contact-item" role="listitem">
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

          <form className="contact-request-form" onSubmit={openEmailDraft} aria-labelledby="request-form-title">
            <div className="request-form-head">
              <span className="request-note-label">
                <span>요청서</span>
                <span className="request-note-label-en" lang="en">Request note</span>
              </span>
              <strong id="request-form-title">어떤 도움이 필요하세요?</strong>
              <p>요청 종류를 선택하면 이메일 제목과 본문이 자동으로 정리됩니다.</p>
            </div>

            <fieldset className="request-type-fieldset">
              <legend>문의 종류</legend>
              <div className="request-type-grid">
                {REQUEST_TYPES.map((type) => (
                  <button
                    className={requestType === type.id ? 'is-active' : ''}
                    type="button"
                    key={type.id}
                    aria-pressed={requestType === type.id}
                    onClick={() => {
                      setRequestType(type.id);
                      setMailOpened(false);
                    }}
                  >
                    <type.icon size={17} aria-hidden="true" />
                    {type.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="request-form-grid">
              <label className="request-field">
                <span>이름</span>
                <input value={name} onChange={(event) => setName(event.target.value)} placeholder="홍길동" required />
              </label>
              <label className="request-field">
                <span>소속·기관</span>
                <input value={organization} onChange={(event) => setOrganization(event.target.value)} placeholder="○○종합사회복지관" />
              </label>
              <label className="request-field request-field--wide">
                <span>회신받을 이메일</span>
                <input type="email" value={replyEmail} onChange={(event) => setReplyEmail(event.target.value)} placeholder="name@example.com" required />
              </label>
              <label className="request-field request-field--wide">
                <span>문의 내용</span>
                <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder={selectedRequest.placeholder} required />
              </label>
            </div>

            <button className="button request-submit" type="submit" disabled={!email}>
              <Send size={17} aria-hidden="true" /> 이메일 작성하기
            </button>
            <p className="request-form-note" aria-live="polite">
              {mailOpened
                ? '메일 앱을 열었습니다. 내용을 확인한 뒤 전송해주세요.'
                : '버튼을 누르면 입력 내용이 채워진 메일 앱이 열립니다. 최종 전송은 메일 앱에서 진행됩니다.'}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
