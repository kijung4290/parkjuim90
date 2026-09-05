'use client';

import { useCallback, useState } from 'react';

/**
 * 사진·동영상 파일을 서버로 올립니다.
 *
 * 어떤 버튼이 지금 올리는 중인지 `busyKey`로 표시해서
 * 같은 화면에 업로드 버튼이 여러 개 있어도 헷갈리지 않게 합니다.
 */
export function useMediaUpload({ authorizedFetch, notify }) {
    const [busyKey, setBusyKey] = useState(null);

    /** 한 개 올리고 주소를 돌려줍니다. 실패하면 null 입니다. */
    const uploadOne = useCallback(async (key, file, folder) => {
        if (!file) return null;

        setBusyKey(key);
        try {
            const form = new FormData();
            form.append('file', file);
            form.append('folder', folder);

            const response = await authorizedFetch('/api/upload', { method: 'POST', body: form });
            const result = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(result.error || '파일을 올리지 못했습니다.');
            return result.url;
        } catch (error) {
            notify('error', error.message);
            return null;
        } finally {
            setBusyKey(null);
        }
    }, [authorizedFetch, notify]);

    /**
     * 여러 장을 차례로 올립니다.
     * 중간에 실패해도 이미 올라간 사진은 그대로 돌려줘서 다시 올리는 수고를 줄입니다.
     * File 이 아닌 { url, alt } 항목은 이미 인터넷에 있는 사진이므로 그대로 통과시킵니다.
     */
    const uploadMany = useCallback(async (key, entries, folder) => {
        const items = Array.from(entries || []);
        if (items.length === 0) return [];

        setBusyKey(key);
        const uploaded = [];
        try {
            for (const item of items) {
                if (!(item instanceof File)) {
                    uploaded.push({ url: item.url, alt: item.alt || '' });
                    continue;
                }

                const form = new FormData();
                form.append('file', item);
                form.append('folder', folder);

                const response = await authorizedFetch('/api/upload', { method: 'POST', body: form });
                const result = await response.json().catch(() => ({}));
                if (!response.ok) throw new Error(result.error || '사진을 올리지 못했습니다.');
                uploaded.push({ url: result.url, alt: '' });
            }
        } catch (error) {
            notify('error', error.message);
        } finally {
            setBusyKey(null);
        }
        return uploaded;
    }, [authorizedFetch, notify]);

    return { busyKey, uploadOne, uploadMany };
}
