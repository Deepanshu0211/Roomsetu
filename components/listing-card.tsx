"use client"

import type React from "react"
import { useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { gsap } from "gsap"
import { MapPin, IndianRupee, Users, Utensils, Wifi, Snowflake, ChevronRight, ImageIcon } from "lucide-react"
import type { Listing } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface ListingCardProps {
  listing: Listing
}

const amenityIcons: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="w-3.5 h-3.5" />,
  Food: <Utensils className="w-3.5 h-3.5" />,
  AC: <Snowflake className="w-3.5 h-3.5" />,
}

export function ListingCard({ listing }: ListingCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      y: -10,
      scale: 1.02,
      boxShadow: "0 30px 60px -15px rgba(0, 0, 0, 0.25)",
      duration: 0.4,
      ease: "power3.out",
    })
    gsap.to(imageRef.current, {
      scale: 1.1,
      duration: 0.6,
      ease: "power3.out",
    })
  }

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      y: 0,
      scale: 1,
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      duration: 0.4,
      ease: "power3.out",
    })
    gsap.to(imageRef.current, {
      scale: 1,
      duration: 0.5,
      ease: "power3.out",
    })
  }

  const genderColors = {
    boys: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    girls: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
    any: "bg-primary/10 text-primary border-primary/20",
  }

  const typeLabels = {
    pg: "PG",
    flat: "Flat",
    hostel: "Hostel",
    room: "Room",
  }

  const photoCount = listing.imageUrls?.length || 1

  return (
    <Link href={`/listing/${listing.id}`}>
      <Card
        ref={cardRef}
        className="overflow-hidden cursor-pointer border-2 border-transparent hover:border-primary/30 transition-colors bg-card rounded-2xl"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative aspect-[16/10] overflow-hidden" ref={imageRef}>
          <Image
            src={listing.imageUrls[0] || "/placeholder.svg?height=300&width=400&query=modern student room interior"}
            alt={listing.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className={`${genderColors[listing.forGender]} border font-semibold`}>
              {listing.forGender === "boys" ? "Boys" : listing.forGender === "girls" ? "Girls" : "Any"}
            </Badge>
            <Badge variant="secondary" className="bg-card/90 backdrop-blur-sm font-semibold">
              {typeLabels[listing.type]}
            </Badge>
          </div>
          {photoCount > 1 && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1">
              <ImageIcon className="w-3 h-3 text-white" />
              <span className="text-xs font-semibold text-white">{photoCount}</span>
            </div>
          )}
          {/* Price tag overlay */}
          <div className="absolute bottom-3 left-3 flex items-center bg-card/95 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-lg">
            <IndianRupee className="w-4 h-4 text-primary" />
            <span className="text-lg font-black text-foreground">{listing.rent.toLocaleString("en-IN")}</span>
            <span className="text-xs text-muted-foreground ml-1">/mo</span>
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="font-bold text-foreground line-clamp-1 text-lg">{listing.title}</h3>

          <div className="flex items-center text-muted-foreground text-sm mt-2">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0 text-primary" />
            <span className="line-clamp-1">
              {listing.area}, {listing.city}
            </span>
            <span className="mx-1.5">·</span>
            <Users className="w-4 h-4 mr-1" />
            <span className="capitalize">{listing.occupancy}</span>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {listing.amenities.slice(0, 3).map((amenity) => (
              <div
                key={amenity}
                className="flex items-center gap-1 text-xs py-1 px-2 rounded-lg bg-secondary text-secondary-foreground"
              >
                {amenityIcons[amenity] || null}
                <span>{amenity}</span>
              </div>
            ))}
            {listing.amenities.length > 3 && (
              <div className="flex items-center text-xs py-1 px-2 rounded-lg bg-secondary text-muted-foreground">
                +{listing.amenities.length - 3}
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              {listing.includesFood ? "Food included" : "Food not included"}
            </span>
            <div className="flex items-center text-primary font-semibold text-sm group-hover:translate-x-1 transition-transform">
              View Details
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
