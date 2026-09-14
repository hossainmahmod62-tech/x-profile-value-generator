import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getLoadingMessages } from '../utils/valueGenerator'

/**
 * Shown while the (simulated) analysis runs. Cycles through playful status
 * lines so the wait feels alive rather than a frozen spinner.
 */
export default function LoadingAnimation({ imageSrc }) {
  const messages = getLoadingMessages()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length)
    }, 750)
    return () => clearInterval(interval)
  }, [messages.length])

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <div className="relative flex h-32 w-32 items-center justify-center">
        {/* Pulsing rings */}
        <span className="absolute inset-0 rounded-full border-2 border-signal-blue/50 animate-pulse-ring" />
        <span
          className="absolute inset-0 rounded-full border-2 border-signal-violet/50 animate-pulse-ring"
          style={{ animationDelay: '0.7s' }}
        />

        <div className="relative h-24 w-24 overflow-hidden rounded-full ring-2 ring-white/20">
          {imageSrc ? (
            <img src={imageSrc} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-signal-blue/40 to-signal-violet/40" />
          )}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-signal-violet/30 via-transparent to-signal-cyan/20"
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </div>

      <div className="h-6 overflow-hidden text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="text-sm font-medium text-mist/70"
          >
            {messages[index]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Indeterminate progress track — reinforces that work is happening */}
      <div className="h-1 w-40 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full w-1/3 rounded-full bg-gradient-to-r from-signal-blue via-signal-violet to-signal-cyan"
          animate={{ x: ['-120%', '220%'] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </div>
  )
}
