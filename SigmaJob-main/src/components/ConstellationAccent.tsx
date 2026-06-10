export default function ConstellationAccent({ dark }: { dark: boolean }) {
  return (
    <svg
      aria-hidden="true"
      style={{
        position: 'absolute', top: 0, right: 0,
        width: '320px', height: '220px',
        pointerEvents: 'none', zIndex: 0,
        opacity: dark ? 0.25 : 0.10,
      }}
      viewBox="0 0 320 220"
      fill="none"
    >
      {[
        [48,32],[160,18],[290,55],[220,110],[268,170],[80,155],[148,195]
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2" fill="#8B85E8" />
      ))}
      <polyline
        points="48,32 160,18 290,55 220,110 268,170 148,195 80,155 48,32"
        stroke="#5B52C4"
        strokeWidth="0.5"
      />
      <line x1="160" y1="18" x2="220" y2="110"
        stroke="#5B52C4" strokeWidth="0.5" />
    </svg>
  );
}
