import { getPortfolioData } from '@/lib/data';
import { DEFAULT_HERO, DEFAULT_PROFILE } from '@/lib/defaults';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import PhilosophySection from '@/components/PhilosophySection';
import ArchiveSection from '@/components/ArchiveSection';
import ExperienceSection from '@/components/ExperienceSection';
import StorySection from '@/components/StorySection';
import GuestbookSection from '@/components/GuestbookSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const data = (await getPortfolioData()) || {};

  // 저장된 값이 비어 있는 항목만 기본값으로 채웁니다.
  const profile = { ...DEFAULT_PROFILE, ...(data.profile || {}) };
  if (!profile.stats?.length) profile.stats = DEFAULT_PROFILE.stats;
  const hero = {
    ...DEFAULT_HERO,
    ...(data.hero || {}),
    slides: Array.isArray(data.hero?.slides) ? data.hero.slides : DEFAULT_HERO.slides,
  };

  return (
    <>
      <a className="skip-link" href="#main-content">본문으로 바로가기</a>
      <Navbar />
      <main id="main-content">
        <HeroSection profile={profile} hero={hero} />
        <PhilosophySection philosophy={data.philosophy || []} />
        <ArchiveSection projects={data.projects || []} />
        <ExperienceSection experiences={data.experiences || []} />
        <StorySection stories={data.stories || []} />
        <GuestbookSection initialGuestbook={data.guestbook || []} />
        <ContactSection profile={profile} />
      </main>
      <Footer profile={profile} />
    </>
  );
}
