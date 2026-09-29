import { useState } from "react"

import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import URLAnalyzer from "./components/URLAnalyzer"
import AnalysisResult from "./components/AnalysisResult"
import DomainIntelligence from "./components/DomainIntelligence"
import ExplanationPanel from "./components/ExplanationPanel"

function App() {
  const [analysisResult, setAnalysisResult] = useState(null)
  const [analyzerKey, setAnalyzerKey] = useState(0)

  const handleNewAnalysis = () => {
    setAnalysisResult(null)
    setAnalyzerKey((previousKey) => previousKey + 1)

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <main className="min-h-screen bg-[var(--background)]">

      <Navbar />

      <Hero />

      <URLAnalyzer
        key={analyzerKey}
        onAnalysisComplete={(result) => {
          setAnalysisResult(result)
        }}
      />

      <AnalysisResult
        result={analysisResult}
        onNewAnalysis={handleNewAnalysis}
      />

      <DomainIntelligence
        result={analysisResult}
      />

      <ExplanationPanel
        result={analysisResult}
      />

    </main>
  )
}

export default App