/** 기록(현장 기록) 데이터를 화면에서 다루기 쉬운 형태로 정리하는 헬퍼입니다. */

/**
 * 저장된 사진 목록을 { url, alt } 배열로 맞춥니다.
 * 예전 데이터가 문자열 배열이거나 image 한 장만 저장돼 있어도 그대로 읽습니다.
 */
export function getStoryImages(story) {
    const raw = Array.isArray(story?.images)
        ? story.images
        : story?.image
            ? [story.image]
            : [];

    return raw
        .map((item) => (typeof item === 'string' ? { url: item, alt: '' } : item))
        .filter((item) => item && typeof item.url === 'string' && item.url.trim())
        .map((item) => ({ url: item.url.trim(), alt: (item.alt || '').trim() }));
}

/** 본문을 빈 줄 기준으로 문단 배열로 나눕니다. */
export function getStoryParagraphs(content) {
    if (typeof content !== 'string') return [];
    return content
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean);
}

/** 목록에 보여줄 한 덩어리 글입니다(공백·줄바꿈을 한 칸으로 정리). */
const flatten = (content) => (typeof content === 'string' ? content.replace(/\s+/g, ' ').trim() : '');

/**
 * 홈 화면 카드에 보여줄 미리보기 글입니다.
 * 관리자가 요약을 적었으면 그 글을, 없으면 본문 앞부분을 잘라서 씁니다.
 */
export function getStoryPreview(story, limit = 120) {
    const summary = flatten(story?.summary);
    if (summary) return summary;

    const body = flatten(story?.content);
    if (body.length <= limit) return body;
    return `${body.slice(0, limit).trimEnd()}…`;
}

/** 카드에서 다 보여주지 못한 내용(잘린 글·요약·추가 사진)이 있는지 확인합니다. */
export function hasMoreToRead(story, limit = 120) {
    const body = flatten(story?.content);
    if (!body) return getStoryImages(story).length > 0;
    if (flatten(story?.summary)) return true;
    return body.length > limit || getStoryImages(story).length > 1;
}
