import "./globals.css";
import "./impact-theme.css";
import "./brand-refresh.css";
import {
  CONTACT_EMAIL,
  CONTENT_UPDATED_AT,
  SAME_AS,
  SEO_DESCRIPTION,
  SEO_KEYWORDS,
  SEO_SHORT_DESCRIPTION,
  SEO_TITLE,
  SERVICES,
  SITE_LOGO,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SEO_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SEO_DESCRIPTION,
  keywords: SEO_KEYWORDS,
  applicationName: SITE_NAME,
  category: "교육",
  creator: SITE_NAME,
  publisher: SITE_NAME,
  authors: [{ name: "박주임 (Ju-im Park)", url: SITE_URL }],
  icons: {
    icon: [{ url: "/icon.svg?v=smartworklab-2", type: "image/svg+xml" }],
    shortcut: "/icon.svg?v=smartworklab-2",
  },
  openGraph: {
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/images/smartworklab-logo.png",
        width: 1254,
        height: 1254,
        type: "image/png",
        alt: "일잘알랩 SMARTWORK LAB",
      },
    ],
  },
  // 로고가 정사각형이라 summary_large_image(1.91:1)로 쓰면 위아래가 잘립니다.
  // 1200x630 배너 이미지를 따로 만들면 summary_large_image로 되돌리세요.
  twitter: {
    card: "summary",
    title: SEO_TITLE,
    description: SEO_SHORT_DESCRIPTION,
    images: ["/images/smartworklab-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

/**
 * 검색 엔진에 "이 사람이 무엇을 하는지"를 기계가 읽는 형식으로 알려줍니다.
 * 서비스 목록은 lib/seo.js 한 곳에서 가져오므로 화면에 보이는 안내와 항상 같습니다.
 */
const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SEO_DESCRIPTION,
      inLanguage: "ko-KR",
      publisher: { "@id": `${SITE_URL}/#person` },
    },
    {
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/#profilepage`,
      url: SITE_URL,
      name: `${SITE_NAME} 공식 홈페이지`,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      // ProfilePage는 "누구의 프로필인지"를 mainEntity로 가리켜야 합니다.
      // about도 schema.org에서 유효하지만, 구글이 필수로 확인하는 속성은 mainEntity입니다.
      mainEntity: { "@id": `${SITE_URL}/#person` },
      dateModified: CONTENT_UPDATED_AT,
      inLanguage: "ko-KR",
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "박주임",
      alternateName: SITE_NAME,
      url: SITE_URL,
      jobTitle: "사회복지사 · 스마트워크 교육 강사",
      description: SEO_DESCRIPTION,
      image: SITE_LOGO,
      email: `mailto:${CONTACT_EMAIL}`,
      sameAs: SAME_AS,
      knowsLanguage: "ko-KR",
      knowsAbout: SEO_KEYWORDS,
      worksFor: { "@id": `${SITE_URL}/#service-provider` },
    },
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#service-provider`,
      name: `${SITE_NAME} 교육·컨설팅`,
      url: `${SITE_URL}/#academy`,
      description: SEO_DESCRIPTION,
      founder: { "@id": `${SITE_URL}/#person` },
      employee: { "@id": `${SITE_URL}/#person` },
      logo: SITE_LOGO,
      image: SITE_LOGO,
      email: `mailto:${CONTACT_EMAIL}`,
      sameAs: SAME_AS,
      areaServed: { "@type": "Country", name: "대한민국" },
      availableLanguage: "ko-KR",
      address: {
        "@type": "PostalAddress",
        addressCountry: "KR",
        addressRegion: "강원특별자치도",
        addressLocality: "원주시",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "SMARTWORKLAB Academy & Consulting",
        itemListElement: SERVICES.map((service, index) => ({
          "@type": "Offer",
          position: index + 1,
          itemOffered: { "@id": `${SITE_URL}/#service-${service.id}` },
        })),
      },
    },
    ...SERVICES.map((service) => ({
      "@type": "Service",
      "@id": `${SITE_URL}/#service-${service.id}`,
      name: service.name,
      alternateName: service.keywords,
      serviceType: service.name,
      description: service.description,
      provider: { "@id": `${SITE_URL}/#person` },
      areaServed: { "@type": "Country", name: "대한민국" },
      url: `${SITE_URL}/#${service.section}`,
    })),
  ],
};

export const viewport = {
  themeColor: "#3024a8",
  colorScheme: "light",
};

const FONT_STYLESHEETS = [
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css",
  "https://cdn.jsdelivr.net/gh/sunn-us/SUIT/fonts/variable/woff2/SUIT-Variable.css",
];

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <meta name="naver-site-verification" content="12eeaaa38514532c590aba1befabb04e3a6516af" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA).replace(/</g, "\\u003c") }}
        />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        {FONT_STYLESHEETS.map((href) => (
          <link rel="stylesheet" href={href} key={href} />
        ))}
      </head>
      <body>{children}</body>
    </html>
  );
}
