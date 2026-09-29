import { Activity, ShieldCheck, Zap } from "lucide-react"
import { motion } from "framer-motion"

function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">

        {/* LEFT SIDE */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            ease: [0.175, 0.885, 0.32, 1.275],
          }}
        >
          <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-[var(--background)] px-4 py-2 shadow-[var(--shadow-recessed)]">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[var(--accent)] shadow-[0_0_10px_rgba(255,71,87,0.7)]" />

            <span className="font-mono text-xs font-bold tracking-[0.12em] text-[var(--text-muted)]">
              AI SECURITY ANALYSIS
            </span>
          </div>

          <h1 className="max-w-3xl text-5xl font-extrabold leading-[0.95] tracking-[-0.03em] text-[var(--text)] md:text-7xl">
            Detect
            <br />
            <span className="text-[var(--accent)]">
              Phishing URLs
            </span>
            <br />
            Before They Strike.
          </h1>

          <p className="mt-7 max-w-xl text-base leading-7 text-[var(--text-muted)] md:text-lg">
            Analyze suspicious URLs using machine learning,
            explainable AI, and live domain intelligence.
          </p>

          {/* Feature indicators */}
          <div className="mt-8 flex flex-wrap gap-4">

            <div className="flex items-center gap-2 rounded-lg bg-[var(--background)] px-4 py-3 shadow-[var(--shadow-card)]">
              <ShieldCheck
                size={18}
                className="text-[var(--accent)]"
              />

              <span className="font-mono text-xs font-bold tracking-wide text-[var(--text-muted)]">
                XGBOOST
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-[var(--background)] px-4 py-3 shadow-[var(--shadow-card)]">
              <Activity
                size={18}
                className="text-[var(--accent)]"
              />

              <span className="font-mono text-xs font-bold tracking-wide text-[var(--text-muted)]">
                SHAP AI
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-[var(--background)] px-4 py-3 shadow-[var(--shadow-card)]">
              <Zap
                size={18}
                className="text-[var(--accent)]"
              />

              <span className="font-mono text-xs font-bold tracking-wide text-[var(--text-muted)]">
                LIVE DNS
              </span>
            </div>

          </div>
        </motion.div>

        {/* RIGHT SIDE — DEVICE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.7,
            delay: 0.15,
            ease: [0.175, 0.885, 0.32, 1.275],
          }}
          className="flex justify-center"
        >
          <div className="relative w-full max-w-md">

            {/* Device */}
            <div
              className="
                relative
                overflow-hidden
                rounded-[24px]
                border-4 border-[#252a2d]
                bg-[#2d3436]
                p-4
                shadow-[12px_12px_24px_rgba(0,0,0,0.25),-6px_-6px_14px_rgba(255,255,255,0.55)]
              "
            >

              {/* Device top bar */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.9)]" />
                  <span className="font-mono text-[10px] font-bold tracking-[0.12em] text-[#e0e5ec]">
                    SECURITY NODE
                  </span>
                </div>

                <span className="font-mono text-[10px] text-[#a8b2d1]">
                  SYS.01
                </span>
              </div>

              {/* Screen */}
              <div
                className="
                  relative
                  min-h-[280px]
                  overflow-hidden
                  rounded-xl
                  bg-[#111517]
                  p-6
                  shadow-[inset_6px_6px_14px_rgba(0,0,0,0.7),inset_-2px_-2px_4px_rgba(255,255,255,0.05)]
                "
              >

                {/* Scanlines */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.12]"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.25) 50%)",
                    backgroundSize: "100% 4px",
                  }}
                />

                <div className="relative z-10">

                  <p className="font-mono text-[10px] font-bold tracking-[0.15em] text-[#a8b2d1]">
                    THREAT ANALYSIS
                  </p>

                  <div className="mt-8 flex items-center justify-center">
                    <div className="flex h-32 w-32 items-center justify-center rounded-full border border-[#ff4757]/40">
                      <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[#ff4757]/60">
                        <ShieldCheck
                          size={48}
                          strokeWidth={1.5}
                          className="text-[#ff4757]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 space-y-3">

                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="text-[#a8b2d1]">
                        ML ENGINE
                      </span>

                      <span className="text-green-400">
                        ONLINE
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-[#252a2d]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "86%" }}
                        transition={{ duration: 1.2, delay: 0.5 }}
                        className="h-full rounded-full bg-[#ff4757]"
                      />
                    </div>

                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="text-[#a8b2d1]">
                        DNS INTELLIGENCE
                      </span>

                      <span className="text-green-400">
                        ACTIVE
                      </span>
                    </div>

                  </div>
                </div>
              </div>

              {/* Device bottom controls */}
              <div className="mt-4 flex items-center justify-between">

                <div className="flex gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#ff4757] shadow-[0_0_8px_rgba(255,71,87,0.8)]" />
                  <span className="h-3 w-3 rounded-full bg-[#a3b1c6]" />
                  <span className="h-3 w-3 rounded-full bg-[#a3b1c6]" />
                </div>

                <span className="font-mono text-[9px] tracking-[0.15em] text-[#a8b2d1]">
                  READY
                </span>

              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  )
}

export default Hero