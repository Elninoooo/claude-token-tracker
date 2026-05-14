import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Cell, LabelList,
} from 'recharts'
import type { DashboardData } from '../types'
import { fmtTokens } from '../utils'

export function WeeklyChart({ data }: { data: DashboardData }) {
  const series = data.weekly_series ?? []
  const weeklyMedian = data.weekly_median ?? 0
  const hasMedian = weeklyMedian > 0
  const projPct = data.current_week_projected_pct

  if (!hasMedian || series.filter((w) => w.tokens > 0).length === 0) {
    return (
      <div className="bg-[var(--panel)] border border-[var(--border)] rounded-lg p-5 flex items-center justify-center h-72">
        <p className="text-sm text-[var(--muted)] text-center px-4">
          Au moins 2 semaines complètes nécessaires pour calculer une médiane
        </p>
      </div>
    )
  }

  const chartData = series.filter((w) => w.tokens > 0 || w.is_current)
  const maxPct = Math.max(...chartData.map((w) => w.pct ?? 0), 100)
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
              const label = props.payload?.is_current ? 'Consommé (semaine en cours)' : 'Consommation'
              const v = typeof value === 'number' ? value : null
              return [v != null ? `${v.toFixed(1)} %${tokens}` : '—', label]
            }}
          />
          <ReferenceLine
            y={100}
            stroke="var(--muted)"
            strokeDasharray="4 2"
            label={{
              value: 'médiane',
              position: 'insideTopRight',
              fontSize: 10,
              fill: 'var(--muted)',
            }}
          />
          <Bar dataKey="pct" radius={[3, 3, 0, 0]} maxBarSize={60}>
            {chartData.map((entry, i) => (
              <Cell
                key={`cell-${i}`}
                fill={entry.is_current ? 'url(#stripe-current)' : 'var(--accent)'}
              />
            ))}
            <LabelList
              dataKey="pct"
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
          projection {projPct.toFixed(0)} % ⤴
        </p>
      )}
    </div>
  )
}
