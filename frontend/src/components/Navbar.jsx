import { ShieldCheck } from "lucide-react"

function Navbar() {
  return (
    <header className="px-6 pt-6 md:px-10">
      <nav
        className="
          mx-auto flex max-w-6xl items-center justify-between
          rounded-2xl
          bg-[var(--background)]
          px-5 py-4
          shadow-[var(--shadow-card)]
        "
      >
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div
            className="
              flex h-11 w-11 items-center justify-center
              rounded-xl
              bg-[var(--background)]
              shadow-[var(--shadow-recessed)]
            "
          >
            <ShieldCheck
              size={24}
              strokeWidth={1.8}
              className="text-[var(--accent)]"
            />
          </div>

          <div>
            <p className="font-bold tracking-tight text-[var(--text)]">
              PHISHING URL DETECTOR
            </p>

            <p className="font-mono text-[10px] font-semibold tracking-[0.12em] text-[var(--text-muted)]">
              SECURITY ANALYSIS SYSTEM
            </p>
          </div>
        </div>

        {/* System status */}
        <div className="hidden items-center gap-3 sm:flex">
          <span
            className="
              h-2.5 w-2.5 rounded-full
              bg-green-500
              shadow-[0_0_10px_rgba(34,197,94,0.9)]
              animate-pulse
            "
          />

          <span className="font-mono text-xs font-bold tracking-[0.08em] text-[var(--text-muted)]">
            SYSTEM OPERATIONAL
          </span>
        </div>
      </nav>
    </header>
  )
}

export default Navbar