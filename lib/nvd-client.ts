interface NVDVulnerability {
  id: string
  sourceIdentifier: string
  published: string
  lastModified: string
  vulnStatus: string
  descriptions: Array<{
    lang: string
    value: string
  }>
  metrics?: {
    cvssMetricV31?: Array<{
      source: string
      type: string
      cvssData: {
        version: string
        vectorString: string
        baseScore: number
        baseSeverity: string
      }
    }>
    cvssMetricV2?: Array<{
      source: string
      type: string
      cvssData: {
        version: string
        vectorString: string
        baseScore: number
        baseSeverity: string
      }
    }>
  }
  weaknesses?: Array<{
    source: string
    type: string
    description: Array<{
      lang: string
      value: string
    }>
  }>
  configurations?: Array<{
    nodes: Array<{
      operator: string
      negate: boolean
      cpeMatch: Array<{
        vulnerable: boolean
        criteria: string
        matchCriteriaId: string
      }>
    }>
  }>
  references?: Array<{
    url: string
    source: string
    tags?: string[]
  }>
}

interface NVDResponse {
  resultsPerPage: number
  startIndex: number
  totalResults: number
  format: string
  version: string
  timestamp: string
  vulnerabilities: Array<{
    cve: NVDVulnerability
  }>
}

export class NVDClient {
  private baseUrl = "https://services.nvd.nist.gov/rest/json/cves/2.0"
  private apiKey?: string
  private requestCount = 0
  private lastRequestTime = 0
  private readonly RATE_LIMIT_DELAY = 6000 // 6 seconds between requests without API key
  private readonly RATE_LIMIT_DELAY_WITH_KEY = 600 // 0.6 seconds with API key

  constructor(apiKey?: string) {
    this.apiKey = apiKey
  }

  private async rateLimit() {
    const now = Date.now()
    const delay = this.apiKey ? this.RATE_LIMIT_DELAY_WITH_KEY : this.RATE_LIMIT_DELAY
    const timeSinceLastRequest = now - this.lastRequestTime

    if (timeSinceLastRequest < delay) {
      const waitTime = delay - timeSinceLastRequest
      console.log(`🕐 NVD Rate limiting: waiting ${waitTime}ms`)
      await new Promise((resolve) => setTimeout(resolve, waitTime))
    }

    this.lastRequestTime = Date.now()
    this.requestCount++
  }

  async searchCVE(params: {
    keywordSearch?: string
    cveId?: string
    cpeName?: string
    cvssV3Severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
    pubStartDate?: string
    pubEndDate?: string
    lastModStartDate?: string
    lastModEndDate?: string
    resultsPerPage?: number
    startIndex?: number
  }): Promise<NVDResponse> {
    await this.rateLimit()

    const searchParams = new URLSearchParams()

    // --- SAFETY GUARD --------------------------------------------------
    // If the caller accidentally invokes `searchCVE({})`, exit early so we
    // don’t hammer NVD with a “bare” request (they’ll respond 404).
    const hasRealQuery =
      params.keywordSearch ||
      params.cveId ||
      params.cpeName ||
      params.cvssV3Severity ||
      params.pubStartDate ||
      params.lastModStartDate

    if (!hasRealQuery) {
      console.warn("⚠️  NVDClient.searchCVE called with no query parameters – skipping network call.")
      return {
        resultsPerPage: 0,
        startIndex: 0,
        totalResults: 0,
        format: "JSON",
        version: "2.0",
        timestamp: new Date().toISOString(),
        vulnerabilities: [],
      }
    }

    // Add parameters
    if (params.keywordSearch) searchParams.append("keywordSearch", params.keywordSearch)
    if (params.cveId) searchParams.append("cveId", params.cveId)
    if (params.cpeName) searchParams.append("cpeName", params.cpeName)
    if (params.cvssV3Severity) searchParams.append("cvssV3Severity", params.cvssV3Severity)
    if (params.pubStartDate) searchParams.append("pubStartDate", params.pubStartDate)
    if (params.pubEndDate) searchParams.append("pubEndDate", params.pubEndDate)
    if (params.lastModStartDate) searchParams.append("lastModStartDate", params.lastModStartDate)
    if (params.lastModEndDate) searchParams.append("lastModEndDate", params.lastModEndDate)

    // Pagination
    searchParams.append("resultsPerPage", (params.resultsPerPage || 20).toString())
    searchParams.append("startIndex", (params.startIndex || 0).toString())

    const url = `${this.baseUrl}?${searchParams.toString()}`

    console.log("🔍 NVD API Request:", {
      url: url.replace(this.baseUrl, "/rest/json/cves/2.0"),
      params,
      requestCount: this.requestCount,
    })

    try {
      const headers: Record<string, string> = {
        "User-Agent": "SecResearch-Platform/1.0",
        Accept: "application/json",
      }

      if (this.apiKey) {
        headers["apiKey"] = this.apiKey
      }

      const response = await fetch(url, {
        method: "GET",
        headers,
      })

      // 200 ➜ normal, 404 ➜ no matches (treat as empty set), everything else ➜ error
      if (response.status === 404) {
        console.info("🔎 NVD returned 404 – no results for this query.")
        return {
          resultsPerPage: 0,
          startIndex: 0,
          totalResults: 0,
          format: "JSON",
          version: "2.0",
          timestamp: new Date().toISOString(),
          vulnerabilities: [],
        }
      }

      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ NVD API Error:", {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        })
        throw new Error(`NVD API Error: ${response.status} ${response.statusText}`)
      }

      const data: NVDResponse = await response.json()

      console.log("✅ NVD API Success:", {
        totalResults: data.totalResults,
        resultsPerPage: data.resultsPerPage,
        vulnerabilities: data.vulnerabilities.length,
      })

      return data
    } catch (error) {
      console.error("❌ NVD API Request Failed:", error)
      throw error
    }
  }

  async getCVEById(cveId: string): Promise<NVDVulnerability | null> {
    try {
      const response = await this.searchCVE({ cveId })
      return response.vulnerabilities[0]?.cve || null
    } catch (error) {
      console.error(`❌ Failed to get CVE ${cveId}:`, error)
      return null
    }
  }

  // Transform NVD data to our application format
  transformToSearchResult(nvdVuln: NVDVulnerability): any {
    const description = nvdVuln.descriptions.find((d) => d.lang === "en")?.value || "No description available"

    // Get CVSS score (prefer v3.1, fallback to v2)
    let cvssScore = 0
    let severity = "Unknown"

    if (nvdVuln.metrics?.cvssMetricV31?.[0]) {
      cvssScore = nvdVuln.metrics.cvssMetricV31[0].cvssData.baseScore
      severity = nvdVuln.metrics.cvssMetricV31[0].cvssData.baseSeverity
    } else if (nvdVuln.metrics?.cvssMetricV2?.[0]) {
      cvssScore = nvdVuln.metrics.cvssMetricV2[0].cvssData.baseScore
      severity = nvdVuln.metrics.cvssMetricV2[0].cvssData.baseSeverity
    }

    // Extract CPE/product information for tags
    const tags = ["CVE"]
    if (nvdVuln.configurations) {
      nvdVuln.configurations.forEach((config) => {
        config.nodes.forEach((node) => {
          node.cpeMatch.forEach((cpe) => {
            if (cpe.criteria) {
              const parts = cpe.criteria.split(":")
              if (parts.length > 3) {
                const vendor = parts[3]
                const product = parts[4]
                if (vendor && vendor !== "*") tags.push(vendor)
                if (product && product !== "*") tags.push(product)
              }
            }
          })
        })
      })
    }

    // Add weakness information
    if (nvdVuln.weaknesses) {
      nvdVuln.weaknesses.forEach((weakness) => {
        weakness.description.forEach((desc) => {
          if (desc.lang === "en" && desc.value.startsWith("CWE-")) {
            tags.push(desc.value)
          }
        })
      })
    }

    return {
      id: nvdVuln.id,
      type: "cve",
      title: `${nvdVuln.id}: ${description.substring(0, 100)}${description.length > 100 ? "..." : ""}`,
      description: description.substring(0, 300) + (description.length > 300 ? "..." : ""),
      severity: severity.charAt(0).toUpperCase() + severity.slice(1).toLowerCase(),
      cvss: cvssScore,
      published: new Date(nvdVuln.published).toLocaleDateString(),
      source: "NVD",
      url: `https://nvd.nist.gov/vuln/detail/${nvdVuln.id}`,
      tags: [...new Set(tags)].slice(0, 5), // Remove duplicates and limit to 5 tags
    }
  }
}

// Utility functions for date formatting
export function formatDateForNVD(date: Date): string {
  return date.toISOString().split("T")[0] + "T00:00:000 UTC-00:00"
}

export function getDateRange(days: number): { start: string; end: string } {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - days)

  return {
    start: formatDateForNVD(start),
    end: formatDateForNVD(end),
  }
}
