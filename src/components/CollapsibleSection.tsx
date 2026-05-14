import { useState } from 'react'

interface CollapsibleSectionProps {
  label: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export function CollapsibleSection({
  label,
  children,
  defaultOpen = false,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="bg-[var(--panel)] border border-[var(--border)] rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-5 py-3 text-sm font-medium hover:bg-white/[0.02] transition-colors"
      >
        <span>{open ? '▴' : '▾'} {label}</span>
      </button>
      {open && (
        <div className="border-t border-[var(--border)] px-5 py-4">{children}</div>
      )}
    </div>
  )
}
