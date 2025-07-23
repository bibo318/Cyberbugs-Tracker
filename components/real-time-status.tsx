"use client"

import { useState, useEffect } from "react"
import { Wifi, WifiOff, Clock, CheckCircle, XCircle, AlertTriangle, Key } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface SourceStatus {
  source: string
  status: "online" | "offline" | "error" | "no-token" | "no-key"
  responseTime: number
  error?: string
}

interface StatusResponse {
  status: string
  timestamp: string
  sources: SourceStatus[]
  configuration: {
    nvdApiKey: boolean
    vulnersApiKey: boolean
    githubToken: boolean
  }
  capabilities: {
    realTimeSearch: boolean
    multiSource: boolean
    rateLimited: boolean
  }
}

export function RealTimeStatus() {
  const [status, setStatus] = useState<StatusResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const checkStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/sources/status")
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      console.error("Failed to check sources status:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkStatus()
    // Auto-refresh every 30 seconds
    const interval = setInterval(checkStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case "offline":
      case "error":
        return <XCircle className="w-4 h-4 text-red-400" />
      case "no-token":
      case "no-key":
        return <Key className="w-4 h-4 text-yellow-400" />
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "offline":
      case "error":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "no-token":
      case "no-key":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  if (!status) {
    return (
      <Card className="bg-gray-900/50 border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Clock className="w-5 h-5 text-gray-400 animate-spin mr-2" />
            <span className="text-gray-400">Checking real-time sources...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  // --- SAFER HANDLING WHEN "sources" IS UNDEFINED --------------------
  const sourcesArr: SourceStatus[] = status.sources ?? []
  const onlineSources = sourcesArr.filter((s) => s.status === "online").length
  const totalSources = sourcesArr.length
  // Safeguard capabilities object
  const capabilities = status.capabilities ?? {
    realTimeSearch: false,
    multiSource: false,
    rateLimited: false,
  }
  // Safeguard configuration object
  const config = status.configuration ?? {
    nvdApiKey: false,
    vulnersApiKey: false,
    githubToken: false,
  }
  // -------------------------------------------------------------------

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-white flex items-center space-x-2">
            {onlineSources === totalSources ? (
              <Wifi className="w-5 h-5 text-green-400" />
            ) : (
              <WifiOff className="w-5 h-5 text-yellow-400" />
            )}
            <span>Real-Time Data Sources</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {onlineSources}/{totalSources} Online
            </Badge>
            <Button
              onClick={checkStatus}
              disabled={loading}
              size="sm"
              variant="outline"
              className="border-green-500/30 hover:border-green-500 bg-transparent"
            >
              {loading ? "Checking..." : "Refresh"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Capabilities */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-800/50 p-3 rounded-lg text-center">
            <div className="text-lg font-bold text-green-400">{capabilities.realTimeSearch ? "✓" : "✗"}</div>
            <div className="text-xs text-gray-400">Real-Time</div>
          </div>
          <div className="bg-gray-800/50 p-3 rounded-lg text-center">
            <div className="text-lg font-bold text-blue-400">{capabilities.multiSource ? totalSources : "0"}</div>
            <div className="text-xs text-gray-400">Sources</div>
          </div>
          <div className="bg-gray-800/50 p-3 rounded-lg text-center">
            <div className="text-lg font-bold text-purple-400">{capabilities.rateLimited ? "✓" : "✗"}</div>
            <div className="text-xs text-gray-400">Rate Limited</div>
          </div>
        </div>

        {/* Sources Status */}
        <div className="space-y-3">
          {sourcesArr.map((source) => (
            <div
              key={source.source}
              className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700/50"
            >
              <div className="flex items-center space-x-3">
                {getStatusIcon(source.status)}
                <div>
                  <div className="font-medium text-white">{source.source}</div>
                  {source.error && <div className="text-xs text-red-400">Error: {source.error}</div>}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {source.responseTime > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {source.responseTime}ms
                  </Badge>
                )}
                <Badge className={getStatusColor(source.status)}>{source.status.toUpperCase().replace("-", " ")}</Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Configuration Status */}
        <div className="border-t border-gray-700 pt-4">
          <div className="text-sm font-medium text-gray-300 mb-2">API Configuration</div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">NVD API:</span>
              <span className={config.nvdApiKey ? "text-green-400" : "text-yellow-400"}>
                {config.nvdApiKey ? "Configured" : "Missing"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Vulners:</span>
              <span className={config.vulnersApiKey ? "text-green-400" : "text-yellow-400"}>
                {config.vulnersApiKey ? "Configured" : "Missing"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">GitHub:</span>
              <span className={config.githubToken ? "text-green-400" : "text-yellow-400"}>
                {config.githubToken ? "Configured" : "Missing"}
              </span>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500 text-center">
          Last updated: {new Date(status.timestamp).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  )
}
