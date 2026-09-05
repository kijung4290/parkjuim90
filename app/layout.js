import "./globals.css";
import {
  SEO_DESCRIPTION,
  SEO_KEYWORDS,
  SEO_SHORT_DESCRIPTION,
  SEO_TITLE,
  SERVICES,
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
  applicationName: `${SITE_NAME} 포트폴리오`,
  category: "교육",
  creator: SITE_NAME,
  publisher: SITE_NAME,
  authors: [{ name: "박주임 (Ju-im Park)", url: SITE_URL }],
  alternates: { canonical: "/" },
  openGraph: {
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_TITLE,
    description: SEO_SHORT_DESCRIPTION,
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
      name: `${SITE_NAME} 포트폴리오`,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#person` },
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
      knowsAbout: SEO_KEYWORDS,
      worksFor: { "@id": `${SITE_URL}/#service-provider` },
    },
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#service-provider`,
      name: `${SITE_NAME} 교육·컨설팅`,
      url: `${SITE_URL}/#services`,
      description: SEO_DESCRIPTION,
      founder: { "@id": `${SITE_URL}/#person` },
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
        name: "교육·컨설팅 안내",
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
      url: `${SITE_URL}/#services`,
    })),
  ],
};

export const viewport = {
  themeColor: "#eef2ef",
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
