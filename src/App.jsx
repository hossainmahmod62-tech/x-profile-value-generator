import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import ImageUploader from './components/ImageUploader'
import GenerateButton from './components/GenerateButton'
import LoadingAnimation from './components/LoadingAnimation'
import ValueCard from './components/ValueCard'
import { hashFileToSeed, generateValueFromSeed } from './utils/valueGenerator'

// Simulated "analysis" duration — long enough for the loading messages to
// cycle through a couple of times, short enough to not feel slow.
const ANALYSIS_DURATION_MS = 2600

export default function App() {
  const [file, setFile] = useState(null)
  const [previewSrc, setPreviewSrc] = useState(null)
  const [status, setStatus] = useState('idle') // idle | loading | result
  const [result, setResult] = useState(null)
  const objectUrlRef = useRef(null)

  const handleFileSelect = useCallback((selectedFile) => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    const url = URL.createObjectURL(selectedFile)
    objectUrlRef.current = url
    setFile(selectedFile)
    setPreviewSrc(url)
    setResult(null)
    setStatus('idle')
  }, [])

  const handleClear = useCallback(() => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    objectUrlRef.current = null
    setFile(null)
    setPreviewSrc(null)
    setResult(null)
    setStatus('idle')
  }, [])

  const handleGenerate = useCallback(async () => {
    if (!file) return
    setStatus('loading')

    // Hash the file's actual bytes so the same image always yields the same
    // seed — and therefore the same fictional value — every time it's run.
    const seedPromise = hashFileToSeed(file)
    const delayPromise = new Promise((resolve) => setTimeout(resolve, ANALYSIS_DURATION_MS))

    const [seed] = await Promise.all([seedPromise, delayPromise])
    const value = generateValueFromSeed(seed)

    setResult(value)
    setStatus('result')
  }, [file])

  const handleReset = useCallback(() => {
    handleClear()
  }, [handleClear])

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    }
  }, [])

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <Navbar />
      <HeroSection />

      <main id="upload" className="relative mx-auto max-w-md px-6 pb-24 sm:px-8">
        <AnimatePresence mode="wait">
          {status === 'result' && result ? (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ValueCard imageSrc={previewSrc} result={result} onReset={handleReset} />
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-panel rounded-xl3 p-6 sm:p-8"
            >
              {status === 'loading' ? (
                <LoadingAnimation imageSrc={previewSrc} />
              ) : (
                <div className="flex flex-col gap-6">
                  <ImageUploader
                    previewSrc={previewSrc}
                    onFileSelect={handleFileSelect}
                    onClear={handleClear}
                    disabled={status === 'loading'}
                  />
                  <GenerateButton onClick={handleGenerate} disabled={!file} />
                  <p className="text-center text-xs leading-relaxed text-mist/35">
                    This value is fictional and created only for entertainment.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="relative mx-auto max-w-md px-6 pb-12 text-center sm:px-8">
        <p className="text-xs text-mist/30">
          Built for the timeline. Not affiliated with X Corp.
        </p>
      </footer>
    </div>
  )
}
