import { useMemo, useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Legend,
} from 'recharts'
import type { DashboardData } from '../types'
import { fmtCost } from '../utils'

const RANGES = [
  { label: '14j', days: 14 },
  { label: '30j', days: 30 },
  { label: '60j', days: 60 },
]

export function CostChart({ data }: { data: DashboardData }) {
  const [range, setRange] = useState(30)

  const chartData = useMemo(() => {
    const rows = data.chart_dates
      .map((date, i) => ({ date, cost: data.chart_costs[i] }))
      .slice(-range)
    return rows
  }, [data, range])

  const pivot = data.pivots[data.pivots.length - 1]

  return (
    <div className="bg-[var(--panel)] border border-[var(--border)] rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">Coût quotidien (USD)</h3>
        <div className="flex gap-1">
          {RANGES.map((r) => (
            <button
              key={r.days}
              onClick={() => setRange(r.days)}
              className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                range === r.days
                  ? 'bg-[var(--accent)] border-[var(--accent)] text-[#0d1117]'
                  : 'border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#58a6ff" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#58a6ff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#7d8590' }}
            tickFormatter={(v) => v.slice(5)}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#7d8590' }}
            tickFormatter={(v) => '$' + v}
            width={50}
          />
          <Tooltip
            contentStyle={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 6 }}
            labelStyle={{ color: '#e6edf3', marginBottom: 4 }}
            formatter={(v: number) => [fmtCost(v), 'Coût']}
          />
          <ReferenceLine
            x={pivot.date}
            stroke="#d29922"
            strokeDasharray="6 4"
            label={{ value: 'Pivot', position: 'insideTopLeft', fontSize: 10, fill: '#d29922' }}
          />
          <Area
            type="monotone"
            dataKey="cost"
            stroke="#58a6ff"
            strokeWidth={2}
            fill="url(#costGrad)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
