"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { X, Filter, IndianRupee } from "lucide-react"

interface FiltersState {
  area: string
  minBudget: string
  maxBudget: string
  type: string
  occupancy: string
  forGender: string
}

interface ListingFiltersProps {
  filters: FiltersState
  onFilterChange: (key: keyof FiltersState, value: string) => void
  onClearFilters: () => void
  availableAreas?: string[]
}

export function ListingFilters({ filters, onFilterChange, onClearFilters, availableAreas = [] }: ListingFiltersProps) {
  const filtersRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.fromTo(
      filtersRef.current,
      { opacity: 0, y: -20, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power4.out", delay: 0.2 },
    )
  }, [])

  const hasActiveFilters = Object.entries(filters).some(([key, v]) => v && v !== "all" && v !== "")
  const activeFilterCount = Object.entries(filters).filter(([key, v]) => v && v !== "all" && v !== "").length

  return (
    <div ref={filtersRef} className="bg-card border-2 border-border rounded-3xl p-5 sm:p-6 mb-8 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Filter className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">Filters</h3>
            {activeFilterCount > 0 && <p className="text-xs text-primary font-semibold">{activeFilterCount} active</p>}
          </div>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-foreground rounded-full"
          >
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Area - Use availableAreas prop */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Area</Label>
          <Select value={filters.area} onValueChange={(v) => onFilterChange("area", v)}>
            <SelectTrigger className="rounded-xl h-11 border-2 focus:border-primary">
              <SelectValue placeholder="All Areas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              {availableAreas.map((area) => (
                <SelectItem key={area} value={area}>
                  {area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Property Type */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Property Type</Label>
          <Select value={filters.type} onValueChange={(v) => onFilterChange("type", v)}>
            <SelectTrigger className="rounded-xl h-11 border-2 focus:border-primary">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="pg">PG</SelectItem>
              <SelectItem value="flat">Flat</SelectItem>
              <SelectItem value="hostel">Hostel</SelectItem>
              <SelectItem value="room">Room in Flat</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* For Gender */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">For</Label>
          <Select value={filters.forGender} onValueChange={(v) => onFilterChange("forGender", v)}>
            <SelectTrigger className="rounded-xl h-11 border-2 focus:border-primary">
              <SelectValue placeholder="Anyone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Anyone</SelectItem>
              <SelectItem value="boys">Boys</SelectItem>
              <SelectItem value="girls">Girls</SelectItem>
              <SelectItem value="any">Co-ed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Occupancy */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Occupancy</Label>
          <Select value={filters.occupancy} onValueChange={(v) => onFilterChange("occupancy", v)}>
            <SelectTrigger className="rounded-xl h-11 border-2 focus:border-primary">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any</SelectItem>
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="double">Double</SelectItem>
              <SelectItem value="triple">Triple</SelectItem>
              <SelectItem value="dorm">Dorm</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Min Budget */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Min Budget</Label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="number"
              placeholder="Min"
              value={filters.minBudget}
              onChange={(e) => onFilterChange("minBudget", e.target.value)}
              className="pl-9 rounded-xl h-11 border-2 focus:border-primary"
            />
          </div>
        </div>

        {/* Max Budget */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Max Budget</Label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxBudget}
              onChange={(e) => onFilterChange("maxBudget", e.target.value)}
              className="pl-9 rounded-xl h-11 border-2 focus:border-primary"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
