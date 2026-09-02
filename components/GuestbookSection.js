'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle2, Send } from 'lucide-react';

const EMOJIS = ['💬', '💙', '🚀', '✨', '🔥', '👏', '💡', '🍀'];
const MAX_MESSAGE = 300;

export default function GuestbookSection({ initialGuestbook = [] }) {
  const [guestbook, setGuestbook] = useState(initialGuestbook);
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(EMOJIS[0]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', text }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!author.trim() || !message.trim() || loading) return;

    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: author.trim(), emoji: selectedEmoji, message: message.trim() }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.entry) {
        throw new Error(result.error || '등록에 실패했습니다.');
      }

      setGuestbook((previous) => [result.entry, ...previous]);
      setAuthor('');
      setMessage('');
      setStatus({ type: 'success', text: '응원 메시지가 등록되었습니다. 고맙습니다!' });
    } catch (error) {
      // 저장에 실패했는데 성공한 것처럼 보이면 안 되므로, 입력값은 그대로 두고 알립니다.
      console.error(error);
      setStatus({ type: 'error', text: `${error.message} 잠시 후 다시 시도해주세요.` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section section--sage" id="guestbook" aria-labelledby="guestbook-title">
      <div className="container">
        <header className="section-head">
          <span className="eyebrow">
            <span className="eyebrow-ko">방명록</span>
            <span className="eyebrow-divider" aria-hidden="true">/</span>
            <span className="eyebrow-en" lang="en">Guestbook</span>
          </span>
          <h2 className="section-title" id="guestbook-title">짧은 인사와 응원을 남겨주세요.</h2>
          <p className="section-description">도구를 사용한 소감, 협업 제안, 따뜻한 한마디를 모두 반갑게 읽겠습니다.</p>
        </header>

        <div className="guestbook-layout">
          <section className="guestbook-form" aria-labelledby="guestbook-form-title">
            <header className="guestbook-form-head">
              <span className="guestbook-panel-label">
                <span>메시지 남기기</span>
                <span className="guestbook-panel-label-en" lang="en">Form</span>
              </span>
              <h3 id="guestbook-form-title">방명록 작성</h3>
            </header>

            {status && (
              <div className={`form-status${status.type === 'error' ? ' form-status--error' : ''}`} role="status">
                {status.type === 'error'
                  ? <AlertCircle size={17} aria-hidden="true" />
                  : <CheckCircle2 size={17} aria-hidden="true" />}
                <span>{status.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <span className="emoji-label" id="emoji-label">마음을 골라주세요</span>
              <div className="emoji-group" role="group" aria-labelledby="emoji-label">
                {EMOJIS.map((emoji) => (
                  <button
                    className={`emoji-button${selectedEmoji === emoji ? ' is-selected' : ''}`}
                    type="button"
                    key={emoji}
                    aria-label={`${emoji} 선택`}
                    aria-pressed={selectedEmoji === emoji}
                    onClick={() => setSelectedEmoji(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              <div className="form-field">
                <label htmlFor="guestbook-author">이름 또는 소속</label>
                <input
                  id="guestbook-author"
                  type="text"
                  placeholder="예: 동료 사회복지사"
                  value={author}
                  onChange={(event) => setAuthor(event.target.value)}
                  maxLength={30}
                  required
                />
              </div>

              <div className="form-field">
                <div className="form-field-head">
                  <label htmlFor="guestbook-message">메시지</label>
                  <span className="form-counter">{message.length} / {MAX_MESSAGE}</span>
                </div>
                <textarea
                  id="guestbook-message"
                  placeholder="응원이나 의견을 자유롭게 남겨주세요."
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  maxLength={MAX_MESSAGE}
                  rows={4}
                  required
                />
              </div>

              <button className="button button--primary" type="submit" disabled={loading}>
                <Send size={16} aria-hidden="true" />
                {loading ? '등록 중…' : '메시지 남기기'}
              </button>
            </form>
          </section>

          <section className="guestbook-testimonials" aria-labelledby="guestbook-testimonials-title">
            <header className="testimonial-head">
              <div>
                <span className="guestbook-panel-label">
                  <span>방문자 메시지</span>
                  <span className="guestbook-panel-label-en" lang="en">Testimonials</span>
                </span>
                <h3 id="guestbook-testimonials-title">도착한 이야기</h3>
              </div>
              <span className="testimonial-count" aria-label={`메시지 ${guestbook.length}개`}>
                {String(guestbook.length).padStart(2, '0')}
              </span>
            </header>

            <div className="message-list" aria-live="polite" aria-label="방명록 메시지">
              {guestbook.map((entry) => (
                <article className="message-card" key={entry.id}>
                  <div className="message-emoji" aria-hidden="true">{entry.emoji || '💬'}</div>
                  <div className="message-content">
                    <div className="message-head">
                      <span className="message-author">{entry.author}</span>
                      <time className="message-date">{entry.date}</time>
                    </div>
                    <p>{entry.message}</p>
                  </div>
                </article>
              ))}

              {guestbook.length === 0 && (
                <p className="empty-state">아직 메시지가 없습니다. 첫 번째 인사를 남겨주세요.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
