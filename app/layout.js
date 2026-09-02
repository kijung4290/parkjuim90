import "./globals.css";

export const metadata = {
  title: "박주임 (parkjuim90.cloud) | 스마트워커 & 사회복지 개발자 포트폴리오",
  description: "기술로 복지의 온도를 높이고 행정의 부담을 덜어내는 사회복지사 & 스마트워크 소프트웨어 크리에이터 박주임의 포트폴리오입니다.",
  keywords: ["사회복지사", "스마트워크", "포트폴리오", "가계도", "사례관리", "온둘레", "치료차팅", "parkjuim90.cloud"],
  openGraph: {
    title: "박주임 | 스마트워커 & 사회복지 개발자 포트폴리오",
    description: "기술로 복지의 온도를 높이고 행정의 부담을 덜어내는 실무형 복지 소프트웨어 아카이브",
    url: "https://parkjuim90.cloud",
    siteName: "박주임 포트폴리오",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  );
}
