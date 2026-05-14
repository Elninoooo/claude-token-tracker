import { useState } from 'react'
import type { DashboardData } from '../types'
import { fmtTokens } from '../utils'
import { TopDaysTable } from './Tables'
import { TipsPanel } from './TipsPanel'
import { LLMInsightsPanel } from './LLMInsightsPanel'

export function AnomalyPrompt({ data }: { data: DashboardData }) {
  const [expanded, setExpanded] = useState(false)
  const anomalies = data.anomaly_days ?? []

  // Afficher seulement si anomalie dans les 7 derniers jours
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 7)
  const cutoffStr = cutoff.toISOString().slice(0, 10)
  const recentAnomalies = anomalies.filter((a) => a.date >= cutoffStr)

  if (recentAnomalies.length === 0) return null

  // Pic principal = ratio le plus élevé parmi les anomalies récentes
  const worst = recentAnomalies.reduce((a, b) =>
    a.ratio_to_median >= b.ratio_to_median ? a : b
  )

  const dateLabel = new Date(worst.date + 'T12:00:00').toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
  })

  const hasLlm = (data.llm_analysis ?? []).length > 0
  const hasTips = (data.tips ?? []).length > 0
  const hasTopDays = (data.top_days ?? []).length > 0

  return (
    <div className="bg-[var(--panel)] border border-[var(--orange)]/40 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 gap-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[var(--orange)]">⚠</span>
          <span className="font-medium">
            Pic détecté · {dateLabel}
          </span>
          <span className="text-[var(--muted)]">
            ({fmtTokens(worst.tokens)}, {worst.ratio_to_median.toFixed(1)}× médiane)
          </span>
        </div>
        {(hasLlm || hasTips || hasTopDays) && (
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="text-xs px-3 py-1.5 rounded border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] transition-colors flex-shrink-0"
          >
            {hasLlm
              ? expanded
                ? 'Masquer l'analyse →'
                : 'Lancer l'analyse Haiku →'
              : expanded
              ? 'Masquer le détail'
              : 'Voir le détail'}
          </button>
        )}
      </div>

      {expanded && (
        <div className="border-t border-[var(--border)] px-5 py-4 space-y-4">
          {hasTopDays && <TopDaysTable data={data} />}
          {hasTips && <TipsPanel data={data} />}
          {hasLlm && <LLMInsightsPanel data={data} />}
        </div>
      )}
    </div>
  )
}
