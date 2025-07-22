"use client"

import { useState } from "react"
import { Filter, Calendar, Shield, Code, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

interface SearchFiltersProps {
  onFiltersChange: (filters: any) => void
}

export function SearchFilters({ onFiltersChange }: SearchFiltersProps) {
  const [filters, setFilters] = useState({
    type: "all",
    severity: "all",
    dateRange: "all",
    hasPoC: false,
    verified: false,
    cvssMin: 0,
  })

  const updateFilters = (newFilters: any) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)
    onFiltersChange(updated)
  }

  return (
    <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Filter className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Advanced Filters</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Type Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-300">Type</Label>
          <Select value={filters.type} onValueChange={(value) => updateFilters({ type: value })}>
            <SelectTrigger className="bg-gray-800 border-gray-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="cve">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>CVE</span>
                </div>
              </SelectItem>
              <SelectItem value="poc">
                <div className="flex items-center space-x-2">
                  <Code className="w-4 h-4" />
                  <span>PoC/Exploits</span>
                </div>
              </SelectItem>
              <SelectItem value="news">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Security News</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Severity Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-300">Severity</Label>
          <Select value={filters.severity} onValueChange={(value) => updateFilters({ severity: value })}>
            <SelectTrigger className="bg-gray-800 border-gray-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="critical">
                <Badge className="bg-red-500/20 text-red-400">Critical</Badge>
              </SelectItem>
              <SelectItem value="high">
                <Badge className="bg-orange-500/20 text-orange-400">High</Badge>
              </SelectItem>
              <SelectItem value="medium">
                <Badge className="bg-yellow-500/20 text-yellow-400">Medium</Badge>
              </SelectItem>
              <SelectItem value="low">
                <Badge className="bg-green-500/20 text-green-400">Low</Badge>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-300">Date Range</Label>
          <Select value={filters.dateRange} onValueChange={(value) => updateFilters({ dateRange: value })}>
            <SelectTrigger className="bg-gray-800 border-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* CVSS Score Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-300">Min CVSS Score</Label>
          <Select
            value={filters.cvssMin.toString()}
            onValueChange={(value) => updateFilters({ cvssMin: Number.parseInt(value) })}
          >
            <SelectTrigger className="bg-gray-800 border-gray-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="0">Any Score</SelectItem>
              <SelectItem value="4">4.0+ (Medium)</SelectItem>
              <SelectItem value="7">7.0+ (High)</SelectItem>
              <SelectItem value="9">9.0+ (Critical)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator className="bg-gray-700" />

      {/* Additional Options */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="hasPoC"
            checked={filters.hasPoC}
            onCheckedChange={(checked) => updateFilters({ hasPoC: checked })}
            className="border-gray-600"
          />
          <Label htmlFor="hasPoC" className="text-sm text-gray-300">
            Has PoC/Exploit
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="verified"
            checked={filters.verified}
            onCheckedChange={(checked) => updateFilters({ verified: checked })}
            className="border-gray-600"
          />
          <Label htmlFor="verified" className="text-sm text-gray-300">
            Verified Only
          </Label>
        </div>
      </div>

      {/* Active Filters Display */}
      {(filters.type !== "all" ||
        filters.severity !== "all" ||
        filters.dateRange !== "all" ||
        filters.hasPoC ||
        filters.verified ||
        filters.cvssMin > 0) && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-300">Active Filters:</Label>
          <div className="flex flex-wrap gap-2">
            {filters.type !== "all" && (
              <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                Type: {filters.type.toUpperCase()}
              </Badge>
            )}
            {filters.severity !== "all" && (
              <Badge variant="outline" className="border-orange-500/30 text-orange-300">
                Severity: {filters.severity}
              </Badge>
            )}
            {filters.dateRange !== "all" && (
              <Badge variant="outline" className="border-blue-500/30 text-blue-300">
                Date: {filters.dateRange}
              </Badge>
            )}
            {filters.hasPoC && (
              <Badge variant="outline" className="border-red-500/30 text-red-300">
                Has PoC
              </Badge>
            )}
            {filters.verified && (
              <Badge variant="outline" className="border-green-500/30 text-green-300">
                Verified
              </Badge>
            )}
            {filters.cvssMin > 0 && (
              <Badge variant="outline" className="border-yellow-500/30 text-yellow-300">
                CVSS ≥ {filters.cvssMin}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                updateFilters({
                  type: "all",
                  severity: "all",
                  dateRange: "all",
                  hasPoC: false,
                  verified: false,
                  cvssMin: 0,
                })
              }
              className="text-gray-400 hover:text-white"
            >
              Clear All
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
