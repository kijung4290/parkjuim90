import { ProjectIcon } from '@/components/projectIcons';

/**
 * 상세 화면 맨 위에 놓는 **간단한 그림**입니다.
 *
 * 도구마다 사진을 준비하기는 어렵기 때문에, 항목 번호(id)로 네 가지 도형 중
 * 하나를 골라 그립니다. 같은 도구는 언제 열어도 같은 그림이 나오고,
 * 서로 다른 도구는 다른 그림이 나와서 "아까 본 그 도구"를 눈으로 구분할 수 있습니다.
 *
 * 그림은 뜻을 담지 않는 장식입니다. 그래서 label을 주지 않으면 보조기기에서 아예 숨깁니다.
 */

const VIEW_WIDTH = 320;
const VIEW_HEIGHT = 168;

/** 같은 id면 항상 같은 숫자가 나오게 만듭니다(새로 고쳐도 그림이 바뀌지 않습니다). */
const hashSeed = (value) => {
    const text = String(value ?? '');
    let hash = 7;
    for (let index = 0; index < text.length; index += 1) {
        hash = (hash * 31 + text.charCodeAt(index)) % 1000003;
    }
    return hash;
};

/** 물방울 격자 */
const dotPattern = () => {
    const dots = [];

    for (let row = 0; row < 4; row += 1) {
        for (let col = 0; col < 10; col += 1) {
            const large = (row + col) % 4 === 0;
            dots.push(
                <circle
                    className={large ? 'glyph-accent' : 'glyph-ink'}
                    cx={16 + col * 32}
                    cy={24 + row * 40}
                    r={large ? 7 : 3.5}
                    key={`dot-${row}-${col}`}
                />,
            );
        }
    }

    return dots;
};

/** 동심원(관계도 느낌) */
const ringPattern = () => (
    <>
        {[34, 58, 82, 106].map((radius, index) => (
            <circle
                className={index === 1 ? 'glyph-accent-stroke' : 'glyph-ink-stroke'}
                cx={58}
                cy={84}
                r={radius}
                key={`ring-${radius}`}
            />
        ))}
        <circle className="glyph-ink" cx={252} cy={40} r={9} />
        <circle className="glyph-accent" cx={286} cy={124} r={5} />
    </>
);

/** 비스듬한 줄무늬(흐름 느낌) */
const stripePattern = () => (
    <>
        {[0, 1, 2, 3, 4, 5, 6].map((index) => (
            <polygon
                className={index % 3 === 1 ? 'glyph-accent' : 'glyph-ink'}
                points={`${-60 + index * 58},0 ${-24 + index * 58},0 ${16 + index * 58},${VIEW_HEIGHT} ${-20 + index * 58},${VIEW_HEIGHT}`}
                key={`stripe-${index}`}
            />
        ))}
    </>
);

/** 막대 그래프(집계·대시보드 느낌) */
const barPattern = () => (
    <>
        <rect className="glyph-ink" x={14} y={18} width={120} height={8} rx={4} />
        {[0, 1, 2, 3, 4].map((index) => (
            <rect
                className={index === 2 ? 'glyph-accent' : 'glyph-ink'}
                x={14 + index * 62}
                y={112 - index * 22}
                width={44}
                height={22 + index * 22}
                rx={6}
                key={`bar-${index}`}
            />
        ))}
    </>
);

const PATTERNS = [dotPattern, ringPattern, stripePattern, barPattern];

export function VisualGlyph({ id, icon, label, iconSize = 30, className = '' }) {
    const variant = hashSeed(id) % PATTERNS.length;
    const drawPattern = PATTERNS[variant];
    const describedProps = label
        ? { role: 'img', 'aria-label': label }
        : { 'aria-hidden': 'true' };

    return (
        <div
            className={`visual-glyph visual-glyph--${variant}${className ? ` ${className}` : ''}`}
            {...describedProps}
        >
            <svg
                className="visual-glyph__pattern"
                viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
                preserveAspectRatio="xMidYMid slice"
                aria-hidden="true"
                focusable="false"
            >
                {drawPattern()}
            </svg>
            <span className="visual-glyph__mark">
                <ProjectIcon name={icon} size={iconSize} />
            </span>
        </div>
    );
}
