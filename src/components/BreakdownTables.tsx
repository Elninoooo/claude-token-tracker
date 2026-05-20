import type { DashboardData } from '../types'
import { fmtCost, fmtTokens } from '../utils'

export function SkillBreakdownTable({ data }: { data: DashboardData }) {
  const items = data.skill_breakdown ?? []
  const windowDays = data.breakdown_window_days ?? 30
  const total = items.reduce((sum, s) => sum + s.cost, 0)

  if (items.length === 0) {
    return (
      <div className="bg-[var(--panel)] border border-[var(--border)] rounded-lg p-5 text-sm text-[var(--muted)]">
        Aucun skill détecté dans les {windowDays} derniers jours.
      </div>
    )
  }

  const max = items[0]?.cost ?? 1

  return (
    <div className="bg-[var(--panel)] border border-[var(--border)] rounded-lg p-5">
      <h3 className="text-sm font-semibold mb-1">Skills les plus coûteux</h3>
      <p className="text-xs text-[var(--muted)] mb-4">
        {windowDays} derniers jours · total attribué {fmtCost(total)}
      </p>
      <div className="space-y-2">
        {items.map((s) => {
          const pct = (s.cost / max) * 100
          return (
            <div key={s.skill} className="flex items-center gap-3 text-sm">
              <span className="font-mono text-xs text-[var(--accent)] w-36 truncate">/{s.skill}</span>
              <div className="flex-1 h-5 bg-white/5 rounded relative overflow-hidden">
                <div
                  className="h-full bg-[var(--accent)] opacity-70"
                  style={{ width: `${pct}%` }}
                />
                <span className="absolute inset-0 flex items-center px-2 text-xs text-[var(--text)]">
                  {fmtCost(s.cost)} · {s.sessions} session{s.sessions > 1 ? 's' : ''} · {fmtTokens(s.tokens)}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function AgentBreakdownTable({ data }: { data: DashboardData }) {
  const items = data.agent_breakdown ?? []
  const windowDays = data.breakdown_window_days ?? 30
  const totalCalls = items.reduce((sum, a) => sum + a.count, 0)

  if (items.length === 0) {
    return (
      <div className="bg-[var(--panel)] border border-[var(--border)] rounded-lg p-5 text-sm text-[var(--muted)]">
        Aucun agent détecté dans les {windowDays} derniers jours.
      </div>
    )
  }

  const max = items[0]?.count ?? 1

  return (
    <div className="bg-[var(--panel)] border border-[var(--border)] rounded-lg p-5">
      <h3 className="text-sm font-semibold mb-1">Agents les plus utilisés</h3>
      <p className="text-xs text-[var(--muted)] mb-4">
        {windowDays} derniers jours · {totalCalls} lancements total
      </p>
      <div className="space-y-2">
        {items.map((a) => {
          const pct = (a.count / max) * 100
          return (
            <div key={a.name} className="flex items-center gap-3 text-sm">
              <span className="font-mono text-xs text-[var(--accent)] w-36 truncate">{a.name}</span>
              <div className="flex-1 h-5 bg-white/5 rounded relative overflow-hidden">
                <div
                  className="h-full bg-[var(--accent)] opacity-70"
                  style={{ width: `${pct}%` }}
                />
                <span className="absolute inset-0 flex items-center px-2 text-xs text-[var(--text)]">
                  {a.count} lancements · {a.sessions} session{a.sessions > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
