const BLOG_ID = 'parkjuim90';
const RSS_URL = `https://rss.blog.naver.com/${BLOG_ID}.xml`;

const decodeXml = (value = '') => value
  .replace(/^<!\[CDATA\[|\]\]>$/g, '')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&#39;|&apos;/g, "'")
  .replace(/&amp;/g, '&')
  .trim();

const readTag = (source, tag) => {
  const match = source.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return decodeXml(match?.[1] || '');
};

const textFromHtml = (html = '') => html
  .replace(/<br\s*\/?\s*>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\.{6,}\s*$/, '')
  .replace(/\s+/g, ' ')
  .trim();

const imageFromHtml = (html = '') => {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return decodeXml(match?.[1] || '');
};

const cleanPostLink = (link, guid) => {
  const logNo = `${link} ${guid}`.match(/(?:logNo=|parkjuim90\/)(\d+)/)?.[1];
  return logNo ? `https://blog.naver.com/${BLOG_ID}/${logNo}` : link;
};

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const part = (type) => parts.find((item) => item.type === type)?.value || '';
  return `${part('year')}.${part('month')}.${part('day')}`;
};

const parseItem = (item, index) => {
  const title = readTag(item, 'title');
  const descriptionHtml = readTag(item, 'description');
  const description = textFromHtml(descriptionHtml);
  const image = imageFromHtml(descriptionHtml);
  const link = cleanPostLink(readTag(item, 'link'), readTag(item, 'guid'));
  const logNo = link.match(/(\d+)$/)?.[1] || index;

  return {
    id: `naver-${logNo}`,
    tag: readTag(item, 'category') || '블로그',
    date: formatDate(readTag(item, 'pubDate')),
    title,
    readTime: `${Math.max(3, Math.ceil(description.length / 350))}분`,
    summary: description.length > 190 ? `${description.slice(0, 190).trimEnd()}…` : description,
    content: description,
    images: image ? [{ url: image, alt: `${title} 네이버 블로그 대표 이미지` }] : [],
    likes: 0,
    link,
    external: true,
  };
};

const shuffle = (items) => {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
};

/**
 * 네이버 RSS의 최근 글 목록에서 요청한 수만큼 무작위로 고릅니다.
 * RSS가 잠시 열리지 않으면 빈 배열을 반환해 저장된 기록을 보여주게 합니다.
 */
export async function getRandomNaverStories(limit = 3) {
  try {
    const response = await fetch(RSS_URL, { next: { revalidate: 3600 } });
    if (!response.ok) throw new Error(`RSS request failed: ${response.status}`);

    const xml = await response.text();
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)]
      .map((match, index) => parseItem(match[1], index))
      .filter((item) => item.title && item.link);

    return shuffle(items).slice(0, Math.max(1, limit));
  } catch (error) {
    console.warn('네이버 블로그 RSS 조회 실패, 저장된 기록으로 대체합니다:', error.message);
    return [];
  }
}

