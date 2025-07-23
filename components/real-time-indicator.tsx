"use client"

import { useState, useEffect } from "react"
import { Wifi, WifiOff, Zap, Database, Github, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface RealTimeIndicatorProps {
  searchResults?: any[]
  apiResponse?: any
}

export function RealTimeIndicator({ searchResults = [], apiResponse }: RealTimeIndicatorProps) {
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    if (apiResponse?.meta?.realtime) {
      setIsLive(true)
      // Flash effect
      const timer = setTimeout(() => setIsLive(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [apiResponse])

  if (!apiResponse?.meta) return null

  const { sources = {}, apiKeysUsed = {}, totalSources = 0 } = apiResponse.meta

  return (
    <Card className="bg-gray-900/50 border-gray-700 mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {isLive ? (
                <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
              ) : (
                <Wifi className="w-5 h-5 text-green-400" />
              )}
              <span className="font-medium text-white">{isLive ? "Live Data Fetched" : "Real-Time Sources"}</span>
            </div>

            <div className="flex items-center space-x-2">
              {apiKeysUsed.nvd && (
                <Badge variant="outline" className="text-xs border-blue-500/30 text-blue-400">
                  <Shield className="w-3 h-3 mr-1" />
                  NVD: {sources.NVD || 0}
                </Badge>
              )}
              {apiKeysUsed.vulners && (
                <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-400">
                  <Database className="w-3 h-3 mr-1" />
                  Vulners: {sources.Vulners || 0}
                </Badge>
              )}
              {apiKeysUsed.github && (
                <Badge variant="outline" className="text-xs border-gray-500/30 text-gray-400">
                  <Github className="w-3 h-3 mr-1" />
                  GitHub: {sources.GitHub || 0}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
              {totalSources} Live Sources
            </Badge>
            <Badge variant="outline" className="text-xs">
              {apiResponse.meta.duration}
            </Badge>
          </div>
        </div>

        {!apiKeysUsed.nvd && !apiKeysUsed.vulners && !apiKeysUsed.github && (
          <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <WifiOff className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-yellow-400">
                No API keys configured - Add NVD_API_KEY, VULNERS_API_KEY, or GITHUB_TOKEN for real-time data
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
