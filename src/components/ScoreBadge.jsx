import { motion } from 'framer-motion'

const ICON_COLORS = {
  blue: { bar: 'from-signal-blue to-signal-violet', text: 'text-signal-blue' },
  violet: { bar: 'from-signal-violet to-signal-cyan', text: 'text-signal-violet' },
  cyan: { bar: 'from-signal-cyan to-signal-blue', text: 'text-signal-cyan' },
}

export default function ScoreBadge({ icon: Icon, label, score, tone = 'blue', delay = 0 }) {
  const colors = ICON_COLORS[tone] ?? ICON_COLORS.blue

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Icon && <Icon size={15} className={colors.text} />}
          <span className="text-sm font-medium text-mist/80">{label}</span>
        </div>
        <span className="font-display text-sm font-semibold text-mist">{score}/100</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
          className={`h-full rounded-full bg-gradient-to-r ${colors.bar}`}
        />
      </div>
    </div>
  )
}
