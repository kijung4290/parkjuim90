'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { normalizePortfolio } from '../lib/portfolio';

/** 브라우저에 임시 보관하는 편집 내용의 이름표입니다. */
const DRAFT_KEY = 'portfolio-admin-draft-v1';

const readDraft = () => {
    try {
        const raw = window.localStorage.getItem(DRAFT_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed?.data || typeof parsed.data !== 'object') return null;
        return parsed;
    } catch {
        return null;
    }
};

const clearDraft = () => {
    try {
        window.localStorage.removeItem(DRAFT_KEY);
    } catch {
        /* 시크릿 모드 등에서 저장이 막혀 있어도 편집은 계속할 수 있어야 합니다. */
    }
};

/**
 * 편집 중인 내용을 들고 있는 곳입니다.
 *
 * 비개발자에게 가장 큰 사고는 "저장을 누르기 전에 창을 닫는 것"이라
 * 세 겹으로 막아둡니다.
 *   1) 저장하지 않은 변경사항이 있으면 창을 닫을 때 브라우저가 되묻습니다.
 *   2) 편집 내용을 브라우저에 자동으로 임시 보관해두고, 다시 들어오면 이어서 편집할 수 있습니다.
 *   3) Ctrl(⌘)+S 로도 바로 저장할 수 있습니다.
 */
export function usePortfolioDraft({ isLoggedIn, authorizedFetch, notify }) {
    const [data, setData] = useState(null);
    const [savedSnapshot, setSavedSnapshot] = useState('');
    const [status, setStatus] = useState('idle'); // idle | loading | ready | error
    const [busy, setBusy] = useState(false);
    const [lastSavedAt, setLastSavedAt] = useState(null);
    const [recovered, setRecovered] = useState(null); // { savedAt, data }

    const isDirty = useMemo(
        () => Boolean(data && savedSnapshot && JSON.stringify(data) !== savedSnapshot),
        [data, savedSnapshot],
    );

    // 로그인하면 저장된 내용을 불러오고, 임시 보관된 편집 내용이 있으면 알려줍니다.
    useEffect(() => {
        if (!isLoggedIn) {
            setData(null);
            setSavedSnapshot('');
            setStatus('idle');
            return undefined;
        }

        let cancelled = false;
        setStatus('loading');

        (async () => {
            try {
                const response = await fetch('/api/portfolio');
                if (!response.ok) throw new Error('불러오기 실패');
                const json = await response.json();
                if (cancelled) return;

                const normalized = normalizePortfolio(json);
                const snapshot = JSON.stringify(normalized);
                setData(normalized);
                setSavedSnapshot(snapshot);
                setStatus('ready');

                const draft = readDraft();
                if (draft && JSON.stringify(normalizePortfolio(draft.data)) !== snapshot) {
                    setRecovered({ savedAt: draft.savedAt, data: normalizePortfolio(draft.data) });
                } else if (draft) {
                    clearDraft();
                }
            } catch (error) {
                console.error(error);
                if (cancelled) return;
                setStatus('error');
                notify('error', '데이터를 불러오지 못했습니다. 인터넷 연결을 확인한 뒤 새로고침해주세요.');
            }
        })();

        return () => { cancelled = true; };
    }, [isLoggedIn, notify]);

    // 편집 내용을 브라우저에 자동으로 임시 보관합니다(서버 저장이 아닙니다).
    useEffect(() => {
        if (status !== 'ready' || recovered) return undefined;

        if (!isDirty) {
            clearDraft();
            return undefined;
        }

        const timer = window.setTimeout(() => {
            try {
                window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ savedAt: Date.now(), data }));
            } catch {
                /* 용량 초과 등으로 임시 보관이 안 돼도 편집은 계속됩니다. */
            }
        }, 700);

        return () => window.clearTimeout(timer);
    }, [data, isDirty, recovered, status]);

    // 저장하지 않고 창을 닫으려 하면 브라우저가 한 번 더 물어봅니다.
    useEffect(() => {
        const warnBeforeLeaving = (event) => {
            if (!isDirty) return;
            event.preventDefault();
            event.returnValue = '';
        };
        window.addEventListener('beforeunload', warnBeforeLeaving);
        return () => window.removeEventListener('beforeunload', warnBeforeLeaving);
    }, [isDirty]);

    const save = useCallback(async () => {
        if (!data) return;
        setBusy(true);
        try {
            const response = await authorizedFetch('/api/portfolio', {
                method: 'POST',
                body: JSON.stringify(data),
            });
            const result = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(result.error || '저장에 실패했습니다.');

            setSavedSnapshot(JSON.stringify(data));
            setLastSavedAt(new Date());
            clearDraft();
            notify('ok', '저장했습니다. 사이트에 바로 반영됩니다.');
        } catch (error) {
            notify('error', error.message);
        }
        setBusy(false);
    }, [authorizedFetch, data, notify]);

    // 저장 단축키. 입력칸 안에서도 동작하도록 창 전체에서 받습니다.
    const saveRef = useRef(save);
    saveRef.current = save;
    useEffect(() => {
        const onKeyDown = (event) => {
            if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== 's') return;
            event.preventDefault();
            if (isDirty && !busy) saveRef.current();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [busy, isDirty]);

    const discard = useCallback(() => {
        if (!isDirty || !window.confirm('저장하지 않은 변경사항을 모두 취소할까요?')) return;
        setData(JSON.parse(savedSnapshot));
        clearDraft();
        notify('ok', '저장 전 상태로 되돌렸습니다.');
    }, [isDirty, notify, savedSnapshot]);

    const resetToBundled = useCallback(async () => {
        if (!window.confirm('저장된 내용을 지우고 코드에 포함된 기본값으로 되돌립니다. 계속할까요?')) return;
        setBusy(true);
        try {
            const response = await authorizedFetch('/api/setup/migrate', { method: 'POST' });
            const result = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(result.error || '초기화에 실패했습니다.');

            const refreshed = await fetch('/api/portfolio');
            if (!refreshed.ok) throw new Error('초기화 후 데이터를 다시 불러오지 못했습니다.');

            const normalized = normalizePortfolio(await refreshed.json());
            setData(normalized);
            setSavedSnapshot(JSON.stringify(normalized));
            clearDraft();
            notify('ok', '기본 데이터로 되돌렸습니다.');
        } catch (error) {
            notify('error', error.message);
        }
        setBusy(false);
    }, [authorizedFetch, notify]);

    const applyRecovered = useCallback(() => {
        if (!recovered) return;
        setData(recovered.data);
        setRecovered(null);
        notify('ok', '임시 보관한 편집 내용을 불러왔습니다. 확인한 뒤 [저장하기]를 눌러주세요.');
    }, [notify, recovered]);

    const dismissRecovered = useCallback(() => {
        clearDraft();
        setRecovered(null);
    }, []);

    return {
        data,
        setData,
        status,
        busy,
        isDirty,
        lastSavedAt,
        recovered,
        save,
        discard,
        resetToBundled,
        applyRecovered,
        dismissRecovered,
    };
}
