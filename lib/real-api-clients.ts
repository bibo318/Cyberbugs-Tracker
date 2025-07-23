// A single, ESM-only module that defines every helper client and
// exports SecurityDataAggregator.  No self-imports, no CommonJS.

/* ──────────────────────────── NVD ──────────────────────────── */
import { NVDClient } from "@/lib/nvd-client"

/* ─────────────────────── Vulners API (real) ─────────────────── */
export class VulnersAPIClient {
  private base = "https://vulners.com/api/v3"

  constructor(private apiKey: string) {}

  async search(query: string, limit = 30) {
    try {
      const res = await fetch(`${this.base}/search/lucene/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          query,
          limit,
          fields: ["id", "title", "description", "cvss", "published", "type", "href", "bulletinFamily"],
        }),
      })

      if (!res.ok) {
        console.error("Vulners API error:", res.status, await res.text())
        return []
      }

      const json = await res.json()
      const docs = json?.data?.search ?? []

      return docs.map((d: any) => ({
        id: d._source.id,
        type: "cve" as const,
        title: d._source.title ?? d._source.id,
        description: d._source.description ?? "No description",
        severity: this.mapSeverity(d._source.cvss?.score),
        cvss: d._source.cvss?.score ?? 0,
        published: new Date(d._source.published).toLocaleDateString(),
        source: "Vulners",
        url: d._source.href ?? `https://vulners.com/cve/${d._source.id}`,
        tags: [d._source.bulletinFamily, "CVE"].filter(Boolean),
      }))
    } catch (e) {
      console.error("Vulners fetch failed:", e)
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

/* ─────────────── GitHub exploits / PoCs (real) ─────────────── */
export class GitHubExploitClient {
  private base = "https://api.github.com"

  constructor(private token: string) {}

  async searchExploits(query: string, limit = 20) {
    try {
      const q = `${query} exploit OR poc OR CVE in:name,description,readme`
      const res = await fetch(
        `${this.base}/search/repositories?q=${encodeURIComponent(q)}&sort=updated&per_page=${limit}`,
        {
          headers: {
            Authorization: `token ${this.token}`,
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "SecResearch-Platform/1.0",
          },
        },
      )

      if (!res.ok) {
        console.error("GitHub API error:", res.status, await res.text())
        return []
      }

      const json = await res.json()
      const repos = json.items ?? []

      return repos.map((r: any) => ({
        id: `gh-${r.id}`,
        type: "poc" as const,
        title: r.name,
        description: r.description ?? "No description",
        severity: "Medium",
        published: new Date(r.updated_at).toLocaleDateString(),
        source: "GitHub",
        url: r.html_url,
        tags: ["PoC", ...(r.topics?.slice(0, 3) ?? [])],
      }))
    } catch (e) {
      console.error("GitHub fetch failed:", e)
      return []
    }
  }
}

/* ──────────────── Security news (simple mock) ──────────────── */
export class SecurityNewsClient {
  async searchNews(query: string, limit = 10) {
    return Array.from({ length: limit }, (_, i) => ({
      id: `news-${i}`,
      type: "news" as const,
      title: `${query} – security headline #${i + 1}`,
      description: `Sample news article about ${query}.`,
      published: new Date(Date.now() - i * 8.64e7).toLocaleDateString(), // 1 day apart
      source: "DemoNews",
      url: "https://example.com",
      tags: ["News"],
    }))
  }
}

/* ─────────────── Exploit-DB (simple mock) ─────────────── */
export class ExploitDBClient {
  async searchExploits(query: string, limit = 5) {
    return Array.from({ length: limit }, (_, i) => ({
      id: `edb-${i}`,
      type: "poc" as const,
      title: `${query} exploit #${i + 1}`,
      description: `Demo exploit for ${query}.`,
      severity: "High",
      published: new Date(Date.now() - i * 3.6e6).toLocaleDateString(), // 1 h apart
      source: "Exploit-DB",
      url: "https://exploit-db.com",
      tags: ["Exploit"],
    }))
  }
}

/* ────────────────────── Aggregator ────────────────────── */
export class SecurityDataAggregator {
  private nvd = this.keys.nvdApiKey ? new NVDClient(this.keys.nvdApiKey) : null
  private vuln = this.keys.vulnersApiKey ? new VulnersAPIClient(this.keys.vulnersApiKey) : null
  private gh = this.keys.githubToken ? new GitHubExploitClient(this.keys.githubToken) : null
  private news = new SecurityNewsClient()
  private edb = new ExploitDBClient()

  constructor(private keys: { nvdApiKey?: string; vulnersApiKey?: string; githubToken?: string }) {}

  async searchAll(query: string) {
    const tasks: Promise<any[]>[] = []

    if (this.nvd) tasks.push(this.searchNVD(query))
    if (this.vuln) tasks.push(this.vuln.search(query, 20))
    if (this.gh) tasks.push(this.gh.searchExploits(query, 15))
    tasks.push(this.edb.searchExploits(query, 5))
    tasks.push(this.news.searchNews(query, 5))

    const settled = await Promise.allSettled(tasks)
    return settled.flatMap((r) => (r.status === "fulfilled" ? r.value : []))
  }

  /* helper */
  private async searchNVD(query: string) {
    try {
      const params = /^CVE-\d{4}-\d{4,}$/i.test(query) ? { cveId: query.toUpperCase() } : { keywordSearch: query }
      const res = await this.nvd!.searchCVE({ ...params, resultsPerPage: 20 })
      return res.vulnerabilities.map((v: any) => this.nvd!.transformToSearchResult(v.cve))
    } catch (e) {
      console.error("NVD search failed:", e)
      return []
    }
  }
}
