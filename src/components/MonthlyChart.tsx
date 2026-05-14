import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, LabelList,
} from 'recharts'
import type { DashboardData } from '../types'
import { fmtTokens } from '../utils'

export function MonthlyChart({ data }: { data: DashboardData }) {
  const series = data.monthly_series ?? []
  const monthlyMedian = data.monthly_median_tokens ?? 0
  const hasData = series.length >= 3

  if (!hasData) {
    return (
      <div className="bg-[var(--panel)] border border-[var(--border)] rounded-lg p-5 flex items-center justify-center h-72">
        <p className="text-sm text-[var(--muted)] text-center px-4">
          Au moins 3 mois complets nécessaires
        </p>
      </div>
    )
  }

  const chartData = series.map((m) => ({
    ...m,
    label: m.month.slice(5), // affiche "05" au lieu de "2026-05"
  }))

  const maxPct = Math.max(...chartData.map((m) => m.pct ?? 0), 100)
  const yMax = Math.ceil(maxPct / 10) * 10 + 20

  return (
    <div className="bg-[var(--panel)] border border-[var(--border)] rounded-lg p-5">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} margin={{ top: 24, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--muted)' }} />
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
            formatter={(v: number, _name: string, props: { payload?: { tokens: number } }) => {
              const tokens = props.payload?.tokens ? ` (${fmtTokens(props.payload.tokens)})` : ''
              return [v != null ? `${v.toFixed(1)} %${tokens}` : '—', 'Consommation']
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
          <Bar dataKey="pct" fill="var(--accent)" radius={[3, 3, 0, 0]} maxBarSize={48}>
            <LabelList
              dataKey="pct"
              position="top"
              fontSize={10}
              fill="var(--muted)"
              formatter={(v: number | null) => (v != null ? `${v.toFixed(0)}%` : '')}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {monthlyMedian > 0 && (
        <p className="text-xs text-[var(--muted)] text-right mt-1 pr-4">
          médiane mensuelle : {fmtTokens(monthlyMedian)}
        </p>
      )}
    </div>
  )
}
