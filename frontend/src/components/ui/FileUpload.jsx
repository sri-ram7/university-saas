import { useCallback, useRef, useState } from 'react'
import { FiUploadCloud, FiFile, FiX } from 'react-icons/fi'
import { cn } from '@/utils/cn'

/**
 * Generic drag-and-drop file picker. Purely presentational — it hands the
 * chosen File back via onFileSelect; feature-level hooks own the actual
 * upload request (POST /uploads).
 */
export default function FileUpload({
  label,
  accept,
  hint = 'Drag & drop or click to browse',
  file,
  onFileSelect,
  onClear,
  error,
  disabled = false,
}) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFiles = useCallback(
    (fileList) => {
      const picked = fileList?.[0]
      if (picked) onFileSelect?.(picked)
    },
    [onFileSelect]
  )

  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
          {label}
        </label>
      )}
      <div
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          if (!disabled) setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          if (!disabled) handleFiles(e.dataTransfer.files)
        }}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors',
          isDragging ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-slate-200 dark:border-ink-700',
          disabled && 'cursor-not-allowed opacity-50',
          error && 'border-rose-400'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          disabled={disabled}
          onChange={(e) => handleFiles(e.target.files)}
        />
        {file ? (
          <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
            <FiFile size={16} />
            <span className="max-w-[220px] truncate">{file.name}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onClear?.()
              }}
              className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-ink-700"
              aria-label="Remove file"
            >
              <FiX size={14} />
            </button>
          </div>
        ) : (
          <>
            <FiUploadCloud size={22} className="text-slate-400" />
            <p className="text-sm text-slate-500 dark:text-slate-400">{hint}</p>
          </>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{error}</p>}
    </div>
  )
}
