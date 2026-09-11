import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, CalendarDays, Clock } from 'lucide-react';
import { getPortfolioData } from '@/lib/data';
import { DEFAULT_PROFILE } from '@/lib/defaults';
import { getStoryImages, getStoryParagraphs } from '@/lib/stories';
import { getStoryKeywords } from '@/lib/keywords';
import {
  findStoryBySlug,
  getPublishedStories,
  getStoryDescription,
  getStoryPath,
  getStorySlug,
  normalizeStoryDate,
} from '@/lib/storyRoutes';
import { SITE_LOGO, SITE_NAME, SITE_URL } from '@/lib/seo';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const revalidate = 600;

const absoluteUrl = (value) => {
  if (!value) return '';
  try { return new URL(value, SITE_URL).toString(); } catch { return ''; }
};

const getStoryData = async (slug) => {
  const data = (await getPortfolioData()) || {};
  return { data, story: findStoryBySlug(data.stories, slug) };
};

export async function generateStaticParams() {
  const data = (await getPortfolioData()) || {};
  return getPublishedStories(data.stories).map((story) => ({ slug: getStorySlug(story) }));
}
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { story } = await getStoryData(slug);
  if (!story) return { title: '기록을 찾을 수 없습니다', robots: { index: false } };

  const path = getStoryPath(story);
  const description = getStoryDescription(story);
  const cover = getStoryImages(story)[0];
  const publishedTime = normalizeStoryDate(story.date);
  const modifiedTime = normalizeStoryDate(story.updatedAt) || publishedTime;

  return {
    title: story.seoTitle || story.title,
    description,
    keywords: getStoryKeywords(story),
    authors: [{ name: '박주임 (Ju-im Park)', url: SITE_URL }],
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      url: path,
      title: story.seoTitle || story.title,
      description,
      publishedTime: publishedTime || undefined,
      modifiedTime: modifiedTime || undefined,
      authors: [SITE_URL],
      tags: getStoryKeywords(story),
      images: cover ? [{ url: absoluteUrl(cover.url), alt: cover.alt || story.title }] : undefined,
    },
    twitter: {
      card: cover ? 'summary_large_image' : 'summary',
      title: story.seoTitle || story.title,
      description,
      images: cover ? [absoluteUrl(cover.url)] : undefined,
    },
  };
}

export default async function StoryPage({ params }) {
  const { slug } = await params;
  const { data, story } = await getStoryData(slug);
  if (!story) notFound();

  const profile = { ...DEFAULT_PROFILE, ...(data.profile || {}) };
  const images = getStoryImages(story);
  const [cover, ...gallery] = images;
  const paragraphs = getStoryParagraphs(story.content);
  const keywords = getStoryKeywords(story);
  const description = getStoryDescription(story);
  const published = normalizeStoryDate(story.date);
  const modified = normalizeStoryDate(story.updatedAt) || published;
  const canonical = `${SITE_URL}${getStoryPath(story)}`;
  const related = getPublishedStories(data.stories).filter((item) => getStorySlug(item) !== getStorySlug(story)).slice(0, 3);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${canonical}#article`,
    mainEntityOfPage: canonical,
    headline: story.title,
    description,
    image: images.map((image) => absoluteUrl(image.url)).filter(Boolean),
    datePublished: published || undefined,
    dateModified: modified || published || undefined,
    inLanguage: 'ko-KR',
    keywords,
    author: { '@type': 'Person', '@id': `${SITE_URL}/#person`, name: '박주임', url: SITE_URL },
    publisher: { '@type': 'Person', '@id': `${SITE_URL}/#person`, name: SITE_NAME, image: SITE_LOGO },
    isPartOf: { '@id': `${SITE_URL}/#website` },
  };

  return (
    <div className="public-site story-page">
      <a className="skip-link" href="#story-content">본문으로 바로가기</a>
      <Navbar />
      <main id="story-content">
        <article className="story-article">
          <div className="container story-article__container">
            <nav className="story-breadcrumb" aria-label="현재 위치">
              <Link href="/stories"><ArrowLeft size={15} aria-hidden="true" /> 일잘알 기록소</Link>
            </nav>

            <header className="story-article__header">
              <span className="story-article__field">FIELD NOTE / {story.tag || 'SMARTWORKLAB'}</span>
              <h1>{story.title}</h1>
              {description && <p className="story-article__dek">{description}</p>}
              <div className="story-article__meta">
                {story.date && <span><CalendarDays size={16} aria-hidden="true" /> {story.date}</span>}
                {story.readTime && <span><Clock size={16} aria-hidden="true" /> {story.readTime} 읽기</span>}
                <span>글 박주임</span>
              </div>
              {keywords.length > 0 && <ul className="keyword-row" aria-label="핵심 키워드">{keywords.map((keyword) => <li className="keyword-chip" key={keyword}>{keyword}</li>)}</ul>}
            </header>

            {cover && <figure className="story-article__cover"><img src={cover.url} alt={cover.alt || story.title} />{cover.alt && <figcaption>{cover.alt}</figcaption>}</figure>}

            <div className="story-article__layout">
              <aside className="story-article__rail" aria-label="글 정보">
                <span>SMARTWORKLAB</span><strong>현장에서 시작한<br />작은 변화의 기록</strong>
              </aside>
              <div className="story-article__body">
                {paragraphs.length > 0 ? paragraphs.map((paragraph, index) => <p className={index === 0 ? 'story-article__lead' : undefined} key={index}>{paragraph}</p>) : <p>{story.summary}</p>}
              </div>
            </div>

            {gallery.length > 0 && <ul className="story-article__gallery">{gallery.map((image, index) => <li key={`${image.url}-${index}`}><figure><img src={image.url} alt={image.alt || `${story.title} 현장 사진 ${index + 2}`} loading="lazy" />{image.alt && <figcaption>{image.alt}</figcaption>}</figure></li>)}</ul>}

            {story.link && <div className="story-article__source"><p>이 글의 기록이 시작된 원문도 함께 확인할 수 있습니다.</p><a className="button button--secondary" href={story.link} target="_blank" rel="noreferrer">원문 보기 <ArrowUpRight size={15} aria-hidden="true" /></a></div>}
          </div>
        </article>

        {related.length > 0 && <section className="story-related"><div className="container"><h2>이어서 읽을 기록</h2><ul>{related.map((item) => <li key={item.id || item.slug}><Link href={getStoryPath(item)}><span>{item.tag || '현장 기록'}</span><strong>{item.title}</strong><ArrowUpRight size={18} aria-hidden="true" /></Link></li>)}</ul></div></section>}
      </main>
      <Footer profile={profile} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
    </div>
  );
}
