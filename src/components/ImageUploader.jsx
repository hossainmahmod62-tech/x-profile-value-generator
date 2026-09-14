import { useCallback, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, ImageUp, X } from 'lucide-react'

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

/**
 * Drag-and-drop + click-to-browse uploader. Reports the raw File object up
 * via onFileSelect so the parent can hash it and drive value generation.
 */
export default function ImageUploader({ previewSrc, onFileSelect, onClear, disabled }) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  const handleFiles = useCallback(
    (fileList) => {
      const file = fileList?.[0]
      if (!file) return

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError('Please upload a JPG, PNG, or WEBP image.')
        return
      }

      setError('')
      onFileSelect(file)
    },
    [onFileSelect]
  )

  const onDrop = useCallback(
    (e) => {
      e.preventDefault()
      setIsDragging(false)
      if (disabled) return
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles, disabled]
  )

  return (
    <div className="w-full">
      <div
        onDragOver={(e) => {
          e.preventDefault()
          if (!disabled) setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled) inputRef.current?.click()
        }}
        aria-label="Upload your profile picture"
        className={`
          relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center gap-3
          rounded-xl2 border-2 border-dashed px-6 py-10 text-center transition-all duration-300
          ${isDragging ? 'border-signal-violet bg-signal-violet/10 scale-[1.01]' : 'border-white/15 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.05]'}
          ${disabled ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <AnimatePresence mode="wait">
          {previewSrc ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <img
                src={previewSrc}
                alt="Your uploaded profile preview"
                className="h-32 w-32 rounded-full border-2 border-white/20 object-cover shadow-glow-blue sm:h-36 sm:w-36"
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onClear()
                    setError('')
                  }}
                  aria-label="Remove image"
                  className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-void/90 text-mist/80 ring-1 ring-white/20 transition-colors hover:bg-void hover:text-mist"
                >
                  <X size={15} />
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-signal-blue/20 to-signal-violet/20 ring-1 ring-white/10">
                {isDragging ? (
                  <ImageUp size={24} className="text-signal-cyan" />
                ) : (
                  <UploadCloud size={24} className="text-mist/70" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-mist/90">
                  {isDragging ? 'Drop it right here' : 'Drag & drop your profile picture'}
                </p>
                <p className="mt-1 text-xs text-mist/50">
                  or click to browse — JPG, PNG, or WEBP
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <p className="mt-3 text-center text-sm text-rose-300/90" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
