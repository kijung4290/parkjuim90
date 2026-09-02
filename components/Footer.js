import { FOOTER_LINKS } from '@/lib/navigation';

export default function Footer({ profile }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="brand">
              <span className="brand-mark" aria-hidden="true">
                <span className="brand-monogram">P/J</span>
                <span className="brand-mark-status" />
              </span>
              <span className="brand-copy">
                <span className="brand-name">박주임의 현장 도구 작업실</span>
                <span className="brand-role">{profile?.domain || 'parkjuim90.cloud'}</span>
              </span>
            </div>
            <p className="footer-manifesto">
              <strong className="footer-manifesto-lead">현장에서 묻고, 함께 쓰는 도구로 답합니다.</strong>
              <span className="footer-manifesto-body">사회복지 현장의 목소리를 듣고, 사람에게 돌아가는 시간을 만드는 실용적인 소프트웨어를 기록합니다.</span>
            </p>
          </div>

          <nav className="footer-links" aria-label="하단 메뉴">
            {FOOTER_LINKS.map((link) => (
              <a href={`#${link.id}`} key={link.id}>{link.label}</a>
            ))}
          </nav>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} JU-IM PARK. ALL RIGHTS RESERVED.</span>
          <span className="footer-build-note">FIELD → TOOL · DESIGNED & BUILT IN WONJU</span>
        </div>
      </div>
    </footer>
  );
}
