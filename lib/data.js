import { supabase } from './supabase';
import fs from 'fs';
import path from 'path';

// Fallback to local JSON data if Supabase isn't populated or available
function getLocalData() {
    try {
        const filePath = path.join(process.cwd(), 'data', 'portfolio.json');
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(content);
        }
    } catch (e) {
        console.error("Local data read error:", e);
    }
    return null;
}

export async function getPortfolioData() {
    const localData = getLocalData();
    try {
        const { data, error } = await supabase
            .from('portfolio')
            .select('*')
            .eq('id', 1)
            .single();

        if (error || !data || !data.content) {
            return localData;
        }

        // Merge or return Supabase content
        return data.content || localData;
    } catch (error) {
        console.error("Error reading portfolio data:", error);
        return localData;
    }
}

export async function savePortfolioData(newData) {
    try {
        // Save to local file first as local backup
        try {
            const filePath = path.join(process.cwd(), 'data', 'portfolio.json');
            fs.writeFileSync(filePath, JSON.stringify(newData, null, 2), 'utf8');
        } catch (fileErr) {
            console.warn("Local file write error:", fileErr);
        }

        // Upsert to Supabase
        const { error } = await supabase
            .from('portfolio')
            .upsert({ id: 1, content: newData });

        if (error) {
            console.warn("Supabase save error (saved locally):", error.message);
            return true; // Still true since local file saved
        }
        return true;
    } catch (error) {
        console.error("Error saving portfolio data:", error);
        return false;
    }
}
