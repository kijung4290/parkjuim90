const clean = (value) => String(value ?? '').trim();

export function slugifyStory(value) {
    return clean(value)
        .normalize('NFKC')
        .toLowerCase()
        .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 90);
}

export function getStorySlug(story) {
    const explicit = slugifyStory(story?.slug);
    if (explicit) return explicit;

    const title = slugifyStory(story?.title) || 'note';
    const id = slugifyStory(story?.id);
    return id ? `${title}-${id}` : title;
}

export function getStoryPath(story) {
    return `/stories/${encodeURIComponent(getStorySlug(story))}`;
}

export function isStoryPublished(story) {
    return story?.published !== false && story?.status !== 'draft' && Boolean(clean(story?.title));
}

export function getPublishedStories(stories = []) {
    return (Array.isArray(stories) ? stories : []).filter(isStoryPublished);
}

export function findStoryBySlug(stories, slug) {
    let target = clean(slug);
    try { target = decodeURIComponent(target); } catch { return undefined; }
    return getPublishedStories(stories).find((story) => getStorySlug(story) === target);
}

export function normalizeStoryDate(value) {
    const match = clean(value).match(/^(\d{4})[.\/-](\d{1,2})(?:[.\/-](\d{1,2}))?/);
    if (!match) return '';
    const [, year, month, day = '01'] = match;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

export function getStoryDescription(story, limit = 160) {
    const text = clean(story?.seoDescription || story?.summary || story?.content).replace(/\s+/g, ' ');
    if (text.length <= limit) return text;
    return `${text.slice(0, limit - 1).trimEnd()}…`;
}
