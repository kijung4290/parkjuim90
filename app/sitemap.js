import { CONTENT_UPDATED_AT, SITE_URL } from '@/lib/seo';
import { getPortfolioData } from '@/lib/data';
import { getPublishedStories, getStoryPath, normalizeStoryDate } from '@/lib/storyRoutes';

export const revalidate = 600;

export default async function sitemap() {
  const data = (await getPortfolioData()) || {};
  const storyEntries = getPublishedStories(data.stories).map((story) => ({
    url: `${SITE_URL}${getStoryPath(story)}`,
    lastModified: new Date(normalizeStoryDate(story.updatedAt || story.date) || CONTENT_UPDATED_AT),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(CONTENT_UPDATED_AT),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/stories`,
      lastModified: storyEntries[0]?.lastModified || new Date(CONTENT_UPDATED_AT),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...storyEntries,
  ];
}
