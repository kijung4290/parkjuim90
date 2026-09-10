import { getPortfolioData } from '@/lib/data';
import { DEFAULT_HERO, DEFAULT_PROFILE } from '@/lib/defaults';
import { TOOL_CATALOG } from '@/data/tools';
import { getRandomNaverStories } from '@/lib/naverBlog';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import BrandOverviewSection from '@/components/BrandOverviewSection';
import ServicesSection from '@/components/ServicesSection';
import ArchiveSection from '@/components/ArchiveSection';
import ExperienceSection from '@/components/ExperienceSection';
import StorySection from '@/components/StorySection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

/**
 * 홈 화면은 미리 만들어 두고 10분마다 다시 만듭니다(ISR).
 * 요청마다 새로 그리면(force-dynamic) CDN 캐시를 지나치므로 첫 응답이 느려지고,
 * 검색 로봇이 한 번에 훑을 수 있는 양도 줄어듭니다.
 * 관리자가 [저장하기]를 누르면 app/api/portfolio/route.js의 revalidatePath('/')가
 * 이 캐시를 즉시 비우므로, 수정 내용은 예전처럼 바로 반영됩니다.
 */
export const revalidate = 600;

/** canonical은 레이아웃이 아니라 페이지마다 지정해야 합니다. */
export const metadata = {
  alternates: { canonical: '/' },
};

export default async function Home() {
  const data = (await getPortfolioData()) || {};
  const blogStories = await getRandomNaverStories(3);

  // 저장된 값이 비어 있는 항목만 기본값으로 채웁니다.
  const profile = { ...DEFAULT_PROFILE, ...(data.profile || {}) };
  if (!profile.stats?.length) profile.stats = DEFAULT_PROFILE.stats;
  const hero = {
    ...DEFAULT_HERO,
    ...(data.hero || {}),
    slides: Array.isArray(data.hero?.slides) ? data.hero.slides : DEFAULT_HERO.slides,
  };
  const projects = data.projects || TOOL_CATALOG;

  return (
    <div className="public-site">
      <a className="skip-link" href="#main-content">본문으로 바로가기</a>
      <Navbar />
      <main id="main-content">
        <HeroSection hero={hero} profile={profile} projectCount={projects.length} />
        <BrandOverviewSection />
        <ExperienceSection experiences={data.experiences || []} />
        <ServicesSection />
        <ArchiveSection projects={projects} />
        <StorySection
          stories={blogStories.length > 0 ? blogStories : (data.stories || [])}
          blogUrl={profile.blog}
        />
        <ContactSection profile={profile} />
      </main>
      <Footer profile={profile} />
    </div>
  );
}
