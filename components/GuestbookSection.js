'use client';

import { useState } from 'react';
import { CheckCircle2, Send } from 'lucide-react';

export default function GuestbookSection({ initialGuestbook = [] }) {
  const [guestbook, setGuestbook] = useState(initialGuestbook);
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('💬');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const emojis = ['💬', '💙', '🚀', '✨', '🔥', '👏', '💡', '🍀'];

  const addLocalEntry = () => {
    const now = new Date();
    const entry = {
      id: Date.now(),
      author: author.trim(),
      emoji: selectedEmoji,
      message: message.trim(),
      date: `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`,
    };
    setGuestbook((previous) => [entry, ...previous]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!author.trim() || !message.trim()) return;

    setLoading(true);
    setSuccessMessage('');

    try {
      const response = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: author.trim(), emoji: selectedEmoji, message: message.trim() }),
      });

      if (!response.ok) throw new Error('Guestbook request failed');
      const result = await response.json();
      if (result.entry) setGuestbook((previous) => [result.entry, ...previous]);
      else addLocalEntry();
    } catch (error) {
      console.error(error);
      addLocalEntry();
    } finally {
      setAuthor('');
      setMessage('');
      setSuccessMessage('응원 메시지가 등록되었습니다. 고맙습니다!');
      setLoading(false);
      window.setTimeout(() => setSuccessMessage(''), 4000);
    }
  };

  return (
    <section className="section section--sage" id="guestbook" aria-labelledby="guestbook-title">
      <div className="container">
        <header className="section-head">
          <span className="eyebrow">Guestbook</span>
          <h2 className="section-title" id="guestbook-title">짧은 인사와 응원을 남겨주세요.</h2>
          <p className="section-description">도구를 사용한 소감, 협업 제안, 따뜻한 한마디를 모두 반갑게 읽겠습니다.</p>
        </header>

        <div className="guestbook-layout">
          <div className="guestbook-form">
            <h3>방명록 작성</h3>

            {successMessage && (
              <div className="success-message" role="status">
                <CheckCircle2 size={17} aria-hidden="true" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <span className="emoji-label" id="emoji-label">마음을 골라주세요</span>
              <div className="emoji-group" role="group" aria-labelledby="emoji-label">
                {emojis.map((emoji) => (
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
                  maxLength={40}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="guestbook-message">메시지</label>
                <textarea
                  id="guestbook-message"
                  placeholder="응원이나 의견을 자유롭게 남겨주세요."
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  maxLength={300}
                  rows={4}
                  required
                />
              </div>

              <button className="button button--primary" type="submit" disabled={loading}>
                <Send size={16} aria-hidden="true" />
                {loading ? '등록 중…' : '메시지 남기기'}
              </button>
            </form>
          </div>

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
              <div className="empty-state">아직 메시지가 없습니다. 첫 번째 인사를 남겨주세요.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
