/** 화면, 문의 폼, 검색 메타데이터가 함께 쓰는 SMARTWORKLAB 서비스 정보입니다. */
export const SITE_URL = 'https://parkjuim90.cloud';
export const SITE_NAME = '일잘알랩 SMARTWORKLAB';

export const SERVICES = [
    {
        id: 'generative-ai-training', section: 'academy', name: '생성형 AI 교육', shortLabel: '생성형 AI 교육',
        tagline: '질문부터 결과물까지 업무에 맞게',
        description: '문서, 기획, 콘텐츠 제작 등 실제 업무를 중심으로 생성형 AI를 정확하고 효율적으로 사용하는 방법을 익힙니다.',
        placeholder: '교육 대상과 인원, AI 활용 수준, 다루고 싶은 업무를 알려주세요.',
        keywords: ['생성형 AI 교육', '챗GPT 교육', 'AI 실무 교육'],
    },
    {
        id: 'smartwork-training', section: 'academy', name: '스마트워크 교육', shortLabel: '스마트워크 교육',
        tagline: '협업 도구로 일의 흐름을 더 단순하게',
        description: '구글 워크스페이스와 협업 도구를 활용해 기록, 공유, 소통의 흐름을 빠르게 바꾸는 실습형 교육입니다.',
        placeholder: '현재 사용하는 도구와 개선하고 싶은 업무 방식을 알려주세요.',
        keywords: ['스마트워크 교육', '구글 워크스페이스 교육', '업무 효율화 교육'],
    },
    {
        id: 'ai-automation-training', section: 'academy', name: 'AI 업무자동화 교육', shortLabel: 'AI 업무자동화 교육',
        tagline: '반복 업무를 직접 자동화하는 실습',
        description: '입력, 정리, 알림, 보고처럼 반복되는 일을 AI와 자동화 도구로 연결해 바로 사용할 결과물을 만듭니다.',
        placeholder: '줄이고 싶은 반복 업무와 현재 사용하는 프로그램을 알려주세요.',
        keywords: ['AI 업무자동화 교육', '업무 자동화 교육', 'AI 자동화 실습'],
    },
    {
        id: 'vibe-coding-training', section: 'academy', name: '바이브코딩 교육', shortLabel: '바이브코딩 교육',
        tagline: 'AI와 대화하며 필요한 도구를 직접',
        description: '개발 경험이 없어도 AI와 대화하며 업무에 필요한 웹앱을 기획하고 구현하는 과정을 배웁니다.',
        placeholder: '만들고 싶은 도구와 참여자의 개발 경험 수준을 알려주세요.',
        keywords: ['바이브코딩 교육', 'AI 코딩 교육', '업무 도구 제작 교육'],
    },
    {
        id: 'process-improvement', section: 'consulting', name: '업무 프로세스 개선', shortLabel: '업무 프로세스 개선',
        tagline: '병목과 중복을 찾아 더 간결하게',
        description: '현재 업무 흐름을 진단하고 불필요한 단계와 중복을 찾아 실행 가능한 개선 프로세스를 설계합니다.',
        placeholder: '개선하고 싶은 업무와 관련 부서, 현재 어려움을 알려주세요.',
        keywords: ['업무 프로세스 개선', '업무 효율화 컨설팅', '프로세스 혁신'],
    },
    {
        id: 'ai-strategy', section: 'consulting', name: 'AI 활용 전략', shortLabel: 'AI 활용 전략',
        tagline: '조직에 맞는 AI 도입 순서 설계',
        description: '조직의 업무와 역량을 분석해 AI가 효과적인 영역을 찾고 작은 실행부터 확산까지의 순서를 정합니다.',
        placeholder: '조직의 AI 도입 현황과 기대하는 변화를 알려주세요.',
        keywords: ['AI 활용 전략', '생성형 AI 컨설팅', 'AI 도입 컨설팅'],
    },
    {
        id: 'task-automation', section: 'consulting', name: '반복 업무 자동화', shortLabel: '반복 업무 자동화',
        tagline: '수작업을 연결해 시간과 오류를 절감',
        description: '입력, 집계, 문서 생성, 안내 등 반복되는 과정을 연결하고 조직에 맞는 자동화 도구를 구축합니다.',
        placeholder: '반복하는 업무와 사용하는 서식 또는 프로그램을 알려주세요.',
        keywords: ['반복 업무 자동화', '업무 자동화 컨설팅', '자동화 프로그램 제작'],
    },
    {
        id: 'organization-innovation', section: 'consulting', name: '조직 업무혁신', shortLabel: '조직 업무혁신',
        tagline: '구성원이 함께 쓰는 변화의 방식',
        description: '도구 도입에 그치지 않고 구성원이 함께 사용할 기준, 습관, 확산 방법을 조직 상황에 맞게 설계합니다.',
        placeholder: '조직의 규모와 변화가 필요한 업무 문화 또는 협업 방식을 알려주세요.',
        keywords: ['조직 업무혁신', '디지털 전환 컨설팅', '스마트워크 컨설팅'],
    },
];

export const PRIMARY_KEYWORDS = SERVICES.map((service) => service.name);
export const SUPPORTING_KEYWORDS = [
    '일잘알랩', 'SMARTWORKLAB', '스마트워커 박주임', '사회복지 스마트워크',
    '사회복지사 교육 강사', '사회복지 업무 자동화', '업무혁신 교육', '복지기관 AI 교육',
];
export const SEO_KEYWORDS = [...PRIMARY_KEYWORDS, ...SUPPORTING_KEYWORDS];
export const SEO_TITLE = '일잘알랩 SMARTWORKLAB | AI 교육·업무혁신 컨설팅';
export const SEO_DESCRIPTION = '생성형 AI·스마트워크·AI 업무자동화·바이브코딩 교육과 업무 프로세스 개선·AI 활용 전략·조직 업무혁신 컨설팅을 제공하는 일잘알랩입니다.';
export const SEO_SHORT_DESCRIPTION = '교육, 컨설팅, 업무도구로 사람의 일에 더 나은 가능성을 만드는 일잘알랩입니다.';

/**
 * 검색엔진·AI 답변엔진이 "이 사람/이 브랜드"를 하나의 대상으로 묶는 데 쓰는 정보입니다.
 * sameAs에 적힌 주소가 서로를 가리켜야 같은 주인으로 인식되므로,
 * 실제로 운영하는 계정만 넣습니다. (placeholder 주소는 넣으면 오히려 신호가 나빠집니다.)
 */
export const CONTACT_EMAIL = 'parkjuim90@gmail.com';
export const SITE_LOGO = `${SITE_URL}/images/smartworklab-logo.png`;
export const BLOG_URL = 'https://blog.naver.com/parkjuim90';
export const SAME_AS = [BLOG_URL];

/**
 * sitemap의 lastModified 값입니다.
 * 매 요청마다 현재 시각을 넣으면 "항상 방금 바뀐 사이트"가 되어 검색엔진이 값을 무시합니다.
 * 화면에 보이는 내용을 실제로 고친 날에만 이 날짜를 바꿔주세요.
 */
export const CONTENT_UPDATED_AT = '2026-09-10';
