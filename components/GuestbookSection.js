'use client';

import { useState } from 'react';
import { MessageSquare, Send, Sparkles, User, CheckCircle2 } from 'lucide-react';

export default function GuestbookSection({ initialGuestbook = [] }) {
  const [guestbook, setGuestbook] = useState(initialGuestbook);
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('💬');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const emojis = ['💬', '💙', '🚀', '✨', '🔥', '👏', '💡', '🍀'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!author.trim() || !message.trim()) return;

    setLoading(true);
    setSuccessMsg('');

    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author,
          emoji: selectedEmoji,
          message
        })
      });

      if (res.ok) {
        const json = await res.json();
        if (json.entry) {
          setGuestbook(prev => [json.entry, ...prev]);
        }
        setAuthor('');
        setMessage('');
        setSuccessMsg('소중한 응원 메시지가 등록되었습니다! 감사합니다.');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        alert('메시지 등록에 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
    } catch (err) {
      console.error(err);
      // Fallback local update
      const now = new Date();
      const newEntry = {
        id: Date.now(),
        author: author.trim(),
        emoji: selectedEmoji,
        message: message.trim(),
        date: `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`
      };
      setGuestbook(prev => [newEntry, ...prev]);
      setAuthor('');
      setMessage('');
      setSuccessMsg('메시지가 등록되었습니다!');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
    setLoading(false);
  };

  return (
    <section id="guestbook" style={{ padding: '100px 0', background: '#F2F4F6' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 50px' }}>
          <div className="toss-badge-gray toss-badge" style={{ marginBottom: '16px' }}>
            응원 & 소통 &middot; Guestbook
          </div>
          <h2 className="title-section">
            방문자 방명록 & 응원 한마디
          </h2>
          <p className="subtitle-section">
            도구를 사용해보신 소감이나 협업 제안, 따뜻한 응원의 메시지를 남겨주세요.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(300px, 380px) 1fr',
          gap: '32px',
          alignItems: 'start'
        }} className="guestbook-container">

          {/* Form Card */}
          <div className="toss-card" style={{ padding: '32px', background: '#ffffff' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#191F28', marginBottom: '20px' }}>
              한마디 남기기
            </h3>

            {successMsg && (
              <div style={{
                background: '#E8F3FF',
                color: '#3182F6',
                padding: '12px 16px',
                borderRadius: '12px',
                fontSize: '0.88rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px'
              }}>
                <CheckCircle2 size={16} />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Emoji Selector */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#4E5968', marginBottom: '8px' }}>
                  이모지 선택
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {emojis.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setSelectedEmoji(em)}
                      style={{
                        fontSize: '1.25rem',
                        padding: '6px 10px',
                        borderRadius: '10px',
                        background: selectedEmoji === em ? '#E8F3FF' : '#F9FAFB',
                        border: selectedEmoji === em ? '2px solid #3182F6' : '1px solid #E5E8EB',
                        cursor: 'pointer'
                      }}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              {/* Author */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#4E5968', marginBottom: '6px' }}>
                  작성자 (이름 / 소속)
                </label>
                <input
                  type="text"
                  placeholder="예: 원주복지관 김철수, 사회복지 실습생"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid #E5E8EB',
                    fontSize: '0.92rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Message */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#4E5968', marginBottom: '6px' }}>
                  응원 메시지
                </label>
                <textarea
                  placeholder="따뜻한 응원이나 의견을 자유롭게 남겨주세요!"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid #E5E8EB',
                    fontSize: '0.92rem',
                    outline: 'none',
                    resize: 'none',
                    lineHeight: '1.5'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-toss btn-toss-primary"
                style={{ width: '100%' }}
              >
                {loading ? '등록 중...' : (
                  <>
                    <Send size={16} />
                    <span>메시지 남기기</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Messages List Feed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '560px', overflowY: 'auto', paddingRight: '4px' }}>
            {guestbook.map((entry) => (
              <div
                key={entry.id}
                className="toss-card"
                style={{
                  padding: '24px',
                  background: '#ffffff',
                  border: '1px solid #E5E8EB',
                  display: 'flex',
                  gap: '16px'
                }}
              >
                <div style={{
                  fontSize: '1.8rem',
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: '#F9FAFB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {entry.emoji || '💬'}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontWeight: '800', fontSize: '0.95rem', color: '#191F28' }}>
                      {entry.author}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#8B95A1' }}>
                      {entry.date}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.92rem', color: '#4E5968', lineHeight: '1.6' }}>
                    {entry.message}
                  </p>
                </div>
              </div>
            ))}

            {guestbook.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#8B95A1', background: '#ffffff', borderRadius: '16px' }}>
                아직 등록된 응원글이 없습니다. 첫 번째 응원 한마디를 남겨보세요!
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 860px) {
          .guestbook-container {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
