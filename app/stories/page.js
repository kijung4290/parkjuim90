import { getPortfolioData } from '@/lib/data';
import { DEFAULT_PROFILE } from '@/lib/defaults';
import { getPublishedStories } from '@/lib/storyRoutes';
import { SITE_NAME } from '@/lib/seo';
import Navbar from '@/components/Navbar';
import StorySection from '@/components/StorySection';
import Footer from '@/components/Footer';

export const revalidate = 600;

export const metadata = {
  title: '일잘알 기록소',
  description: '사회복지 현장의 AI 활용, 업무자동화, 바이브코딩과 스마트워크 실천 기록입니다.',
  alternates: { canonical: '/stories' },
  openGraph: {
    title: `일잘알 기록소 | ${SITE_NAME}`,
    description: '현장에서 직접 실험한 AI·업무혁신 방법을 기록합니다.',
    url: '/stories',
    type: 'website',
  },
};

export default async function StoriesPage() {
  const data = (await getPortfolioData()) || {};
  const profile = { ...DEFAULT_PROFILE, ...(data.profile || {}) };
  const stories = getPublishedStories(data.stories);

  return (
    <div className="public-site notes-page">
      <a className="skip-link" href="#notes">글 목록으로 바로가기</a>
      <Navbar />
      <main>
        {stories.length > 0 ? (
          <StorySection stories={stories} blogUrl={profile.blog} showAllLink={false} archive />
        ) : (
          <section className="section section--white notes-empty" id="notes">
            <div className="container"><h1>아직 공개된 기록이 없습니다.</h1></div>
          </section>
        )}
      </main>
      <Footer profile={profile} />
    </div>
  );
}
