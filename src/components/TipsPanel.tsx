import type { DashboardData } from '../types'

export function TipsPanel({ data }: { data: DashboardData }) {
  if (!data.tips.length) return null
  return (
    <div className="space-y-2">
      {data.tips.map((tip, i) => (
        <div
          key={i}
          className="bg-[var(--panel)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm flex gap-3"
        >
          <span className="text-[var(--orange)] flex-shrink-0">💡</span>
          <span>{tip}</span>
        </div>
      ))}
    </div>
  )
}
