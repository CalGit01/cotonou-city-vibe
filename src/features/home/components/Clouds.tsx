const CLOUDS = [
  { top: "7%", scale: 1, duration: "78s", delay: "0s", opacity: 0.95 },
  { top: "19%", scale: 0.68, duration: "104s", delay: "-34s", opacity: 0.8 },
  { top: "34%", scale: 1.3, duration: "128s", delay: "-70s", opacity: 0.62 },
  { top: "50%", scale: 0.85, duration: "92s", delay: "-16s", opacity: 0.5 },
]

export function Clouds() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {CLOUDS.map((cloud, index) => (
        <span
          key={index}
          className="cloud absolute left-0"
          style={{
            top: cloud.top,
            animationDuration: cloud.duration,
            animationDelay: cloud.delay,
          }}
        >
          <span
            className="relative block h-7 w-28"
            style={{ transform: `scale(${cloud.scale})`, opacity: cloud.opacity }}
          >
            <span className="absolute inset-0 rounded-full bg-white shadow-[0_10px_24px_rgba(10,26,36,0.10)]" />
            <span className="absolute -top-4 left-4 block size-10 rounded-full bg-white" />
            <span className="absolute -top-6 left-12 block size-12 rounded-full bg-white" />
            <span className="absolute -top-2 left-24 block size-7 rounded-full bg-white" />
          </span>
        </span>
      ))}
    </div>
  )
}
