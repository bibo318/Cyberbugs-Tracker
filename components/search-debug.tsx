"use client"

import { useState } from "react"
import { Code, Eye, EyeOff, Terminal } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface SearchDebugProps {
  searchQuery: string
  searchResults: any[]
  loading: boolean
  lastSearchTime?: string
  apiResponse?: any
}

export function SearchDebug({ searchQuery, searchResults, loading, lastSearchTime, apiResponse }: SearchDebugProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!searchQuery && searchResults.length === 0) {
    return null
  }

  return (
    <Card className="bg-gray-900/50 border-gray-700 mt-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-3 cursor-pointer hover:bg-gray-800/30 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Terminal className="w-5 h-5 text-green-400" />
                <CardTitle className="text-lg text-white">Debug Information</CardTitle>
                <Badge variant="outline" className="text-xs">
                  {loading ? "Loading..." : `${searchResults.length} results`}
                </Badge>
              </div>
              <Button variant="ghost" size="sm">
                {isOpen ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Search Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800/50 p-3 rounded-lg">
                <div className="text-sm text-gray-400">Search Query</div>
                <div className="font-mono text-green-400">{searchQuery || "No query"}</div>
              </div>

              <div className="bg-gray-800/50 p-3 rounded-lg">
                <div className="text-sm text-gray-400">Results Count</div>
                <div className="font-mono text-blue-400">{searchResults.length}</div>
              </div>

              <div className="bg-gray-800/50 p-3 rounded-lg">
                <div className="text-sm text-gray-400">Last Search</div>
                <div className="font-mono text-purple-400">{lastSearchTime || "Never"}</div>
              </div>
            </div>

            {/* API Response */}
            {apiResponse && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Code className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-300">API Response</span>
                </div>
                <div className="bg-black/50 p-4 rounded-lg border border-gray-700 overflow-x-auto">
                  <pre className="text-xs text-gray-300">{JSON.stringify(apiResponse, null, 2)}</pre>
                </div>
              </div>
            )}

            {/* Console Logs Simulation */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium text-gray-300">Console Output</span>
              </div>
              <div className="bg-black/50 p-4 rounded-lg border border-gray-700 font-mono text-xs space-y-1">
                <div className="text-green-400">🔍 API Search called at: {new Date().toISOString()}</div>
                <div className="text-blue-400">
                  📝 Search parameters: {JSON.stringify({ query: searchQuery, filter: "all", sort: "date" })}
                </div>
                <div className="text-yellow-400">📊 Initial results count: {searchResults.length}</div>
                {searchQuery && <div className="text-purple-400">🔎 Query "{searchQuery}" processed successfully</div>}
                <div className="text-green-400">✅ Search completed, returning {searchResults.length} results</div>
              </div>
            </div>

            {/* Network Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800/50 p-3 rounded-lg">
                <div className="text-sm text-gray-400">Network Status</div>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-400 text-sm">Online</span>
                </div>
              </div>

              <div className="bg-gray-800/50 p-3 rounded-lg">
                <div className="text-sm text-gray-400">API Endpoint</div>
                <div className="font-mono text-blue-400 text-sm">/api/search</div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
