/** 관리자 화면이 다루는 포트폴리오 데이터를 정리하는 순수 함수 모음입니다. */

import { DEFAULT_HERO } from '@/lib/defaults';
import { getCategoryLabel } from '@/lib/projectMeta';
import { createId, PROJECT_LINK_FIELDS } from '../constants';

/** 배열을 '한 줄에 하나씩' 입력칸에 넣을 수 있는 글로 바꿉니다. */
export const toLines = (value) => (Array.isArray(value) ? value.join('\n') : '');

/** '한 줄에 하나씩' 입력칸의 글을 배열로 되돌립니다(빈 줄은 버립니다). */
export const fromLines = (text) =>
    String(text || '')
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);

/** 저장된 데이터에 빠진 항목이 있어도 편집 화면이 깨지지 않도록 빈 값을 채웁니다. */
export const normalizePortfolio = (json) => ({
    ...json,
    hero: {
        ...DEFAULT_HERO,
        ...(json?.hero || {}),
        slides: Array.isArray(json?.hero?.slides) ? json.hero.slides : DEFAULT_HERO.slides,
    },
    profile: { stats: [], ...(json?.profile || {}) },
    philosophy: json?.philosophy || [],
    projects: json?.projects || [],
    experiences: json?.experiences || [],
    stories: json?.stories || [],
    guestbook: json?.guestbook || [],
});

/** 왼쪽 메뉴 옆에 보여줄 항목 개수입니다(개수가 없는 항목은 null). */
export const getSectionCount = (data, id) => {
    if (id === 'hero') return data?.hero?.slides?.length ?? 0;
    if (Array.isArray(data?.[id])) return data[id].length;
    return null;
};

/**
 * 프로젝트 카드의 링크 하나를 읽습니다.
 * 예전 데이터에는 links 배열 없이 link 한 줄만 저장돼 있어 그 경우도 함께 처리합니다.
 */
export const getProjectLinkValue = (project, linkType) => {
    const savedLink = Array.isArray(project?.links)
        ? project.links.find((link) => link?.id === linkType)?.url
        : '';

    if (savedLink) return savedLink;
    if (linkType === 'webapp' && !project?.links?.length && project?.link !== '#') return project?.link || '';
    return '';
};

/** 프로젝트 링크 한 칸을 고쳐 쓴 새 프로젝트를 돌려줍니다. */
export const withProjectLink = (project, linkField, url) => {
    const links = Array.isArray(project.links) ? [...project.links] : [];

    // 예전 형식(link 한 줄)만 있던 프로젝트는 먼저 웹앱 링크로 옮겨 담습니다.
    if (links.length === 0 && project.link && project.link !== '#' && linkField.id !== 'webapp') {
        links.push({ id: 'webapp', label: '웹앱 열기', url: project.link });
    }

    const linkIndex = links.findIndex((link) => link?.id === linkField.id);
    const trimmed = String(url || '').trim();

    if (trimmed) {
        const nextLink = { id: linkField.id, label: linkField.buttonLabel, url: trimmed };
        if (linkIndex >= 0) links[linkIndex] = nextLink;
        else links.push(nextLink);
    } else if (linkIndex >= 0) {
        links.splice(linkIndex, 1);
    }

    const primaryLink = PROJECT_LINK_FIELDS
        .map((field) => links.find((link) => link?.id === field.id)?.url)
        .find(Boolean) || '#';

    return { ...project, links, link: primaryLink };
};

/** 카테고리를 바꾸면 카드에 표시되는 한글 라벨도 함께 맞춥니다. */
export const withProjectCategory = (project, categoryId) => ({
    ...project,
    category: categoryId,
    categoryLabel: getCategoryLabel(categoryId),
});

/**
 * 항목을 복제합니다. 번호(id)는 새로 만들고 제목 뒤에 '(사본)'을 붙여
 * 목록에서 원본과 헷갈리지 않게 합니다.
 */
export const duplicateEntry = (item, { idPrefix, titleKey = 'title' }) => {
    const copy = JSON.parse(JSON.stringify(item ?? {}));
    copy.id = createId(idPrefix);
    const original = copy[titleKey];
    if (typeof original === 'string') copy[titleKey] = original ? `${original} (사본)` : '';
    return copy;
};

/** 배열에서 한 칸 위/아래로 옮긴 새 배열을 돌려줍니다. */
export const moveInList = (list, index, delta) => {
    const next = [...list];
    const target = index + delta;
    if (target < 0 || target >= next.length) return next;
    [next[index], next[target]] = [next[target], next[index]];
    return next;
};

/** 배열의 한 항목을 맨 앞으로 끌어올린 새 배열을 돌려줍니다. */
export const moveToTop = (list, index) => {
    if (index <= 0) return [...list];
    const next = [...list];
    const [item] = next.splice(index, 1);
    next.unshift(item);
    return next;
};
