import { DashboardData } from '../types'
import { fmtCost } from '../utils'

export function BeforeAfterPanel({ data }: { data: DashboardData }) {
  const pivot = data.pivots[data.pivots.length - 1]
  const savedPositive = data.saved_so_far >= 0

  return (
    <div className="bg-[var(--panel)] border border-[var(--border)] rounded-lg p-5">
      <h3 className="text-sm font-semibold mb-4">
        Avant / après {pivot.date} — {pivot.label}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Cell label="Avant" value={fmtCost(data.avg_before)} sub={`${data.before_period} (${data.before_days}j)`} />
        <Cell label="Après" value={fmtCost(data.avg_after)} sub={`${data.after_period} (${data.after_days}j)`} />
        <Cell
          label="Delta"
          value={`${data.delta_avg_pct > 0 ? '▲' : '▼'} ${Math.abs(data.delta_avg_pct).toFixed(1)}%`}
          sub={data.delta_avg_pct < 0 ? 'baisse' : 'hausse'}
          color={data.delta_avg_pct < 0 ? 'var(--green)' : 'var(--red)'}
        />
        <Cell
          label="Économisé"
          value={fmtCost(Math.abs(data.saved_so_far))}
          sub={`${savedPositive ? 'cumulé depuis pivot' : 'surcoût cumulé'} · ~${fmtCost(data.saved_monthly_est)}/mois est.`}
          color={savedPositive ? 'var(--green)' : 'var(--red)'}
        />
      </div>
      {data.after_days < 3 && (
        <p className="text-xs text-[var(--orange)] mt-3">
          ⚠ Données après-pivot encore minces ({data.after_days} jour(s)). Relancer dans 5-7 jours.
        </p>
      )}
    </div>
  )
}

function Cell({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="bg-white/[0.02] rounded-md p-3 text-center">
      <div className="text-xs uppercase tracking-wider text-[var(--muted)] mb-1">{label}</div>
      <div className="text-xl font-semibold" style={color ? { color } : undefined}>{value}</div>
      {sub && <div className="text-xs text-[var(--muted)] mt-1">{sub}</div>}
    </div>
  )
}
