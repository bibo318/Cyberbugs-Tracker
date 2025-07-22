// API client utilities for external services

export class VulnersClient {
  private apiKey: string
  private baseUrl = "https://vulners.com/api/v3"

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async search(query: string, limit = 50) {
    try {
      const response = await fetch(`${this.baseUrl}/search/lucene/`, {
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
      return await response.json()
    } catch (error) {
      console.error("Vulners API error:", error)
      return { data: [] }
    }
  }
}

export class NVDClient {
  private baseUrl = "https://services.nvd.nist.gov/rest/json/cves/2.0"

  async searchCVE(keyword: string, limit = 50) {
    try {
      const params = new URLSearchParams({
        keywordSearch: keyword,
        resultsPerPage: limit.toString(),
      })

      const response = await fetch(`${this.baseUrl}?${params}`)
      return await response.json()
    } catch (error) {
      console.error("NVD API error:", error)
      return { vulnerabilities: [] }
    }
  }
}

export class GitHubClient {
  private token: string
  private baseUrl = "https://api.github.com"

  constructor(token: string) {
    this.token = token
  }

  async searchExploits(query: string, limit = 30) {
    try {
      const searchQuery = `${query} exploit poc vulnerability`
      const response = await fetch(
        `${this.baseUrl}/search/repositories?q=${encodeURIComponent(searchQuery)}&sort=updated&per_page=${limit}`,
        {
          headers: {
            Authorization: `token ${this.token}`,
            Accept: "application/vnd.github.v3+json",
          },
        },
      )
      return await response.json()
    } catch (error) {
      console.error("GitHub API error:", error)
      return { items: [] }
    }
  }
}

// RSS Feed parser for security news
export async function parseSecurityFeeds() {
  const feeds = [
    "https://feeds.feedburner.com/TheHackersNews",
    "https://www.bleepingcomputer.com/feed/",
    "https://threatpost.com/feed/",
    "https://packetstormsecurity.com/files/tags/advisory/rss.xml",
  ]

  const allNews = []

  for (const feedUrl of feeds) {
    try {
      // In a real implementation, use rss-parser
      // const Parser = require('rss-parser')
      // const parser = new Parser()
      // const feed = await parser.parseURL(feedUrl)
      // allNews.push(...feed.items)
    } catch (error) {
      console.error(`Error parsing feed ${feedUrl}:`, error)
    }
  }

  return allNews
}
