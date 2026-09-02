import { createClient } from '@supabase/supabase-js';

const PLACEHOLDER_URL = 'https://placeholder.supabase.co';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || PLACEHOLDER_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

/** 환경변수가 없을 때도 빌드가 죽지 않도록 자리표시자 클라이언트를 만듭니다. */
export const isSupabaseConfigured = supabaseUrl !== PLACEHOLDER_URL;

if (!isSupabaseConfigured) {
    console.warn('⚠️ NEXT_PUBLIC_SUPABASE_URL이 없습니다. 자리표시자 값으로 대체합니다.');
}

/** 브라우저와 서버 모두에서 쓰는 공개(anon) 클라이언트입니다. */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
