/**
 * 상세 화면(‘자세히’ 창)에 보여줄 **핵심 키워드**를 만드는 헬퍼입니다.
 *
 * 상세 화면은 글이 길어지기 쉬운 곳입니다. 방문자는 문장을 처음부터 읽기보다
 * "이게 무엇에 관한 것인지"를 먼저 훑어보기 때문에, 긴 설명 앞에
 * 짧은 키워드 몇 개를 먼저 보여주고 문장은 접어둡니다.
 *
 * 키워드는 **관리자가 적은 값을 먼저 쓰고, 없으면 이미 정리된 항목에서 가져옵니다.**
 * 본문에서 낱말을 자동으로 뽑는 방법은 일부러 쓰지 않았습니다.
 * 형태소 분석기 없이 한국어 문장을 자르면 ‘가계도를’이 ‘가계’로 잘리고
 * ‘직접·매일’ 같은 꾸밈말이 주제어처럼 올라와서, 키워드가 오히려 읽는 것을 방해합니다.
 * 어색한 칩을 보여주는 것보다 칩을 접어두는 편이 화면이 깔끔합니다.
 */

const clean = (value) => String(value ?? '').replace(/\s+/g, ' ').trim();

/** 같은 뜻의 칩이 두 번 보이지 않도록 순서를 지키면서 중복을 지웁니다. */
const dedupe = (values, limit) => {
    const seen = new Set();
    const result = [];

    for (const raw of values) {
        const value = clean(raw);
        if (!value) continue;

        const key = value.toLowerCase();
        if (seen.has(key)) continue;

        seen.add(key);
        result.push(value);
        if (result.length >= limit) break;
    }

    return result;
};

/**
 * 관리자가 적은 키워드 칸을 읽습니다.
 * 배열로 저장된 값이 기본이지만, 쉼표나 가운뎃점으로 한 줄에 적어도 그대로 읽습니다.
 */
const fromKeywordField = (value) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') return value.split(/[,\n·]/);
    return [];
};

/**
 * 프로젝트 상세 화면의 키워드입니다.
 *
 * 카테고리는 항상 맨 앞에 옵니다(상세 화면에서 분류를 보여주는 유일한 자리입니다).
 * 그 뒤에는 관리자가 적은 키워드를, 적지 않았으면 부제를 나눠 붙입니다.
 * 부제는 이미 ‘공유용 · 심화 활용’처럼 짧은 낱말로 정리돼 있어서 그대로 칩이 됩니다.
 *
 * 기술 스택은 상세 화면에 따로 한 줄로 나오므로 여기에 넣지 않습니다(같은 값을 두 번 보여주지 않습니다).
 */
export function getProjectKeywords(project, limit = 6) {
    const explicit = fromKeywordField(project?.keywords);
    const rest = explicit.length > 0 ? explicit : String(project?.subtitle || '').split('·');

    return dedupe([project?.categoryLabel, ...rest], limit);
}

/**
 * 기록(글) 상세 화면의 키워드입니다.
 * 기록에는 정리된 항목이 분류(tag) 하나뿐이라, 관리자가 키워드를 적지 않으면 분류만 보여줍니다.
 */
export function getStoryKeywords(story, limit = 5) {
    const explicit = fromKeywordField(story?.keywords);
    if (explicit.length > 0) return dedupe([story?.tag, ...explicit], limit);

    return dedupe([story?.tag], limit);
}
