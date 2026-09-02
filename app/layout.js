import "./globals.css";

const SITE_URL = "https://parkjuim90.cloud";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "스마트워커 박주임 | 스마트워크 교육·컨설팅·바이브코딩",
    template: "%s | 박주임 포트폴리오",
  },
  description:
    "스마트워커 박주임의 스마트워크 교육, 스마트워크 컨설팅, 직원역량강화교육, 바이브코딩 교육과 사회복지 현장용 업무 자동화 도구를 소개합니다.",
  keywords: [
    "스마트워크 교육",
    "스마트워크 컨설팅",
    "직원역량강화교육",
    "바이브코딩 교육",
    "스마트워커 박주임",
    "사회복지 스마트워크",
    "사회복지사 교육",
    "업무 자동화 교육",
    "구글 앱스 스크립트 교육",
    "사회복지 디지털 전환",
  ],
  applicationName: "스마트워커 박주임 포트폴리오",
  creator: "스마트워커 박주임",
  publisher: "스마트워커 박주임",
  authors: [{ name: "박주임 (Ju-im Park)", url: SITE_URL }],
  alternates: { canonical: "/" },
  openGraph: {
    title: "스마트워커 박주임 | 스마트워크 교육·컨설팅",
    description: "직원역량강화교육과 바이브코딩 교육, 사회복지 현장용 스마트워크 도구를 소개합니다.",
    url: SITE_URL,
    siteName: "스마트워커 박주임",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "스마트워커 박주임 | 스마트워크 교육·컨설팅",
    description: "직원역량강화교육과 바이브코딩 교육, 사회복지 현장용 스마트워크 도구를 소개합니다.",
  },
  robots: { index: true, follow: true },
};

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "스마트워커 박주임",
      description: "스마트워크 교육·컨설팅과 바이브코딩 교육, 사회복지 현장 도구 아카이브",
      inLanguage: "ko-KR",
    },
    {
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/#profilepage`,
      url: SITE_URL,
      name: "스마트워커 박주임 포트폴리오",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#person` },
      inLanguage: "ko-KR",
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "박주임",
      alternateName: "스마트워커 박주임",
      url: SITE_URL,
      jobTitle: "사회복지사·스마트워크 교육 강사",
      description: "사회복지 현장의 업무를 개선하는 스마트워크 교육과 컨설팅, 직원역량강화교육, 바이브코딩 교육을 진행합니다.",
      knowsAbout: [
        "스마트워크 교육",
        "스마트워크 컨설팅",
        "직원역량강화교육",
        "바이브코딩 교육",
        "사회복지 업무 자동화",
        "Google Apps Script",
      ],
    },
    ...[
      "스마트워크 교육",
      "스마트워크 컨설팅",
      "직원역량강화교육",
      "바이브코딩 교육",
    ].map((name, index) => ({
      "@type": "Service",
      "@id": `${SITE_URL}/#service-${index + 1}`,
      name,
      provider: { "@id": `${SITE_URL}/#person` },
      areaServed: "대한민국",
      url: `${SITE_URL}/#contact`,
    })),
  ],
};

export const viewport = {
  themeColor: "#f5f7f3",
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
