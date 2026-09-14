import { Sparkles } from 'lucide-react'

/**
 * Slim top navigation. Purely a brand anchor — this is a single-page tool,
 * so there's no nav links to speak of, just identity and a subtle CTA.
 */
export default function Navbar() {
  return (
    <header className="relative z-20 w-full">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6 sm:px-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-signal-blue to-signal-violet shadow-glow-blue">
            <Sparkles size={18} strokeWidth={2.25} className="text-white" />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight text-mist">
            ValueFeed
          </span>
        </div>

        <a
          href="#upload"
          className="hidden rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-mist/90 transition-colors hover:bg-white/10 sm:block"
        >
          Get your score
        </a>
      </div>
    </header>
  )
}
