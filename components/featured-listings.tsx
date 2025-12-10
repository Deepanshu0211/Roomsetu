"use client"

import { useEffect, useRef, useMemo } from "react"
import Link from "next/link"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowRight, Sparkles } from "lucide-react"
import { useListingsStore, getApprovedListings } from "@/lib/listings-store"
import { ListingCard } from "./listing-card"
import { Button } from "@/components/ui/button"
import { useLocation } from "@/lib/location-context"

gsap.registerPlugin(ScrollTrigger)

export function FeaturedListings() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const { city, area } = useLocation()

  const allListingsRaw = useListingsStore((state) => state.listings)

  const displayListings = useMemo(() => {
    const approved = getApprovedListings(allListingsRaw)

    // Filter by city and optionally area
    const filtered = approved
      .filter((l) => {
        if (city && l.city !== city) return false
        if (area && l.area !== area) return false
        return true
      })
      .slice(0, 6)

    // If no listings in selected location, show all
    return filtered.length > 0 ? filtered : approved.slice(0, 6)
  }, [allListingsRaw, city, area])

  const hasLocalListings = useMemo(() => {
    const approved = getApprovedListings(allListingsRaw)
    return approved.some((l) => l.city === city)
  }, [allListingsRaw, city])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      )

      // Staggered card reveal with 3D effect
      const cards = cardsRef.current?.children
      if (cards) {
        gsap.fromTo(
          cards,
          {
            opacity: 0,
            y: 80,
            scale: 0.85,
            rotateX: 15,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power4.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [displayListings])

  return (
    <section ref={sectionRef} id="featured-listings" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div
        ref={headingRef}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold text-primary uppercase tracking-wider">
              {city ? `In ${city}` : "Featured"}
              {area && ` • ${area}`}
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">
            {city ? "Rooms Near You" : "Popular Listings"}
          </h2>
          <p className="text-muted-foreground mt-2 text-lg">
            {hasLocalListings
              ? `Verified accommodations in ${city}${area ? `, ${area}` : ""}`
              : "Top-rated rooms and PGs across India"}
          </p>
        </div>
        <Button
          variant="outline"
          asChild
          className="rounded-full px-6 py-5 font-bold border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all group bg-transparent"
        >
          <Link href="/browse">
            View All
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>

      <div
        ref={cardsRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        style={{ perspective: "1000px" }}
      >
        {displayListings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>

      {!hasLocalListings && city && (
        <p className="text-center text-muted-foreground mt-8">
          No listings found in {city}
          {area && `, ${area}`}. Showing popular listings from other cities.
        </p>
      )}
    </section>
  )
}
