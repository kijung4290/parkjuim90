'use client';

import { useState } from 'react';
import { Globe, Copy, Check, ExternalLink, ShieldCheck } from 'lucide-react';

export default function DomainGuideSection({ domain = "parkjuim90.cloud" }) {
  const [copiedKey, setCopiedKey] = useState(null);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <section style={{ padding: '80px 0', background: '#ffffff', borderTop: '1px solid #F2F4F6', borderBottom: '1px solid #F2F4F6' }}>
      <div className="container">
        <div className="toss-card" style={{
          padding: '40px',
          background: 'linear-gradient(135deg, #F9FAFB 0%, #F2F4F6 100%)',
          border: '1px solid #E5E8EB',
          borderRadius: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: '#E8F3FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Globe size={20} color="#3182F6" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#191F28' }}>
                가비아 도메인 연결 안내 &middot; <span style={{ color: '#3182F6' }}>{domain}</span>
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#6B7684' }}>
                가비아(Gabia) DNS 설정에서 아래 레코드를 등록하면 포트폴리오가 내 도메인으로 즉시 연결됩니다.
              </p>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            marginTop: '24px'
          }}>
            {/* Record 1: CNAME */}
            <div style={{ background: '#ffffff', padding: '18px 20px', borderRadius: '14px', border: '1px solid #E5E8EB' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#3182F6', background: '#E8F3FF', padding: '2px 8px', borderRadius: '4px' }}>
                  CNAME 레코드 (서브도메인)
                </span>
                <button
                  onClick={() => copyToClipboard('cname.vercel-dns.com', 'cname')}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#4E5968', fontWeight: '600' }}
                >
                  {copiedKey === 'cname' ? <Check size={14} color="#3182F6" /> : <Copy size={14} />}
                  <span>{copiedKey === 'cname' ? '복사됨' : '값 복사'}</span>
                </button>
              </div>
              <div style={{ fontSize: '0.9rem', color: '#191F28', fontWeight: '600' }}>
                호스트: <code>www</code> &rarr; 값: <code>cname.vercel-dns.com</code>
              </div>
            </div>

            {/* Record 2: A Record */}
            <div style={{ background: '#ffffff', padding: '18px 20px', borderRadius: '14px', border: '1px solid #E5E8EB' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#191F28', background: '#F2F4F6', padding: '2px 8px', borderRadius: '4px' }}>
                  A 레코드 (루트 도메인)
                </span>
                <button
                  onClick={() => copyToClipboard('76.76.21.21', 'a-record')}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#4E5968', fontWeight: '600' }}
                >
                  {copiedKey === 'a-record' ? <Check size={14} color="#3182F6" /> : <Copy size={14} />}
                  <span>{copiedKey === 'a-record' ? '복사됨' : 'IP 복사'}</span>
                </button>
              </div>
              <div style={{ fontSize: '0.9rem', color: '#191F28', fontWeight: '600' }}>
                호스트: <code>@</code> &rarr; 값(IP): <code>76.76.21.21</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
