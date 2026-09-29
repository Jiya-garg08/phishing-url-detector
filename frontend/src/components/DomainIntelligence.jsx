import {
  Globe,
  Server,
  Clock3,
  Network,
  Database,
} from "lucide-react"

import { motion } from "framer-motion"

function DomainIntelligence({ result }) {

  // Don't show this section until a URL has been analyzed.
  if (!result) {
    return null
  }

  const liveData = result.live_domain_intelligence
const intelligence = [
  {
    label: "DOMAIN AGE",
    value: liveData.domain_age_days,
    icon: Clock3,
  },
  {
    label: "DNS STATUS",
    value: liveData.dns_resolvable === "Yes" ? "ONLINE" : "OFFLINE",
    icon: Globe,
    status: liveData.dns_resolvable === "Yes",
  },
  {
    label: "IP ADDRESSES",
    value: liveData.num_ips,
    icon: Network,
  },
  {
    label: "DNS TTL",
    value:
      liveData.ttl !== "Unavailable"
        ? `${liveData.ttl} sec`
        : "Unavailable",
    icon: Server,
  },
  {
    label: "NAME SERVERS",
    value: liveData.num_name_servers,
    icon: Database,
  },
]

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

        {/* Heading */}
        <div className="mb-6 flex items-center gap-3">
          <span className="h-px w-10 bg-[var(--accent)]" />

          <span className="font-mono text-xs font-bold tracking-[0.14em] text-[var(--text-muted)]">
            LIVE DOMAIN INTELLIGENCE
          </span>
        </div>

        {/* Main panel */}
        <div className="rounded-2xl bg-[var(--background)] p-6 shadow-[var(--shadow-floating)] md:p-8">

          {/* Header */}
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[var(--text)]">
                Domain Intelligence
              </h2>

              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Current DNS and domain registration information.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-[var(--background)] px-4 py-3 shadow-[var(--shadow-recessed)]">

              <span
                className="
                  h-2.5 w-2.5 animate-pulse rounded-full
                  bg-green-500
                  shadow-[0_0_10px_rgba(34,197,94,0.8)]
                "
              />

              <span className="font-mono text-[10px] font-bold tracking-[0.1em] text-[var(--text-muted)]">
                LIVE DATA
              </span>

            </div>
          </div>

          {/* Intelligence cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">

            {intelligence.map((item, index) => {

              const Icon = item.icon

              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.08,
                  }}
                  whileHover={{ y: -4 }}
                  className="
                    rounded-xl
                    bg-[var(--background)]
                    p-5
                    shadow-[var(--shadow-card)]
                    transition-shadow
                    duration-300
                    hover:shadow-[var(--shadow-floating)]
                  "
                >

                  <div className="flex items-center justify-between">

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--background)] shadow-[var(--shadow-recessed)]">

                      <Icon
                        size={19}
                        strokeWidth={1.7}
                        className="text-[var(--accent)]"
                      />

                    </div>

                    {item.status && (
                      <span
                        className="
                          h-2.5 w-2.5 rounded-full
                          bg-green-500
                          shadow-[0_0_8px_rgba(34,197,94,0.8)]
                        "
                      />
                    )}

                  </div>

                  <p className="mt-5 font-mono text-[9px] font-bold tracking-[0.1em] text-[var(--text-muted)]">
                    {item.label}
                  </p>

                  <p className="mt-2 font-mono text-xl font-bold text-[var(--text)]">
                    {item.value}
                  </p>

                </motion.div>
              )
            })}

          </div>

          {/* Supporting note */}
          <div className="mt-6 rounded-lg bg-[var(--background)] px-5 py-4 shadow-[var(--shadow-recessed)]">

            <p className="font-mono text-[10px] leading-5 tracking-wide text-[var(--text-muted)]">
              DNS and RDAP information is supporting evidence and does not
              override the machine learning classification.
            </p>

          </div>

        </div>
      </motion.div>
    </section>
  )
}

export default DomainIntelligence