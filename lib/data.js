import { supabase } from './supabase';
import initialPortfolioData from '@/data/portfolio.json';

export async function getPortfolioData() {
    try {
        const { data, error } = await supabase
            .from('portfolio')
            .select('*')
            .eq('id', 1)
            .single();

        if (error || !data || !data.content) {
            return initialPortfolioData;
        }

        return data.content || initialPortfolioData;
    } catch (error) {
        console.warn("Supabase read fallback to bundled JSON:", error);
        return initialPortfolioData;
    }
}

export async function savePortfolioData(newData) {
    try {
        const { error } = await supabase
            .from('portfolio')
            .upsert({ id: 1, content: newData });

        if (error) {
            console.warn("Supabase save error:", error.message);
            return false;
        }
        return true;
    } catch (error) {
        console.error("Error saving portfolio data:", error);
        return false;
    }
}
