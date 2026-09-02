/** 상단 메뉴와 하단 메뉴가 같은 목록을 쓰도록 한곳에 모아둡니다. */
export const NAV_LINKS = [
    { id: 'philosophy', label: '일하는 원칙' },
    { id: 'archive', label: '만든 도구' },
    { id: 'experience', label: '경력' },
    { id: 'stories', label: '기록' },
    { id: 'guestbook', label: '방명록' },
];

export const FOOTER_LINKS = [...NAV_LINKS, { id: 'contact', label: '문의' }];
