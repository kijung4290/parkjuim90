import { FOOTER_LINKS } from '@/lib/navigation';

export default function Footer({ profile }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="brand">
              <span className="brand-mark" aria-hidden="true">P/J</span>
              <span className="brand-copy">
                <span className="brand-name">박주임의 현장 도구</span>
                <span className="brand-role">{profile?.domain || 'parkjuim90.cloud'}</span>
              </span>
            </div>
            <p>사회복지 현장의 목소리를 듣고, 사람에게 돌아가는 시간을 만드는 실용적인 소프트웨어를 기록합니다.</p>
          </div>

          <nav className="footer-links" aria-label="하단 메뉴">
            {FOOTER_LINKS.map((link) => (
              <a href={`#${link.id}`} key={link.id}>{link.label}</a>
            ))}
          </nav>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} JU-IM PARK. ALL RIGHTS RESERVED.</span>
          <span>DESIGNED & BUILT IN WONJU</span>
        </div>
      </div>
    </footer>
  );
}
