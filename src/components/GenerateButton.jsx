import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export default function GenerateButton({ onClick, disabled }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? {} : { scale: 0.97 }}
      className={`
        group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full
        px-6 py-4 font-display text-base font-semibold tracking-tight transition-all duration-300
        ${
          disabled
            ? 'cursor-not-allowed bg-white/5 text-mist/30'
            : 'bg-gradient-to-r from-signal-blue to-signal-violet text-white shadow-glow-violet hover:shadow-glow-blue'
        }
      `}
    >
      {/* Diagonal shine sweep on hover — a single tasteful CTA flourish */}
      {!disabled && (
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
      )}
      <Sparkles size={18} className={disabled ? '' : 'transition-transform group-hover:rotate-12'} />
      <span className="relative">Generate My Value</span>
    </motion.button>
  )
}
