"use client"

import { useState } from "react"
import { Bug, CheckCircle, XCircle, AlertTriangle, ExternalLink, Copy } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DebugResult {
  success: boolean
  query: string
  timestamp: string
  debug?: {
    apiKeyConfigured: boolean
    queryType: string
    nvdParams: any
    duration: string
    results: {
      totalResults: number
      returned: number
      transformed: number
    }
    directTest: {
      url: string
      status: number
      hasData: boolean
      directCount: number
    }
    sampleResults: any[]
    rawNVDSample: any[]
  }
  error?: {
    message: string
    stack?: string
    apiKeyConfigured: boolean
  }
}

export function NVDDebugPanel() {
  const [query, setQuery] = useState("CVE-2024-4577")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DebugResult | null>(null)

  const testNVDQuery = async () => {
    if (!query.trim()) return

    setLoading(true)
    try {
      console.log("🧪 Testing NVD query:", query)
      const response = await fetch(`/api/nvd/debug?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      setResult(data)
      console.log("🔍 Debug result:", data)
    } catch (error) {
      console.error("❌ Debug test failed:", error)
      setResult({
        success: false,
        query,
        timestamp: new Date().toISOString(),
        error: {
          message: error instanceof Error ? error.message : "Unknown error",
          apiKeyConfigured: false,
        },
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getStatusIcon = (success: boolean) => {
    return success ? <CheckCircle className="w-5 h-5 text-green-400" /> : <XCircle className="w-5 h-5 text-red-400" />
  }

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg text-white flex items-center space-x-2">
          <Bug className="w-5 h-5 text-yellow-400" />
          <span>NVD Debug Panel</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Test Input */}
        <div className="flex space-x-2">
          <Input
            placeholder="Enter CVE ID (e.g., CVE-2024-4577) or keyword (e.g., PHP)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && testNVDQuery()}
            className="bg-gray-800 border-gray-600 text-white"
          />
          <Button onClick={testNVDQuery} disabled={loading} className="bg-yellow-600 hover:bg-yellow-700">
            {loading ? "Testing..." : "Test"}
          </Button>
        </div>

        {/* Quick Test Buttons */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-400">Quick tests:</span>
          {["CVE-2024-4577", "CVE-2023-44487", "PHP", "Apache", "Microsoft"].map((testQuery) => (
            <Button
              key={testQuery}
              variant="outline"
              size="sm"
              onClick={() => setQuery(testQuery)}
              className="text-xs border-gray-600 hover:border-yellow-500"
            >
              {testQuery}
            </Button>
          ))}
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-4">
            <Separator className="bg-gray-700" />

            {/* Status Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getStatusIcon(result.success)}
                <span className="font-medium text-white">Test Result for "{result.query}"</span>
              </div>
              <Badge variant="outline" className={result.success ? "text-green-400" : "text-red-400"}>
                {result.success ? "SUCCESS" : "FAILED"}
              </Badge>
            </div>

            {result.success && result.debug ? (
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-gray-800">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="api">API Details</TabsTrigger>
                  <TabsTrigger value="results">Results</TabsTrigger>
                  <TabsTrigger value="raw">Raw Data</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-800/50 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-400">{result.debug.results.totalResults}</div>
                      <div className="text-xs text-gray-400">Total Found</div>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-400">{result.debug.results.returned}</div>
                      <div className="text-xs text-gray-400">Returned</div>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-400">{result.debug.results.transformed}</div>
                      <div className="text-xs text-gray-400">Transformed</div>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-yellow-400">{result.debug.duration}</div>
                      <div className="text-xs text-gray-400">Duration</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-white mb-2">Configuration</div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">API Key:</span>
                          <span className={result.debug.apiKeyConfigured ? "text-green-400" : "text-yellow-400"}>
                            {result.debug.apiKeyConfigured ? "Configured" : "Not Set"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Query Type:</span>
                          <span className="text-blue-400">{result.debug.queryType}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-white mb-2">Direct API Test</div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Status:</span>
                          <span className={result.debug.directTest.status === 200 ? "text-green-400" : "text-red-400"}>
                            {result.debug.directTest.status}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Results:</span>
                          <span className="text-blue-400">{result.debug.directTest.directCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="api" className="space-y-4">
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white">API URL</span>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.debug!.directTest.url)}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="bg-black/50 p-2 rounded text-xs font-mono text-green-400 break-all">
                      {result.debug.directTest.url}
                    </div>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-white mb-2">Parameters Sent</div>
                    <div className="bg-black/50 p-2 rounded text-xs font-mono text-blue-400">
                      {JSON.stringify(result.debug.nvdParams, null, 2)}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="results" className="space-y-4">
                  {result.debug.sampleResults.length > 0 ? (
                    <div className="space-y-3">
                      {result.debug.sampleResults.map((sample, index) => (
                        <div key={index} className="bg-gray-800/50 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline" className="text-blue-400 border-blue-500/30">
                              {sample.id}
                            </Badge>
                            <Badge
                              className={
                                sample.severity === "Critical"
                                  ? "bg-red-500/20 text-red-400"
                                  : sample.severity === "High"
                                    ? "bg-orange-500/20 text-orange-400"
                                    : sample.severity === "Medium"
                                      ? "bg-yellow-500/20 text-yellow-400"
                                      : "bg-green-500/20 text-green-400"
                              }
                            >
                              {sample.severity} ({sample.cvss})
                            </Badge>
                          </div>
                          <div className="text-sm text-white mb-2">{sample.title}</div>
                          <div className="text-xs text-gray-400 mb-2">{sample.description}</div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Published: {sample.published}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(sample.url, "_blank")}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              View <ExternalLink className="w-3 h-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                      <div>No results found</div>
                      <div className="text-xs mt-1">Try a different CVE ID or keyword</div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="raw" className="space-y-4">
                  <div className="bg-black/50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-white mb-2">Raw NVD Response Sample</div>
                    <pre className="text-xs text-green-400 overflow-x-auto">
                      {JSON.stringify(result.debug.rawNVDSample, null, 2)}
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              result.error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span className="font-medium text-red-400">Error Details</span>
                  </div>
                  <div className="text-sm text-red-300 mb-2">{result.error.message}</div>
                  {result.error.stack && (
                    <details className="text-xs text-gray-400">
                      <summary className="cursor-pointer">Stack Trace</summary>
                      <pre className="mt-2 bg-black/50 p-2 rounded overflow-x-auto">{result.error.stack}</pre>
                    </details>
                  )}
                  <div className="text-xs text-gray-400 mt-2">
                    API Key: {result.error.apiKeyConfigured ? "Configured" : "Not configured"}
                  </div>
                </div>
              )
            )}

            <div className="text-xs text-gray-500 text-center">
              Test completed at {new Date(result.timestamp).toLocaleString()}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
