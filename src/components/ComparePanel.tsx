import { useMemo, useState } from 'react'
import type { DashboardData } from '../types'
import { fmtCost } from '../utils'

interface PeriodStats {
  avgPerDay: number
  totalCost: number
  days: number
  label: string
}

function computePeriod(
  dates: string[],
  costs: number[],
  from: string,
  to: string,
): PeriodStats | null {
  const rows = dates
    .map((d, i) => ({ date: d, cost: costs[i] }))
    .filter((r) => r.date >= from && r.date <= to)

  if (!rows.length) return null
  const totalCost = rows.reduce((s, r) => s + r.cost, 0)
  return {
    avgPerDay: totalCost / rows.length,
    totalCost,
    days: rows.length,
    label: `${from} → ${to}`,
  }
}

export function ComparePanel({ data }: { data: DashboardData }) {
  const minDate = data.chart_dates[0] ?? ''
  const maxDate = data.chart_dates[data.chart_dates.length - 1] ?? ''

  const oneMonthAgo = useMemo(() => {
    if (!maxDate) return minDate
    const d = new Date(maxDate)
    d.setDate(d.getDate() - 30)
    return d.toISOString().slice(0, 10)
  }, [maxDate, minDate])

  const [a1, setA1] = useState(minDate)
  const [a2, setA2] = useState(oneMonthAgo)
  const [b1, setB1] = useState(oneMonthAgo)
  const [b2, setB2] = useState(maxDate)

  const periodA = useMemo(
    () => computePeriod(data.chart_dates, data.chart_costs, a1, a2),
    [data, a1, a2],
  )
  const periodB = useMemo(
    () => computePeriod(data.chart_dates, data.chart_costs, b1, b2),
    [data, b1, b2],
  )

  const delta =
    periodA && periodB && periodA.avgPerDay > 0
      ? ((periodB.avgPerDay - periodA.avgPerDay) / periodA.avgPerDay) * 100
      : null

  const savedCumul =
    periodA && periodB
      ? (periodA.avgPerDay - periodB.avgPerDay) * periodB.days
      : null

  const inputClass =
    'bg-[var(--bg)] border border-[var(--border)] rounded text-sm px-2 py-1 text-[var(--text)] w-36'

  return (
    <div className="bg-[var(--panel)] border border-[var(--border)] rounded-lg p-5">
      <h3 className="text-sm font-semibold mb-4">Comparer deux périodes</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
        <div>
          <div className="text-xs text-[var(--muted)] uppercase tracking-wider mb-2">Période A (référence)</div>
          <div className="flex items-center gap-2">
            <input type="date" value={a1} min={minDate} max={a2} onChange={(e) => setA1(e.target.value)} className={inputClass} />
            <span className="text-[var(--muted)]">→</span>
            <input type="date" value={a2} min={a1} max={maxDate} onChange={(e) => setA2(e.target.value)} className={inputClass} />
          </div>
          {periodA && (
            <div className="mt-2 text-sm">
              <span className="font-semibold">{fmtCost(periodA.avgPerDay)}/j</span>
              <span className="text-[var(--muted)] ml-2">{fmtCost(periodA.totalCost)} total · {periodA.days}j</span>
            </div>
          )}
        </div>
        <div>
          <div className="text-xs text-[var(--muted)] uppercase tracking-wider mb-2">Période B (comparée)</div>
          <div className="flex items-center gap-2">
            <input type="date" value={b1} min={minDate} max={b2} onChange={(e) => setB1(e.target.value)} className={inputClass} />
            <span className="text-[var(--muted)]">→</span>
            <input type="date" value={b2} min={b1} max={maxDate} onChange={(e) => setB2(e.target.value)} className={inputClass} />
          </div>
          {periodB && (
            <div className="mt-2 text-sm">
              <span className="font-semibold">{fmtCost(periodB.avgPerDay)}/j</span>
              <span className="text-[var(--muted)] ml-2">{fmtCost(periodB.totalCost)} total · {periodB.days}j</span>
            </div>
          )}
        </div>
      </div>

      {delta !== null && savedCumul !== null && (
        <div className="grid grid-cols-2 gap-3 border-t border-[var(--border)] pt-4">
          <div className="text-center">
            <div className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">Delta avg/jour</div>
            <div className={`text-2xl font-semibold ${delta < 0 ? 'text-[var(--green)]' : 'text-[var(--red)]'}`}>
              {delta > 0 ? '▲' : '▼'} {Math.abs(delta).toFixed(1)}%
            </div>
            <div className="text-xs text-[var(--muted)] mt-1">
              {delta < 0 ? 'B moins cher que A' : 'B plus cher que A'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">
              {savedCumul >= 0 ? 'Économisé (cumulé B)' : 'Surcoût (cumulé B)'}
            </div>
            <div className={`text-2xl font-semibold ${savedCumul >= 0 ? 'text-[var(--green)]' : 'text-[var(--red)]'}`}>
              {fmtCost(Math.abs(savedCumul))}
            </div>
            <div className="text-xs text-[var(--muted)] mt-1">sur {periodB?.days}j</div>
          </div>
        </div>
      )}
    </div>
  )
}
