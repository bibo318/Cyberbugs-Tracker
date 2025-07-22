"use client"

import { useState, useEffect } from "react"
import { Search, Shield, Eye, AlertTriangle, Code, Newspaper, Filter, Calendar, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SearchResult {
  id: string
  type: "cve" | "poc" | "news" | "advisory"
  title: string
  description: string
  severity?: string
  cvss?: number
  published: string
  source: string
  url: string
  tags: string[]
}

export default function SecurityResearchPlatform() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [searchHistory, setSearchHistory] = useState<string[]>([])

  useEffect(() => {
    // Load search history from localStorage
    const history = localStorage.getItem("searchHistory")
    if (history) {
      setSearchHistory(JSON.parse(history))
    }
  }, [])

  const handleSearch = async () => {
    if (!query.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&filter=${filter}&sort=${sortBy}`)
      const data = await response.json()
      setResults(data.results || [])

      // Update search history
      const newHistory = [query, ...searchHistory.filter((h) => h !== query)].slice(0, 10)
      setSearchHistory(newHistory)
      localStorage.setItem("searchHistory", JSON.stringify(newHistory))
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "cve":
        return <Shield className="w-4 h-4" />
      case "poc":
        return <Code className="w-4 h-4" />
      case "news":
        return <Newspaper className="w-4 h-4" />
      case "advisory":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Eye className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-red-500 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-red-400 bg-clip-text text-transparent">
                  SecResearch
                </h1>
                <p className="text-xs text-gray-400">Security Intelligence Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-green-500/30 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                Live Feed
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-red-900/20" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fillRule=evenodd%3E%3Cg fill=%23ffffff fillOpacity=0.02%3E%3Ccircle cx=30 cy=30 r=1/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

        <div className="container mx-auto relative z-10">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-red-400 to-green-400 bg-clip-text text-transparent">
            Advanced Security Research
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Comprehensive vulnerability intelligence from CVE databases, exploit repositories, zero-day advisories, and
            real-time security feeds
          </p>

          {/* Search Interface */}
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search CVE, software, version, exploit, or security advisory..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-12 h-14 bg-gray-900/50 border-purple-500/30 text-white placeholder-gray-400 text-lg focus:border-purple-400 focus:ring-purple-400/20"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={loading}
                className="h-14 px-8 bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 text-white font-semibold"
              >
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-40 bg-gray-900/50 border-gray-700">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="cve">CVE Only</SelectItem>
                  <SelectItem value="poc">PoC/Exploits</SelectItem>
                  <SelectItem value="news">Security News</SelectItem>
                  <SelectItem value="high-severity">High Severity</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 bg-gray-900/50 border-gray-700">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="date">Latest First</SelectItem>
                  <SelectItem value="severity">By Severity</SelectItem>
                  <SelectItem value="relevance">Relevance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search History */}
            {searchHistory.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="text-sm text-gray-400">Recent:</span>
                {searchHistory.slice(0, 5).map((term, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setQuery(term)}
                    className="text-xs border-gray-700 hover:border-purple-500/50"
                  >
                    {term}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Results Section */}
      {results.length > 0 && (
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">Search Results ({results.length})</h3>
              <div className="text-sm text-gray-400">
                Found {results.length} results for "{query}"
              </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-900/50">
                <TabsTrigger value="all">All Results</TabsTrigger>
                <TabsTrigger value="cve">CVE</TabsTrigger>
                <TabsTrigger value="poc">PoC/Exploits</TabsTrigger>
                <TabsTrigger value="news">News</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {results.map((result) => (
                    <Card
                      key={result.id}
                      className="bg-gray-900/50 border-gray-700 hover:border-purple-500/50 transition-colors"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(result.type)}
                            <Badge variant="outline" className="text-xs">
                              {result.type.toUpperCase()}
                            </Badge>
                          </div>
                          {result.severity && (
                            <Badge className={getSeverityColor(result.severity)}>{result.severity}</Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg text-white line-clamp-2">{result.title}</CardTitle>
                        <CardDescription className="text-gray-400 line-clamp-3">{result.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {result.cvss && (
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-400">CVSS:</span>
                              <Badge
                                variant="outline"
                                className={
                                  result.cvss >= 9
                                    ? "border-red-500 text-red-400"
                                    : result.cvss >= 7
                                      ? "border-orange-500 text-orange-400"
                                      : result.cvss >= 4
                                        ? "border-yellow-500 text-yellow-400"
                                        : "border-green-500 text-green-400"
                                }
                              >
                                {result.cvss}
                              </Badge>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-1">
                            {result.tags.slice(0, 3).map((tag, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs bg-purple-500/20 text-purple-300"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <Separator className="bg-gray-700" />

                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">{result.source}</span>
                            <span className="text-gray-500">{result.published}</span>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/10 bg-transparent"
                            onClick={() => window.open(result.url, "_blank")}
                          >
                            View Details
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Other tab contents would filter results by type */}
              <TabsContent value="cve" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {results
                    .filter((r) => r.type === "cve")
                    .map((result) => (
                      <Card
                        key={result.id}
                        className="bg-gray-900/50 border-gray-700 hover:border-purple-500/50 transition-colors"
                      >
                        {/* Same card content as above */}
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-2">
                              {getTypeIcon(result.type)}
                              <Badge variant="outline" className="text-xs">
                                {result.type.toUpperCase()}
                              </Badge>
                            </div>
                            {result.severity && (
                              <Badge className={getSeverityColor(result.severity)}>{result.severity}</Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg text-white line-clamp-2">{result.title}</CardTitle>
                          <CardDescription className="text-gray-400 line-clamp-3">{result.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {result.cvss && (
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-400">CVSS:</span>
                                <Badge
                                  variant="outline"
                                  className={
                                    result.cvss >= 9
                                      ? "border-red-500 text-red-400"
                                      : result.cvss >= 7
                                        ? "border-orange-500 text-orange-400"
                                        : result.cvss >= 4
                                          ? "border-yellow-500 text-yellow-400"
                                          : "border-green-500 text-green-400"
                                  }
                                >
                                  {result.cvss}
                                </Badge>
                              </div>
                            )}

                            <div className="flex flex-wrap gap-1">
                              {result.tags.slice(0, 3).map((tag, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs bg-purple-500/20 text-purple-300"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            <Separator className="bg-gray-700" />

                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">{result.source}</span>
                              <span className="text-gray-500">{result.published}</span>
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/10 bg-transparent"
                              onClick={() => window.open(result.url, "_blank")}
                            >
                              View Details
                              <ExternalLink className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="poc" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {results
                    .filter((r) => r.type === "poc")
                    .map((result) => (
                      <Card
                        key={result.id}
                        className="bg-gray-900/50 border-gray-700 hover:border-purple-500/50 transition-colors"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-2">
                              {getTypeIcon(result.type)}
                              <Badge variant="outline" className="text-xs">
                                {result.type.toUpperCase()}
                              </Badge>
                            </div>
                            {result.severity && (
                              <Badge className={getSeverityColor(result.severity)}>{result.severity}</Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg text-white line-clamp-2">{result.title}</CardTitle>
                          <CardDescription className="text-gray-400 line-clamp-3">{result.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex flex-wrap gap-1">
                              {result.tags.slice(0, 3).map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs bg-red-500/20 text-red-300">
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            <Separator className="bg-gray-700" />

                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">{result.source}</span>
                              <span className="text-gray-500">{result.published}</span>
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full border-red-500/30 hover:border-red-500 hover:bg-red-500/10 bg-transparent"
                              onClick={() => window.open(result.url, "_blank")}
                            >
                              View Exploit
                              <ExternalLink className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="news" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {results
                    .filter((r) => r.type === "news")
                    .map((result) => (
                      <Card
                        key={result.id}
                        className="bg-gray-900/50 border-gray-700 hover:border-purple-500/50 transition-colors"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-2">
                              {getTypeIcon(result.type)}
                              <Badge variant="outline" className="text-xs">
                                NEWS
                              </Badge>
                            </div>
                          </div>
                          <CardTitle className="text-lg text-white line-clamp-2">{result.title}</CardTitle>
                          <CardDescription className="text-gray-400 line-clamp-3">{result.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex flex-wrap gap-1">
                              {result.tags.slice(0, 3).map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs bg-blue-500/20 text-blue-300">
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            <Separator className="bg-gray-700" />

                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">{result.source}</span>
                              <span className="text-gray-500">{result.published}</span>
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full border-blue-500/30 hover:border-blue-500 hover:bg-blue-500/10 bg-transparent"
                              onClick={() => window.open(result.url, "_blank")}
                            >
                              Read Article
                              <ExternalLink className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-4 mt-20">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-red-500 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-red-400 bg-clip-text text-transparent">
              SecResearch
            </span>
          </div>
          <p className="text-gray-400 mb-4">Advanced Security Intelligence Platform</p>
          <p className="text-sm text-gray-500">
            Aggregating vulnerability data from CVE, NVD, Exploit-DB, GitHub, and security news sources
          </p>
        </div>
      </footer>
    </div>
  )
}
