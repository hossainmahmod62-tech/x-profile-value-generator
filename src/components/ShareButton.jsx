import { Share2 } from 'lucide-react'
import { buildShareText } from '../utils/valueGenerator'

/**
 * Opens X's web intent with a prefilled tweet: the value, rarity,
 * personality, and a link back to the site so friends can generate their
 * own — the "challenge" framing is what actually drives viral sharing.
 */
export default function ShareButton({ result }) {
  const handleShare = () => {
    const siteUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const text = buildShareText(result, siteUrl)

    const url = new URL('https://twitter.com/intent/tweet')
    url.searchParams.set('text', text)
    window.open(url.toString(), '_blank', 'noopener,noreferrer')
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="flex items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/15 transition-transform active:scale-[0.98] hover:ring-white/30"
    >
      <Share2 size={16} />
      Share on X
    </button>
  )
}
