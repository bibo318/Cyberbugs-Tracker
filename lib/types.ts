export interface CVEData {
  id: string
  description: string
  severity: "Critical" | "High" | "Medium" | "Low"
  cvss: number
  published: string
  modified: string
  references: string[]
  cwe: string[]
  affectedProducts: string[]
}

export interface ExploitData {
  id: string
  title: string
  description: string
  author: string
  published: string
  platform: string
  type: string
  url: string
  verified: boolean
}

export interface SecurityNews {
  id: string
  title: string
  description: string
  published: string
  source: string
  url: string
  tags: string[]
}

export interface SearchFilters {
  type: "all" | "cve" | "poc" | "news" | "advisory"
  severity: "all" | "critical" | "high" | "medium" | "low"
  dateRange: "all" | "24h" | "7d" | "30d" | "90d"
  hasPoC: boolean
  verified: boolean
}

export interface APIResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  query: string
  filters: SearchFilters
}
