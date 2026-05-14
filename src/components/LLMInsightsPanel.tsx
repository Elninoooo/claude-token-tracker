import { DashboardData } from '../types'
import { fmtCost } from '../utils'

export function LLMInsightsPanel({ data }: { data: DashboardData }) {
  const analysis = data.llm_analysis ?? []
  if (analysis.length === 0) return null

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
          Analyse IA des pics de coût
        </span>
        <span className="text-xs text-[var(--muted)]">
          claude-haiku-4-5 · top 3 jours · &lt;$0.02/run
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {analysis.map((day) => {
          const topDay = data.top_days.find((d) => d.date === day.date)
          return (
            <div key={day.date} className="border border-[var(--border)] rounded-md p-3">
              <div className="text-sm font-semibold mb-2 text-[var(--fg)]">
                📅 {day.date}
                {topDay && (
                  <span className="ml-2 text-[var(--red)] font-normal">
                    {fmtCost(topDay.totalCost)}
                  </span>
                )}
              </div>
              <ul className="flex flex-col gap-1">
                {day.bullets.map((bullet, i) => (
                  <li key={i} className="flex gap-2 text-sm text-[var(--fg)]">
                    <span className="text-[var(--purple)] shrink-0">▸</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
