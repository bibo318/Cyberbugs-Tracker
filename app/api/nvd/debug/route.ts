import { type NextRequest, NextResponse } from "next/server"
import { NVDClient } from "@/lib/nvd-client"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q") || "CVE-2024-4577"

  try {
    console.log("🔍 NVD Debug - Testing query:", query)

    const nvdClient = new NVDClient(process.env.NVD_API_KEY)

    // Test 1: Direct NVD API call with raw response
    console.log("=== TEST 1: Raw NVD API Call ===")

    const nvdParams: any = {}

    // Determine if it's a CVE ID or keyword search
    if (query.match(/^CVE-\d{4}-\d{4,}$/i)) {
      nvdParams.cveId = query.toUpperCase()
      console.log("Detected CVE ID format:", nvdParams.cveId)
    } else {
      nvdParams.keywordSearch = query
      console.log("Using keyword search:", nvdParams.keywordSearch)
    }

    // Make the API call
    const startTime = Date.now()
    const nvdResponse = await nvdClient.searchCVE({
      ...nvdParams,
      resultsPerPage: 10,
    })
    const duration = Date.now() - startTime

    console.log("NVD Response received in", duration, "ms")
    console.log("Total results:", nvdResponse.totalResults)
    console.log("Vulnerabilities returned:", nvdResponse.vulnerabilities.length)

    // Test 2: Transform to our format
    console.log("=== TEST 2: Data Transformation ===")
    const transformedResults = nvdResponse.vulnerabilities.map((vuln) => {
      const transformed = nvdClient.transformToSearchResult(vuln.cve)
      console.log("Transformed:", transformed.id, "->", transformed.title.substring(0, 50) + "...")
      return transformed
    })

    // Test 3: Direct API test without our wrapper
    console.log("=== TEST 3: Direct Fetch Test ===")
    const directUrl = `https://services.nvd.nist.gov/rest/json/cves/2.0?${query.match(/^CVE-\d{4}-\d{4,}$/i) ? `cveId=${query.toUpperCase()}` : `keywordSearch=${encodeURIComponent(query)}`}&resultsPerPage=5`

    console.log("Direct URL:", directUrl)

    const headers: Record<string, string> = {
      "User-Agent": "SecResearch-Platform/1.0",
      Accept: "application/json",
    }

    if (process.env.NVD_API_KEY) {
      headers["apiKey"] = process.env.NVD_API_KEY
    }

    const directResponse = await fetch(directUrl, { headers })
    const directData = await directResponse.json()

    console.log("Direct response status:", directResponse.status)
    console.log("Direct response data keys:", Object.keys(directData))

    return NextResponse.json({
      success: true,
      query,
      timestamp: new Date().toISOString(),
      debug: {
        apiKeyConfigured: !!process.env.NVD_API_KEY,
        queryType: query.match(/^CVE-\d{4}-\d{4,}$/i) ? "CVE_ID" : "KEYWORD",
        nvdParams,
        duration: `${duration}ms`,
        results: {
          totalResults: nvdResponse.totalResults,
          returned: nvdResponse.vulnerabilities.length,
          transformed: transformedResults.length,
        },
        directTest: {
          url: directUrl,
          status: directResponse.status,
          hasData: !!directData.vulnerabilities,
          directCount: directData.vulnerabilities?.length || 0,
        },
        sampleResults: transformedResults.slice(0, 3),
        rawNVDSample: nvdResponse.vulnerabilities.slice(0, 1).map((v) => ({
          id: v.cve.id,
          published: v.cve.published,
          descriptions: v.cve.descriptions?.slice(0, 1),
          metrics: v.cve.metrics,
        })),
      },
    })
  } catch (error) {
    console.error("❌ NVD Debug Error:", error)

    return NextResponse.json(
      {
        success: false,
        query,
        timestamp: new Date().toISOString(),
        error: {
          message: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : undefined,
          apiKeyConfigured: !!process.env.NVD_API_KEY,
        },
      },
      { status: 500 },
    )
  }
}
