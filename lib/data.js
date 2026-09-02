import { supabase } from './supabase';
import { writeClient } from './supabaseServer';
import initialPortfolioData from '@/data/portfolio.json';
import { TOOL_CATALOG } from '@/data/tools';

const isEmpty = (value) => !value || typeof value !== 'object' || Object.keys(value).length === 0;
const TOOL_CATALOG_VERSION = 1;

/**
 * 예전 프로젝트 데이터는 현재 홈페이지에 표시하는 도구 목록으로 한 번 교체합니다.
 * 관리자가 이 버전의 데이터를 저장한 뒤에는 추가·수정·삭제한 projects를 그대로 사용합니다.
 */
const preparePortfolioContent = (content) => {
    const portfolio = isEmpty(content) ? initialPortfolioData : content;
    const hasManagedCatalog =
        portfolio.toolCatalogVersion === TOOL_CATALOG_VERSION &&
        Array.isArray(portfolio.projects);

    if (hasManagedCatalog) return portfolio;

    return {
        ...portfolio,
        toolCatalogVersion: TOOL_CATALOG_VERSION,
        projects: TOOL_CATALOG,
    };
};

/**
 * 포트폴리오 데이터를 읽어옵니다.
 *
 * readable이 false면 DB 조회 자체가 실패한 것이므로,
 * 이 결과를 그대로 다시 저장하면 안 됩니다(번들 JSON이 실제 데이터를 덮어씁니다).
 *
 * @returns {Promise<{ content: object, readable: boolean }>}
 */
export async function readPortfolio() {
    try {
        const { data, error } = await supabase
            .from('portfolio')
            .select('content')
            .eq('id', 1)
            .maybeSingle();

        if (error) {
            console.warn('Supabase 조회 실패, 번들 JSON으로 대체합니다:', error.message);
            return { content: preparePortfolioContent(initialPortfolioData), readable: false };
        }

        // 행이 없거나 content가 비어 있으면(스키마 초기 상태) 번들 JSON을 보여줍니다.
        return { content: preparePortfolioContent(data?.content), readable: true };
    } catch (error) {
        console.warn('Supabase 조회 중 오류, 번들 JSON으로 대체합니다:', error);
        return { content: preparePortfolioContent(initialPortfolioData), readable: false };
    }
}

export async function getPortfolioData() {
    const { content } = await readPortfolio();
    return content;
}

export async function savePortfolioData(newData) {
    try {
        const content = preparePortfolioContent(newData);
        const { error } = await writeClient
            .from('portfolio')
            .upsert({ id: 1, content });

        if (error) {
            console.warn('Supabase 저장 실패:', error.message);
            return false;
        }
        return true;
    } catch (error) {
        console.error('Supabase 저장 중 오류:', error);
        return false;
    }
}
