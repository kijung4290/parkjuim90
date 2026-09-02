import {
    Activity,
    BookOpen,
    Bot,
    FolderHeart,
    LayoutGrid,
    Network,
    ShieldAlert,
    Sparkles,
    Users,
} from 'lucide-react';

/** 프로젝트 카드에 쓸 수 있는 아이콘 목록입니다. */
export const PROJECT_ICONS = {
    Network,
    FolderHeart,
    Activity,
    Users,
    BookOpen,
    LayoutGrid,
    Bot,
    ShieldAlert,
};

export const PROJECT_ICON_NAMES = Object.keys(PROJECT_ICONS);

export function ProjectIcon({ name, size = 23 }) {
    const Icon = PROJECT_ICONS[name] || Sparkles;
    return <Icon size={size} strokeWidth={1.8} aria-hidden="true" />;
}
