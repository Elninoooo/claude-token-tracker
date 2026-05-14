import type { DashboardData } from '../types'
import { fmtCost, fmtTokens } from '../utils'

interface KPIProps {
  label: string
  value: string
  sub?: string
  delta?: number
  deltaLabel?: string
}

function KPI({ label, value, sub, delta, deltaLabel }: KPIProps) {
  const deltaEl =
    delta !== undefined ? (
      <div className={`text-xs mt-1 ${delta > 0 ? 'text-[var(--red)]' : 'text-[var(--green)]'}`}>
        {delta > 0 ? '▲' : '▼'} {Math.abs(delta).toFixed(1)}% {deltaLabel}
      </div>
    ) : sub ? (
      <div className="text-xs mt-1 text-[var(--muted)]">{sub}</div>
    ) : null

  return (
    <div className="bg-[var(--panel)] border border-[var(--border)] rounded-lg p-4">
      <div className="text-xs uppercase tracking-wider text-[var(--muted)] mb-1.5">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
      {deltaEl}
    </div>
  )
}

export function KPIGrid({ data }: { data: DashboardData }) {
  const kpis: KPIProps[] = [
    { label: `Coût ${data.current_month}`, value: fmtCost(data.cur_cost), sub: `Jour ${data.day_of_month}` },
    {
      label: 'Projection fin de mois',
      value: fmtCost(data.pace),
      sub: data.day_of_month === 1 ? 'J1 — peu fiable' : 'à ce rythme',
    },
    {
      label: `Mois précédent (${data.prev_month})`,
      value: fmtCost(data.prev_cost),
      delta: data.delta_pct,
      deltaLabel: 'vs projection',
    },
    { label: 'Total tokens (mois)', value: fmtTokens(data.total_tokens) },
    { label: 'Cache create (mois)', value: fmtTokens(data.cache_create) },
    { label: 'Cache read (mois)', value: fmtTokens(data.cache_read) },
  ]

  if (data.eco) {
    kpis.push(
      { label: '⚡ kWh estimé (mois)', value: data.eco.kwh.toFixed(2) + ' kWh', sub: 'indicatif ±50%' },
      { label: '🌱 CO₂ estimé (mois)', value: data.eco.kg_co2.toFixed(2) + ' kg CO₂', sub: data.eco.source },
    )
  }

  return (
    <div className="mb-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {kpis.map((k) => (
          <KPI key={k.label} {...k} />
        ))}
      </div>
      {data.eco && (
        <p className="text-xs text-[var(--muted)] mt-2 px-1">
          Source écolo : {data.eco.source} — {data.eco.note}
        </p>
      )}
    </div>
  )
}
