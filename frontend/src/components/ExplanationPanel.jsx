import { BrainCircuit, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { motion } from "framer-motion"

function ExplanationPanel({ result }) {

  // Don't show this section until a URL has been analyzed.
  if (!result) {
    return null
  }

  const phishingReasons =
    result.explanation?.phishing_reasons || []

  const legitimateReasons =
    result.explanation?.legitimate_reasons || []

  return (
    <section className="mx-auto max-w-6xl px-6 pb-24 md:px-10">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          ease: [0.175, 0.885, 0.32, 1.275],
        }}
      >

        {/* Section heading */}
        <div className="mb-6 flex items-center gap-3">
          <span className="h-px w-10 bg-[var(--accent)]" />

          <span className="font-mono text-xs font-bold tracking-[0.14em] text-[var(--text-muted)]">
            EXPLAINABLE AI
          </span>
        </div>

        {/* Main panel */}
        <div className="rounded-2xl bg-[var(--background)] p-6 shadow-[var(--shadow-floating)] md:p-10">

          {/* Header */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-4">

              <div
                className="
                  flex h-14 w-14
                  items-center justify-center
                  rounded-xl
                  bg-[var(--background)]
                  shadow-[var(--shadow-recessed)]
                "
              >
                <BrainCircuit
                  size={28}
                  strokeWidth={1.5}
                  className="text-[var(--accent)]"
                />
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight text-[var(--text)]">
                  Why did the model decide?
                </h2>

                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  SHAP-based feature contributions for this prediction.
                </p>
              </div>

            </div>

            <div className="rounded-lg bg-[var(--background)] px-4 py-3 shadow-[var(--shadow-recessed)]">
              <span className="font-mono text-[10px] font-bold tracking-[0.1em] text-[var(--text-muted)]">
                SHAP ANALYSIS
              </span>
            </div>

          </div>

          {/* Explanation columns */}
          <div className="mt-10 grid gap-8 md:grid-cols-2">

            {/* Phishing reasons */}
            <div>

              <div className="mb-4 flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent)]/10">
                  <ArrowUpRight
                    size={18}
                    className="text-[var(--accent)]"
                  />
                </div>

                <div>
                  <p className="font-mono text-xs font-bold tracking-[0.1em] text-[var(--accent)]">
                    PHISHING CONTRIBUTIONS
                  </p>

                  <p className="text-xs text-[var(--text-muted)]">
                    Features pushing the prediction toward phishing.
                  </p>
                </div>

              </div>

              <div className="space-y-3">

                {phishingReasons.length > 0 ? (
                  phishingReasons.map((reason, index) => (
                    <motion.div
                      key={`${reason}-${index}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: index * 0.08,
                      }}
                      className="
                        rounded-lg
                        bg-[var(--background)]
                        px-5 py-4
                        shadow-[var(--shadow-card)]
                      "
                    >
                      <p className="font-mono text-xs leading-5 text-[var(--text)]">
                        {reason}
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <div className="rounded-lg bg-[var(--background)] px-5 py-4 shadow-[var(--shadow-card)]">
                    <p className="font-mono text-xs text-[var(--text-muted)]">
                      No strong phishing-directed contributions identified.
                    </p>
                  </div>
                )}

              </div>

            </div>

            {/* Legitimate reasons */}
            <div>

              <div className="mb-4 flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10">
                  <ArrowDownRight
                    size={18}
                    className="text-green-600"
                  />
                </div>

                <div>
                  <p className="font-mono text-xs font-bold tracking-[0.1em] text-green-600">
                    LEGITIMATE CONTRIBUTIONS
                  </p>

                  <p className="text-xs text-[var(--text-muted)]">
                    Features pushing the prediction toward legitimate.
                  </p>
                </div>

              </div>

              <div className="space-y-3">

                {legitimateReasons.length > 0 ? (
                  legitimateReasons.map((reason, index) => (
                    <motion.div
                      key={`${reason}-${index}`}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: index * 0.08,
                      }}
                      className="
                        rounded-lg
                        bg-[var(--background)]
                        px-5 py-4
                        shadow-[var(--shadow-card)]
                      "
                    >
                      <p className="font-mono text-xs leading-5 text-[var(--text)]">
                        {reason}
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <div className="rounded-lg bg-[var(--background)] px-5 py-4 shadow-[var(--shadow-card)]">
                    <p className="font-mono text-xs text-[var(--text-muted)]">
                      No strong legitimate-directed contributions identified.
                    </p>
                  </div>
                )}

              </div>

            </div>

          </div>

          {/* Technical note */}
          <div className="mt-8 rounded-lg bg-[var(--dark-panel)] px-5 py-4">

            <p className="font-mono text-[10px] leading-5 tracking-wide text-[#e0e5ec]">
              SHAP explains how individual URL features influenced the
              machine learning prediction. Contributions are model-based
              explanations, not independent security guarantees.
            </p>

          </div>

        </div>
      </motion.div>
    </section>
  )
}

export default ExplanationPanel