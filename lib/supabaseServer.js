import { createClient } from '@supabase/supabase-js';
import { supabase } from './supabase';

/**
 * 서버 전용 모듈입니다. 클라이언트 컴포넌트에서 import하지 마세요.
 *
 * SUPABASE_SERVICE_ROLE_KEY를 설정하면 쓰기 작업이 RLS를 우회하는
 * 서비스 롤 키로 처리되므로, 공개 anon 키로는 쓰기를 막을 수 있습니다.
 * (supabase_schema.sql의 "권한 강화" 항목 참고)
 * 키가 없으면 기존처럼 anon 클라이언트를 그대로 사용합니다.
 */
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

export const writeClient =
    serviceRoleKey && supabaseUrl
        ? createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } })
        : supabase;

/**
 * 요청의 Authorization 헤더에 담긴 Supabase 액세스 토큰을 검증합니다.
 * 로그인한 관리자면 user 객체를, 아니면 null을 반환합니다.
 */
export async function getRequestUser(request) {
    const header = request.headers.get('authorization') || '';
    const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
    if (!token) return null;

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) return null;
    return data.user;
}
