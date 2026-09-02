import { getPortfolioData } from '@/lib/data';
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
  const data = await getPortfolioData() || {};

  const profile = data.profile || {
    name: data.name || "박주임 (Ju-im Park)",
    role: data.role || "사회복지사 & 스마트워크 소프트웨어 빌더",
    introduction: data.introduction,
    domain: "parkjuim90.cloud",
    email: data.contact?.email || "parkjuim90@gmail.com",
    phone: data.contact?.phone,
    blog: data.contact?.blog,
    github: data.contact?.github,
    stats: [
      { label: "자체 개발 복지 솔루션", value: "10+", unit: "개" },
      { label: "행정 소요시간 단축", value: "70", unit: "%" },
      { label: "사회복지 실천 경력", value: "10", unit: "년차" },
      { label: "스마트워크 강의 & 멘토링", value: "20+", unit: "회" }
    ]
  };

  const philosophy = data.philosophy || [];
  const projects = data.projects || [];
  const experiences = data.experiences || [];
  const stories = data.stories || [];
  const guestbook = data.guestbook || [];

  return (
    <>
      <a className="skip-link" href="#main-content">본문으로 바로가기</a>
      <Navbar />
      <main id="main-content">
        <HeroSection profile={profile} />
        <PhilosophySection philosophy={philosophy} />
        <ArchiveSection projects={projects} />
        <ExperienceSection experiences={experiences} />
        <StorySection stories={stories} />
        <GuestbookSection initialGuestbook={guestbook} />
        <ContactSection profile={profile} />
      </main>
      <Footer profile={profile} />
    </>
  );
}
