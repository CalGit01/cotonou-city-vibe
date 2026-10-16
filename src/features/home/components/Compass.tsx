export function Compass() {
  return (
    <div className="absolute bottom-6 right-6 z-20 hidden md:block">
      <svg width="66" height="66" viewBox="0 0 66 66" aria-hidden="true">
        <circle
          cx="33"
          cy="33"
          r="30"
          fill="#ffffff"
          fillOpacity="0.92"
          stroke="#0a1a24"
          strokeOpacity="0.12"
          strokeWidth="2"
        />
        <circle
          cx="33"
          cy="33"
          r="23"
          fill="none"
          stroke="#0a1a24"
          strokeOpacity="0.08"
          strokeWidth="1.5"
        />
        <path d="M33 12 L37 33 L33 54 L29 33 Z" fill="#c2451e" />
        <path d="M33 12 L37 33 L33 33 Z" fill="#12303f" />
        <path d="M12 33 L33 29 L54 33 L33 37 Z" fill="#12303f" opacity="0.35" />
        <circle cx="33" cy="33" r="3" fill="#0a1a24" />
        <text
          x="33"
          y="9"
          textAnchor="middle"
          fontFamily="'Plus Jakarta Sans', sans-serif"
          fontSize="9"
          fontWeight="800"
          fill="#c2451e"
        >
          N
        </text>
      </svg>
    </div>
  )
}
