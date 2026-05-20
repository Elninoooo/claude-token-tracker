import { useState } from 'react'
import './index.css'
import { useData } from './hooks/useData'
import { StatCardGrid } from './components/StatCardGrid'
import { WeeklyChart } from './components/WeeklyChart'
import { MonthlyChart } from './components/MonthlyChart'
import { CostChart } from './components/CostChart'
import { RangeToggle } from './components/RangeToggle'
import type { Range } from './components/RangeToggle'
import { SkillBreakdownTable, AgentBreakdownTable } from './components/BreakdownTables'
import { ModelStackedChart, ModelPieChart } from './components/ModelCharts'
import { ProjectChart } from './components/ProjectChart'
import { ProjectTable, ConfigDirTable } from './components/Tables'
import { TipsPanel } from './components/TipsPanel'
import { LLMInsightsPanel } from './components/LLMInsightsPanel'

const DATA_URL = import.meta.env.VITE_DATA_URL || '/data.json'

function formatRelativeTime(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60) return 'il y a quelques secondes'
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`
  return `il y a ${Math.floor(diff / 3600)} h`
}

function getWeekDateRange(weekStart: string) {
  if (!weekStart) return ''
  const start = new Date(weekStart + 'T12:00:00')
  const end = new Date(weekStart + 'T12:00:00')
  end.setDate(end.getDate() + 6)
  const fmt = (d: Date) =>
    d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
  return `du ${fmt(start)} au ${fmt(end)} ${end.getFullYear()}`
}

export default function App() {
  const { data, error, loading } = useData(DATA_URL)
  const [graphRange, setGraphRange] = useState<Range>('S')

  if (loading) {
    return (
      <div className="flex flex-col gap-4 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Skeleton header */}
        <div className="h-6 w-40 bg-[var(--panel)] rounded animate-pulse" />
        <div className="h-4 w-64 bg-[var(--panel)] rounded animate-pulse" />
        {/* Skeleton cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-[var(--panel)] border border-[var(--border)] rounded-lg animate-pulse" />
          ))}
        </div>
        {/* Skeleton chart */}
        <div className="h-72 bg-[var(--panel)] border border-[var(--border)] rounded-lg animate-pulse" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3 text-[var(--muted)]">
        <p className="text-[var(--red)]">Impossible de charger data.json</p>
        <p className="text-sm">{error}</p>
        <p className="text-xs">
          Pointez{' '}
          <code className="bg-white/5 px-1.5 py-0.5 rounded">VITE_DATA_URL</code> vers votre
          fichier data.json, ou placez-le dans{' '}
          <code className="bg-white/5 px-1.5 py-0.5 rounded">public/data.json</code>.
        </p>
      </div>
    )
  }

  const weekNum = data.current_week_num ?? 0
  const weekStart = data.current_week_start ?? ''
  const weekRange = getWeekDateRange(weekStart)
  const hasMonthlyData = (data.monthly_series ?? []).length >= 3
  const hasDailyMedian = (data.median_daily_cost ?? 0) > 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <header className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Token Tracker</h1>
          {weekNum > 0 && (
            <p className="text-sm text-[var(--muted)]">
              Semaine {weekNum} · {weekRange}
            </p>
          )}
        </div>
        <p className="text-xs text-[var(--muted)] mt-1 flex-shrink-0">
          maj {formatRelativeTime(data.generated_at)}
        </p>
      </header>

      {/* Banner ccusage stale */}
      {!data.ccusage_status.fresh && (
        <div className="bg-[var(--red)]/10 border-l-4 border-[var(--red)] rounded px-4 py-3 mb-4 text-sm">
          <strong className="text-[var(--red)]">⚠ ccusage indisponible</strong> — données en cache
          du {data.ccusage_status.stale_since} (obsolètes de {data.ccusage_status.stale_days}j).
          Relancer le script quand le réseau est disponible.
        </div>
      )}

      {/* Stat cards */}
      <div className="mb-4">
        <StatCardGrid data={data} />
      </div>

      {/* Graph principal polymorphe */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            {graphRange === 'J' && 'Consommation quotidienne (% de la médiane)'}
            {graphRange === 'S' && `Consommation hebdomadaire (% du quota ${data.plan_name ?? 'plan'})`}
            {graphRange === 'M' && 'Consommation mensuelle (% de la médiane)'}
          </span>
          <RangeToggle
            value={graphRange}
            onChange={setGraphRange}
            disableM={!hasMonthlyData}
          />
        </div>
        {graphRange === 'J' && <CostChart data={data} percentMode={hasDailyMedian} />}
        {graphRange === 'S' && <WeeklyChart data={data} />}
        {graphRange === 'M' && <MonthlyChart data={data} />}
      </div>

      {/* Détail toujours visible — pas d'accordéon */}
      <div className="space-y-6">
        {/* Qu'est-ce qui coûte le plus : skills + agents */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-3">
            Ce qui te coûte le plus
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SkillBreakdownTable data={data} />
            <AgentBreakdownTable data={data} />
          </div>
        </div>

        {/* Répartition par modèle */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-3">
            Répartition par modèle
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ModelStackedChart data={data} />
            <ModelPieChart data={data} />
          </div>
        </div>

        {/* Activité par projet + config (table côte à côte) */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-3">
            Activité par projet et config
          </div>
          <ProjectChart data={data} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <ProjectTable data={data} />
            <ConfigDirTable data={data} />
          </div>
        </div>

        {/* Coût quotidien en $ */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-3">
            Coût quotidien (USD)
          </div>
          <CostChart data={data} percentMode={false} />
        </div>

        {/* Pistes d'optimisation */}
        {data.tips.length > 0 && (
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-3">
              Optimisation
            </div>
            <TipsPanel data={data} />
          </div>
        )}

        {/* Analyse IA */}
        {(data.llm_analysis ?? []).length > 0 && (
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-3">
              Analyse IA
            </div>
            <LLMInsightsPanel data={data} />
          </div>
        )}

        {/* Mention écologique */}
        {data.eco && (
          <p className="text-xs text-[var(--muted)]">
            ⚡ ~{data.eco.kwh.toFixed(2)} kWh · 🌱 ~{data.eco.kg_co2.toFixed(2)} kg CO₂ ce mois
            — Source : {data.eco.source} ({data.eco.note})
          </p>
        )}
      </div>

      <footer className="text-xs text-[var(--muted)] text-center pt-6 mt-6 border-t border-[var(--border)]">
        <code className="bg-white/5 px-1.5 py-0.5 rounded">
          python3 ~/Code/Cerebro/scripts/token-tracker.py
        </code>
      </footer>
    </div>
  )
}
