import type { DashboardData } from '../types'
import { fmtCost } from '../utils'

export function ProjectTable({ data }: { data: DashboardData }) {
  return (
    <div className="bg-[var(--panel)] border border-[var(--border)] rounded-lg p-5">
      <h3 className="text-sm font-semibold mb-3">Activité par projet (60j)</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-[var(--muted)] text-xs uppercase tracking-wider border-b border-[var(--border)]">
            <th className="text-left py-2 px-3">Projet</th>
            <th className="text-right py-2 px-3">Sessions</th>
            <th className="text-right py-2 px-3">Tool calls</th>
            <th className="text-left py-2 px-3">Dernière activité</th>
          </tr>
        </thead>
        <tbody>
          {data.project_table.map((p) => (
            <tr key={p.name} className="border-b border-[var(--border)] last:border-0">
              <td className="py-2.5 px-3">{p.name}</td>
              <td className="py-2.5 px-3 text-right">{p.sessions}</td>
              <td className="py-2.5 px-3 text-right">{p.tool_calls.toLocaleString()}</td>
              <td className="py-2.5 px-3 text-[var(--muted)]">{p.last_active}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-[var(--muted)] mt-3">
        ccusage ne sépare pas le coût par projet. Sessions/tool calls = proxy d'intensité.
      </p>
    </div>
  )
}

export function ConfigDirTable({ data }: { data: DashboardData }) {
  if (!data.config_dir_table.length) return null
  return (
    <div className="bg-[var(--panel)] border border-[var(--border)] rounded-lg p-5">
      <h3 className="text-sm font-semibold mb-3">Config dirs actifs (60j)</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-[var(--muted)] text-xs uppercase tracking-wider border-b border-[var(--border)]">
            <th className="text-left py-2 px-3">Config dir</th>
            <th className="text-right py-2 px-3">Sessions</th>
            <th className="text-right py-2 px-3">Tool calls</th>
          </tr>
        </thead>
        <tbody>
          {data.config_dir_table.map((c) => (
            <tr key={c.name} className="border-b border-[var(--border)] last:border-0">
              <td className="py-2.5 px-3 font-mono text-xs">{c.name}</td>
              <td className="py-2.5 px-3 text-right">{c.sessions}</td>
              <td className="py-2.5 px-3 text-right">{c.tool_calls.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function TopDaysTable({ data }: { data: DashboardData }) {
  if (!data.top_days.length) return null
  return (
    <div className="bg-[var(--panel)] border border-[var(--border)] rounded-lg p-5">
      <h3 className="text-sm font-semibold mb-3">Top jours coûteux</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-[var(--muted)] text-xs uppercase tracking-wider border-b border-[var(--border)]">
            <th className="text-left py-2 px-3">Date</th>
            <th className="text-right py-2 px-3">Coût</th>
            <th className="text-right py-2 px-3">vs médiane</th>
          </tr>
        </thead>
        <tbody>
          {data.top_days.map((d) => {
            const ratio =
              data.median_daily_cost > 0
                ? (d.totalCost / data.median_daily_cost).toFixed(1) + '×'
                : '—'
            return (
              <tr key={d.date} className="border-b border-[var(--border)] last:border-0">
                <td className="py-2.5 px-3">{d.date}</td>
                <td className="py-2.5 px-3 text-right">{fmtCost(d.totalCost)}</td>
                <td className="py-2.5 px-3 text-right text-[var(--orange)]">{ratio}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
