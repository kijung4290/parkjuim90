'use client';

import { useId, useState } from 'react';
import { ChevronDown, ChevronUp, ImagePlus, Trash2 } from 'lucide-react';
import { UPLOAD_LIMITS } from '../constants';

/**
 * 기록에 붙일 사진을 올리고 설명·순서를 정리하는 편집기입니다.
 * 컴퓨터·휴대폰에 있는 사진을 바로 올릴 수 있고, 이미 인터넷에 있는 사진은 주소로 붙일 수 있습니다.
 */
export function StoryImageEditor({ images, uploading, onUpload, onUpdate, onRemove, onMove }) {
    const [linkUrl, setLinkUrl] = useState('');
    const inputId = useId();

    const addLink = () => {
        const url = linkUrl.trim();
        if (!url) return;
        onUpload([{ url, alt: '' }]);
        setLinkUrl('');
    };

    return (
        <div className="admin-span-all admin-photos">
            <div className="admin-photos-head">
                <span>
                    사진
                    <em>({UPLOAD_LIMITS.image.formats} · 한 장당 {UPLOAD_LIMITS.image.megabytes}MB까지 · 여러 장 한 번에 선택 가능)</em>
                </span>
                <label className={`button button--soft button--small${uploading ? ' is-disabled' : ''}`} htmlFor={inputId}>
                    <ImagePlus size={16} aria-hidden="true" /> {uploading ? '올리는 중…' : '사진 올리기'}
                </label>
                <input
                    id={inputId}
                    className="admin-file-input"
                    type="file"
                    accept={UPLOAD_LIMITS.image.accept}
                    multiple
                    disabled={uploading}
                    onChange={(event) => {
                        onUpload(event.target.files);
                        event.target.value = '';
                    }}
                />
            </div>

            {images.length > 0 ? (
                <ul className="admin-photo-list">
                    {images.map((image, imageIndex) => (
                        <li className="admin-photo" key={`${image.url}-${imageIndex}`}>
                            <img src={image.url} alt="" />
                            <div className="admin-photo-body">
                                <input
                                    value={image.alt || ''}
                                    placeholder="사진 설명 (화면에 함께 보이고, 화면 낭독기가 읽어줍니다)"
                                    onChange={(event) => onUpdate(imageIndex, { alt: event.target.value })}
                                />
                                <div className="admin-photo-tools">
                                    {imageIndex === 0 && <span className="admin-photo-cover">대표</span>}
                                    <button type="button" title="앞으로" aria-label={`사진 ${imageIndex + 1} 앞으로`} disabled={imageIndex === 0} onClick={() => onMove(imageIndex, -1)}><ChevronUp size={15} /></button>
                                    <button type="button" title="뒤로" aria-label={`사진 ${imageIndex + 1} 뒤로`} disabled={imageIndex === images.length - 1} onClick={() => onMove(imageIndex, 1)}><ChevronDown size={15} /></button>
                                    <button type="button" className="is-danger" title="삭제" aria-label={`사진 ${imageIndex + 1} 삭제`} onClick={() => onRemove(imageIndex)}><Trash2 size={15} /></button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="admin-photos-empty">첫 번째 사진이 홈 화면 카드의 대표 사진이 되고, 나머지는 전문 화면에서 보입니다.</p>
            )}

            <div className="admin-photos-link">
                <input
                    value={linkUrl}
                    placeholder="이미 인터넷에 있는 사진 주소 (https://...)"
                    onChange={(event) => setLinkUrl(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key !== 'Enter') return;
                        event.preventDefault();
                        addLink();
                    }}
                />
                <button className="button button--soft button--small" type="button" onClick={addLink}>주소로 추가</button>
            </div>
        </div>
    );
}
