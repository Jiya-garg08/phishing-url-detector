import { useState } from "react"
import { ArrowRight, Link2, Search } from "lucide-react"
import { motion } from "framer-motion"

function URLAnalyzer({ onAnalysisComplete }) {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleAnalyze = async () => {
    if (!url.trim()) {
      setError("Please enter a URL.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: url.trim(),
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || "Analysis failed.")
      }

      console.log("Backend response:", data)

      if (onAnalysisComplete) {
        onAnalysisComplete(data)
      }
    } catch (error) {
      console.error("Analysis error:", error)
      setError(
        error.message || "Unable to connect to the backend."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-6 pb-24 md:px-10">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.6,
          ease: [0.175, 0.885, 0.32, 1.275],
        }}
        className="relative"
      >

        {/* Section heading */}
        <div className="mb-6 flex items-center gap-3">
          <span className="h-px w-10 bg-[var(--accent)]" />

          <span className="font-mono text-xs font-bold tracking-[0.14em] text-[var(--text-muted)]">
            URL THREAT ANALYZER
          </span>
        </div>

        {/* Main panel */}
        <div className="relative rounded-2xl bg-[var(--background)] p-6 shadow-[var(--shadow-floating)] md:p-10">

          {/* Corner screws */}
          <div className="absolute left-4 top-4 h-3 w-3 rounded-full bg-[var(--muted)] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.25)]" />

          <div className="absolute right-4 top-4 h-3 w-3 rounded-full bg-[var(--muted)] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.25)]" />

          <div className="absolute bottom-4 left-4 h-3 w-3 rounded-full bg-[var(--muted)] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.25)]" />

          <div className="absolute bottom-4 right-4 h-3 w-3 rounded-full bg-[var(--muted)] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.25)]" />

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--background)] shadow-[var(--shadow-recessed)]">
                <Search
                  size={22}
                  strokeWidth={1.8}
                  className="text-[var(--accent)]"
                />
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight text-[var(--text)]">
                  Analyze a URL
                </h2>

                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  Enter a URL to perform a complete security analysis.
                </p>
              </div>

            </div>
          </div>

          {/* URL input + button */}
          <div className="flex flex-col gap-4 md:flex-row">

            {/* URL INPUT */}
            <div className="flex min-h-14 flex-1 items-center gap-3 rounded-lg bg-[var(--background)] px-5 shadow-[var(--shadow-recessed)]">

              <Link2
                size={20}
                strokeWidth={1.7}
                className="shrink-0 text-[var(--text-muted)]"
              />

              <input
                type="url"
                value={url}
                onChange={(event) => {
                  setUrl(event.target.value)
                  setError("")
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleAnalyze()
                  }
                }}
                placeholder="https://example.com"
                disabled={loading}
                className="w-full bg-transparent font-mono text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-muted)] placeholder:opacity-50 disabled:cursor-not-allowed"
              />

            </div>

            {/* ANALYZE BUTTON */}
            <motion.button
              onClick={handleAnalyze}
              disabled={loading}
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { y: 2 } : {}}
              transition={{ duration: 0.15 }}
              className="
                group
                flex
                min-h-14
                items-center
                justify-center
                gap-3
                rounded-lg
                bg-[var(--accent)]
                px-7
                font-mono
                text-sm
                font-bold
                tracking-[0.08em]
                text-white
                shadow-[4px_4px_8px_rgba(166,50,60,0.4),-4px_-4px_8px_rgba(255,100,110,0.35)]
                transition-all
                duration-150
                hover:brightness-110
                active:shadow-[var(--shadow-pressed)]
                disabled:cursor-not-allowed
                disabled:opacity-70
                md:min-w-48
              "
            >

              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                  SCANNING...
                </span>
              ) : (
                <>
                  ANALYZE URL

                  <ArrowRight
                    size={18}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </>
              )}

            </motion.button>

          </div>

          {/* Error message */}
          {error && (
            <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 shadow-[var(--shadow-recessed)]">
              <p className="font-mono text-xs font-semibold text-red-600">
                {error}
              </p>
            </div>
          )}

          {/* Feature labels */}
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">

            <span className="font-mono text-[10px] font-semibold tracking-[0.08em] text-[var(--text-muted)]">
              HTTP / HTTPS SUPPORTED
            </span>

            <span className="font-mono text-[10px] font-semibold tracking-[0.08em] text-[var(--text-muted)]">
              XGBOOST ANALYSIS
            </span>

            <span className="font-mono text-[10px] font-semibold tracking-[0.08em] text-[var(--text-muted)]">
              LIVE DNS INTELLIGENCE
            </span>

          </div>

        </div>
      </motion.div>
    </section>
  )
}

export default URLAnalyzer