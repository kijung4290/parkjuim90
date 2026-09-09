'use client';

import { LENGTH_HINTS } from '../constants';
import { Field } from '../components/Field';
import { SectionShell } from '../components/SectionShell';
import { StatsEditor } from '../components/StatsEditor';

/** 이름·연락처·소개글과 첫 화면의 활동 지표를 편집합니다. */
export function ProfileEditor({ section, active, issues, profile, mutations }) {
    const { updateProfile, stats } = mutations;
    const set = (key) => (event) => updateProfile(key, event.target.value);

    return (
        <SectionShell section={section} active={active} issues={issues}>
            <div className="admin-grid">
                <Field label="이름" required>
                    <input value={profile.name || ''} onChange={set('name')} placeholder="예: 박주임 (Ju-im Park)" />
                </Field>
                <Field label="직함" required>
                    <input value={profile.role || ''} onChange={set('role')} placeholder="예: 사회복지사 & 스마트워크 빌더" />
                </Field>
                <Field label="이메일" required hint="(문의 버튼이 이 주소로 메일을 엽니다)">
                    <input type="email" value={profile.email || ''} onChange={set('email')} placeholder="hello@example.com" />
                </Field>
                <Field label="활동 지역">
                    <input value={profile.location || ''} onChange={set('location')} placeholder="강원특별자치도 원주시" />
                </Field>
                <Field label="도메인" hint="(맨 아래 발자국에 표시)">
                    <input value={profile.domain || ''} onChange={set('domain')} placeholder="parkjuim90.cloud" />
                </Field>
                <Field label="전화번호" hint="(사이트에는 표시되지 않고 기록용으로만 보관됩니다)">
                    <input value={profile.phone || ''} onChange={set('phone')} placeholder="010-0000-0000" />
                </Field>
                <Field label="블로그 주소" hint="(비우면 문의 영역에서 숨겨집니다)">
                    <input value={profile.blog || ''} onChange={set('blog')} placeholder="https://blog.naver.com/..." />
                </Field>
                <Field label="GitHub 주소" hint="(사이트에는 아직 표시되지 않습니다)">
                    <input value={profile.github || ''} onChange={set('github')} placeholder="https://github.com/..." />
                </Field>

                <Field label="소개글" limit={LENGTH_HINTS.introduction} value={profile.introduction || ''} wide>
                    <textarea
                        value={profile.introduction || ''}
                        onChange={set('introduction')}
                        placeholder="어떤 일을 하는 사람인지 2~3문장으로 소개해주세요."
                    />
                </Field>

                <StatsEditor
                    stats={profile.stats || []}
                    onAdd={stats.add}
                    onUpdate={stats.update}
                    onRemove={stats.remove}
                    onMove={stats.move}
                />
            </div>
        </SectionShell>
    );
}
