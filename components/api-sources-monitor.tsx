"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Globe,
  Database,
  Github,
  Shield,
  Rss,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  ExternalLink,
  Activity,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

interface APISource {
  id: string
  name: string
  description: string
  url: string
  type: "cve" | "exploit" | "news" | "advisory" | "github"
  icon: React.ReactNode
  status: "idle" | "fetching" | "success" | "error" | "timeout"
  responseTime?: number
  resultCount?: number
  lastFetched?: string
  error?: string
}

interface APISourcesMonitorProps {
  isSearching: boolean
  searchQuery: string
  onSourcesUpdate?: (sources: APISource[]) => void
}

export function APISourcesMonitor({ isSearching, searchQuery, onSourcesUpdate }: APISourcesMonitorProps) {
  const [sources, setSources] = useState<APISource[]>([
    {
      id: "nvd",
      name: "NVD (NIST)",
      description: "National Vulnerability Database - Official CVE repository",
      url: "https://services.nvd.nist.gov/rest/json/cves/2.0",
      type: "cve",
      icon: <Shield className="w-4 h-4" />,
      status: "idle",
    },
    {
      id: "vulners",
      name: "Vulners API",
      description: "Comprehensive vulnerability intelligence platform",
      url: "https://vulners.com/api/v3/search/lucene/",
      type: "cve",
      icon: <Database className="w-4 h-4" />,
      status: "idle",
    },
    {
      id: "github",
      name: "GitHub Search",
      description: "PoC exploits and security tools repositories",
      url: "https://api.github.com/search/repositories",
      type: "github",
      icon: <Github className="w-4 h-4" />,
      status: "idle",
    },
    {
      id: "exploitdb",
      name: "Exploit-DB",
      description: "Exploit database and proof-of-concepts",
      url: "https://www.exploit-db.com/search",
      type: "exploit",
      icon: <AlertTriangle className="w-4 h-4" />,
      status: "idle",
    },
    {
      id: "zdi",
      name: "Zero Day Initiative",
      description: "Zero-day vulnerability advisories",
      url: "https://www.zerodayinitiative.com/advisories/",
      type: "advisory",
      icon: <Activity className="w-4 h-4" />,
      status: "idle",
    },
    {
      id: "packetstorm",
      name: "PacketStorm Security",
      description: "Security advisories and exploits feed",
      url: "https://packetstormsecurity.com/files/tags/advisory/rss.xml",
      type: "news",
      icon: <Rss className="w-4 h-4" />,
      status: "idle",
    },
    {
      id: "bleepingcomputer",
      name: "BleepingComputer",
      description: "Latest cybersecurity news and alerts",
      url: "https://www.bleepingcomputer.com/feed/",
      type: "news",
      icon: <Globe className="w-4 h-4" />,
      status: "idle",
    },
    {
      id: "threatpost",
      name: "ThreatPost",
      description: "Threat intelligence and security news",
      url: "https://threatpost.com/feed/",
      type: "news",
      icon: <Rss className="w-4 h-4" />,
      status: "idle",
    },
  ])

  // Simulate API calls when searching
  useEffect(() => {
    if (isSearching && searchQuery) {
      simulateAPIFetching()
    }
  }, [isSearching, searchQuery])

  const simulateAPIFetching = async () => {
    // Reset all sources to fetching state
    setSources((prev) =>
      prev.map((source) => ({
        ...source,
        status: "fetching" as const,
        responseTime: undefined,
        resultCount: undefined,
        error: undefined,
      })),
    )

    // Simulate different response times and results for each source
    const sourcePromises = sources.map(async (source, index) => {
      const delay = Math.random() * 3000 + 500 // 500ms to 3.5s delay
      const shouldFail = Math.random() < 0.15 // 15% chance of failure

      await new Promise((resolve) => setTimeout(resolve, delay))

      const responseTime = Math.round(delay)

      if (shouldFail) {
        return {
          ...source,
          status: "error" as const,
          responseTime,
          error: getRandomError(),
          lastFetched: new Date().toISOString(),
        }
      }

      const resultCount = getRandomResultCount(source.type, searchQuery)

      return {
        ...source,
        status: "success" as const,
        responseTime,
        resultCount,
        lastFetched: new Date().toISOString(),
      }
    })

    // Update sources as they complete
    sourcePromises.forEach(async (promise, index) => {
      const updatedSource = await promise
      setSources((prev) => prev.map((s, i) => (i === index ? updatedSource : s)))
    })

    // Notify parent component
    Promise.all(sourcePromises).then((updatedSources) => {
      onSourcesUpdate?.(updatedSources)
    })
  }

  const getRandomError = () => {
    const errors = [
      "Rate limit exceeded",
      "API key invalid",
      "Connection timeout",
      "Service temporarily unavailable",
      "Authentication failed",
      "Network error",
    ]
    return errors[Math.floor(Math.random() * errors.length)]
  }

  const getRandomResultCount = (type: string, query: string) => {
    // Simulate realistic result counts based on source type and query
    const baseCount = query.toLowerCase().includes("cve")
      ? Math.floor(Math.random() * 50) + 10
      : Math.floor(Math.random() * 100) + 5

    switch (type) {
      case "cve":
        return Math.floor(baseCount * 0.8)
      case "exploit":
        return Math.floor(baseCount * 0.3)
      case "github":
        return Math.floor(baseCount * 1.2)
      case "news":
        return Math.floor(baseCount * 0.6)
      case "advisory":
        return Math.floor(baseCount * 0.4)
      default:
        return baseCount
    }
  }

  const getStatusIcon = (status: APISource["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case "error":
        return <XCircle className="w-4 h-4 text-red-400" />
      case "fetching":
        return <Clock className="w-4 h-4 text-yellow-400 animate-spin" />
      case "timeout":
        return <AlertTriangle className="w-4 h-4 text-orange-400" />
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-600" />
    }
  }

  const getStatusColor = (status: APISource["status"]) => {
    switch (status) {
      case "success":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "error":
      case "timeout":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "fetching":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "cve":
        return "bg-blue-500/20 text-blue-400"
      case "exploit":
        return "bg-red-500/20 text-red-400"
      case "github":
        return "bg-purple-500/20 text-purple-400"
      case "news":
        return "bg-green-500/20 text-green-400"
      case "advisory":
        return "bg-orange-500/20 text-orange-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  const totalSources = sources.length
  const completedSources = sources.filter((s) => s.status === "success" || s.status === "error").length
  const successfulSources = sources.filter((s) => s.status === "success").length
  const totalResults = sources.reduce((sum, source) => sum + (source.resultCount || 0), 0)
  const avgResponseTime = sources
    .filter((s) => s.responseTime)
    .reduce((sum, s, _, arr) => sum + (s.responseTime || 0) / arr.length, 0)

  if (!isSearching && !sources.some((s) => s.status !== "idle")) {
    return null
  }

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-white flex items-center space-x-2">
            <Database className="w-5 h-5 text-purple-400" />
            <span>Data Sources Monitor</span>
          </CardTitle>
          <div className="flex items-center space-x-4 text-sm">
            <div className="text-gray-400">
              Progress: {completedSources}/{totalSources}
            </div>
            {isSearching && (
              <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">
                <Clock className="w-3 h-3 mr-1 animate-spin" />
                Fetching...
              </Badge>
            )}
          </div>
        </div>

        {isSearching && <Progress value={(completedSources / totalSources) * 100} className="h-2 bg-gray-800" />}

        {/* Summary Stats */}
        {completedSources > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-gray-800/50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-400">{successfulSources}</div>
              <div className="text-xs text-gray-400">Sources Online</div>
            </div>
            <div className="bg-gray-800/50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-400">{totalResults}</div>
              <div className="text-xs text-gray-400">Total Results</div>
            </div>
            <div className="bg-gray-800/50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-400">{Math.round(avgResponseTime)}ms</div>
              <div className="text-xs text-gray-400">Avg Response</div>
            </div>
            <div className="bg-gray-800/50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-yellow-400">{searchQuery.length}</div>
              <div className="text-xs text-gray-400">Query Length</div>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="grid gap-3">
          {sources.map((source) => (
            <div
              key={source.id}
              className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(source.status)}
                  {source.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-white truncate">{source.name}</h4>
                    <Badge variant="secondary" className={`text-xs ${getTypeColor(source.type)}`}>
                      {source.type.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400 truncate">{source.description}</p>
                  {source.error && <p className="text-xs text-red-400 mt-1">Error: {source.error}</p>}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {source.resultCount !== undefined && (
                  <Badge variant="outline" className="text-xs">
                    {source.resultCount} results
                  </Badge>
                )}

                {source.responseTime && (
                  <Badge variant="outline" className="text-xs">
                    {source.responseTime}ms
                  </Badge>
                )}

                <Badge className={getStatusColor(source.status)}>{source.status.toUpperCase()}</Badge>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(source.url, "_blank")}
                  className="text-gray-400 hover:text-white"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Real-time Log */}
        {isSearching && (
          <div className="mt-6 space-y-2">
            <h4 className="text-sm font-medium text-gray-300 flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>Real-time Activity Log</span>
            </h4>
            <div className="bg-black/50 p-3 rounded-lg border border-gray-700 max-h-32 overflow-y-auto">
              <div className="font-mono text-xs space-y-1">
                <div className="text-green-400">🔍 Starting search for: "{searchQuery}"</div>
                <div className="text-blue-400">📡 Querying {totalSources} data sources...</div>
                {sources.map((source) => (
                  <div
                    key={source.id}
                    className={
                      source.status === "success"
                        ? "text-green-400"
                        : source.status === "error"
                          ? "text-red-400"
                          : source.status === "fetching"
                            ? "text-yellow-400"
                            : "text-gray-400"
                    }
                  >
                    {source.status === "fetching" && `⏳ Fetching from ${source.name}...`}
                    {source.status === "success" &&
                      `✅ ${source.name}: ${source.resultCount} results (${source.responseTime}ms)`}
                    {source.status === "error" && `❌ ${source.name}: ${source.error}`}
                  </div>
                ))}
                {completedSources === totalSources && (
                  <div className="text-purple-400">🎉 Search completed! Found {totalResults} total results</div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
