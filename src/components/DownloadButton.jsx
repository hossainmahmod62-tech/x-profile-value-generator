import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { renderResultCard, triggerDownload } from '../utils/canvasCard'

export default function DownloadButton({ imageSrc, result }) {
  const [isRendering, setIsRendering] = useState(false)

  const handleDownload = async () => {
    setIsRendering(true)
    try {
      const siteLabel =
        typeof window !== 'undefined' && window.location?.host ? window.location.host : 'ValueFeed'
      const dataUrl = await renderResultCard({ imageSrc, result, siteLabel })
      triggerDownload(dataUrl, `x-profile-value-${result.rarity.toLowerCase()}.png`)
    } finally {
      setIsRendering(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={isRendering}
      className="flex items-center justify-center gap-2 rounded-full bg-mist px-5 py-3 text-sm font-semibold text-void transition-opacity hover:opacity-90 disabled:opacity-60"
    >
      {isRendering ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
      {isRendering ? 'Rendering...' : 'Download Result Card'}
    </button>
  )
}
