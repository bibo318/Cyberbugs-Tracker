import { NextResponse } from "next/server"
import { NVDClient } from "@/lib/nvd-client"

export async function GET() {
  try {
    console.log("🧪 Testing NVD API integration...")

    const nvdClient = new NVDClient(process.env.NVD_API_KEY)

    // Test 1: Search for a specific CVE
    console.log("Test 1: Searching for CVE-2024-4577")
    const cveResult = await nvdClient.searchCVE({
      cveId: "CVE-2024-4577",
    })

    // Test 2: Keyword search
    console.log("Test 2: Keyword search for 'PHP'")
    const keywordResult = await nvdClient.searchCVE({
      keywordSearch: "PHP",
      resultsPerPage: 5,
    })

    // Test 3: High severity vulnerabilities
    console.log("Test 3: High severity vulnerabilities")
    const severityResult = await nvdClient.searchCVE({
      cvssV3Severity: "HIGH",
      resultsPerPage: 5,
    })

    const testResults = {
      status: "success",
      timestamp: new Date().toISOString(),
      tests: {
        cveSearch: {
          query: "CVE-2024-4577",
          totalResults: cveResult.totalResults,
          found: cveResult.vulnerabilities.length,
          sample: cveResult.vulnerabilities[0]
            ? {
                id: cveResult.vulnerabilities[0].cve.id,
                published: cveResult.vulnerabilities[0].cve.published,
                description: cveResult.vulnerabilities[0].cve.descriptions[0]?.value.substring(0, 100) + "...",
              }
            : null,
        },
        keywordSearch: {
          query: "PHP",
          totalResults: keywordResult.totalResults,
          found: keywordResult.vulnerabilities.length,
          samples: keywordResult.vulnerabilities.slice(0, 3).map((v) => ({
            id: v.cve.id,
            published: v.cve.published,
          })),
        },
        severitySearch: {
          query: "HIGH severity",
          totalResults: severityResult.totalResults,
          found: severityResult.vulnerabilities.length,
          samples: severityResult.vulnerabilities.slice(0, 3).map((v) => ({
            id: v.cve.id,
            severity: v.cve.metrics?.cvssMetricV31?.[0]?.cvssData.baseSeverity || "Unknown",
            score: v.cve.metrics?.cvssMetricV31?.[0]?.cvssData.baseScore || 0,
          })),
        },
      },
      apiInfo: {
        hasApiKey: !!process.env.NVD_API_KEY,
        rateLimitInfo: process.env.NVD_API_KEY
          ? "With API key: 50 requests per 30 seconds"
          : "Without API key: 5 requests per 30 seconds",
      },
    }

    console.log("✅ NVD API tests completed successfully")
    return NextResponse.json(testResults)
  } catch (error) {
    console.error("❌ NVD API test failed:", error)

    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
        apiInfo: {
          hasApiKey: !!process.env.NVD_API_KEY,
          suggestion: !process.env.NVD_API_KEY
            ? "Consider getting an API key from https://nvd.nist.gov/developers/request-an-api-key for better rate limits"
            : "Check your API key configuration",
        },
      },
      { status: 500 },
    )
  }
}
