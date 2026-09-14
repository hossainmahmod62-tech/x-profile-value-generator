import { motion } from 'framer-motion'
import { RotateCcw, Wand2, Flame, Zap } from 'lucide-react'
import ScoreBadge from './ScoreBadge'
import ShareButton from './ShareButton'
import DownloadButton from './DownloadButton'
import { formatCurrency } from '../utils/valueGenerator'

export default function ValueCard({ imageSrc, result, onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel relative w-full overflow-hidden rounded-xl3 p-6 sm:p-8"
      style={{ boxShadow: `0 8px 40px -8px ${result.rarityColor}55, 0 8px 32px rgba(0,0,0,0.35)` }}
    >
      {/* Rarity-tinted ambient wash — ties the whole card to the tier color */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{ backgroundColor: result.rarityColor }}
        aria-hidden="true"
      />

      <div className="relative flex flex-col items-center text-center">
        <span className="mb-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-mist/40">
          Edition #{String(result.editionNumber).padStart(6, '0')}
        </span>

        <div className="relative mt-3">
          <img
            src={imageSrc}
            alt="Your profile"
            className="h-28 w-28 rounded-full border-2 object-cover sm:h-32 sm:w-32"
            style={{ borderColor: `${result.rarityColor}88`, boxShadow: `0 0 30px ${result.rarityColor}55` }}
          />
        </div>

        <p className="mt-5 font-display text-lg font-semibold text-mist">
          {result.personalityEmoji} {result.personalityName}
        </p>

        <span
          className="mt-3 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide"
          style={{
            color: result.rarityColor,
            backgroundColor: `${result.rarityColor}1A`,
            border: `1px solid ${result.rarityColor}55`,
          }}
        >
          {result.rarityEmoji} {result.rarity.toUpperCase()}
        </span>

        <p className="mt-7 text-xs font-medium uppercase tracking-[0.2em] text-mist/50">
          Fictional X Profile Value
        </p>
        <p className="value-shimmer mt-2 font-display text-5xl font-bold tracking-tight sm:text-6xl">
          {formatCurrency(result.value)}
        </p>

        <span className="mt-4 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-mist/70">
          Degen Level · {result.degenLevel}
        </span>
      </div>

      <div className="relative my-7 h-px w-full bg-white/10" />

      <div className="relative flex flex-col gap-5">
        <ScoreBadge icon={Wand2} label="Digital Aura" score={result.digitalAura} tone="blue" delay={0.1} />
        <ScoreBadge icon={Flame} label="Meme Energy" score={result.memeEnergy} tone="violet" delay={0.2} />
        <ScoreBadge icon={Zap} label="Timeline Power" score={result.timelinePower} tone="cyan" delay={0.3} />
      </div>

      {/*
        Always single-column: this card has a fixed max-w-md regardless of
        viewport, so a viewport-based sm:grid-cols-2 split (as opposed to a
        container-based one) starves each button of width on wide screens
        and wraps "Download Result Card" onto two lines. Full-width stacked
        buttons stay correct at every screen size.
      */}
      <div className="relative mt-8 grid grid-cols-1 gap-3">
        <ShareButton result={result} />
        <DownloadButton imageSrc={imageSrc} result={result} />
      </div>

      <button
        type="button"
        onClick={onReset}
        className="relative mx-auto mt-4 flex items-center gap-2 text-sm font-medium text-mist/50 transition-colors hover:text-mist/80"
      >
        <RotateCcw size={14} />
        Try another picture
      </button>

      <p className="relative mt-6 text-center text-xs leading-relaxed text-mist/35">
        This value is fictional and created only for entertainment.
      </p>
    </motion.div>
  )
}
