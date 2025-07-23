import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("🔍 Checking real-time data sources status...")

    // Test each source with a simple query
    const testQuery = "test"
    const testResults = await Promise.allSettled([
      // Test NVD
      fetch("https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=test&resultsPerPage=1").then((r) => ({
        source: "NVD",
        status: r.ok ? "online" : "offline",
        responseTime: 0,
      })),

      // Test GitHub
      process.env.GITHUB_TOKEN
        ? fetch("https://api.github.com/search/repositories?q=test&per_page=1", {
            headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` },
          }).then((r) => ({ source: "GitHub", status: r.ok ? "online" : "offline", responseTime: 0 }))
        : Promise.resolve({ source: "GitHub", status: "no-token", responseTime: 0 }),

      // Test Vulners (if API key available)
      process.env.VULNERS_API_KEY
        ? fetch("https://vulners.com/api/v3/search/lucene/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.VULNERS_API_KEY}`,
            },
            body: JSON.stringify({ query: "test", limit: 1 }),
          }).then((r) => ({ source: "Vulners", status: r.ok ? "online" : "offline", responseTime: 0 }))
        : Promise.resolve({ source: "Vulners", status: "no-key", responseTime: 0 }),
    ])

    const sourceStatus = testResults.map((result, index) => {
      if (result.status === "fulfilled") {
        return result.value
      } else {
        const sources = ["NVD", "GitHub", "Vulners"]
        return {
          source: sources[index],
          status: "error",
          responseTime: 0,
          error: result.reason?.message || "Unknown error",
        }
      }
    })

    return NextResponse.json({
      status: "success",
      timestamp: new Date().toISOString(),
      sources: sourceStatus,
      configuration: {
        nvdApiKey: !!process.env.NVD_API_KEY,
        vulnersApiKey: !!process.env.VULNERS_API_KEY,
        githubToken: !!process.env.GITHUB_TOKEN,
      },
      capabilities: {
        realTimeSearch: true,
        multiSource: true,
        rateLimited: true,
      },
    })
  } catch (error) {
    console.error("❌ Sources status check failed:", error)

    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
