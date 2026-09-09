'use client';

import { useRef, useState } from 'react';
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
} from 'lucide-react';
import { SERVICES } from '@/lib/seo';

const SERVICE_ICONS = {
  'staff-training': GraduationCap,
  'smartwork-training': Laptop,
  'smartwork-consulting': ClipboardCheck,
  'vibe-coding': CodeXml,
  'custom-template': FileSpreadsheet,
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
  const startedAt = useRef(Date.now());
  const [copied, setCopied] = useState(false);
  const [requestType, setRequestType] = useState(REQUEST_TYPES[0].id);
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [replyEmail, setReplyEmail] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState('');
  const [submitState, setSubmitState] = useState({ status: 'idle', message: '' });
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

  const sendEmail = async (event) => {
    event.preventDefault();
    if (!email || submitState.status === 'sending') return;

    setSubmitState({ status: 'sending', message: '문의를 보내고 있습니다.' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestType, name, organization, replyEmail, message, website, startedAt: startedAt.current }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) throw new Error(result.error || '메일을 보내지 못했습니다. 잠시 뒤 다시 시도해주세요.');

      setName('');
      setOrganization('');
      setReplyEmail('');
      setMessage('');
      setWebsite('');
      startedAt.current = Date.now();
      setSubmitState({ status: 'success', message: '문의가 전송되었습니다. 확인 후 입력하신 이메일로 답변드리겠습니다.' });
    } catch (error) {
      setSubmitState({ status: 'error', message: error.message });
    }
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
            <p className="section-description">사회복지 직원교육·직원역량강화, 스마트워크 교육·컨설팅, 바이브코딩 교육부터 반복 업무를 줄이는 업무양식 맞춤 제작까지 편하게 문의해주세요.</p>

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

          <form className="contact-request-form" onSubmit={sendEmail} aria-labelledby="request-form-title">
            <div className="request-form-head">
              <span className="request-note-label">
                <span>요청서</span>
                <span className="request-note-label-en" lang="en">Request note</span>
              </span>
              <strong id="request-form-title">어떤 도움이 필요하세요?</strong>
              <p>작성하신 문의는 이 화면에서 바로 전송됩니다.</p>
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
                      setSubmitState({ status: 'idle', message: '' });
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
              <label className="request-field request-field--trap" aria-hidden="true">
                <span>웹사이트</span>
                <input value={website} onChange={(event) => setWebsite(event.target.value)} tabIndex="-1" autoComplete="off" />
              </label>
            </div>

            <button className="button request-submit" type="submit" disabled={!email || submitState.status === 'sending'}>
              <Send size={17} aria-hidden="true" /> {submitState.status === 'sending' ? '전송 중…' : '문의 보내기'}
            </button>
            <p className={`request-form-note request-form-note--${submitState.status}`} aria-live="polite">
              {submitState.message || '입력하신 이메일은 문의 답변 용도로만 사용됩니다.'}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
