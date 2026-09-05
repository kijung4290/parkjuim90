'use client';

import { PROJECT_ICON_NAMES, ProjectIcon } from '@/components/projectIcons';

/**
 * 프로젝트 카드에 붙일 아이콘을 눈으로 보고 고릅니다.
 * 예전에는 'FolderHeart' 같은 영문 이름만 나오는 목록이라
 * 실제로 어떤 그림인지 저장해보기 전에는 알 수 없었습니다.
 */
export function IconPicker({ value, onChange }) {
    return (
        <div className="admin-field admin-span-all">
            <span>카드 아이콘<em>눌러서 고르세요</em></span>
            <div className="admin-icon-grid" role="radiogroup" aria-label="프로젝트 카드 아이콘">
                {PROJECT_ICON_NAMES.map((name) => (
                    <button
                        className={`admin-icon-choice${value === name ? ' is-active' : ''}`}
                        type="button"
                        role="radio"
                        aria-checked={value === name}
                        aria-label={name}
                        title={name}
                        key={name}
                        onClick={() => onChange(name)}
                    >
                        <ProjectIcon name={name} size={22} />
                    </button>
                ))}
            </div>
        </div>
    );
}
