type IslamicDecorProps = {
    /** 'color' للأقسام الفاتحة، 'light' للأقسام الداكنة */
    tone?: 'color' | 'light'
}

/** زخارف إسلامية متحركة ناعمة: نجمة ثمانية تدور ببطء + ۞ و✦ عائمة + توهج زجاجي */
export default function IslamicDecor({ tone = 'color' }: IslamicDecorProps) {
    return (
        <div className={`decor-layer${tone === 'light' ? ' decor-light' : ''}`} aria-hidden="true">
            <span className="decor-glow decor-glow-a" />
            <span className="decor-glow decor-glow-b" />
            <svg viewBox="0 0 100 100" className="decor-star decor-star-a">
                <rect x="24" y="24" width="52" height="52" rx="7" />
                <rect x="24" y="24" width="52" height="52" rx="7" transform="rotate(45 50 50)" />
                <circle cx="50" cy="50" r="9" />
                <circle cx="50" cy="50" r="2.5" />
            </svg>
            <svg viewBox="0 0 100 100" className="decor-star decor-star-b">
                <rect x="24" y="24" width="52" height="52" rx="7" />
                <rect x="24" y="24" width="52" height="52" rx="7" transform="rotate(45 50 50)" />
            </svg>
            <span className="decor-char decor-char-a">۞</span>
            <span className="decor-char decor-char-b">✦</span>
        </div>
    )
}
