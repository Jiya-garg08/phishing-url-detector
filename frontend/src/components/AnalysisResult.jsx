import {
  CheckCircle2,
  AlertTriangle,
  Activity,
  Link2,
  ShieldCheck,
} from "lucide-react"

import { motion } from "framer-motion"

function AnalysisResult({ result, onNewAnalysis }) {
  // Don't show the result section until a URL has been analyzed.
  if (!result) {
    return null
  }

  const prediction = result.prediction
  const phishingProbability = result.phishing_probability
  const legitimateProbability = result.legitimate_probability
  const riskLevel = result.risk_level
  const analyzedUrl = result.url

  const isPhishing = prediction === "Phishing"

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
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-[var(--accent)]" />

            <span className="font-mono text-xs font-bold tracking-[0.14em] text-[var(--text-muted)]">
              ANALYSIS RESULT
            </span>
          </div>

          <div className="flex items-center gap-4">

            {/* Analysis complete indicator */}
            <div className="hidden items-center gap-2 sm:flex">
              <Activity
                size={14}
                className="text-green-500"
              />

              <span className="font-mono text-[10px] font-bold tracking-[0.1em] text-[var(--text-muted)]">
                ANALYSIS COMPLETE
              </span>
            </div>

            {/* New analysis button */}
            <motion.button
              onClick={onNewAnalysis}
              whileHover={{ scale: 1.02 }}
              whileTap={{ y: 2 }}
              transition={{ duration: 0.15 }}
              className="
                flex
                items-center
                justify-center
                rounded-lg
                bg-[var(--background)]
                px-4
                py-2.5
                font-mono
                text-[10px]
                font-bold
                tracking-[0.08em]
                text-[var(--text)]
                shadow-[var(--shadow-card)]
                transition-all
                duration-150
                hover:text-[var(--accent)]
                active:shadow-[var(--shadow-pressed)]
              "
            >
              NEW ANALYSIS
            </motion.button>

          </div>
        </div>

        {/* Result panel */}
        <div className="rounded-2xl bg-[var(--background)] p-6 shadow-[var(--shadow-floating)] md:p-10">

          {/* URL analyzed */}
          <div className="mb-8 rounded-xl bg-[var(--background)] p-5 shadow-[var(--shadow-recessed)]">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--background)] shadow-[var(--shadow-recessed)]">
                <Link2
                  size={19}
                  strokeWidth={1.7}
                  className="text-[var(--accent)]"
                />
              </div>

              <div className="min-w-0">
                <p className="font-mono text-[9px] font-bold tracking-[0.12em] text-[var(--text-muted)]">
                  URL ANALYZED
                </p>

                <p
                  className="mt-1 break-all font-mono text-sm font-semibold text-[var(--text)]"
                  title={analyzedUrl}
                >
                  {analyzedUrl}
                </p>
              </div>

            </div>

          </div>

          {/* Analysis dimensions */}
          <div className="mb-8 grid gap-5 md:grid-cols-3">

            {/* URL format */}
            <div className="rounded-xl bg-[var(--background)] p-5 shadow-[var(--shadow-card)]">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                  <CheckCircle2
                    size={20}
                    className="text-green-600"
                  />
                </div>

                <div>
                  <p className="font-mono text-[9px] font-bold tracking-[0.1em] text-[var(--text-muted)]">
                    URL FORMAT
                  </p>

                  <p className="mt-1 font-mono text-sm font-bold text-green-600">
                    VALID
                  </p>
                </div>

              </div>

              <p className="mt-4 text-xs leading-5 text-[var(--text-muted)]">
                The URL passed the HTTP/HTTPS format validation.
              </p>

            </div>

            {/* ML classification */}
            <div className="rounded-xl bg-[var(--background)] p-5 shadow-[var(--shadow-card)]">

              <div className="flex items-center gap-3">

                <div
                  className={`
                    flex h-10 w-10 items-center justify-center rounded-lg
                    ${
                      isPhishing
                        ? "bg-[var(--accent)]/10"
                        : "bg-green-500/10"
                    }
                  `}
                >
                  <ShieldCheck
                    size={20}
                    className={
                      isPhishing
                        ? "text-[var(--accent)]"
                        : "text-green-600"
                    }
                  />
                </div>

                <div>
                  <p className="font-mono text-[9px] font-bold tracking-[0.1em] text-[var(--text-muted)]">
                    ML CLASSIFICATION
                  </p>

                  <p
                    className={`
                      mt-1 font-mono text-sm font-bold
                      ${
                        isPhishing
                          ? "text-[var(--accent)]"
                          : "text-green-600"
                      }
                    `}
                  >
                    {prediction}
                  </p>
                </div>

              </div>

              <p className="mt-4 text-xs leading-5 text-[var(--text-muted)]">
                Classification generated by the trained XGBoost model.
              </p>

            </div>

            {/* Risk assessment */}
            <div className="rounded-xl bg-[var(--background)] p-5 shadow-[var(--shadow-card)]">

              <div className="flex items-center gap-3">

                <div
                  className={`
                    h-4 w-4 rounded-full animate-pulse
                    ${
                      riskLevel === "High"
                        ? "bg-[var(--accent)] shadow-[0_0_12px_rgba(255,71,87,0.8)]"
                        : riskLevel === "Medium"
                        ? "bg-yellow-500 shadow-[0_0_12px_rgba(234,179,8,0.8)]"
                        : "bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.8)]"
                    }
                  `}
                />

                <div>
                  <p className="font-mono text-[9px] font-bold tracking-[0.1em] text-[var(--text-muted)]">
                    RISK ASSESSMENT
                  </p>

                  <p className="mt-1 font-mono text-sm font-bold text-[var(--text)]">
                    {riskLevel}
                  </p>
                </div>

              </div>

              <p className="mt-4 text-xs leading-5 text-[var(--text-muted)]">
                Risk level is derived from the model's phishing probability.
              </p>

            </div>

          </div>

          {/* Main prediction + risk */}
          <div className="grid gap-6 md:grid-cols-2">

            {/* Prediction */}
            <div className="rounded-xl bg-[var(--background)] p-6 shadow-[var(--shadow-card)]">

              <p className="font-mono text-[10px] font-bold tracking-[0.12em] text-[var(--text-muted)]">
                PREDICTION
              </p>

              <div className="mt-5 flex items-center gap-4">

                <div
                  className={`
                    flex h-14 w-14 items-center justify-center
                    rounded-full
                    shadow-[var(--shadow-recessed)]
                    ${
                      isPhishing
                        ? "text-[var(--accent)]"
                        : "text-green-500"
                    }
                  `}
                >
                  {isPhishing ? (
                    <AlertTriangle
                      size={30}
                      strokeWidth={1.7}
                    />
                  ) : (
                    <CheckCircle2
                      size={30}
                      strokeWidth={1.7}
                    />
                  )}
                </div>

                <div>
                  <h2
                    className={`
                      text-3xl font-extrabold tracking-tight
                      ${
                        isPhishing
                          ? "text-[var(--accent)]"
                          : "text-green-600"
                      }
                    `}
                  >
                    {prediction}
                  </h2>

                  <p className="mt-1 font-mono text-[10px] font-bold tracking-[0.1em] text-[var(--text-muted)]">
                    MACHINE LEARNING CLASSIFICATION
                  </p>
                </div>

              </div>

            </div>

            {/* Risk */}
            <div className="rounded-xl bg-[var(--background)] p-6 shadow-[var(--shadow-card)]">

              <p className="font-mono text-[10px] font-bold tracking-[0.12em] text-[var(--text-muted)]">
                RISK LEVEL
              </p>

              <div className="mt-5 flex items-center gap-4">

                <div
                  className={`
                    h-4 w-4 rounded-full animate-pulse
                    ${
                      riskLevel === "High"
                        ? "bg-[var(--accent)] shadow-[0_0_12px_rgba(255,71,87,0.8)]"
                        : riskLevel === "Medium"
                        ? "bg-yellow-500 shadow-[0_0_12px_rgba(234,179,8,0.8)]"
                        : "bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.8)]"
                    }
                  `}
                />

                <div>
                  <h2 className="text-3xl font-extrabold tracking-tight text-[var(--text)]">
                    {riskLevel}
                  </h2>

                  <p className="mt-1 font-mono text-[10px] font-bold tracking-[0.1em] text-[var(--text-muted)]">
                    THREAT ASSESSMENT
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* Probability section */}
          <div className="mt-8 rounded-xl bg-[var(--background)] p-6 shadow-[var(--shadow-recessed)] md:p-8">

            <div className="grid gap-8 md:grid-cols-2">

              {/* Phishing probability */}
              <div>

                <p className="font-mono text-[10px] font-bold tracking-[0.12em] text-[var(--text-muted)]">
                  PHISHING PROBABILITY
                </p>

                <p className="mt-2 font-mono text-4xl font-bold text-[var(--accent)]">
                  {phishingProbability}%
                </p>

                <div className="mt-4 h-3 overflow-hidden rounded-full bg-[var(--muted)] shadow-[var(--shadow-recessed)]">

                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${phishingProbability}%`,
                    }}
                    transition={{
                      duration: 1,
                      ease: "easeOut",
                    }}
                    className="h-full rounded-full bg-[var(--accent)]"
                  />

                </div>

              </div>

              {/* Legitimate probability */}
              <div>

                <p className="font-mono text-[10px] font-bold tracking-[0.12em] text-[var(--text-muted)]">
                  LEGITIMATE PROBABILITY
                </p>

                <p className="mt-2 font-mono text-4xl font-bold text-green-600">
                  {legitimateProbability}%
                </p>

                <div className="mt-4 h-3 overflow-hidden rounded-full bg-[var(--muted)] shadow-[var(--shadow-recessed)]">

                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${legitimateProbability}%`,
                    }}
                    transition={{
                      duration: 1,
                      ease: "easeOut",
                    }}
                    className="h-full rounded-full bg-green-500"
                  />

                </div>

              </div>

            </div>

          </div>

          {/* Interpretation note */}
          <div className="mt-8 rounded-lg bg-[var(--dark-panel)] px-5 py-4">

            <p className="font-mono text-[10px] leading-5 tracking-wide text-[#e0e5ec]">
              ML classification is based on URL features learned during
              training. Live DNS and RDAP information provides additional
              domain evidence. Neither classification nor live evidence
              independently guarantees that a website is safe or malicious.
            </p>

          </div>

        </div>
      </motion.div>
    </section>
  )
}

export default AnalysisResult