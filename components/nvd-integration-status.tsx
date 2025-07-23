"use client"

import { useState, useEffect } from "react"
import { Shield, CheckCircle, XCircle, AlertTriangle, ExternalLink, Key, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface NVDTestResult {
  status: "success" | "error"
  timestamp: string
  tests?: {
    cveSearch: {
      query: string
      totalResults: number
      found: number
      sample?: any
    }
    keywordSearch: {
      query: string
      totalResults: number
      found: number
      samples: any[]
    }
    severitySearch: {
      query: string
      totalResults: number
      found: number
      samples: any[]
    }
  }
  apiInfo: {
    hasApiKey: boolean
    rateLimitInfo: string
    suggestion?: string
  }
  error?: string
}

export function NVDIntegrationStatus() {
  const [testResult, setTestResult] = useState<NVDTestResult | null>(null)
  const [loading, setLoading] = useState(false)

  const testNVDIntegration = async () => {
    setLoading(true)
    try {
      console.log("🧪 Testing NVD integration...")
      const response = await fetch("/api/nvd/test")
      const data = await response.json()
      setTestResult(data)
      console.log("✅ NVD test completed:", data)
    } catch (error) {
      console.error("❌ NVD test failed:", error)
      setTestResult({
        status: "error",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
        apiInfo: {
          hasApiKey: false,
          rateLimitInfo: "Unknown",
        },
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Auto-test on component mount
    testNVDIntegration()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-400" />
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "error":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    }
  }

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-white flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <span>NVD Integration Status</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            {testResult && (
              <Badge className={getStatusColor(testResult.status)}>
                {getStatusIcon(testResult.status)}
                <span className="ml-1">{testResult.status.toUpperCase()}</span>
              </Badge>
            )}
            <Button
              onClick={testNVDIntegration}
              disabled={loading}
              size="sm"
              variant="outline"
              className="border-blue-500/30 hover:border-blue-500 bg-transparent"
            >
              {loading ? "Testing..." : "Test Integration"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* API Key Status */}
        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Key className="w-4 h-4 text-yellow-400" />
            <div>
              <div className="font-medium text-white">API Key Status</div>
              <div className="text-sm text-gray-400">
                {testResult?.apiInfo.hasApiKey ? "Configured" : "Not configured (using public access)"}
              </div>
            </div>
          </div>
          <Badge variant="outline" className={testResult?.apiInfo.hasApiKey ? "text-green-400" : "text-yellow-400"}>
            {testResult?.apiInfo.hasApiKey ? "With Key" : "Public"}
          </Badge>
        </div>

        {/* Rate Limit Info */}
        {testResult?.apiInfo.rateLimitInfo && (
          <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
            <Clock className="w-4 h-4 text-blue-400" />
            <div>
              <div className="font-medium text-white">Rate Limits</div>
              <div className="text-sm text-gray-400">{testResult.apiInfo.rateLimitInfo}</div>
            </div>
          </div>
        )}

        {/* Test Results */}
        {testResult?.tests && (
          <>
            <Separator className="bg-gray-700" />
            <div className="space-y-3">
              <h4 className="font-medium text-white">Integration Tests</h4>

              {/* CVE Search Test */}
              <div className="p-3 bg-gray-800/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">CVE ID Search</span>
                  <Badge variant="outline" className="text-xs">
                    {testResult.tests.cveSearch.found} found
                  </Badge>
                </div>
                <div className="text-xs text-gray-400">
                  Query: {testResult.tests.cveSearch.query} • Total: {testResult.tests.cveSearch.totalResults}
                </div>
                {testResult.tests.cveSearch.sample && (
                  <div className="mt-2 text-xs text-green-400">
                    ✅ Found: {testResult.tests.cveSearch.sample.id} ({testResult.tests.cveSearch.sample.published})
                  </div>
                )}
              </div>

              {/* Keyword Search Test */}
              <div className="p-3 bg-gray-800/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">Keyword Search</span>
                  <Badge variant="outline" className="text-xs">
                    {testResult.tests.keywordSearch.found} found
                  </Badge>
                </div>
                <div className="text-xs text-gray-400">
                  Query: "{testResult.tests.keywordSearch.query}" • Total: {testResult.tests.keywordSearch.totalResults}
                </div>
                {testResult.tests.keywordSearch.samples.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {testResult.tests.keywordSearch.samples.map((sample, index) => (
                      <div key={index} className="text-xs text-green-400">
                        ✅ {sample.id} ({sample.published})
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Severity Search Test */}
              <div className="p-3 bg-gray-800/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">Severity Filter</span>
                  <Badge variant="outline" className="text-xs">
                    {testResult.tests.severitySearch.found} found
                  </Badge>
                </div>
                <div className="text-xs text-gray-400">
                  Filter: {testResult.tests.severitySearch.query} • Total:{" "}
                  {testResult.tests.severitySearch.totalResults}
                </div>
                {testResult.tests.severitySearch.samples.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {testResult.tests.severitySearch.samples.map((sample, index) => (
                      <div key={index} className="text-xs text-orange-400">
                        🔥 {sample.id} - {sample.severity} ({sample.score})
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Error Display */}
        {testResult?.error && (
          <>
            <Separator className="bg-gray-700" />
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <XCircle className="w-4 h-4 text-red-400" />
                <span className="font-medium text-red-400">Integration Error</span>
              </div>
              <div className="text-sm text-red-300">{testResult.error}</div>
              {testResult.apiInfo.suggestion && (
                <div className="text-xs text-gray-400 mt-2">💡 {testResult.apiInfo.suggestion}</div>
              )}
            </div>
          </>
        )}

        {/* Links */}
        <Separator className="bg-gray-700" />
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-400">
            Last tested: {testResult ? new Date(testResult.timestamp).toLocaleString() : "Never"}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open("https://nvd.nist.gov/developers", "_blank")}
              className="text-gray-400 hover:text-white"
            >
              API Docs
              <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open("https://nvd.nist.gov/developers/request-an-api-key", "_blank")}
              className="text-gray-400 hover:text-white"
            >
              Get API Key
              <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
