'use client';

import { useMemo, useState } from 'react';
import { DEFAULT_HERO } from '@/lib/defaults';
import { SECTIONS } from './constants';
import { getAllIssues, countProblems } from './lib/checklist';
import { useAdminSession } from './hooks/useAdminSession';
import { useDraftMutations } from './hooks/useDraftMutations';
import { useMediaUpload } from './hooks/useMediaUpload';
import { usePortfolioDraft } from './hooks/usePortfolioDraft';
import { useToast } from './hooks/useToast';
import { AdminNav } from './components/AdminNav';
import { AdminTopbar } from './components/AdminTopbar';
import { LoginScreen } from './components/LoginScreen';
import { RecoveryBanner, Toast } from './components/Notices';
import { HeroEditor } from './sections/HeroEditor';
import { ProfileEditor } from './sections/ProfileEditor';
import { PhilosophyEditor } from './sections/PhilosophyEditor';
import { ProjectsEditor } from './sections/ProjectsEditor';
import { ExperiencesEditor } from './sections/ExperiencesEditor';
import { StoriesEditor } from './sections/StoriesEditor';
import { GuestbookEditor } from './sections/GuestbookEditor';
import { SettingsEditor } from './sections/SettingsEditor';
import './admin.css';

const sectionById = (id) => SECTIONS.find((section) => section.id === id);

/**
 * 관리자 화면의 뼈대입니다.
 *
 * 실제 편집 화면은 sections/ 아래에, 데이터를 다루는 일은 hooks/ 와 lib/ 아래에 나눠 두었습니다.
 * 여기서는 "로그인했는가 → 데이터를 불러왔는가 → 어떤 항목을 보고 있는가" 세 가지만 정리합니다.
 */
export default function AdminPage() {
    const { message, notify, dismiss } = useToast();
    const { checked, isLoggedIn, signingIn, signIn, signOut, authorizedFetch } = useAdminSession();
    const draft = usePortfolioDraft({ isLoggedIn, authorizedFetch, notify });
    const mutations = useDraftMutations(draft.setData);
    const upload = useMediaUpload({ authorizedFetch, notify });

    const [activeSection, setActiveSection] = useState('hero');
    const [loginError, setLoginError] = useState(null);

    const data = draft.data;
    const issues = useMemo(() => (data ? getAllIssues(data) : {}), [data]);
    const totalProblems = useMemo(
        () => Object.values(issues).reduce((sum, list) => sum + countProblems(list), 0),
        [issues],
    );

    const handleLogin = async (email, password) => {
        const error = await signIn(email, password);
        setLoginError(error ? `로그인 실패: ${error}` : null);
    };

    const handleLogout = async () => {
        if (draft.isDirty && !window.confirm('저장하지 않은 변경사항이 있습니다. 그래도 로그아웃할까요?')) return;
        await signOut();
    };

    const goToSection = (id) => {
        setActiveSection(id);
        window.requestAnimationFrame(() => {
            document.querySelector('.admin-main')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    };

    if (!checked) return <div className="admin-center">확인 중…</div>;
    if (!isLoggedIn) return <LoginScreen busy={signingIn} errorText={loginError} onSubmit={handleLogin} />;
    if (!data) {
        return (
            <div className="admin-center">
                {draft.status === 'error' ? '데이터를 불러오지 못했습니다. 새로고침해주세요.' : '데이터를 불러오는 중…'}
            </div>
        );
    }

    const active = sectionById(activeSection) || SECTIONS[0];
    const shared = { mutations, upload, notify };

    return (
        <div className="admin-shell">
            <AdminTopbar
                isDirty={draft.isDirty}
                busy={draft.busy}
                problemCount={totalProblems}
                lastSavedAt={draft.lastSavedAt}
                onSave={draft.save}
                onDiscard={draft.discard}
                onLogout={handleLogout}
            />

            <Toast message={message} onDismiss={dismiss} />

            <div className="admin-body">
                <AdminNav data={data} issues={issues} activeSection={activeSection} onSelect={goToSection} />

                <main className="admin-main">
                    <RecoveryBanner
                        recovered={draft.recovered}
                        onApply={draft.applyRecovered}
                        onDismiss={draft.dismissRecovered}
                    />

                    <div className="admin-workspace-head">
                        <span>사이트 내용 관리</span>
                        <h1>{active.label} 수정</h1>
                        <p>{active.guide} 입력한 내용은 <strong>[저장하기]</strong>를 눌러야 사이트에 반영됩니다.</p>
                    </div>

                    <HeroEditor
                        section={sectionById('hero')}
                        active={activeSection === 'hero'}
                        issues={issues.hero}
                        hero={data.hero || DEFAULT_HERO}
                        {...shared}
                    />
                    <ProfileEditor
                        section={sectionById('profile')}
                        active={activeSection === 'profile'}
                        issues={issues.profile}
                        profile={data.profile || {}}
                        {...shared}
                    />
                    <PhilosophyEditor
                        section={sectionById('philosophy')}
                        active={activeSection === 'philosophy'}
                        issues={issues.philosophy}
                        items={data.philosophy}
                        {...shared}
                    />
                    <ProjectsEditor
                        section={sectionById('projects')}
                        active={activeSection === 'projects'}
                        issues={issues.projects}
                        items={data.projects}
                        {...shared}
                    />
                    <ExperiencesEditor
                        section={sectionById('experiences')}
                        active={activeSection === 'experiences'}
                        issues={issues.experiences}
                        items={data.experiences}
                        {...shared}
                    />
                    <StoriesEditor
                        section={sectionById('stories')}
                        active={activeSection === 'stories'}
                        issues={issues.stories}
                        items={data.stories}
                        {...shared}
                    />
                    <GuestbookEditor
                        section={sectionById('guestbook')}
                        active={activeSection === 'guestbook'}
                        entries={data.guestbook}
                        {...shared}
                    />
                    <SettingsEditor
                        section={sectionById('settings')}
                        active={activeSection === 'settings'}
                        issues={issues}
                        busy={draft.busy}
                        onReset={draft.resetToBundled}
                        onSelectSection={goToSection}
                    />
                </main>
            </div>
        </div>
    );
}
