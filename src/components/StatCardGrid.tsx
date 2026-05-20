import type { DashboardData } from '../types'
import { fmtTokens } from '../utils'

interface CardProps {
  label: string
  value: string
  sub: string
  intent?: 'neutral' | 'up' | 'down' | 'warn' | 'danger'
}

function StatCard({ label, value, sub, intent = 'neutral' }: CardProps) {
  const valueColor =
    intent === 'danger' ? 'text-[var(--red)]'
    : intent === 'up' ? 'text-[var(--red)]'
    : intent === 'down' ? 'text-[var(--green)]'
    : intent === 'warn' ? 'text-[var(--orange)]'
    : 'text-[var(--text)]'

  return (
    <div className="bg-[var(--panel)] border border-[var(--border)] rounded-lg p-4">
      <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">
        {label}
      </div>
      <div className={`text-3xl font-semibold ${valueColor}`}>{value}</div>
      <div className={`text-xs mt-1 ${
        intent === 'warn' ? 'text-[var(--orange)]'
        : intent === 'danger' ? 'text-[var(--red)]'
        : 'text-[var(--muted)]'
      }`}>
        {sub}
      </div>
    </div>
  )
}

function pickIntent(pct: number): CardProps['intent'] {
  if (pct >= 100) return 'danger'
  if (pct >= 80) return 'warn'
  return 'neutral'
}

export function StatCardGrid({ data }: { data: DashboardData }) {
  const weekNum = data.current_week_num ?? 0
  const prevWeekNum = weekNum > 1 ? weekNum - 1 : 52
  const daysInWeek = data.days_in_current_week ?? 0

  const planName = data.plan_name ?? 'Plan inconnu'
  const planQuota = data.plan_weekly_token_quota ?? 0
  const planPct = data.plan_weekly_pct_consumed ?? 0
  const planProjPct = data.plan_weekly_pct_projected ?? 0
  const tokensRemaining = data.plan_weekly_tokens_remaining ?? 0
  const tokensConsumed = data.current_week_tokens ?? 0

  // Card 1 — % du quota plan consommé (PRINCIPAL)
  const quotaVal = `${planPct.toFixed(0)} %`
  const quotaSub = `${fmtTokens(tokensConsumed)} / ${fmtTokens(planQuota)} · ${planName}`
  const quotaIntent = pickIntent(planPct)

  // Card 2 — projection fin de semaine vs quota
  const projVal = `${planProjPct.toFixed(0)} %`
  const projSub = daysInWeek === 1
    ? 'J1 — projection peu fiable'
    : `à ce rythme, fin de semaine`
  const projIntent: CardProps['intent'] = daysInWeek === 1 ? 'warn' : pickIntent(planProjPct)

  // Card 3 — tokens restants avant blocage
  const remainingVal = fmtTokens(tokensRemaining)
  const remainingSub = tokensRemaining > 0 ? 'avant blocage hebdo' : 'quota épuisé'

  // Card 4 — delta vs semaine précédente (tendance perso)
  const delta = data.prev_week_delta_pct
  let deltaVal = '—'
  let deltaIntent: CardProps['intent'] = 'neutral'
  if (delta != null) {
    const abs = Math.abs(delta)
    if (abs < 5) {
      deltaVal = 'stable'
      deltaIntent = 'neutral'
    } else if (delta > 0) {
      deltaVal = `▲ +${delta.toFixed(0)} %`
      deltaIntent = 'up'
    } else {
      deltaVal = `▼ ${delta.toFixed(0)} %`
      deltaIntent = 'down'
    }
  }
  const deltaSub = delta != null ? `projection vs S${prevWeekNum}` : 'Données insuffisantes'

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard
        label="% du quota hebdo"
        value={quotaVal}
        sub={quotaSub}
        intent={quotaIntent}
      />
      <StatCard
        label="Projection fin de semaine"
        value={projVal}
        sub={projSub}
        intent={projIntent}
      />
      <StatCard
        label="Tokens restants"
        value={remainingVal}
        sub={remainingSub}
      />
      <StatCard
        label="Delta vs sem. précédente"
        value={deltaVal}
        sub={deltaSub}
        intent={deltaIntent}
      />
    </div>
  )
}
