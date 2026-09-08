export function BrandSymbol({ className = '' }) {
  return (
    <span className={`brand-symbol${className ? ` ${className}` : ''}`} aria-hidden="true">
      <img src="/images/smartworklab-logo.png" alt="" />
    </span>
  );
}

export function BrandLockup({ compact = false }) {
  return (
    <span className={`lab-lockup${compact ? ' lab-lockup--compact' : ''}`}>
      <BrandSymbol />
      <span className="lab-lockup-copy">
        <strong>일잘알랩</strong>
        <span lang="en">SMARTWORK LAB</span>
      </span>
    </span>
  );
}
