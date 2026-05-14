export const fmtCost = (n: number) =>
  '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const fmtTokens = (n: number) => {
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B'
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K'
  return String(n)
}

export const MODEL_COLORS = [
  '#a371f7', '#58a6ff', '#3fb950', '#f78166', '#d29922', '#bc8cff', '#79c0ff',
]

export const PROJECT_COLORS = [
  '#58a6ff', '#3fb950', '#a371f7', '#f78166', '#d29922', '#bc8cff', '#7d8590',
]

export const shortModelName = (name: string) =>
  name.replace('claude-', '').replace(/-\d{8}$/, '')
