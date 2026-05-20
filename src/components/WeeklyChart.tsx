import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Cell, LabelList,
} from 'recharts'
import type { DashboardData } from '../types'
import { fmtTokens } from '../utils'

export function WeeklyChart({ data }: { data: DashboardData }) {
  const series = data.weekly_series ?? []
  const planQuota = data.plan_weekly_token_quota ?? 0
  const hasQuota = planQuota > 0
  const projPct = data.plan_weekly_pct_projected

  if (!hasQuota || series.filter((w) => w.tokens > 0).length === 0) {
    return (
      <div className="bg-[var(--panel)] border border-[var(--border)] rounded-lg p-5 flex items-center justify-center h-72">
        <p className="text-sm text-[var(--muted)] text-center px-4">
          Aucune donnée de consommation hebdomadaire
        </p>
      </div>
    )
  }

  // Affichage en % du quota plan
  const chartData = series
    .filter((w) => w.tokens > 0 || w.is_current)
    .map((w) => ({ ...w, displayPct: w.plan_pct ?? 0 }))
  const maxPct = Math.max(...chartData.map((w) => w.displayPct), 100)
  const yMax = Math.ceil(maxPct / 10) * 10 + 20

  return (
    <div className="bg-[var(--panel)] border border-[var(--border)] rounded-lg p-5">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} margin={{ top: 24, right: 16, bottom: 0, left: 0 }}>
          <defs>
            <pattern
              id="stripe-current"
              patternUnits="userSpaceOnUse"
              width="8"
              height="8"
              patternTransform="rotate(45)"
            >
              <rect width="4" height="8" fill="var(--accent)" fillOpacity="0.55" />
            </pattern>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="week" tick={{ fontSize: 11, fill: 'var(--muted)' }} />
          <YAxis
            domain={[0, yMax]}
            tick={{ fontSize: 11, fill: 'var(--muted)' }}
            tickFormatter={(v: number) => `${v}%`}
            width={45}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--panel)',
              border: '1px solid var(--border)',
              borderRadius: 6,
            }}
            labelStyle={{ color: 'var(--text)', marginBottom: 4 }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any, _name: any, props: any) => {
              const tokens = props.payload?.tokens ? ` (${fmtTokens(props.payload.tokens)})` : ''
              const label = props.payload?.is_current ? 'Quota (semaine en cours)' : '% du quota hebdo'
              const v = typeof value === 'number' ? value : null
              return [v != null ? `${v.toFixed(1)} %${tokens}` : '—', label]
            }}
          />
          <ReferenceLine
            y={100}
            stroke="var(--red)"
            strokeDasharray="4 2"
            label={{
              value: 'quota épuisé',
              position: 'insideTopRight',
              fontSize: 10,
              fill: 'var(--red)',
            }}
          />
          <Bar dataKey="displayPct" radius={[3, 3, 0, 0]} maxBarSize={60}>
            {chartData.map((entry, i) => (
              <Cell
                key={`cell-${i}`}
                fill={
                  entry.is_current
                    ? 'url(#stripe-current)'
                    : entry.displayPct >= 100
                      ? 'var(--red)'
                      : entry.displayPct >= 80
                        ? 'var(--orange)'
                        : 'var(--accent)'
                }
              />
            ))}
            <LabelList
              dataKey="displayPct"
              position="top"
              fontSize={10}
              fill="var(--muted)"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(v: any) => (typeof v === 'number' && v > 0 ? `${v.toFixed(0)}%` : '')}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {projPct != null && (
        <p className="text-xs text-[var(--muted)] text-right mt-1 pr-4">
          projection fin de semaine : {projPct.toFixed(0)} % du quota ⤴
        </p>
      )}
    </div>
  )
}
