/**
 * 저장하기 전에 "빠진 곳이 없는지" 스스로 점검해주는 규칙 모음입니다.
 *
 * 개발자가 아닌 사람이 가장 자주 겪는 문제는
 * "분명히 입력했는데 사이트에 안 보인다" 인데, 원인은 대부분
 * 필수 칸이 비어 있어서 화면이 그 항목을 통째로 숨기기 때문입니다.
 *
 * 그래서 결과를 두 가지로 나눠서 알려줍니다.
 *   problem — 그대로 두면 사이트에서 숨겨지거나 비어 보입니다(꼭 고칠 것).
 *   hint    — 없어도 동작하지만 있으면 더 좋습니다(제안).
 */

import { getStoryImages } from '@/lib/stories';
import { MAX_PROFILE_STATS } from '../constants';

const isBlank = (value) => !String(value ?? '').trim();
const looksLikeEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
const looksLikeUrl = (value) => /^(https?:\/\/|\/)/.test(String(value || '').trim());

const problem = (text) => ({ level: 'problem', text });
const hint = (text) => ({ level: 'hint', text });

const ordinal = (index) => `${index + 1}번째`;
const nameOf = (title, fallback) => (isBlank(title) ? fallback : `‘${String(title).trim()}’`);

/**
 * 항목 하나만 놓고 보는 점검 규칙입니다.
 * 목록 카드 옆의 경고 배지와 항목 전체 점검 목록이 같은 규칙을 나눠 씁니다.
 */
export const ITEM_CHECKS = {
    hero: (slide) => {
        const issues = [];
        if (slide?.type === 'quote') {
            if (isBlank(slide.title) && isBlank(slide.description)) {
                issues.push(problem('글귀와 설명이 모두 비어 있어 사이트에서 숨겨집니다.'));
            }
            return issues;
        }

        const kind = slide?.type === 'video' ? '동영상' : '이미지';
        if (isBlank(slide?.url)) {
            issues.push(problem(`${kind} 주소가 없습니다. 파일을 올리거나 주소를 넣어주세요.`));
        } else if (!looksLikeUrl(slide.url)) {
            issues.push(problem('주소는 https:// 또는 /images/… 처럼 시작해야 합니다.'));
        }
        if (isBlank(slide?.title)) issues.push(hint('제목을 넣으면 화면에 설명이 함께 보입니다.'));
        if (isBlank(slide?.alt)) issues.push(hint('대체 설명을 넣으면 사진을 못 보는 방문자에게도 내용이 전달됩니다.'));
        return issues;
    },

    philosophy: (item) => {
        const issues = [];
        if (isBlank(item?.title)) issues.push(problem('제목이 비어 있습니다.'));
        if (isBlank(item?.desc)) issues.push(hint('설명을 넣으면 카드가 훨씬 잘 읽힙니다.'));
        return issues;
    },

    projects: (project) => {
        const issues = [];
        if (isBlank(project?.title)) issues.push(problem('제목이 비어 있습니다.'));
        if (isBlank(project?.summary)) issues.push(problem('한 줄 요약이 없으면 카드가 비어 보입니다.'));
        if (isBlank(project?.category)) issues.push(problem('카테고리를 골라야 방문자가 걸러 찾을 수 있습니다.'));

        const hasLink = Array.isArray(project?.links) && project.links.some((link) => link?.url);
        if (!hasLink && (!project?.link || project.link === '#')) {
            issues.push(hint('링크를 하나도 넣지 않으면 바로가기 버튼이 보이지 않습니다.'));
        }
        return issues;
    },

    experiences: (experience) => {
        const issues = [];
        if (isBlank(experience?.company)) issues.push(problem('소속이 비어 있습니다.'));
        if (isBlank(experience?.period)) issues.push(problem('기간이 비어 있습니다. 예: 2018 - 현재'));
        if (isBlank(experience?.role)) issues.push(hint('역할을 적으면 어떤 일을 했는지 바로 보입니다.'));
        return issues;
    },

    stories: (story) => {
        const issues = [];
        if (isBlank(story?.title)) issues.push(problem('제목이 비어 있습니다.'));
        if (isBlank(story?.content) && isBlank(story?.summary) && getStoryImages(story).length === 0) {
            issues.push(problem('내용·요약·사진이 모두 비어 있어 빈 카드로 보입니다.'));
        }
        if (!isBlank(story?.link) && !looksLikeUrl(story.link)) {
            issues.push(problem('원문 링크는 https:// 로 시작해야 합니다.'));
        }
        if (isBlank(story?.date)) issues.push(hint('날짜를 적으면 카드에 함께 보입니다. 예: 2026.08'));
        if (isBlank(story?.tag)) issues.push(hint('분류를 적으면 카드 위에 작은 라벨이 붙습니다.'));
        return issues;
    },
};

/** 목록 카드 옆 경고 배지에 쓰는 '꼭 고칠 것' 개수입니다. */
export const countItemProblems = (kind, item) =>
    (ITEM_CHECKS[kind]?.(item) || []).filter((issue) => issue.level === 'problem').length;

/** 항목별 결과 앞에 "‘○○’: " 같은 이름표를 붙입니다. */
const withLabel = (issues, label) => issues.map((issue) => ({ ...issue, text: `${label}: ${issue.text}` }));

const checkList = (items, kind, labelOf) =>
    items.flatMap((item, index) => withLabel(ITEM_CHECKS[kind](item), labelOf(item, index)));

function checkHero(data) {
    const hero = data.hero || {};
    const slides = hero.slides || [];

    if (slides.length === 0) {
        return [problem('슬라이드가 하나도 없습니다. 비어 있으면 기본 슬라이드가 대신 보입니다.')];
    }

    const issues = checkList(slides, 'hero', (_slide, index) => `${ordinal(index)} 슬라이드`);

    const visible = slides.filter((slide) => (slide.type === 'quote'
        ? !isBlank(slide.title) || !isBlank(slide.description)
        : !isBlank(slide.url)));

    if (visible.length === 0) {
        issues.unshift(problem('사이트에 보일 슬라이드가 한 장도 없어 기본 슬라이드가 대신 보입니다.'));
    } else if (visible.length === 1 && hero.autoplay) {
        issues.push(hint('보이는 슬라이드가 한 장뿐이라 자동 재생은 효과가 없습니다.'));
    }

    return issues;
}

function checkProfile(data) {
    const profile = data.profile || {};
    const issues = [];

    if (isBlank(profile.name)) issues.push(problem('이름이 비어 있습니다.'));
    if (isBlank(profile.role)) issues.push(problem('직함이 비어 있습니다. 첫 화면 글귀 슬라이드에 이름과 함께 보입니다.'));

    if (isBlank(profile.email)) {
        issues.push(problem('이메일이 비어 있으면 문의 영역의 [이메일 작성하기] 버튼이 눌리지 않습니다.'));
    } else if (!looksLikeEmail(profile.email)) {
        issues.push(problem('이메일 형식이 올바르지 않습니다. 예: hello@example.com'));
    }

    if (!isBlank(profile.blog) && !looksLikeUrl(profile.blog)) {
        issues.push(problem('블로그 주소는 https:// 로 시작해야 합니다.'));
    }

    if (isBlank(profile.location)) issues.push(hint('활동 지역을 넣으면 문의 영역에 함께 보입니다.'));
    if (isBlank(profile.introduction)) issues.push(hint('소개글을 채우면 나를 설명하기가 훨씬 쉬워집니다.'));

    const stats = Array.isArray(profile.stats) ? profile.stats : [];
    stats.forEach((stat, index) => {
        if (isBlank(stat?.label) !== isBlank(stat?.value)) {
            issues.push(problem(`${ordinal(index)} 활동 지표: 설명과 숫자를 모두 채워야 화면에 보입니다.`));
        }
    });
    if (stats.filter((stat) => !isBlank(stat?.label) && !isBlank(stat?.value)).length === 0) {
        issues.push(hint('활동 지표를 채우면 첫 화면에 숫자 카드가 함께 보입니다.'));
    }
    if (stats.length > MAX_PROFILE_STATS) {
        issues.push(hint(`활동 지표는 앞에서부터 ${MAX_PROFILE_STATS}개까지만 화면에 보입니다.`));
    }

    return issues;
}

function checkPhilosophy(data) {
    const list = data.philosophy || [];
    if (list.length === 0) return [hint('원칙을 등록하면 첫 화면 아래에 소개 카드가 생깁니다.')];

    const issues = checkList(list, 'philosophy', (item, index) => nameOf(item.title, `${ordinal(index)} 원칙`));
    if (list.length % 2 === 1) issues.push(hint('2열 카드로 보이므로 짝수 개일 때 가장 보기 좋습니다.'));
    return issues;
}

function checkProjects(data) {
    const list = data.projects || [];
    if (list.length === 0) return [hint('프로젝트를 등록하면 ‘만든 도구’ 영역이 채워집니다.')];

    const issues = checkList(list, 'projects', (project, index) => nameOf(project.title, `${ordinal(index)} 프로젝트`));

    const seen = new Set();
    list.forEach((project) => {
        const key = String(project?.title || '').trim();
        if (!key) return;
        if (seen.has(key)) issues.push(hint(`제목이 같은 프로젝트가 두 개 있습니다: ‘${key}’`));
        seen.add(key);
    });

    return issues;
}

function checkExperiences(data) {
    const list = data.experiences || [];
    if (list.length === 0) return [hint('경력을 등록하면 ‘경력’ 영역이 채워집니다.')];
    return checkList(list, 'experiences', (item, index) => nameOf(item.company || item.role, `${ordinal(index)} 경력`));
}

function checkStories(data) {
    const list = data.stories || [];
    if (list.length === 0) return [hint('기록을 등록하면 ‘기록’ 영역이 채워집니다.')];
    return checkList(list, 'stories', (story, index) => nameOf(story.title, `${ordinal(index)} 기록`));
}

const SECTION_CHECKS = {
    hero: checkHero,
    profile: checkProfile,
    philosophy: checkPhilosophy,
    projects: checkProjects,
    experiences: checkExperiences,
    stories: checkStories,
};

/** 한 항목의 점검 결과입니다. */
export function getSectionIssues(data, sectionId) {
    if (!data || !SECTION_CHECKS[sectionId]) return [];
    try {
        return SECTION_CHECKS[sectionId](data);
    } catch {
        return [];
    }
}

/** 모든 항목의 점검 결과를 { hero: [...], profile: [...] } 형태로 모읍니다. */
export function getAllIssues(data) {
    const result = {};
    Object.keys(SECTION_CHECKS).forEach((sectionId) => {
        result[sectionId] = getSectionIssues(data, sectionId);
    });
    return result;
}

export const countProblems = (issues = []) => issues.filter((issue) => issue.level === 'problem').length;
