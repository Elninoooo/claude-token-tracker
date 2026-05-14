import './index.css'
import { useData } from './hooks/useData'
import { KPIGrid } from './components/KPIGrid'
import { BeforeAfterPanel } from './components/BeforeAfterPanel'
import { CostChart } from './components/CostChart'
import { ModelStackedChart, ModelPieChart } from './components/ModelCharts'
import { ProjectChart } from './components/ProjectChart'
import { ProjectTable, ConfigDirTable, TopDaysTable } from './components/Tables'
import { TipsPanel } from './components/TipsPanel'
import { ComparePanel } from './components/ComparePanel'

const DATA_URL = import.meta.env.VITE_DATA_URL || '/data.json'

function Section({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      {title && (
        <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-3">
          {title}
        </div>
      )}
      {children}
    </div>
  )
}

export default function App() {
  const { data, error, loading } = useData(DATA_URL)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-[var(--muted)]">
        Chargement…
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3 text-[var(--muted)]">
        <p className="text-[var(--red)]">Impossible de charger data.json</p>
        <p className="text-sm">{error}</p>
        <p className="text-xs">
          Pointez <code className="bg-white/5 px-1.5 py-0.5 rounded">VITE_DATA_URL</code> vers votre fichier data.json,
          ou placez-le dans <code className="bg-white/5 px-1.5 py-0.5 rounded">public/data.json</code>.
        </p>
      </div>
    )
  }

  const pivot = data.pivots[data.pivots.length - 1]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-semibold mb-1">Token Tracker</h1>
        <p className="text-sm text-[var(--muted)]">
          Consommation Claude Code — généré le{' '}
          {new Date(data.generated_at).toLocaleString('fr-FR')}
        </p>
      </header>

      {/* Banners */}
      {!data.ccusage_status.fresh && (
        <div className="bg-[var(--red)]/10 border-l-4 border-[var(--red)] rounded px-4 py-3 mb-4 text-sm">
          <strong className="text-[var(--red)]">⚠ ccusage indisponible</strong> — données en
          cache du {data.ccusage_status.stale_since} (obsolètes de{' '}
          {data.ccusage_status.stale_days}j).
        </div>
      )}
      <div className="bg-[var(--orange)]/10 border-l-4 border-[var(--orange)] rounded px-4 py-3 mb-6 text-sm">
        <strong className="text-[var(--orange)]">{pivot.date}</strong> · {pivot.label}
        <br />
        <span className="text-[var(--muted)] text-xs">{pivot.description}</span>
      </div>

      {/* KPIs */}
      <Section>
        <KPIGrid data={data} />
      </Section>

      {/* Before / After */}
      <Section title="Impact du dernier pivot">
        <BeforeAfterPanel data={data} />
      </Section>

      {/* Compare */}
      <Section title="Comparer deux périodes">
        <ComparePanel data={data} />
      </Section>

      {/* Cost chart */}
      <Section title="Coût quotidien">
        <CostChart data={data} />
      </Section>

      {/* Model charts */}
      <Section title="Répartition par modèle">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ModelStackedChart data={data} />
          <ModelPieChart data={data} />
        </div>
      </Section>

      {/* Project chart */}
      <Section title="Activité par projet">
        <ProjectChart data={data} />
      </Section>

      {/* Top days + tips */}
      {(data.top_days.length > 0 || data.tips.length > 0) && (
        <Section title="Optimisation">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TopDaysTable data={data} />
            {data.tips.length > 0 && (
              <div>
                <TipsPanel data={data} />
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Tables */}
      <Section title="Détail">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ProjectTable data={data} />
          <ConfigDirTable data={data} />
        </div>
      </Section>

      <footer className="text-xs text-[var(--muted)] text-center pt-4 border-t border-[var(--border)]">
        Pour mettre à jour :{' '}
        <code className="bg-white/5 px-1.5 py-0.5 rounded">
          python3 ~/Code/Cerebro/scripts/token-tracker.py
        </code>
      </footer>
    </div>
  )
}
