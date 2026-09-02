import "./globals.css";

const SITE_URL = "https://parkjuim90.cloud";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "박주임 (parkjuim90.cloud) | 스마트워커 & 사회복지 개발자 포트폴리오",
    template: "%s | 박주임 포트폴리오",
  },
  description:
    "기술로 복지의 온도를 높이고 행정의 부담을 덜어내는 사회복지사 & 스마트워크 소프트웨어 크리에이터 박주임의 포트폴리오입니다.",
  keywords: ["사회복지사", "스마트워크", "포트폴리오", "가계도", "사례관리", "온둘레", "치료차팅", "parkjuim90.cloud"],
  authors: [{ name: "박주임 (Ju-im Park)", url: SITE_URL }],
  alternates: { canonical: "/" },
  openGraph: {
    title: "박주임 | 스마트워커 & 사회복지 개발자 포트폴리오",
    description: "기술로 복지의 온도를 높이고 행정의 부담을 덜어내는 실무형 복지 소프트웨어 아카이브",
    url: SITE_URL,
    siteName: "박주임 포트폴리오",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "박주임 | 스마트워커 & 사회복지 개발자 포트폴리오",
    description: "기술로 복지의 온도를 높이고 행정의 부담을 덜어내는 실무형 복지 소프트웨어 아카이브",
  },
  robots: { index: true, follow: true },
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
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        {FONT_STYLESHEETS.map((href) => (
          <link rel="stylesheet" href={href} key={href} />
        ))}
      </head>
      <body>{children}</body>
    </html>
  );
}
