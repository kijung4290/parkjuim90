/** 프로젝트 카테고리 정의. 화면 필터와 관리자 화면이 같은 목록을 씁니다. */
export const PROJECT_CATEGORIES = [
    { id: 'social', label: '사회복지 실무' },
    { id: 'ai', label: 'AI & 챗봇' },
    { id: 'community', label: '커뮤니티 & 돌봄' },
    { id: 'automation', label: '행정 자동화' },
    { id: 'smartwork', label: '스마트워크 & 교육' },
];

export const getCategoryLabel = (id) =>
    PROJECT_CATEGORIES.find((category) => category.id === id)?.label || '';
