export interface Pivot {
  date: string
  label: string
  description: string
}

export interface ModelEntry {
  label: string
  cost: number
}

export interface ProjectRow {
  name: string
  sessions: number
  tool_calls: number
  last_active: string
}

export interface ConfigDirRow {
  name: string
  sessions: number
  tool_calls: number
}

export interface TopDay {
  date: string
  totalCost: number
}

export interface WeeklySeriesItem {
  week: string
  tokens: number
  pct: number | null
  is_current: boolean
}

export interface MonthlySeriesItem {
  month: string
  tokens: number
  pct: number | null
}

export interface AnomalyDay {
  date: string
  tokens: number
  ratio_to_median: number
}

export interface LlmDayAnalysis {
  date: string
  bullets: string[]
}

export interface EcoData {
  kwh: number
  gco2: number
  kg_co2: number
  source: string
  note: string
}

export interface CcusageStatus {
  fresh: boolean
  stale_since: string | null
  stale_days: number
}

export interface DashboardData {
  generated_at: string
  current_month: string
  prev_month: string
  cur_cost: number
  pace: number
  prev_cost: number
  delta_pct: number
  total_tokens: number
  cache_create: number
  cache_read: number
  pivots: Pivot[]
  avg_before: number
  avg_after: number
  delta_avg_pct: number
  before_period: string
  after_period: string
  before_days: number
  after_days: number
  chart_dates: string[]
  chart_costs: number[]
  chart_cache_create: number[]
  chart_cache_read: number[]
  model_list: string[]
  model_daily: Record<string, number[]>
  proj_names: string[]
  proj_chart_dates: string[]
  proj_chart_series: Record<string, number[]>
  monthly_labels: string[]
  monthly_costs: number[]
  by_model_cur: ModelEntry[]
  project_table: ProjectRow[]
  saved_so_far: number
  saved_monthly_est: number
  config_dir_table: ConfigDirRow[]
  ccusage_status: CcusageStatus
  day_of_month: number
  eco: EcoData | null
  top_days: TopDay[]
  tips: string[]
  median_daily_cost: number
  llm_analysis: LlmDayAnalysis[]
  // V2 weekly stats (optionnels — backward compat)
  weekly_median?: number
  current_week_tokens?: number
  current_week_consumed_pct?: number | null
  current_week_projected_tokens?: number
  current_week_projected_pct?: number | null
  weekly_series?: WeeklySeriesItem[]
  prev_week_tokens?: number
  prev_week_delta_pct?: number | null
  anomaly_days?: AnomalyDay[]
  days_in_current_week?: number
  current_week_num?: number
  current_week_start?: string
  monthly_series?: MonthlySeriesItem[]
  monthly_median_tokens?: number
}
