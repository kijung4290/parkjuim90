/** 브랜드 메뉴와 각 메뉴의 세부 이동 지점을 한곳에서 관리합니다. */
export const NAV_LINKS = [
    {
        id: 'about',
        label: '일잘알랩 소개',
        english: 'SMARTWORKLAB 소개',
        children: [
            { id: 'lab-intro', label: 'SMARTWORKLAB 소개' },
            { id: 'park-intro', label: '스마트워커 박주임 소개' },
            { id: 'lab-philosophy', label: '연구소 철학' },
            { id: 'innovation-direction', label: '업무혁신 방향' },
        ],
    },
    {
        id: 'academy',
        label: '일잘알 클래스',
        english: 'SMARTWORKLAB Academy',
        children: [
            { id: 'generative-ai-training', label: '생성형 AI 교육' },
            { id: 'smartwork-training', label: '스마트워크 교육' },
            { id: 'ai-automation-training', label: 'AI 업무자동화 교육' },
            { id: 'vibe-coding-training', label: '바이브코딩 교육' },
        ],
    },
    {
        id: 'consulting',
        label: '일잘알 컨설팅',
        english: 'SMARTWORKLAB Consulting',
        children: [
            { id: 'process-improvement', label: '업무 프로세스 개선' },
            { id: 'ai-strategy', label: 'AI 활용 전략' },
            { id: 'task-automation', label: '반복 업무 자동화' },
            { id: 'organization-innovation', label: '조직 업무혁신' },
        ],
    },
    {
        id: 'tools',
        label: '일잘알 도구실',
        english: 'SMARTWORKLAB Tools',
        children: [
            { id: 'made-tools', label: '직접 제작한 업무도구' },
            { id: 'automation-programs', label: '자동화 프로그램' },
            { id: 'ai-use-cases', label: 'AI 적용 사례' },
        ],
    },
    {
        id: 'notes',
        label: '일잘알 기록소',
        english: 'SMARTWORKLAB Notes',
        children: [
            { id: 'notes-blog', label: '블로그' },
            { id: 'notes-ai', label: 'AI 활용 이야기' },
            { id: 'notes-build', label: '제작 과정' },
            { id: 'notes-insight', label: '업무혁신 인사이트' },
        ],
    },
];

export const FOOTER_LINKS = [...NAV_LINKS, { id: 'contact', label: '문의', english: 'Contact' }];
