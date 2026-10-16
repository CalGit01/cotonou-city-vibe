const BIRDS = [
  { top: "12%", duration: "32s", delay: "0s", scale: 1 },
  { top: "9%", duration: "44s", delay: "-18s", scale: 0.7 },
  { top: "21%", duration: "38s", delay: "-29s", scale: 0.85 },
]

export function Birds() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {BIRDS.map((bird, index) => (
        <span
          key={index}
          className="bird absolute left-0"
          style={{
            top: bird.top,
            animationDuration: bird.duration,
            animationDelay: bird.delay,
          }}
        >
          <svg
            viewBox="0 0 24 10"
            className="bird-wing"
            style={{ width: 22 * bird.scale, height: 10 * bird.scale }}
            aria-hidden="true"
          >
            <path
              d="M1 7 Q6 -1 12 5 Q18 -1 23 7"
              fill="none"
              stroke="#12303f"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </span>
      ))}
    </div>
  )
}
