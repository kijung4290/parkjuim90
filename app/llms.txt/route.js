import {
  BLOG_URL,
  CONTACT_EMAIL,
  SEO_DESCRIPTION,
  SERVICES,
  SITE_NAME,
  SITE_URL,
} from '@/lib/seo';
import { getPortfolioData } from '@/lib/data';
import { getPublishedStories, getStoryDescription, getStoryPath } from '@/lib/storyRoutes';

/**
 * AI 답변엔진(ChatGPT, Perplexity 등)이 사이트를 요약할 때 먼저 찾는 평문 파일입니다.
 * 내용은 lib/seo.js에서 만들어지므로 서비스 목록을 고치면 여기도 함께 바뀝니다.
 *
 * 확인: https://parkjuim90.cloud/llms.txt
 */
export const revalidate = 600;

const listSection = (name) => SERVICES
  .filter((service) => service.section === name)
  .map((service) => `- [${service.name}](${SITE_URL}/#${service.id}): ${service.description}`)
  .join('\n');

export async function GET() {
  const data = (await getPortfolioData()) || {};
  const storyLines = getPublishedStories(data.stories)
    .map((story) => `- [${story.title}](${SITE_URL}${getStoryPath(story)}): ${getStoryDescription(story)}`)
    .join('\n');

  const text = [
    `# ${SITE_NAME}`,
    '',
    `> ${SEO_DESCRIPTION}`,
    '',
    '운영자: 박주임 (사회복지사 · 스마트워크 교육 강사)',
    '활동 지역: 강원특별자치도 원주시 (전국 강의·온라인 협업 가능)',
    `문의: ${CONTACT_EMAIL}`,
    '',
    '## 일잘알 클래스 (교육)',
    '',
    listSection('academy'),
    '',
    '## 일잘알 컨설팅',
    '',
    listSection('consulting'),
    '',
    '## 그 밖의 자료',
    '',
    `- [일잘알랩 홈페이지](${SITE_URL}): 교육·컨설팅 안내, 직접 만든 업무도구, 현장 기록`,
    `- [네이버 블로그](${BLOG_URL}): 사회복지 현장의 AI·자동화 실무 기록`,
    '',
    '## 최신 현장 기록',
    '',
    storyLines || '- 아직 공개된 기록이 없습니다.',
    '',
  ].join('\n');

  return new Response(text, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
