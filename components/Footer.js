import { FOOTER_LINKS } from '@/lib/navigation';
import { BrandLockup } from '@/components/BrandLogo';

export default function Footer({ profile }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="brand">
              <BrandLockup />
            </div>
            <p className="footer-manifesto">
              <strong className="footer-manifesto-lead">일을 더 잘 아는, 더 스마트한 방법.</strong>
              <span className="footer-manifesto-body">교육, 컨설팅, 도구 제작으로 사람의 일에 더 나은 가능성을 만듭니다.</span>
            </p>
          </div>

          <nav className="footer-links" aria-label="하단 메뉴">
            {FOOTER_LINKS.map((link) => (
              <a href={`#${link.id}`} key={link.id}><strong>{link.label}</strong><span>{link.english}</span></a>
            ))}
          </nav>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} SMARTWORKLAB. ALL RIGHTS RESERVED.</span>
          <span className="footer-build-note">WORK SMARTER · MAKE WORK HUMAN</span>
        </div>
      </div>
    </footer>
  );
}
