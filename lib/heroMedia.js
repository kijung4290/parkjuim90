/** YouTube·Vimeo 공유 주소를 안전한 임베드 주소로 바꿉니다. */
export function getVideoEmbedUrl(value, { autoplay = false, loop = false, controls = true } = {}) {
    if (!value) return null;

    try {
        const url = new URL(value, 'https://example.com');
        const host = url.hostname.toLowerCase().replace(/^www\./, '');
        let videoId = '';

        if (host === 'youtu.be') {
            videoId = url.pathname.split('/').filter(Boolean)[0] || '';
        } else if (host === 'youtube.com' || host === 'm.youtube.com') {
            if (url.pathname === '/watch') videoId = url.searchParams.get('v') || '';
            else if (/^\/(embed|shorts)\//.test(url.pathname)) videoId = url.pathname.split('/')[2] || '';
        }

        if (videoId) {
            const params = new URLSearchParams({
                autoplay: autoplay ? '1' : '0',
                mute: autoplay ? '1' : '0',
                playsinline: '1',
                rel: '0',
                controls: controls ? '1' : '0',
            });
            if (loop) {
                params.set('loop', '1');
                params.set('playlist', videoId);
            }
            return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?${params}`;
        }

        if (host === 'vimeo.com' || host === 'player.vimeo.com') {
            const vimeoId = url.pathname.split('/').filter(Boolean).find((part) => /^\d+$/.test(part));
            if (vimeoId) {
                const params = new URLSearchParams({
                    autoplay: autoplay ? '1' : '0',
                    muted: autoplay ? '1' : '0',
                    loop: loop ? '1' : '0',
                    title: '0',
                    byline: '0',
                    controls: controls ? '1' : '0',
                });
                return `https://player.vimeo.com/video/${vimeoId}?${params}`;
            }
        }
    } catch {
        return null;
    }

    return null;
}
