'use client';

import { useMemo } from 'react';
import { getStoryImages } from '@/lib/stories';
import { duplicateEntry, moveInList, moveToTop, withProjectLink } from '../lib/portfolio';

/**
 * 편집 내용을 고치는 손잡이를 한곳에 모았습니다.
 * 각 편집 화면은 여기서 필요한 함수만 받아 쓰기 때문에
 * "데이터를 어떻게 바꾸는지"와 "화면을 어떻게 그리는지"가 섞이지 않습니다.
 */
export function useDraftMutations(setData) {
    return useMemo(() => {
        const mutateList = (key, mutate) =>
            setData((prev) => ({ ...prev, [key]: mutate([...(prev?.[key] || [])]) }));

        /* ── 첫 화면 ─────────────────────────────── */
        const updateHero = (key, value) =>
            setData((prev) => ({ ...prev, hero: { ...prev.hero, [key]: value } }));

        const mutateSlides = (mutate) =>
            setData((prev) => ({
                ...prev,
                hero: { ...prev.hero, slides: mutate([...(prev.hero?.slides || [])]) },
            }));

        const heroSlides = {
            update: (index, patch) => mutateSlides((slides) => {
                slides[index] = { ...slides[index], ...patch };
                return slides;
            }),
            add: (slide) => mutateSlides((slides) => [...slides, slide]),
            duplicate: (index) => mutateSlides((slides) => {
                const copy = duplicateEntry(slides[index], { idPrefix: `hero-${slides[index]?.type || 'slide'}` });
                slides.splice(index + 1, 0, copy);
                return slides;
            }),
            remove: (index) => mutateSlides((slides) => slides.filter((_, i) => i !== index)),
            move: (index, delta) => mutateSlides((slides) => moveInList(slides, index, delta)),
            moveTop: (index) => mutateSlides((slides) => moveToTop(slides, index)),
        };

        /* ── 기본 정보 ───────────────────────────── */
        const updateProfile = (key, value) =>
            setData((prev) => ({ ...prev, profile: { ...prev.profile, [key]: value } }));

        const mutateStats = (mutate) =>
            setData((prev) => ({
                ...prev,
                profile: { ...prev.profile, stats: mutate([...(prev.profile?.stats || [])]) },
            }));

        const stats = {
            update: (index, patch) => mutateStats((list) => {
                list[index] = { ...list[index], ...patch };
                return list;
            }),
            add: (stat) => mutateStats((list) => [...list, stat]),
            remove: (index) => mutateStats((list) => list.filter((_, i) => i !== index)),
            move: (index, delta) => mutateStats((list) => moveInList(list, index, delta)),
        };

        /* ── 목록형 항목(원칙·프로젝트·경력·기록·방명록) ── */
        const list = {
            update: (key, index, patch) => mutateList(key, (items) => {
                items[index] = { ...items[index], ...patch };
                return items;
            }),
            add: (key, item) => mutateList(key, (items) => [...items, item]),
            duplicate: (key, index, idPrefix) => mutateList(key, (items) => {
                const copy = duplicateEntry(items[index], { idPrefix });
                items.splice(index + 1, 0, copy);
                return items;
            }),
            remove: (key, index) => mutateList(key, (items) => items.filter((_, i) => i !== index)),
            move: (key, index, delta) => mutateList(key, (items) => moveInList(items, index, delta)),
            moveTop: (key, index) => mutateList(key, (items) => moveToTop(items, index)),
        };

        /* ── 프로젝트 링크 ───────────────────────── */
        const updateProjectLink = (index, linkField, url) =>
            mutateList('projects', (projects) => {
                projects[index] = withProjectLink(projects[index], linkField, url);
                return projects;
            });

        /* ── 기록에 붙는 사진 ────────────────────── */
        const mutateStoryImages = (index, mutate) =>
            mutateList('stories', (stories) => {
                stories[index] = { ...stories[index], images: mutate(getStoryImages(stories[index])) };
                return stories;
            });

        const storyImages = {
            append: (index, added) => mutateStoryImages(index, (images) => [...images, ...added]),
            update: (index, imageIndex, patch) => mutateStoryImages(index, (images) => {
                const next = [...images];
                next[imageIndex] = { ...next[imageIndex], ...patch };
                return next;
            }),
            remove: (index, imageIndex) =>
                mutateStoryImages(index, (images) => images.filter((_, i) => i !== imageIndex)),
            move: (index, imageIndex, delta) =>
                mutateStoryImages(index, (images) => moveInList(images, imageIndex, delta)),
        };

        return { updateHero, heroSlides, updateProfile, stats, list, updateProjectLink, storyImages };
    }, [setData]);
}
