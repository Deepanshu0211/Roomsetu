"use client"

import { useEffect, useRef, useState, Suspense, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { gsap } from "gsap"
import { Search, MapPin, Loader2, SlidersHorizontal } from "lucide-react"
import { useListingsStore, filterListings } from "@/lib/listings-store"
import { ListingCard } from "@/components/listing-card"
import { ListingFilters } from "@/components/listing-filters"
import { Footer } from "@/components/footer"
import { useLocation } from "@/lib/location-context"
import { Button } from "@/components/ui/button"

interface FiltersState {
  area: string
  minBudget: string
  maxBudget: string
  type: string
  occupancy: string
  forGender: string
}

const defaultFilters: FiltersState = {
  area: "all",
  minBudget: "",
  maxBudget: "",
  type: "all",
  occupancy: "all",
  forGender: "all",
}

function BrowseContent() {
  const searchParams = useSearchParams()
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const { city, area: locationArea, loading: locationLoading, availableAreas } = useLocation()
  const [showFilters, setShowFilters] = useState(true)

  const allListings = useListingsStore((state) => state.listings)

  const [filters, setFilters] = useState<FiltersState>(() => {
    const filterParam = searchParams.get("filter")
    const areaParam = searchParams.get("area")

    const initialFilters = { ...defaultFilters }

    if (areaParam) {
      initialFilters.area = areaParam
    }

    if (filterParam) {
      if (["boys", "girls"].includes(filterParam)) {
        initialFilters.forGender = filterParam
      }
      if (["pg", "flat", "hostel"].includes(filterParam)) {
        initialFilters.type = filterParam
      }
    }

    return initialFilters
  })

  useEffect(() => {
    if (locationArea && filters.area === "all") {
      setFilters((prev) => ({ ...prev, area: locationArea }))
    }
  }, [locationArea, filters.area])

  const listings = useMemo(() => {
    return filterListings(allListings, {
      city: city,
      area: filters.area,
      minBudget: filters.minBudget ? Number(filters.minBudget) : undefined,
      maxBudget: filters.maxBudget ? Number(filters.maxBudget) : undefined,
      type: filters.type,
      occupancy: filters.occupancy,
      forGender: filters.forGender,
    })
  }, [allListings, city, filters])

  const handleFilterChange = (key: keyof FiltersState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setFilters(defaultFilters)
  }

  useEffect(() => {
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: -40, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power4.out" },
    )
  }, [])

  // Animate cards when listings change
  useEffect(() => {
    const cards = cardsRef.current?.children
    if (cards && cards.length > 0) {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 50, scale: 0.9, rotateY: 5 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateY: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power4.out",
        },
      )
    }
  }, [listings.length, filters, city])

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div ref={headerRef} className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">Browse Rooms</h1>
              <p className="text-muted-foreground mt-2 text-lg">
                {locationLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Detecting your location...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Showing rooms in <span className="font-bold text-foreground">{city}</span>
                    {filters.area !== "all" && (
                      <>
                        {" "}
                        near <span className="font-semibold text-primary">{filters.area}</span>
                      </>
                    )}
                  </span>
                )}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden rounded-full bg-transparent"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>
        </div>

        {/* Filters - pass available areas from context */}
        <div className={`${showFilters ? "block" : "hidden sm:block"}`}>
          <ListingFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            availableAreas={availableAreas}
          />
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground">
            Found <span className="font-black text-foreground text-xl">{listings.length}</span>{" "}
            {listings.length === 1 ? "room" : "rooms"} in {city}
          </p>
        </div>

        {/* Listings Grid */}
        {listings.length > 0 ? (
          <div
            ref={cardsRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            style={{ perspective: "1000px" }}
          >
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-secondary rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No rooms found in {city}</h3>
            <p className="text-muted-foreground mb-6">Try selecting a different city or adjusting your filters.</p>
            <Button onClick={handleClearFilters} className="rounded-full">
              Clear All Filters
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default function BrowsePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground font-medium">Loading rooms...</p>
          </div>
        </div>
      }
    >
      <BrowseContent />
    </Suspense>
  )
}
