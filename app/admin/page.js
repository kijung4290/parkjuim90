'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    BriefcaseBusiness,
    Check,
    ChevronDown,
    ChevronUp,
    Compass,
    ExternalLink,
    Film,
    FolderKanban,
    Image as ImageIcon,
    LogOut,
    MessagesSquare,
    NotebookText,
    Plus,
    Quote,
    RotateCcw,
    Save,
    Settings,
    Trash2,
    Undo2,
    UserRound,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PROJECT_CATEGORIES, getCategoryLabel } from '@/lib/projectMeta';
import { DEFAULT_HERO } from '@/lib/defaults';
import { getVideoEmbedUrl } from '@/lib/heroMedia';
import { PROJECT_ICON_NAMES } from '@/components/projectIcons';
import './admin.css';

const SECTIONS = [
    { id: 'hero', label: '첫 화면 슬라이드', description: '영상·현장 사진·글귀', icon: ImageIcon },
    { id: 'profile', label: '기본 정보', description: '이름, 소개, 연락처', icon: UserRound },
    { id: 'philosophy', label: '일하는 원칙', description: '나를 설명하는 가치', icon: Compass },
    { id: 'projects', label: '프로젝트', description: '만든 도구와 서비스', icon: FolderKanban },
    { id: 'experiences', label: '경력', description: '소속과 주요 역할', icon: BriefcaseBusiness },
    { id: 'stories', label: '기록', description: '글과 현장 이야기', icon: NotebookText },
    { id: 'guestbook', label: '방명록', description: '방문자 메시지 관리', icon: MessagesSquare },
    { id: 'settings', label: '설정', description: '기본 데이터로 초기화', icon: Settings },
];

const toLines = (value) => (Array.isArray(value) ? value.join('\n') : '');
const fromLines = (text) => text.split('\n').map((line) => line.trim()).filter(Boolean);
const HERO_TYPE_LABELS = { image: '이미지', video: '동영상', quote: '글귀' };

const normalizePortfolio = (json) => ({
    ...json,
    hero: {
        ...DEFAULT_HERO,
        ...(json.hero || {}),
        slides: Array.isArray(json.hero?.slides) ? json.hero.slides : DEFAULT_HERO.slides,
    },
    profile: { stats: [], ...(json.profile || {}) },
    philosophy: json.philosophy || [],
    projects: json.projects || [],
    experiences: json.experiences || [],
    stories: json.stories || [],
    guestbook: json.guestbook || [],
});

/** 라벨과 입력칸을 함께 묶어주는 작은 헬퍼입니다. */
function Field({ label, hint, wide = false, children }) {
    return (
        <label className={`admin-field${wide ? ' admin-span-all' : ''}`}>
            <span>{label}{hint && <em>{hint}</em>}</span>
            {children}
        </label>
    );
}

function SlidePreview({ slide }) {
    const embedUrl = slide.type === 'video'
        ? getVideoEmbedUrl(slide.url, { autoplay: false, loop: false })
        : null;

    return (
        <div className="admin-media-preview">
            {slide.type === 'quote' ? (
                <div className="admin-quote-preview">
                    <Quote size={28} aria-hidden="true" />
                    <strong>{slide.title || '글귀를 입력해주세요.'}</strong>
                    {slide.description && <span>{slide.description}</span>}
                </div>
            ) : !slide.url ? (
                <div className="admin-media-empty">
                    {slide.type === 'video' ? <Film size={26} /> : <ImageIcon size={26} />}
                    <strong>미디어 주소를 입력해주세요</strong>
                    <span>주소를 입력하기 전까지 이 슬라이드는 사이트에서 숨겨집니다.</span>
                </div>
            ) : slide.type === 'image' ? (
                <img src={slide.url} alt="히어로 이미지 미리보기" />
            ) : embedUrl ? (
                <iframe src={embedUrl} title="히어로 동영상 미리보기" allow="encrypted-media; picture-in-picture" allowFullScreen />
            ) : (
                <video src={slide.url} poster={slide.poster || undefined} controls preload="metadata" />
            )}
        </div>
    );
}

/** 반복 항목 하나를 감싸며 순서 이동·삭제 버튼을 제공합니다. */
function ItemCard({ label, title, index, total, onMove, onRemove, children }) {
    return (
        <details className="admin-item" defaultOpen={index === 0}>
            <summary className="admin-item-head">
                <span className="admin-item-heading">
                    <span className="admin-item-label">{label} {index + 1}</span>
                    <strong>{title || `새 ${label}`}</strong>
                </span>
                <div className="admin-item-tools" onClick={(event) => event.stopPropagation()}>
                    <button type="button" title="위로 이동" aria-label={`${label} ${index + 1} 위로 이동`} disabled={index === 0} onClick={() => onMove(index, -1)}><ChevronUp size={16} /></button>
                    <button type="button" title="아래로 이동" aria-label={`${label} ${index + 1} 아래로 이동`} disabled={index === total - 1} onClick={() => onMove(index, 1)}><ChevronDown size={16} /></button>
                    <button type="button" className="is-danger" title="삭제" aria-label={`${title || label} 삭제`} onClick={() => onRemove(index)}><Trash2 size={15} /></button>
                </div>
                <ChevronDown className="admin-item-chevron" size={18} aria-hidden="true" />
            </summary>
            <div className="admin-item-content">{children}</div>
        </details>
    );
}

export default function AdminPage() {
    const [session, setSession] = useState(null);
    const [authChecked, setAuthChecked] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [data, setData] = useState(null);
    const [savedSnapshot, setSavedSnapshot] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null); // { type: 'ok' | 'error', text }
    const [activeSection, setActiveSection] = useState('hero');

    const isLoggedIn = Boolean(session);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session: current } }) => {
            setSession(current);
            setAuthChecked(true);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, current) => {
            setSession(current);
            setAuthChecked(true);
        });

        return () => subscription.unsubscribe();
    }, []);

    // 로그인 상태가 되면 저장된 내용을 불러옵니다.
    useEffect(() => {
        if (!isLoggedIn) {
            setData(null);
            return undefined;
        }

        let cancelled = false;
        (async () => {
            try {
                const response = await fetch('/api/portfolio');
                if (!response.ok) throw new Error('불러오기 실패');
                const json = await response.json();
                if (cancelled) return;
                const normalized = normalizePortfolio(json);
                setData(normalized);
                setSavedSnapshot(JSON.stringify(normalized));
            } catch (error) {
                console.error(error);
                if (!cancelled) setMessage({ type: 'error', text: '데이터를 불러오지 못했습니다.' });
            }
        })();

        return () => { cancelled = true; };
    }, [isLoggedIn]);

    const isDirty = Boolean(data && savedSnapshot && JSON.stringify(data) !== savedSnapshot);

    useEffect(() => {
        const warnBeforeLeaving = (event) => {
            if (!isDirty) return;
            event.preventDefault();
            event.returnValue = '';
        };
        window.addEventListener('beforeunload', warnBeforeLeaving);
        return () => window.removeEventListener('beforeunload', warnBeforeLeaving);
    }, [isDirty]);

    const notify = (type, text) => {
        setMessage({ type, text });
        if (type === 'ok') window.setTimeout(() => setMessage(null), 3000);
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) notify('error', `로그인 실패: ${error.message}`);
        setLoading(false);
    };

    const handleLogout = async () => {
        if (isDirty && !window.confirm('저장하지 않은 변경사항이 있습니다. 그래도 로그아웃할까요?')) return;
        await supabase.auth.signOut();
        setSession(null);
        setData(null);
    };

    /** 저장·초기화 요청에는 로그인 토큰을 함께 보냅니다. */
    const authorizedFetch = async (url, options = {}) => {
        const { data: { session: current } } = await supabase.auth.getSession();
        if (!current?.access_token) throw new Error('로그인이 만료되었습니다. 다시 로그인해주세요.');
        return fetch(url, {
            ...options,
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${current.access_token}`, ...options.headers },
        });
    };

    const saveChanges = async () => {
        setLoading(true);
        setMessage(null);
        try {
            const response = await authorizedFetch('/api/portfolio', { method: 'POST', body: JSON.stringify(data) });
            const result = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(result.error || '저장에 실패했습니다.');
            setSavedSnapshot(JSON.stringify(data));
            notify('ok', '변경사항을 저장했습니다.');
        } catch (error) {
            notify('error', error.message);
        }
        setLoading(false);
    };

    const resetToBundled = async () => {
        if (!window.confirm('저장된 내용을 지우고 data/portfolio.json의 기본값으로 되돌립니다. 계속할까요?')) return;
        setLoading(true);
        try {
            const response = await authorizedFetch('/api/setup/migrate', { method: 'POST' });
            const result = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(result.error || '초기화에 실패했습니다.');
            const refreshed = await fetch('/api/portfolio');
            if (!refreshed.ok) throw new Error('초기화 후 데이터를 다시 불러오지 못했습니다.');
            const json = await refreshed.json();
            const normalized = normalizePortfolio(json);
            setData(normalized);
            setSavedSnapshot(JSON.stringify(normalized));
            notify('ok', '기본 데이터로 되돌렸습니다.');
        } catch (error) {
            notify('error', error.message);
        }
        setLoading(false);
    };

    /* ── 데이터 수정 헬퍼 ───────────────────────────── */
    const updateHero = (key, value) =>
        setData((prev) => ({ ...prev, hero: { ...prev.hero, [key]: value } }));

    const mutateHeroSlides = (mutate) =>
        setData((prev) => ({
            ...prev,
            hero: { ...prev.hero, slides: mutate([...(prev.hero.slides || [])]) },
        }));

    const updateHeroSlide = (index, patch) =>
        mutateHeroSlides((slides) => {
            slides[index] = { ...slides[index], ...patch };
            return slides;
        });

    const addHeroSlide = (type) => {
        const typeLabel = HERO_TYPE_LABELS[type];
        mutateHeroSlides((slides) => [...slides, {
            id: `hero-${type}-${Date.now()}`,
            type,
            eyebrow: type === 'image' ? 'LECTURE & COMMUNITY' : type === 'video' ? 'FIELD FILM' : 'FIELD NOTE',
            title: '',
            description: '',
            url: '',
            poster: '',
            alt: '',
        }]);
        notify('ok', `${typeLabel} 슬라이드를 추가했습니다.`);
        window.setTimeout(() => {
            const items = document.querySelectorAll('#hero details.admin-item');
            const newItem = items[items.length - 1];
            if (!newItem) return;
            newItem.open = true;
            newItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 0);
    };

    const removeHeroSlide = (index) => {
        if (!window.confirm('이 슬라이드를 삭제할까요?')) return;
        mutateHeroSlides((slides) => slides.filter((_, slideIndex) => slideIndex !== index));
    };

    const moveHeroSlide = (index, delta) =>
        mutateHeroSlides((slides) => {
            const target = index + delta;
            if (target < 0 || target >= slides.length) return slides;
            [slides[index], slides[target]] = [slides[target], slides[index]];
            return slides;
        });

    const updateProfile = (key, value) =>
        setData((prev) => ({ ...prev, profile: { ...prev.profile, [key]: value } }));

    const mutateList = (key, mutate) =>
        setData((prev) => ({ ...prev, [key]: mutate([...(prev[key] || [])]) }));

    const updateItem = (key, index, patch) =>
        mutateList(key, (list) => {
            list[index] = { ...list[index], ...patch };
            return list;
        });

    const addItem = (key, template) => mutateList(key, (list) => [...list, template]);

    const removeItem = (key, index) => {
        if (!window.confirm('이 항목을 삭제할까요?')) return;
        mutateList(key, (list) => list.filter((_, i) => i !== index));
    };

    const moveItem = (key, index, delta) =>
        mutateList(key, (list) => {
            const target = index + delta;
            if (target < 0 || target >= list.length) return list;
            [list[index], list[target]] = [list[target], list[index]];
            return list;
        });

    const discardChanges = () => {
        if (!isDirty || !window.confirm('저장하지 않은 변경사항을 모두 취소할까요?')) return;
        setData(JSON.parse(savedSnapshot));
        notify('ok', '저장 전 상태로 되돌렸습니다.');
    };

    const getSectionCount = (id) => {
        if (id === 'hero') return heroSlides.length;
        if (['philosophy', 'projects', 'experiences', 'stories', 'guestbook'].includes(id)) return data[id].length;
        return null;
    };

    const goToSection = (id) => {
        setActiveSection(id);
        window.requestAnimationFrame(() => {
            document.querySelector('.admin-main')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    };

    /* ── 화면 ──────────────────────────────────────── */
    if (!authChecked) {
        return <div className="admin-center">확인 중…</div>;
    }

    if (!session) {
        return (
            <div className="admin-login">
                <div className="admin-login-card">
                    <span className="brand-mark" aria-hidden="true">P/J</span>
                    <h1>포트폴리오 관리자</h1>
                    <p>Supabase 계정으로 로그인하면 사이트 내용을 수정할 수 있습니다.</p>

                    {message?.type === 'error' && (
                        <div className="form-status form-status--error" role="status"><span>{message.text}</span></div>
                    )}

                    <form onSubmit={handleLogin}>
                        <div className="form-field">
                            <label htmlFor="admin-email">이메일</label>
                            <input id="admin-email" type="email" autoComplete="username" value={email}
                                onChange={(event) => setEmail(event.target.value)} placeholder="admin@example.com" required />
                        </div>
                        <div className="form-field">
                            <label htmlFor="admin-password">비밀번호</label>
                            <input id="admin-password" type="password" autoComplete="current-password" value={password}
                                onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" required />
                        </div>
                        <button className="button button--primary" type="submit" disabled={loading}>
                            {loading ? '로그인 중…' : '로그인'}
                        </button>
                    </form>

                    <Link className="admin-back" href="/">사이트로 돌아가기</Link>
                </div>
            </div>
        );
    }

    if (!data) return <div className="admin-center">데이터를 불러오는 중…</div>;

    const profile = data.profile || {};
    const hero = data.hero || DEFAULT_HERO;
    const heroSlides = hero.slides || [];

    return (
        <div className="admin-shell">
            <header className="admin-topbar">
                <div className="admin-topbar-inner">
                    <div className="admin-title">
                        <span className="brand-mark" aria-hidden="true">P/J</span>
                        <strong>포트폴리오 관리자</strong>
                    </div>
                    <div className="admin-actions">
                        <span className={`admin-save-state${isDirty ? ' is-dirty' : ''}`} aria-live="polite">
                            {isDirty ? <><span className="admin-status-dot" /> 저장하지 않은 변경사항</> : <><Check size={15} /> 모두 저장됨</>}
                        </span>
                        <Link className="button button--secondary button--small" href="/" target="_blank" rel="noreferrer">
                            <ExternalLink size={16} /> 사이트 보기
                        </Link>
                        {isDirty && (
                            <button className="button button--ghost button--small" type="button" onClick={discardChanges} disabled={loading}>
                                <Undo2 size={16} /> 변경 취소
                            </button>
                        )}
                        <button className="button button--primary button--small" type="button" onClick={saveChanges} disabled={loading || !isDirty}>
                            <Save size={16} /> {loading ? '저장 중…' : '저장하기'}
                        </button>
                        <button className="admin-icon-button" type="button" onClick={handleLogout} title="로그아웃" aria-label="로그아웃"><LogOut size={18} /></button>
                    </div>
                </div>
            </header>

            {message && (
                <div className={`admin-toast admin-toast--${message.type}`} role="status">
                    {message.type === 'ok' && <Check size={17} />}{message.text}
                </div>
            )}

            <div className="admin-body">
                <nav className="admin-nav" aria-label="관리 항목">
                    {SECTIONS.map((section) => (
                        <button
                            className={activeSection === section.id ? 'is-active' : ''}
                            type="button"
                            key={section.id}
                            onClick={() => goToSection(section.id)}
                        >
                            <section.icon size={19} aria-hidden="true" />
                            <span>
                                <strong>{section.label}</strong>
                                <small>{section.description}</small>
                            </span>
                            {getSectionCount(section.id) !== null && <b>{getSectionCount(section.id)}</b>}
                        </button>
                    ))}
                </nav>

                <main className="admin-main">
                    <div className="admin-workspace-head">
                        <span>사이트 내용 관리</span>
                        <h1>{SECTIONS.find((section) => section.id === activeSection)?.label} 수정</h1>
                        <p>여기에서 {SECTIONS.find((section) => section.id === activeSection)?.description} 내용을 수정합니다. 입력한 내용은 저장하기를 눌러야 사이트에 반영됩니다.</p>
                    </div>
                    {/* 첫 화면 */}
                    <section className={`admin-card${activeSection === 'hero' ? ' is-active' : ''}`} id="hero">
                        <div className="admin-card-head">
                            <div>
                                <h2>첫 화면 슬라이드</h2>
                                <p>위에 있는 슬라이드부터 영상·사진·글귀가 자동으로 재생됩니다.</p>
                            </div>
                            <div className="admin-add-group">
                                <button className="button button--soft button--small" type="button" onClick={() => addHeroSlide('video')}><Film size={16} /> 영상</button>
                                <button className="button button--soft button--small" type="button" onClick={() => addHeroSlide('image')}><ImageIcon size={16} /> 이미지</button>
                                <button className="button button--soft button--small" type="button" onClick={() => addHeroSlide('quote')}><Quote size={16} /> 글귀</button>
                            </div>
                        </div>

                        <div className="admin-hero-settings">
                            <label className="admin-check">
                                <input type="checkbox" checked={Boolean(hero.autoplay)} onChange={(e) => updateHero('autoplay', e.target.checked)} />
                                슬라이드 자동 재생
                            </label>
                            <Field label="슬라이드 전환 시간">
                                <select value={Number(hero.interval) || 7000} onChange={(e) => updateHero('interval', Number(e.target.value))}>
                                    <option value="5000">5초</option>
                                    <option value="7000">7초</option>
                                    <option value="10000">10초</option>
                                    <option value="15000">15초</option>
                                </select>
                            </Field>
                        </div>

                        <p className="admin-slide-guide">이미지·영상은 주소를, 글귀는 내용을 입력해야 사이트에 표시됩니다. 준비 중인 빈 슬라이드는 자동으로 숨겨집니다.</p>

                        <div className="admin-list admin-slide-list">
                            {heroSlides.map((slide, index) => (
                                <ItemCard
                                    label={`${HERO_TYPE_LABELS[slide.type] || '일반'} 슬라이드`}
                                    title={slide.title}
                                    key={slide.id || index}
                                    index={index}
                                    total={heroSlides.length}
                                    onMove={(slideIndex, delta) => moveHeroSlide(slideIndex, delta)}
                                    onRemove={(slideIndex) => removeHeroSlide(slideIndex)}
                                >
                                    <div className="admin-slide-editor">
                                        <div className="admin-grid">
                                            <Field label="작은 분류 문구" hint="슬라이드 위쪽에 작게 표시">
                                                <input value={slide.eyebrow || ''} onChange={(e) => updateHeroSlide(index, { eyebrow: e.target.value })} placeholder="예: LECTURE & COMMUNITY" />
                                            </Field>
                                            <Field label="슬라이드 종류">
                                                <select value={slide.type || 'quote'} onChange={(e) => updateHeroSlide(index, { type: e.target.value })}>
                                                    <option value="video">동영상</option>
                                                    <option value="image">이미지</option>
                                                    <option value="quote">글귀</option>
                                                </select>
                                            </Field>
                                            <Field label={slide.type === 'quote' ? '글귀' : '제목'} wide>
                                                <textarea value={slide.title || ''} onChange={(e) => updateHeroSlide(index, { title: e.target.value })} placeholder={slide.type === 'quote' ? '첫 화면에 크게 보여줄 글귀를 입력해주세요.' : '사진이나 영상을 설명하는 제목'} />
                                            </Field>
                                            <Field label="설명" wide>
                                                <textarea value={slide.description || ''} onChange={(e) => updateHeroSlide(index, { description: e.target.value })} placeholder="제목 아래에 표시할 짧은 설명" />
                                            </Field>
                                            {slide.type !== 'quote' && (
                                                <Field
                                                    label={slide.type === 'video' ? '동영상 주소' : '이미지 주소'}
                                                    hint={slide.type === 'video' ? 'YouTube·Vimeo·MP4·WebM 지원' : 'JPG·PNG·WebP 권장'}
                                                    wide
                                                >
                                                    <input
                                                        value={slide.url || ''}
                                                        onChange={(e) => updateHeroSlide(index, { url: e.target.value })}
                                                        placeholder={slide.type === 'video' ? 'https://youtu.be/... 또는 /videos/intro.mp4' : 'https://... 또는 /images/lecture.webp'}
                                                    />
                                                </Field>
                                            )}
                                            {slide.type === 'video' && (
                                                <Field label="영상 표지 이미지" hint="직접 동영상 파일일 때 사용" wide>
                                                    <input value={slide.poster || ''} onChange={(e) => updateHeroSlide(index, { poster: e.target.value })} placeholder="/images/video-poster.webp" />
                                                </Field>
                                            )}
                                            {slide.type !== 'quote' && (
                                                <Field label="대체 설명" hint="사진·영상을 볼 수 없는 방문자에게 전달" wide>
                                                    <input value={slide.alt || ''} onChange={(e) => updateHeroSlide(index, { alt: e.target.value })} placeholder="강의 중인 사회복지사와 참여자들의 모습" />
                                                </Field>
                                            )}
                                        </div>

                                        <div>
                                            <span className="admin-preview-label">슬라이드 미리보기 · 가로 이미지 권장</span>
                                            <SlidePreview slide={slide} />
                                        </div>
                                    </div>
                                </ItemCard>
                            ))}
                            {heroSlides.length === 0 && <p className="admin-empty">슬라이드가 없습니다. 위 버튼에서 영상, 이미지 또는 글귀를 추가해주세요.</p>}
                        </div>
                    </section>

                    {/* 기본 정보 */}
                    <section className={`admin-card${activeSection === 'profile' ? ' is-active' : ''}`} id="profile">
                        <div className="admin-card-head">
                            <div>
                                <h2>기본 정보</h2>
                                <p>첫 화면과 문의 영역에 표시되는 정보입니다.</p>
                            </div>
                        </div>
                        <div className="admin-grid">
                            <Field label="이름">
                                <input value={profile.name || ''} onChange={(e) => updateProfile('name', e.target.value)} placeholder="예: 박주임 (Ju-im Park)" />
                            </Field>
                            <Field label="직함">
                                <input value={profile.role || ''} onChange={(e) => updateProfile('role', e.target.value)} placeholder="예: 사회복지사 & 스마트워크 빌더" />
                            </Field>
                            <Field label="도메인">
                                <input value={profile.domain || ''} onChange={(e) => updateProfile('domain', e.target.value)} placeholder="parkjuim90.cloud" />
                            </Field>
                            <Field label="활동 지역">
                                <input value={profile.location || ''} onChange={(e) => updateProfile('location', e.target.value)} placeholder="강원특별자치도 원주시" />
                            </Field>
                            <Field label="이메일">
                                <input type="email" value={profile.email || ''} onChange={(e) => updateProfile('email', e.target.value)} placeholder="hello@example.com" />
                            </Field>
                            <Field label="전화번호" hint="(화면에는 표시되지 않습니다)">
                                <input value={profile.phone || ''} onChange={(e) => updateProfile('phone', e.target.value)} placeholder="010-0000-0000" />
                            </Field>
                            <Field label="블로그 주소" hint="(비우면 문의 영역에서 숨겨집니다)">
                                <input value={profile.blog || ''} onChange={(e) => updateProfile('blog', e.target.value)} placeholder="https://blog.naver.com/..." />
                            </Field>
                            <Field label="GitHub 주소">
                                <input value={profile.github || ''} onChange={(e) => updateProfile('github', e.target.value)} placeholder="https://github.com/..." />
                            </Field>
                            <Field label="소개글" wide>
                                <textarea value={profile.introduction || ''} onChange={(e) => updateProfile('introduction', e.target.value)} placeholder="어떤 일을 하는 사람인지 2~3문장으로 소개해주세요." />
                            </Field>
                        </div>
                    </section>

                    {/* 일하는 원칙 */}
                    <section className={`admin-card${activeSection === 'philosophy' ? ' is-active' : ''}`} id="philosophy">
                        <div className="admin-card-head">
                            <div>
                                <h2>일하는 원칙</h2>
                                <p>2열 격자로 표시되므로 4개 단위가 가장 보기 좋습니다.</p>
                            </div>
                            <button className="button button--soft button--small" type="button"
                                onClick={() => addItem('philosophy', { id: Date.now(), title: '', subtitle: '', desc: '' })}>
                                <Plus size={16} /> 원칙 추가
                            </button>
                        </div>
                        <div className="admin-list">
                            {data.philosophy.map((item, index) => (
                                <ItemCard
                                    label="원칙" title={item.title} key={item.id || index} index={index} total={data.philosophy.length}
                                    onMove={(i, delta) => moveItem('philosophy', i, delta)}
                                    onRemove={(i) => removeItem('philosophy', i)}
                                >
                                    <div className="admin-grid">
                                        <Field label="영문 소제목">
                                            <input value={item.subtitle || ''} onChange={(e) => updateItem('philosophy', index, { subtitle: e.target.value })} placeholder="Human-First Efficiency" />
                                        </Field>
                                        <Field label="제목">
                                            <input value={item.title || ''} onChange={(e) => updateItem('philosophy', index, { title: e.target.value })} placeholder="행정을 줄여 사람을 봅니다" />
                                        </Field>
                                        <Field label="설명" wide>
                                            <textarea value={item.desc || ''} onChange={(e) => updateItem('philosophy', index, { desc: e.target.value })} />
                                        </Field>
                                    </div>
                                </ItemCard>
                            ))}
                            {data.philosophy.length === 0 && <p className="admin-empty">등록된 원칙이 없습니다.</p>}
                        </div>
                    </section>

                    {/* 프로젝트 */}
                    <section className={`admin-card${activeSection === 'projects' ? ' is-active' : ''}`} id="projects">
                        <div className="admin-card-head">
                            <div>
                                <h2>프로젝트</h2>
                                <p>‘대표 프로젝트’로 표시하면 카드가 두 칸 너비로 커집니다.</p>
                            </div>
                            <button className="button button--soft button--small" type="button"
                                onClick={() => addItem('projects', {
                                    id: `project-${Date.now()}`,
                                    category: PROJECT_CATEGORIES[0].id,
                                    categoryLabel: PROJECT_CATEGORIES[0].label,
                                    title: '', subtitle: '', summary: '', description: '',
                                    highlights: [], techStack: [], link: '#', badge: '', icon: PROJECT_ICON_NAMES[0],
                                })}>
                                <Plus size={16} /> 프로젝트 추가
                            </button>
                        </div>
                        <div className="admin-list">
                            {data.projects.map((project, index) => (
                                <ItemCard
                                    label="프로젝트" title={project.title} key={project.id || index} index={index} total={data.projects.length}
                                    onMove={(i, delta) => moveItem('projects', i, delta)}
                                    onRemove={(i) => removeItem('projects', i)}
                                >
                                    <div className="admin-grid">
                                        <Field label="제목">
                                            <input value={project.title || ''} onChange={(e) => updateItem('projects', index, { title: e.target.value })} />
                                        </Field>
                                        <Field label="영문 부제">
                                            <input value={project.subtitle || ''} onChange={(e) => updateItem('projects', index, { subtitle: e.target.value })} />
                                        </Field>
                                        <Field label="카테고리">
                                            <select
                                                value={project.category || ''}
                                                onChange={(e) => updateItem('projects', index, {
                                                    category: e.target.value,
                                                    categoryLabel: getCategoryLabel(e.target.value),
                                                })}
                                            >
                                                {PROJECT_CATEGORIES.map((category) => (
                                                    <option value={category.id} key={category.id}>{category.label}</option>
                                                ))}
                                            </select>
                                        </Field>
                                        <Field label="아이콘">
                                            <select value={project.icon || ''} onChange={(e) => updateItem('projects', index, { icon: e.target.value })}>
                                                {PROJECT_ICON_NAMES.map((name) => <option value={name} key={name}>{name}</option>)}
                                            </select>
                                        </Field>
                                        <Field label="배지" hint="(카드 오른쪽 위 라벨)">
                                            <input value={project.badge || ''} onChange={(e) => updateItem('projects', index, { badge: e.target.value })} placeholder="실무 도입 완료" />
                                        </Field>
                                        <Field label="링크" hint="(없으면 # 그대로)">
                                            <input value={project.link || ''} onChange={(e) => updateItem('projects', index, { link: e.target.value })} placeholder="https://..." />
                                        </Field>
                                        <Field label="한 줄 요약" wide>
                                            <textarea value={project.summary || ''} onChange={(e) => updateItem('projects', index, { summary: e.target.value })} />
                                        </Field>
                                        <Field label="상세 설명" hint="(자세히 보기 창에 표시)" wide>
                                            <textarea value={project.description || ''} onChange={(e) => updateItem('projects', index, { description: e.target.value })} />
                                        </Field>
                                        <Field label="주요 기능" hint="한 줄에 하나씩">
                                            <textarea value={toLines(project.highlights)} onChange={(e) => updateItem('projects', index, { highlights: fromLines(e.target.value) })} />
                                        </Field>
                                        <Field label="기술 스택" hint="한 줄에 하나씩">
                                            <textarea value={toLines(project.techStack)} onChange={(e) => updateItem('projects', index, { techStack: fromLines(e.target.value) })} />
                                        </Field>
                                        <div className="admin-span-all">
                                            <label className="admin-check">
                                                <input
                                                    type="checkbox"
                                                    checked={project.featured ?? Boolean(project.badge?.includes('★'))}
                                                    onChange={(e) => updateItem('projects', index, { featured: e.target.checked })}
                                                />
                                                대표 프로젝트로 크게 표시하기
                                            </label>
                                        </div>
                                    </div>
                                </ItemCard>
                            ))}
                            {data.projects.length === 0 && <p className="admin-empty">등록된 프로젝트가 없습니다.</p>}
                        </div>
                    </section>

                    {/* 경력 */}
                    <section className={`admin-card${activeSection === 'experiences' ? ' is-active' : ''}`} id="experiences">
                        <div className="admin-card-head">
                            <div>
                                <h2>경력</h2>
                                <p>위에 있는 항목이 먼저 표시됩니다.</p>
                            </div>
                            <button className="button button--soft button--small" type="button"
                                onClick={() => addItem('experiences', { id: Date.now(), period: '', company: '', role: '', description: '', tags: [] })}>
                                <Plus size={16} /> 경력 추가
                            </button>
                        </div>
                        <div className="admin-list">
                            {data.experiences.map((experience, index) => (
                                <ItemCard
                                    label="경력" title={experience.company || experience.role} key={experience.id || index} index={index} total={data.experiences.length}
                                    onMove={(i, delta) => moveItem('experiences', i, delta)}
                                    onRemove={(i) => removeItem('experiences', i)}
                                >
                                    <div className="admin-grid">
                                        <Field label="기간">
                                            <input value={experience.period || ''} onChange={(e) => updateItem('experiences', index, { period: e.target.value })} placeholder="2018 - 현재" />
                                        </Field>
                                        <Field label="소속">
                                            <input value={experience.company || ''} onChange={(e) => updateItem('experiences', index, { company: e.target.value })} />
                                        </Field>
                                        <Field label="역할" wide>
                                            <input value={experience.role || ''} onChange={(e) => updateItem('experiences', index, { role: e.target.value })} />
                                        </Field>
                                        <Field label="설명" wide>
                                            <textarea value={experience.description || ''} onChange={(e) => updateItem('experiences', index, { description: e.target.value })} />
                                        </Field>
                                        <Field label="태그" hint="한 줄에 하나씩" wide>
                                            <textarea value={toLines(experience.tags)} onChange={(e) => updateItem('experiences', index, { tags: fromLines(e.target.value) })} />
                                        </Field>
                                    </div>
                                </ItemCard>
                            ))}
                            {data.experiences.length === 0 && <p className="admin-empty">등록된 경력이 없습니다.</p>}
                        </div>
                    </section>

                    {/* 기록 */}
                    <section className={`admin-card${activeSection === 'stories' ? ' is-active' : ''}`} id="stories">
                        <div className="admin-card-head">
                            <div>
                                <h2>기록</h2>
                                <p>첫 번째 글이 두 칸 너비로 크게 표시됩니다.</p>
                            </div>
                            <button className="button button--soft button--small" type="button"
                                onClick={() => addItem('stories', { id: Date.now(), tag: '', date: '', readTime: '3분', title: '', content: '', likes: 0, link: '' })}>
                                <Plus size={16} /> 기록 추가
                            </button>
                        </div>
                        <div className="admin-list">
                            {data.stories.map((story, index) => (
                                <ItemCard
                                    label="기록" title={story.title} key={story.id || index} index={index} total={data.stories.length}
                                    onMove={(i, delta) => moveItem('stories', i, delta)}
                                    onRemove={(i) => removeItem('stories', i)}
                                >
                                    <div className="admin-grid admin-grid--three">
                                        <Field label="분류">
                                            <input value={story.tag || ''} onChange={(e) => updateItem('stories', index, { tag: e.target.value })} placeholder="개발기" />
                                        </Field>
                                        <Field label="날짜">
                                            <input value={story.date || ''} onChange={(e) => updateItem('stories', index, { date: e.target.value })} placeholder="2026.08" />
                                        </Field>
                                        <Field label="읽는 시간">
                                            <input value={story.readTime || ''} onChange={(e) => updateItem('stories', index, { readTime: e.target.value })} placeholder="3분" />
                                        </Field>
                                    </div>
                                    <div className="admin-grid">
                                        <Field label="제목" wide>
                                            <input value={story.title || ''} onChange={(e) => updateItem('stories', index, { title: e.target.value })} />
                                        </Field>
                                        <Field label="내용" wide>
                                            <textarea value={story.content || ''} onChange={(e) => updateItem('stories', index, { content: e.target.value })} />
                                        </Field>
                                        <Field label="원문 링크" hint="(입력하면 ‘기록 읽기’가 나타납니다)">
                                            <input value={story.link || ''} onChange={(e) => updateItem('stories', index, { link: e.target.value })} placeholder="https://..." />
                                        </Field>
                                        <Field label="공감 수">
                                            <input type="number" min="0" value={story.likes ?? 0}
                                                onChange={(e) => updateItem('stories', index, { likes: Number(e.target.value) || 0 })} />
                                        </Field>
                                    </div>
                                </ItemCard>
                            ))}
                            {data.stories.length === 0 && <p className="admin-empty">등록된 기록이 없습니다.</p>}
                        </div>
                    </section>

                    {/* 방명록 */}
                    <section className={`admin-card${activeSection === 'guestbook' ? ' is-active' : ''}`} id="guestbook">
                        <div className="admin-card-head">
                            <div>
                                <h2>방명록</h2>
                                <p>방문자가 남긴 글입니다. 부적절한 글은 삭제할 수 있습니다.</p>
                            </div>
                        </div>
                        <div className="admin-list">
                            {data.guestbook.map((entry, index) => (
                                <div className="admin-item" key={entry.id || index}>
                                    <div className="admin-item-head">
                                        <span className="admin-item-label">{entry.emoji || '💬'} {entry.author} · {entry.date}</span>
                                        <div className="admin-item-tools">
                                            <button type="button" className="is-danger" onClick={() => removeItem('guestbook', index)}>삭제</button>
                                        </div>
                                    </div>
                                    <p className="admin-guest-message">{entry.message}</p>
                                </div>
                            ))}
                            {data.guestbook.length === 0 && <p className="admin-empty">아직 남겨진 메시지가 없습니다.</p>}
                        </div>

                        <p className="admin-note">
                            삭제한 뒤에도 <strong>[변경사항 저장]</strong>을 눌러야 사이트에 반영됩니다.
                        </p>
                    </section>

                    <section className={`admin-card admin-danger-zone${activeSection === 'settings' ? ' is-active' : ''}`} id="settings">
                        <div className="admin-card-head">
                            <div>
                                <h2>초기화</h2>
                                <p>저장된 내용을 모두 지우고 코드에 들어 있는 기본 데이터로 되돌립니다.</p>
                            </div>
                            <button className="button button--secondary button--small" type="button" onClick={resetToBundled} disabled={loading}>
                                <RotateCcw size={16} /> 기본 데이터로 되돌리기
                            </button>
                        </div>
                        <p className="admin-note">되돌린 내용은 복구할 수 없으니 주의해주세요.</p>
                    </section>
                </main>
            </div>
        </div>
    );
}
