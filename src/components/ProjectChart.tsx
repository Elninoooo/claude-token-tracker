import { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import type { DashboardData } from '../types'
import { PROJECT_COLORS } from '../utils'

export function ProjectChart({ data }: { data: DashboardData }) {
  const chartData = useMemo(() => {
    return data.proj_chart_dates.slice(-60).map((date, i) => {
      const row: Record<string, string | number> = { date }
      data.proj_names.forEach((p) => {
        row[p] = data.proj_chart_series[p]?.[i] ?? 0
      })
      return row
    })
  }, [data])

  return (
    <div className="bg-[var(--panel)] border border-[var(--border)] rounded-lg p-5">
      <h3 className="text-sm font-semibold mb-4">Sessions par projet (60j)</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} barSize={6}>
          <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#7d8590' }} tickFormatter={(v) => v.slice(5)} />
          <YAxis tick={{ fontSize: 11, fill: '#7d8590' }} width={40} />
          <Tooltip
            contentStyle={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 6 }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {data.proj_names.map((p, i) => (
            <Bar key={p} dataKey={p} stackId="a" fill={PROJECT_COLORS[i % PROJECT_COLORS.length]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
