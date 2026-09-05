'use client';

import { Film, Image as ImageIcon, Quote } from 'lucide-react';
import { getVideoEmbedUrl } from '@/lib/heroMedia';

/** 첫 화면 슬라이드가 실제로 어떻게 보일지 옆에서 바로 확인합니다. */
export function SlidePreview({ slide }) {
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
