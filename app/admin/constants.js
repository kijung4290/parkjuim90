import {
    BriefcaseBusiness,
    Compass,
    FolderKanban,
    Image as ImageIcon,
    MessagesSquare,
    NotebookText,
    Settings,
    UserRound,
} from 'lucide-react';
import { PROJECT_CATEGORIES } from '@/lib/projectMeta';
import { PROJECT_ICON_NAMES } from '@/components/projectIcons';

/**
 * 왼쪽 메뉴에 보이는 관리 항목입니다.
 *
 * guide   — 이 항목이 홈페이지의 어디에 보이는지 설명하는 안내 문장입니다.
 * preview — [사이트에서 확인] 버튼이 열어줄 실제 홈페이지 위치입니다.
 */
export const SECTIONS = [
    {
        id: 'hero',
        label: '첫 화면 슬라이드',
        description: '영상·현장 사진·글귀',
        icon: ImageIcon,
        preview: '/',
        guide: '홈페이지를 열면 가장 먼저 보이는 큰 화면입니다. 위에 있는 슬라이드부터 차례대로 재생됩니다.',
    },
    {
        id: 'profile',
        label: '기본 정보',
        description: '이름, 소개, 연락처, 지표',
        icon: UserRound,
        preview: '/#contact',
        guide: '첫 화면의 이름·활동 지표와 맨 아래 문의 영역에 함께 쓰이는 정보입니다.',
    },
    {
        id: 'philosophy',
        label: '일하는 원칙',
        description: '나를 설명하는 가치',
        icon: Compass,
        preview: '/#philosophy',
        guide: '첫 화면 바로 아래에서 2열 카드로 보이는 소개 문구입니다.',
    },
    {
        id: 'projects',
        label: '프로젝트',
        description: '만든 도구와 서비스',
        icon: FolderKanban,
        preview: '/#archive',
        guide: '‘만든 도구’ 영역의 카드 목록입니다. 방문자가 카테고리로 걸러 보거나 검색할 수 있습니다.',
    },
    {
        id: 'experiences',
        label: '경력',
        description: '소속과 주요 역할',
        icon: BriefcaseBusiness,
        preview: '/#experience',
        guide: '‘경력’ 영역에 위에서부터 순서대로 표시됩니다.',
    },
    {
        id: 'stories',
        label: '기록',
        description: '글과 현장 이야기',
        icon: NotebookText,
        preview: '/#stories',
        guide: '‘기록’ 영역의 글 카드입니다. 첫 번째 글이 두 칸 너비로 크게 보입니다.',
    },
    {
        id: 'guestbook',
        label: '방명록',
        description: '방문자 메시지 관리',
        icon: MessagesSquare,
        preview: '/#guestbook',
        guide: '방문자가 직접 남긴 글입니다. 여기에서는 확인과 삭제만 할 수 있습니다.',
    },
    {
        id: 'settings',
        label: '설정',
        description: '기본 데이터로 초기화',
        icon: Settings,
        preview: '/',
        guide: '지금까지 저장한 내용을 지우고 처음 상태로 되돌리는 곳입니다.',
    },
];

export const HERO_TYPE_LABELS = { image: '이미지', video: '동영상', quote: '글귀' };

const HERO_TYPE_EYEBROWS = {
    image: 'LECTURE & COMMUNITY',
    video: 'FIELD FILM',
    quote: 'FIELD NOTE',
};

export const HERO_INTERVALS = [
    { value: 5000, label: '5초' },
    { value: 7000, label: '7초 (권장)' },
    { value: 10000, label: '10초' },
    { value: 15000, label: '15초' },
];

export const PROJECT_LINK_FIELDS = [
    { id: 'webapp', label: '웹앱 링크', buttonLabel: '웹앱 열기' },
    { id: 'sheet', label: '실습 시트 링크', buttonLabel: '실습 시트' },
    { id: 'blog', label: '설명 글 링크', buttonLabel: '설명 글' },
];

/** app/api/upload/route.js 가 실제로 받아주는 용량·형식과 같은 값이어야 합니다. */
export const UPLOAD_LIMITS = {
    image: { megabytes: 10, accept: 'image/png,image/jpeg,image/webp,image/gif,image/avif', formats: 'JPG · PNG · WEBP · GIF · AVIF' },
    video: { megabytes: 50, accept: 'video/mp4,video/webm,video/ogg,video/quicktime', formats: 'MP4 · WEBM · MOV' },
};

/** 글자 수 안내를 붙일 곳에서 쓰는 권장 길이입니다(넘어도 저장은 됩니다). */
export const LENGTH_HINTS = {
    slideTitle: 45,
    slideDescription: 80,
    introduction: 220,
    philosophyDesc: 120,
    projectSummary: 90,
    storySummary: 90,
};

/** 같은 밀리초에 두 번 눌러도 겹치지 않는 항목 번호를 만듭니다(복제 기능 때문에 필요합니다). */
export const createId = (prefix) =>
    `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

export const createHeroSlide = (type) => ({
    id: createId(`hero-${type}`),
    type,
    eyebrow: HERO_TYPE_EYEBROWS[type] || 'FIELD NOTE',
    title: '',
    description: '',
    url: '',
    poster: '',
    alt: '',
});

export const createPhilosophy = () => ({
    id: createId('philosophy'),
    title: '',
    subtitle: '',
    desc: '',
});

export const createProject = () => ({
    id: createId('project'),
    category: PROJECT_CATEGORIES[0].id,
    categoryLabel: PROJECT_CATEGORIES[0].label,
    title: '',
    subtitle: '',
    summary: '',
    description: '',
    highlights: [],
    techStack: [],
    link: '#',
    links: [],
    badge: '',
    icon: PROJECT_ICON_NAMES[0],
});

export const createExperience = () => ({
    id: createId('experience'),
    period: '',
    company: '',
    role: '',
    description: '',
    tags: [],
});

export const createStory = () => ({
    id: createId('story'),
    tag: '',
    date: '',
    readTime: '3분',
    title: '',
    summary: '',
    content: '',
    images: [],
    likes: 0,
    link: '',
});

export const createStat = () => ({ label: '', value: '', unit: '' });

/** 첫 화면에 함께 보이는 활동 지표는 4칸까지만 표시됩니다(HeroSection.js 참고). */
export const MAX_PROFILE_STATS = 4;
