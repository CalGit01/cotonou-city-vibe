export function CotonouLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 53"
      className={className}
      role="img"
      aria-label="Cotonou City Vibe"
    >
      <defs>
        <linearGradient id="ccv-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd45a" />
          <stop offset="1" stopColor="#e9a512" />
        </linearGradient>
        <clipPath id="ccv-band">
          <rect x="10" y="40" width="44" height="9" rx="3" />
        </clipPath>
      </defs>
      <path
        d="M6 18 L18 30 L32 8 L46 30 L58 18 L53 42 H11 Z"
        fill="url(#ccv-gold)"
        stroke="#b97b06"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <g clipPath="url(#ccv-band)">
        <rect x="10" y="40" width="14.7" height="9" fill="#008751" />
        <rect x="24.7" y="40" width="14.6" height="9" fill="#fcd116" />
        <rect x="39.3" y="40" width="14.7" height="9" fill="#e8112d" />
      </g>
      <rect
        x="10"
        y="40"
        width="44"
        height="9"
        rx="3"
        fill="none"
        stroke="#b97b06"
        strokeWidth="2"
      />
      <circle cx="6" cy="17" r="4" fill="#fff6dc" stroke="#b97b06" strokeWidth="1.5" />
      <circle cx="32" cy="7" r="4.5" fill="#fff6dc" stroke="#b97b06" strokeWidth="1.5" />
      <circle cx="58" cy="17" r="4" fill="#fff6dc" stroke="#b97b06" strokeWidth="1.5" />
      <path
        d="M32 24 L37 30 L32 36 L27 30 Z"
        fill="#22b573"
        stroke="#128a55"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M32 24 L37 30 L32 30 Z" fill="#4ade80" />
    </svg>
  )
}
