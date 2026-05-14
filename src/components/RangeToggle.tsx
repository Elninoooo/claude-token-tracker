type Range = 'J' | 'S' | 'M'

interface RangeToggleProps {
  value: Range
  onChange: (range: Range) => void
  disableM?: boolean
}

export function RangeToggle({ value, onChange, disableM = false }: RangeToggleProps) {
  const ranges: { label: Range; title: string }[] = [
    { label: 'J', title: 'Jour' },
    { label: 'S', title: 'Semaine' },
    { label: 'M', title: 'Mois' },
  ]

  return (
    <div className="flex gap-1">
      {ranges.map(({ label, title }) => {
        const disabled = label === 'M' && disableM
        return (
          <button
            key={label}
            onClick={() => !disabled && onChange(label)}
            disabled={disabled}
            title={disabled ? 'Au moins 3 mois complets nécessaires' : title}
            className={`text-xs px-2.5 py-1 rounded border transition-colors ${
              value === label && !disabled
                ? 'bg-[var(--accent)] border-[var(--accent)] text-[#0d1117]'
                : disabled
                ? 'border-[var(--border)] text-[var(--border)] cursor-not-allowed'
                : 'border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

export type { Range }
