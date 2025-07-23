import { type NextRequest, NextResponse } from "next/server"
import { NVDClient } from "@/lib/nvd-client"

// Simple real API clients without complex imports
class SimpleVulnersClient {
  constructor(private apiKey: string) {}

  async search(query: string, limit = 20) {
    try {
      const response = await fetch("https://vulners.com/api/v3/search/lucene/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          query,
          limit,
          fields: ["id", "title", "description", "cvss", "published", "type", "href"],
        }),
      })

      if (!response.ok) {
        console.log("Vulners API not available:", response.status)
        return []
      }

      const data = await response.json()
      const results = data?.data?.search || []

      return results.map((item: any) => ({
        id: item._source.id,
        type: "cve" as const,
        title: item._source.title || item._source.id,
        description: item._source.description || "No description available",
        severity: this.mapSeverity(item._source.cvss?.score),
        cvss: item._source.cvss?.score || 0,
        published: new Date(item._source.published).toLocaleDateString(),
        source: "Vulners",
        url: item._source.href || `https://vulners.com/cve/${item._source.id}`,
        tags: ["CVE", "Vulners"],
      }))
    } catch (error) {
      console.log("Vulners search failed:", error)
      return []
    }
  }

  private mapSeverity(score = 0) {
    if (score >= 9) return "Critical"
    if (score >= 7) return "High"
    if (score >= 4) return "Medium"
    return "Low"
  }
}

class SimpleGitHubClient {
  constructor(private token: string) {}

  async searchExploits(query: string, limit = 15) {
    try {
      const searchQuery = `${query} exploit OR poc OR vulnerability`
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(searchQuery)}&sort=updated&per_page=${limit}`,
        {
          headers: {
            Authorization: `token ${this.token}`,
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "SecResearch-Platform/1.0",
          },
        },
      )

      if (!response.ok) {
        console.log("GitHub API not available:", response.status)
        return []
      }

      const data = await response.json()
      const repos = data.items || []

      return repos.map((repo: any) => ({
        id: `github-${repo.id}`,
        type: "poc" as const,
        title: repo.name,
        description: repo.description || "No description available",
        severity: "Medium",
        published: new Date(repo.updated_at).toLocaleDateString(),
        source: "GitHub",
        url: repo.html_url,
        tags: ["PoC", "GitHub", ...(repo.topics?.slice(0, 2) || [])],
      }))
    } catch (error) {
      console.log("GitHub search failed:", error)
      return []
    }
  }
}

export async function GET(request: NextRequest) {
  const startTime = Date.now()

  try {
    console.log("🔍 REAL-TIME Search API called at:", new Date().toISOString())

    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q") || ""
    const filter = searchParams.get("filter") || "all"
    const sort = searchParams.get("sort") || "date"

    console.log("📝 Real-time search parameters:", { query, filter, sort })

    if (!query.trim()) {
      return NextResponse.json({
        results: [],
        total: 0,
        query: "",
        meta: {
          duration: "0ms",
          message: "No query provided",
          status: "success",
          realtime: true,
        },
      })
    }

    // Initialize real API clients
    const nvdClient = process.env.NVD_API_KEY ? new NVDClient(process.env.NVD_API_KEY) : null
    const vulnersClient = process.env.VULNERS_API_KEY ? new SimpleVulnersClient(process.env.VULNERS_API_KEY) : null
    const githubClient = process.env.GITHUB_TOKEN ? new SimpleGitHubClient(process.env.GITHUB_TOKEN) : null

    console.log("🌐 API Clients initialized:", {
      nvd: !!nvdClient,
      vulners: !!vulnersClient,
      github: !!githubClient,
    })

    // Parallel real-time API calls
    const searchPromises: Promise<any[]>[] = []

    // NVD Search
    if (nvdClient) {
      console.log("🔍 Searching NVD...")
      const nvdPromise = (async () => {
        try {
          const params = query.match(/^CVE-\d{4}-\d{4,}$/i) ? { cveId: query.toUpperCase() } : { keywordSearch: query }

          const nvdResponse = await nvdClient.searchCVE({
            ...params,
            resultsPerPage: 20,
          })

          const results = nvdResponse.vulnerabilities.map((vuln: any) => nvdClient.transformToSearchResult(vuln.cve))
          console.log(`✅ NVD returned ${results.length} results`)
          return results
        } catch (error) {
          console.log("❌ NVD search failed:", error)
          return []
        }
      })()
      searchPromises.push(nvdPromise)
    }

    // Vulners Search
    if (vulnersClient) {
      console.log("🔍 Searching Vulners...")
      const vulnersPromise = vulnersClient.search(query, 20).then((results) => {
        console.log(`✅ Vulners returned ${results.length} results`)
        return results
      })
      searchPromises.push(vulnersPromise)
    }

    // GitHub Search
    if (githubClient) {
      console.log("🔍 Searching GitHub...")
      const githubPromise = githubClient.searchExploits(query, 15).then((results) => {
        console.log(`✅ GitHub returned ${results.length} results`)
        return results
      })
      searchPromises.push(githubPromise)
    }

    // Wait for all real-time API calls to complete
    console.log("⏳ Waiting for real-time API responses...")
    const allResults = await Promise.allSettled(searchPromises)

    // Combine all real-time results
    let combinedResults: any[] = []
    const sourceStats: Record<string, number> = {}

    allResults.forEach((result) => {
      if (result.status === "fulfilled") {
        const results = result.value
        combinedResults = combinedResults.concat(results)

        // Count results by source
        results.forEach((item: any) => {
          sourceStats[item.source] = (sourceStats[item.source] || 0) + 1
        })
      }
    })

    console.log("📊 Real-time results combined:", {
      total: combinedResults.length,
      sources: sourceStats,
    })

    // Apply filters to real-time results
    let filteredResults = combinedResults

    if (filter !== "all") {
      if (filter === "cve") {
        filteredResults = filteredResults.filter((result) => result.type === "cve")
      } else if (filter === "poc") {
        filteredResults = filteredResults.filter((result) => result.type === "poc")
      } else if (filter === "news") {
        filteredResults = filteredResults.filter((result) => result.type === "news")
      } else if (filter === "high-severity") {
        filteredResults = filteredResults.filter(
          (result) => result.severity === "Critical" || result.severity === "High",
        )
      }
    }

    // Sort real-time results
    if (sort === "severity") {
      const severityOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 }
      filteredResults.sort((a, b) => {
        const aScore = severityOrder[a.severity as keyof typeof severityOrder] || 0
        const bScore = severityOrder[b.severity as keyof typeof severityOrder] || 0
        return bScore - aScore
      })
    } else if (sort === "date") {
      filteredResults.sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime())
    }

    const endTime = Date.now()
    const duration = endTime - startTime

    console.log(`✅ REAL-TIME search completed in ${duration}ms`)
    console.log(`📊 Final results: ${filteredResults.length} items from ${Object.keys(sourceStats).length} sources`)

    const response = {
      results: filteredResults,
      total: filteredResults.length,
      query,
      filter,
      sort,
      meta: {
        duration: `${duration}ms`,
        timestamp: new Date().toISOString(),
        status: "success",
        sources: sourceStats,
        realtime: true,
        totalSources: Object.keys(sourceStats).length,
        apiKeysUsed: {
          nvd: !!process.env.NVD_API_KEY,
          vulners: !!process.env.VULNERS_API_KEY,
          github: !!process.env.GITHUB_TOKEN,
        },
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    const endTime = Date.now()
    const duration = endTime - startTime

    console.error("❌ REAL-TIME search API error:", error)

    return NextResponse.json(
      {
        error: "Real-time search failed",
        results: [],
        total: 0,
        query: request.nextUrl.searchParams.get("q") || "",
        meta: {
          duration: `${duration}ms`,
          timestamp: new Date().toISOString(),
          status: "error",
          errorMessage: error instanceof Error ? error.message : "Unknown error",
          realtime: true,
        },
      },
      { status: 500 },
    )
  }
}
