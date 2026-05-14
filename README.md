# Claude Token Tracker

Dashboard React pour visualiser et réduire sa consommation Claude Code.

Lit un `data.json` généré par le script Python [`token-tracker.py`](https://github.com/Elninoooo/cerebro) et affiche :

- KPIs du mois en cours (coût, rythme, projection)
- Impact du dernier pivot de comportement (avant/après)
- Comparateur de deux périodes au choix
- Coût quotidien sur 60 jours (Chart.js)
- Répartition par modèle (stacked bar + donut)
- Activité par projet (stacked bar)
- Top 5 jours coûteux + pistes d'optimisation heuristiques
- **Analyse IA des pics** — Haiku analyse les 3 jours les plus chers et donne 3 bullets actionnables

## Stack

- Vite + React 19 + TypeScript
- Recharts (graphes)
- Tailwind CSS

## Setup local

```bash
# 1. Générer data.json (repo Cerebro)
python3 ~/Code/Cerebro/scripts/token-tracker.py

# 2. Lancer le dashboard
npm install
npm run dev
# → http://localhost:5173
```

Le `public/data.json` est un symlink vers le vault Cerebro — pas besoin de copier.

## Pointer vers un autre data.json

```bash
VITE_DATA_URL=https://example.com/my-data.json npm run dev
```

Ou en production :

```bash
VITE_DATA_URL=https://example.com/my-data.json npm run build
```

## Analyse IA des pics (item 7)

Le script Python appelle `claude-haiku-4-5` sur les 3 jours les plus coûteux si `ANTHROPIC_API_KEY` est défini. Budget hard-cap : ~$0.02 par run. Skip silencieux si la clé est absente.

```bash
export ANTHROPIC_API_KEY=sk-ant-...
python3 ~/Code/Cerebro/scripts/token-tracker.py
```

Le champ `llm_analysis` apparaît alors dans `data.json` et le panel "Analyse IA" s'affiche dans le dashboard.

## Structure

```
src/
  components/
    KPIGrid.tsx          — KPIs du mois
    BeforeAfterPanel.tsx — Impact pivot
    ComparePanel.tsx     — Comparateur de périodes ⭐
    CostChart.tsx        — Coût quotidien
    ModelCharts.tsx      — Stacked bar + donut modèles
    ProjectChart.tsx     — Activité par projet
    Tables.tsx           — Top jours, projets, config dirs
    TipsPanel.tsx        — Pistes d'optimisation heuristiques
    LLMInsightsPanel.tsx — Analyse IA Haiku
  hooks/useData.ts       — Fetch data.json avec error state
  types.ts               — Types DashboardData
  utils.ts               — fmtCost, fmtTokens, couleurs
```
