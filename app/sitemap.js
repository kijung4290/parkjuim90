import { CONTENT_UPDATED_AT, SITE_URL } from '@/lib/seo';

export default function sitemap() {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(CONTENT_UPDATED_AT),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
