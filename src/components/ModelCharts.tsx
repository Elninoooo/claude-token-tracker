import { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer,
} from 'recharts'
import type { DashboardData } from '../types'
import { fmtCost, MODEL_COLORS, shortModelName } from '../utils'

export function ModelStackedChart({ data }: { data: DashboardData }) {
  const chartData = useMemo(() => {
    return data.chart_dates.slice(-60).map((date, i) => {
      const row: Record<string, string | number> = { date }
      data.model_list.forEach((m) => {
        row[shortModelName(m)] = data.model_daily[m][i] ?? 0
      })
      return row
    })
  }, [data])

  const shortNames = data.model_list.map(shortModelName)

  return (
    <div className="bg-[var(--panel)] border border-[var(--border)] rounded-lg p-5">
      <h3 className="text-sm font-semibold mb-4">Coût par modèle dans le temps (60j)</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} barSize={6}>
          <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#7d8590' }} tickFormatter={(v) => v.slice(5)} />
          <YAxis tick={{ fontSize: 11, fill: '#7d8590' }} tickFormatter={(v) => '$' + v} width={50} />
          <Tooltip
            contentStyle={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 6 }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(v: any, name: any) => [typeof v === 'number' ? fmtCost(v) : v, name]}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {shortNames.map((name, i) => (
            <Bar key={name} dataKey={name} stackId="a" fill={MODEL_COLORS[i % MODEL_COLORS.length]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function ModelPieChart({ data }: { data: DashboardData }) {
  return (
    <div className="bg-[var(--panel)] border border-[var(--border)] rounded-lg p-5">
      <h3 className="text-sm font-semibold mb-4">Mois en cours — par modèle</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data.by_model_cur}
            dataKey="cost"
            nameKey="label"
            cx="50%"
            cy="50%"
            outerRadius={90}
            innerRadius={45}
          >
            {data.by_model_cur.map((_, i) => (
              <Cell key={i} fill={MODEL_COLORS[i % MODEL_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 6 }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(v: any, name: any) => [typeof v === 'number' ? fmtCost(v) : v, name]}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
