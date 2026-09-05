/** 데이터가 비어 있을 때 화면이 깨지지 않도록 쓰는 기본값입니다. */
export const DEFAULT_PROFILE = {
    name: '박주임 (Ju-im Park)',
    role: '사회복지사 & 스마트워크 소프트웨어 빌더',
    introduction:
        '10년 차 현직 사회복지사이자 실무 문제를 코딩으로 직접 해결하는 빌더입니다. 현장의 반복 행정을 줄여 복지사가 사람에 온전히 집중할 수 있는 실용적인 웹 도구를 만듭니다.',
    domain: 'parkjuim90.cloud',
    email: 'parkjuim90@gmail.com',
    location: '강원특별자치도 원주시',
    blog: '',
    github: '',
    stats: [
        { label: '자체 개발 복지 솔루션', value: '10+', unit: '개' },
        { label: '행정 소요시간 단축', value: '70', unit: '%' },
        { label: '사회복지 실천 경력', value: '10', unit: '년차' },
        { label: '스마트워크 강의 & 멘토링', value: '20+', unit: '회' },
    ],
};

/** 첫 화면의 문구와 이미지·동영상 기본값입니다. */
export const DEFAULT_HERO = {
    autoplay: true,
    interval: 7000,
    slides: [
        {
            id: 'hero-quote',
            type: 'quote',
            eyebrow: 'FIELD NOTE · WONJU',
            title: '사람에게 쓰는 시간은 늘리고, 반복 행정은 줄입니다.',
            description: '현장에서 발견한 불편을 누구나 바로 쓰는 도구로 바꿉니다.',
            url: '',
            poster: '',
            alt: '',
        },
        {
            id: 'hero-lecture',
            type: 'image',
            eyebrow: 'LECTURE & COMMUNITY',
            title: '현장에서 배우고, 동료와 함께 나눕니다.',
            description: '사회복지 실천과 스마트워크 교육 현장의 생생한 사진입니다.',
            url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1920&q=80',
            poster: '',
            alt: '사회복지 스마트워크 강의 현장',
        },
        {
            id: 'hero-film',
            type: 'video',
            eyebrow: 'SMART WELFARE IN MOTION',
            title: '기술이 복지의 온도를 높이는 순간',
            description: '현장의 고민과 디지털 전환 과정을 담은 소개 영상입니다.',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            poster: '',
            alt: '복지 현장과 스마트워크를 소개하는 영상',
        },
    ],
};
