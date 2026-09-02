'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminPage() {
    const [session, setSession] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [activeSection, setActiveSection] = useState('basic');

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) fetchData();
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session && !data) fetchData();
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) alert('로그인 실패: ' + error.message);
        setLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setSession(null);
        setData(null);
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/portfolio');
            if (res.ok) {
                const json = await res.json();
                setData({
                    name: json.name || "",
                    role: json.role || "",
                    introduction: json.introduction || "",
                    profileImage: json.profileImage || "",
                    contact: json.contact || {},
                    experiences: json.experiences || [],
                    projects: json.projects || [],
                    education: json.education || [],
                    skills: json.skills || [],
                    otherSkills: json.otherSkills || []
                });
            } else {
                setData({
                    name: "", role: "", introduction: "", profileImage: "", contact: {},
                    experiences: [], projects: [], education: [], skills: [], otherSkills: []
                });
            }
        } catch (err) {
            console.error(err);
            alert('데이터를 불러오는데 실패했습니다.');
        }
        setLoading(false);
    };

    const saveChanges = async () => {
        setLoading(true);
        setMessage('');
        try {
            const res = await fetch('/api/portfolio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (res.ok) {
                setMessage('✅ 저장 완료');
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage('❌ 저장 실패');
            }
        } catch (err) {
            console.error(err);
            setMessage('❌ 오류 발생');
        }
        setLoading(false);
    };

    /* Data Handlers */
    const handleBasicChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const handleContactChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, contact: { ...prev.contact, [name]: value } }));
    };

    const handleArrayChange = (arrayName, index, field, value) => {
        setData(prev => {
            const newArray = [...(prev[arrayName] || [])];
            newArray[index] = { ...newArray[index], [field]: value };
            return { ...prev, [arrayName]: newArray };
        });
    };

    const handleFlatArrayChange = (arrayName, index, value) => {
        setData(prev => {
            const newArray = [...(prev[arrayName] || [])];
            newArray[index] = value;
            return { ...prev, [arrayName]: newArray };
        });
    };

    const addArrayItem = (arrayName, template) => {
        setData(prev => ({ ...prev, [arrayName]: [...(prev[arrayName] || []), template] }));
    };

    const removeArrayItem = (arrayName, index) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;
        setData(prev => {
            const newArray = [...(prev[arrayName] || [])];
            newArray.splice(index, 1);
            return { ...prev, [arrayName]: newArray };
        });
    };


    /* Render */
    if (!session) {
        return (
            <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color, #F1F3F9)' }}>
                <div style={{ background: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px' }}>
                    <h1 style={{ marginBottom: '2rem', textAlign: 'center', fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.03em' }}>포트폴리오 관리자</h1>
                    <form onSubmit={handleLogin}>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#4B5563' }}>이메일</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', outline: 'none' }} placeholder="admin@example.com" />
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#4B5563' }}>비밀번호</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', outline: 'none' }} placeholder="••••••••" />
                        </div>
                        <button type="submit" style={{ width: '100%', padding: '12px', background: '#1F2937', color: '#fff', borderRadius: '8px', fontWeight: '700', border: 'none', cursor: 'pointer' }} disabled={loading}>
                            {loading ? '로그인 중...' : '로그인'}
                        </button>
                    </form>
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <Link href="/" style={{ fontSize: '0.9rem', color: '#9CA3AF', textDecoration: 'underline' }}>사이트로 돌아가기</Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!data) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>데이터를 불러오는 중...</div>;

    const navItems = [
        { id: 'basic', label: '기본 정보' },
        { id: 'contact', label: '연락처' },
        { id: 'experience', label: '경력 사항' },
        { id: 'projects', label: '추가 프로젝트' },
        { id: 'education', label: '학력' },
        { id: 'skills', label: '보유 스킬' }
    ];

    const scrollToSection = (id) => {
        setActiveSection(id);
        const el = document.getElementById(id);
        if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    // Helper UI styles
    const cardStyle = { background: '#fff', borderRadius: '16px', padding: '32px', marginBottom: '40px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' };
    const sectionTitleStyle = { fontSize: '1.2rem', fontWeight: '700', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
    const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', outline: 'none', transition: 'border 0.2s', fontSize: '0.95rem' };
    const labelStyle = { display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: '600', color: '#374151' };
    const btnSecondary = { padding: '6px 16px', background: '#F3F4F6', color: '#374151', borderRadius: '6px', border: 'none', fontWeight: '600', cursor: 'pointer', fontSize: '0.85rem' };
    const btnDanger = { padding: '4px 12px', background: '#FEE2E2', color: '#DC2626', borderRadius: '6px', border: 'none', fontWeight: '600', cursor: 'pointer', fontSize: '0.8rem' };

    return (
        <div style={{ minHeight: '100vh', background: '#F9FAFB', fontFamily: "'Pretendard', sans-serif" }}>
            {/* 고정 상단바 */}
            <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #E5E7EB', padding: '16px 24px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: '800', fontSize: '1.25rem', letterSpacing: '-0.03em', color: '#111827' }}>Dash<span style={{ color: '#A855F7' }}>board</span></div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        {message && <span style={{ color: message.includes('❌') ? '#DC2626' : '#059669', fontSize: '0.9rem', fontWeight: '600' }}>{message}</span>}
                        <Link href="/" target="_blank" style={{ ...btnSecondary, textDecoration: 'none' }}>미리보기</Link>
                        <button onClick={saveChanges} style={{ padding: '8px 20px', background: '#A855F7', color: '#fff', borderRadius: '6px', border: 'none', fontWeight: '700', cursor: 'pointer' }} disabled={loading}>
                            {loading ? '저장 중...' : '변경사항 저장'}
                        </button>
                        <button onClick={handleLogout} style={{ ...btnSecondary, background: 'transparent', color: '#9CA3AF' }}>로그아웃</button>
                    </div>
                </div>
            </header>

            <div style={{ maxWidth: '1200px', margin: '40px auto 0', padding: '0 24px', display: 'flex', gap: '40px', alignItems: 'flex-start' }}>

                {/* 사이드바 (Navigation) */}
                <aside style={{ width: '220px', position: 'sticky', top: '100px', flexShrink: 0 }}>
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                style={{
                                    textAlign: 'left', padding: '10px 16px', borderRadius: '8px', transition: 'all 0.2s',
                                    background: activeSection === item.id ? '#F3E8FF' : 'transparent',
                                    color: activeSection === item.id ? '#9333EA' : '#4B5563',
                                    fontWeight: activeSection === item.id ? '700' : '500',
                                    border: 'none', cursor: 'pointer', fontSize: '0.95rem'
                                }}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* 메인 폼 영역 */}
                <main style={{ flex: 1, paddingBottom: '100px' }}>

                    {/* 1. Basic Info */}
                    <section id="basic" style={cardStyle}>
                        <div style={sectionTitleStyle}>기본 정보</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                            <div>
                                <label style={labelStyle}>이름</label>
                                <input name="name" value={data.name} onChange={handleBasicChange} style={inputStyle} placeholder="예: 이수진" />
                            </div>
                            <div>
                                <label style={labelStyle}>직업 / 타이틀</label>
                                <input name="role" value={data.role} onChange={handleBasicChange} style={inputStyle} placeholder="예: 그래픽 디자이너" />
                            </div>
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={labelStyle}>프로필 이미지 URL</label>
                            <input name="profileImage" value={data.profileImage || ''} onChange={handleBasicChange} style={inputStyle} placeholder="https://..." />
                        </div>
                        <div>
                            <label style={labelStyle}>소개글</label>
                            <textarea name="introduction" value={data.introduction} onChange={handleBasicChange} style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} placeholder="안녕하세요, 저는..." />
                        </div>
                    </section>

                    {/* 2. Contact */}
                    <section id="contact" style={cardStyle}>
                        <div style={sectionTitleStyle}>연락처 상세</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={labelStyle}>이메일</label>
                                <input name="email" value={data.contact?.email || ''} onChange={handleContactChange} style={inputStyle} placeholder="hello@example.com" />
                            </div>
                            <div>
                                <label style={labelStyle}>전화번호</label>
                                <input name="phone" value={data.contact?.phone || ''} onChange={handleContactChange} style={inputStyle} placeholder="010-0000-0000" />
                            </div>
                            <div>
                                <label style={labelStyle}>웹사이트 (블로그 등)</label>
                                <input name="blog" value={data.contact?.blog || ''} onChange={handleContactChange} style={inputStyle} placeholder="www.yourdomain.com" />
                            </div>
                        </div>
                    </section>

                    {/* 3. Experience */}
                    <section id="experience" style={cardStyle}>
                        <div style={sectionTitleStyle}>
                            <span>경력 사항</span>
                            <button onClick={() => addArrayItem('experiences', { id: Date.now(), company: '', role: '', period: '', description: '' })} style={btnSecondary}>+ 경력 추가</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {data.experiences.map((exp, idx) => (
                                <div key={exp.id || idx} style={{ padding: '20px', background: '#F9FAFB', borderRadius: '12px', border: '1px solid #F3F4F6', position: 'relative' }}>
                                    <button onClick={() => removeArrayItem('experiences', idx)} style={{ ...btnDanger, position: 'absolute', top: '16px', right: '16px' }}>삭제</button>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px', paddingRight: '60px' }}>
                                        <div>
                                            <label style={{ ...labelStyle, fontSize: '0.8rem', color: '#6B7280' }}>회사명/소속</label>
                                            <input value={exp.company || ''} onChange={(e) => handleArrayChange('experiences', idx, 'company', e.target.value)} style={inputStyle} placeholder="예: Liceria & Co." />
                                        </div>
                                        <div>
                                            <label style={{ ...labelStyle, fontSize: '0.8rem', color: '#6B7280' }}>기간</label>
                                            <input value={exp.period || ''} onChange={(e) => handleArrayChange('experiences', idx, 'period', e.target.value)} style={inputStyle} placeholder="예: 2023년 12월 - 2025년 2월" />
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={{ ...labelStyle, fontSize: '0.8rem', color: '#6B7280' }}>직급/역할</label>
                                        <input value={exp.role || ''} onChange={(e) => handleArrayChange('experiences', idx, 'role', e.target.value)} style={{ ...inputStyle, fontWeight: '600' }} placeholder="예: 디자인팀 파트장" />
                                    </div>
                                    <div>
                                        <label style={{ ...labelStyle, fontSize: '0.8rem', color: '#6B7280' }}>담당 업무 (엔터키로 구분)</label>
                                        <textarea value={exp.description || ''} onChange={(e) => handleArrayChange('experiences', idx, 'description', e.target.value)} style={{ ...inputStyle, minHeight: '80px' }} placeholder="웹사이트 구축 프로젝트&#13;&#10;로고 제작" />
                                    </div>
                                </div>
                            ))}
                            {data.experiences.length === 0 && <p style={{ color: '#9CA3AF', textAlign: 'center', padding: '20px' }}>등록된 경력이 없습니다.</p>}
                        </div>
                    </section>

                    {/* 4. Projects (Optional) */}
                    <section id="projects" style={cardStyle}>
                        <div style={sectionTitleStyle}>
                            <span>추가 프로젝트 (선택)</span>
                            <button onClick={() => addArrayItem('projects', { id: Date.now(), title: '', description: '', link: '' })} style={btnSecondary}>+ 프로젝트 추가</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {data.projects.map((proj, idx) => (
                                <div key={proj.id || idx} style={{ padding: '20px', background: '#F9FAFB', borderRadius: '12px', border: '1px solid #F3F4F6' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <input value={proj.title || ''} onChange={(e) => handleArrayChange('projects', idx, 'title', e.target.value)} style={{ ...inputStyle, width: 'calc(100% - 70px)', fontWeight: '600' }} placeholder="프로젝트 제목" />
                                        <button onClick={() => removeArrayItem('projects', idx)} style={btnDanger}>삭제</button>
                                    </div>
                                    <textarea value={proj.description || ''} onChange={(e) => handleArrayChange('projects', idx, 'description', e.target.value)} style={{ ...inputStyle, marginBottom: '12px', minHeight: '60px' }} placeholder="설명" />
                                    <input value={proj.link || ''} onChange={(e) => handleArrayChange('projects', idx, 'link', e.target.value)} style={{ ...inputStyle, fontSize: '0.85rem' }} placeholder="관련 링크 URL (선택)" />
                                </div>
                            ))}
                            {data.projects.length === 0 && <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>작성 시 하단 교육 섹션 위에 '기타 프로젝트' 항목이 표시됩니다.</p>}
                        </div>
                    </section>

                    {/* 5. Education */}
                    <section id="education" style={cardStyle}>
                        <div style={sectionTitleStyle}>
                            <span>학력</span>
                            <button onClick={() => addArrayItem('education', { id: Date.now(), school: '', details: '' })} style={btnSecondary}>+ 학력 추가</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {data.education.map((edu, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: '10px' }}>
                                    <input value={edu.school || ''} onChange={(e) => handleArrayChange('education', idx, 'school', e.target.value)} style={{ ...inputStyle, flex: 1 }} placeholder="학교명 (예: Liceria 대학원)" />
                                    <input value={edu.details || ''} onChange={(e) => handleArrayChange('education', idx, 'details', e.target.value)} style={{ ...inputStyle, flex: 2 }} placeholder="세부내용 (예: 브랜드 마케팅 전공 · 2026년 졸업)" />
                                    <button onClick={() => removeArrayItem('education', idx)} style={{ border: 'none', background: 'transparent', color: '#DC2626', fontSize: '1.2rem', cursor: 'pointer', padding: '0 8px' }}>&times;</button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 6. Skills */}
                    <section id="skills" style={cardStyle}>
                        <div style={sectionTitleStyle}><span>보유 스킬</span></div>

                        <div style={{ marginBottom: '32px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <label style={labelStyle}>디자인 스킬 (태그 형태)</label>
                                <button onClick={() => addArrayItem('skills', '')} style={btnSecondary}>+ 스킬 추가</button>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                {data.skills.map((skill, idx) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', background: '#F3F4F6', borderRadius: '20px', padding: '4px 12px', border: '1px solid #E5E7EB' }}>
                                        <input value={skill} onChange={(e) => handleFlatArrayChange('skills', idx, e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', width: '80px', fontSize: '0.9rem', textAlign: 'center' }} placeholder="스킬명" />
                                        <button onClick={() => removeArrayItem('skills', idx)} style={{ border: 'none', background: 'transparent', color: '#9CA3AF', cursor: 'pointer', marginLeft: '4px' }}>&times;</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <label style={labelStyle}>그 외 능력 (언어 등)</label>
                                <button onClick={() => addArrayItem('otherSkills', { label: '', value: '' })} style={btnSecondary}>+ 항목 추가</button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {data.otherSkills.map((os, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: '10px' }}>
                                        <input value={os.label || ''} onChange={(e) => handleArrayChange('otherSkills', idx, 'label', e.target.value)} style={{ ...inputStyle, width: '150px' }} placeholder="항목 (예: 영어 능력)" />
                                        <input value={os.value || ''} onChange={(e) => handleArrayChange('otherSkills', idx, 'value', e.target.value)} style={{ ...inputStyle, flex: 1 }} placeholder="수준 (예: 원어민 (Native))" />
                                        <button onClick={() => removeArrayItem('otherSkills', idx)} style={{ border: 'none', background: 'transparent', color: '#DC2626', fontSize: '1.2rem', cursor: 'pointer', padding: '0 8px' }}>&times;</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                </main>
            </div>
        </div>
    );
}
