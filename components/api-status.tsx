"use client"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface APIStatus {
  endpoint: string
  status: "online" | "offline" | "testing" | "error"
  responseTime?: number
  lastChecked: string
  error?: string
}

export function APIStatusChecker() {
  const [apiStatuses, setApiStatuses] = useState<APIStatus[]>([
    {
      endpoint: "/api/search",
      status: "testing",
      lastChecked: new Date().toISOString(),
    },
  ])

  const checkAPIStatus = async (endpoint: string) => {
    const startTime = Date.now()

    try {
      console.log(`🔍 Testing API endpoint: ${endpoint}`)

      const response = await fetch(`${endpoint}?q=test&filter=all&sort=date`)
      const endTime = Date.now()
      const responseTime = endTime - startTime

      console.log(`📊 API Response:`, {
        status: response.status,
        ok: response.ok,
        responseTime: `${responseTime}ms`,
      })

      if (response.ok) {
        const data = await response.json()
        console.log(`✅ API Data:`, data)

        setApiStatuses((prev) =>
          prev.map((api) =>
            api.endpoint === endpoint
              ? {
                  ...api,
                  status: "online" as const,
                  responseTime,
                  lastChecked: new Date().toISOString(),
                  error: undefined,
                }
              : api,
          ),
        )
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      const endTime = Date.now()
      const responseTime = endTime - startTime

      console.error(`❌ API Error for ${endpoint}:`, error)

      setApiStatuses((prev) =>
        prev.map((api) =>
          api.endpoint === endpoint
            ? {
                ...api,
                status: "error" as const,
                responseTime,
                lastChecked: new Date().toISOString(),
                error: error instanceof Error ? error.message : "Unknown error",
              }
            : api,
        ),
      )
    }
  }

  const testAllAPIs = () => {
    apiStatuses.forEach((api) => {
      setApiStatuses((prev) =>
        prev.map((a) => (a.endpoint === api.endpoint ? { ...a, status: "testing" as const } : a)),
      )
      checkAPIStatus(api.endpoint)
    })
  }

  useEffect(() => {
    // Test APIs on component mount
    testAllAPIs()
  }, [])

  const getStatusIcon = (status: APIStatus["status"]) => {
    switch (status) {
      case "online":
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case "offline":
      case "error":
        return <XCircle className="w-5 h-5 text-red-400" />
      case "testing":
        return <Clock className="w-5 h-5 text-yellow-400 animate-spin" />
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: APIStatus["status"]) => {
    switch (status) {
      case "online":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "offline":
      case "error":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "testing":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-white">API Status Monitor</CardTitle>
          <Button
            onClick={testAllAPIs}
            size="sm"
            variant="outline"
            className="border-purple-500/30 hover:border-purple-500 bg-transparent"
          >
            Test APIs
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {apiStatuses.map((api) => (
          <div
            key={api.endpoint}
            className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700"
          >
            <div className="flex items-center space-x-3">
              {getStatusIcon(api.status)}
              <div>
                <div className="font-medium text-white">{api.endpoint}</div>
                <div className="text-sm text-gray-400">
                  Last checked: {new Date(api.lastChecked).toLocaleTimeString()}
                </div>
                {api.error && <div className="text-sm text-red-400 mt-1">Error: {api.error}</div>}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {api.responseTime && (
                <Badge variant="outline" className="text-xs">
                  {api.responseTime}ms
                </Badge>
              )}
              <Badge className={getStatusColor(api.status)}>{api.status.toUpperCase()}</Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
