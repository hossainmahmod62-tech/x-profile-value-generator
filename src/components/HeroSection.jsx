import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative mx-auto max-w-3xl px-6 pb-10 pt-8 text-center sm:px-8 sm:pt-14">
      {/* Soft floating orbs for depth — one deliberate ambient motion, not scattered per-element effects */}
      <div
        className="pointer-events-none absolute -top-10 left-1/2 -z-10 h-72 w-72 -translate-x-[140%] rounded-full bg-signal-blue/20 blur-3xl animate-float-slow"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-10 left-1/2 -z-10 h-72 w-72 translate-x-[60%] rounded-full bg-signal-violet/20 blur-3xl animate-float-slow"
        style={{ animationDelay: '2s' }}
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-mist/70"
      >
        <Sparkles size={14} className="text-signal-cyan" />
        <span>No blockchain. No data. Just vibes.</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        className="text-balance font-display text-4xl font-semibold leading-[1.1] tracking-tight text-mist sm:text-6xl"
      >
        Discover Your X Profile's{' '}
        <span className="text-gradient">Fictional Value</span> 
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mt-5 max-w-xl text-balance text-base text-mist/65 sm:text-lg"
      >
        Upload your profile picture and discover your imaginary digital worth,
        rarity, and profile personality. Purely for fun built to share.
      </motion.p>
    </section>
  )
}
