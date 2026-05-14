import type { DashboardData } from '../types'
import { fmtTokens } from '../utils'

interface CardProps {
  label: string
  value: string
  sub: string
  intent?: 'neutral' | 'up' | 'down' | 'warn'
}

function StatCard({ label, value, sub, intent = 'neutral' }: CardProps) {
  const valueColor =
    intent === 'up' ? 'text-[var(--red)]'
    : intent === 'down' ? 'text-[var(--green)]'
    : intent === 'warn' ? 'text-[var(--orange)]'
    : 'text-[var(--text)]'

  return (
    <div className="bg-[var(--panel)] border border-[var(--border)] rounded-lg p-4">
      <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">
        {label}
      </div>
      <div className={`text-3xl font-semibold ${valueColor}`}>{value}</div>
      <div className={`text-xs mt-1 ${intent === 'warn' ? 'text-[var(--orange)]' : 'text-[var(--muted)]'}`}>
        {sub}
      </div>
    </div>
  )
}

export function StatCardGrid({ data }: { data: DashboardData }) {
  const weekNum = data.current_week_num ?? 0
  const prevWeekNum = weekNum > 1 ? weekNum - 1 : 52
  const daysInWeek = data.days_in_current_week ?? 0
  const weeklyMedian = data.weekly_median ?? 0
  const hasMedian = weeklyMedian > 0

  // Card 1 — % consommé
  const consumedPct = data.current_week_consumed_pct
  const consumedVal = hasMedian && consumedPct != null ? `${consumedPct.toFixed(0)} %` : '—'
  const consumedSub = hasMedian
    ? `sur ${daysInWeek} jour${daysInWeek > 1 ? 's' : ''}`
    : 'Données insuffisantes'

  // Card 2 — projection fin de semaine
  const projPct = data.current_week_projected_pct
  const projVal = hasMedian && projPct != null ? `${projPct.toFixed(0)} %` : '—'
  const projSub = daysInWeek === 1 ? 'J1 — projection peu fiable' : 'à ce rythme'
  const projIntent: CardProps['intent'] = daysInWeek === 1 ? 'warn' : 'neutral'

  // Card 3 — tokens consommés
  const tokensVal = fmtTokens(data.current_week_tokens ?? 0)
  const tokensSub = hasMedian
    ? `médiane ${fmtTokens(weeklyMedian)}`
    : 'Données insuffisantes'

  // Card 4 — delta vs semaine précédente
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
  const deltaSub = delta != null ? `vs S${prevWeekNum}` : 'Données insuffisantes'

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard label="% Consommé" value={consumedVal} sub={consumedSub} />
      <StatCard
        label="Projection fin de semaine"
        value={projVal}
        sub={projSub}
        intent={projIntent}
      />
      <StatCard label="Tokens consommés" value={tokensVal} sub={tokensSub} />
      <StatCard
        label="Delta vs sem. précédente"
        value={deltaVal}
        sub={deltaSub}
        intent={deltaIntent}
      />
    </div>
  )
}
