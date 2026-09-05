'use client';

import { useId } from 'react';
import { Film, ImagePlus, Trash2 } from 'lucide-react';
import { UPLOAD_LIMITS } from '../constants';

/**
 * "파일을 올리거나 / 주소를 붙여넣거나" 두 가지 방법을 한 줄에 담은 입력칸입니다.
 * 첫 화면 이미지·동영상·표지 사진이 모두 같은 모양을 쓰도록 하나로 모았습니다.
 */
export function MediaInput({
    kind = 'image',       // 'image' | 'video'
    label,
    hint,
    value,
    onChange,
    onFile,
    busy = false,
    placeholder,
}) {
    const inputId = useId();
    const limits = UPLOAD_LIMITS[kind] || UPLOAD_LIMITS.image;
    const Icon = kind === 'video' ? Film : ImagePlus;
    const uploadLabel = kind === 'video' ? '동영상 파일 올리기' : '사진 파일 올리기';

    return (
        <div className="admin-field admin-span-all">
            <span>
                {label}
                {hint && <em>{hint}</em>}
            </span>

            <div className="admin-hero-upload-box">
                <label className={`button button--soft button--small${busy ? ' is-disabled' : ''}`} htmlFor={inputId}>
                    <Icon size={16} aria-hidden="true" /> {busy ? '올리는 중…' : uploadLabel}
                </label>
                <input
                    id={inputId}
                    className="admin-file-input"
                    type="file"
                    accept={limits.accept}
                    disabled={busy}
                    onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) onFile(file);
                        event.target.value = '';
                    }}
                />

                <span className="admin-upload-or">또는</span>

                <input
                    className="admin-hero-url-input"
                    value={value || ''}
                    placeholder={placeholder}
                    onChange={(event) => onChange(event.target.value)}
                />

                {value && (
                    <button
                        className="button button--ghost button--small is-danger"
                        type="button"
                        onClick={() => onChange('')}
                        title="주소 지우기"
                    >
                        <Trash2 size={15} aria-hidden="true" /> 비우기
                    </button>
                )}
            </div>

            <p className="admin-inline-help">
                {limits.formats} 형식 · 한 개당 {limits.megabytes}MB까지 올릴 수 있습니다.
                {kind === 'video' && ' YouTube·Vimeo 주소를 붙여넣으면 파일을 올리지 않아도 됩니다.'}
            </p>
        </div>
    );
}
