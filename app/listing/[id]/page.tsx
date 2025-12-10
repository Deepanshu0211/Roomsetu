"use client"

import { useEffect, useRef, useMemo, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { gsap } from "gsap"
import {
  ArrowLeft,
  MapPin,
  IndianRupee,
  Users,
  Phone,
  MessageCircle,
  Utensils,
  Zap,
  Calendar,
  Home,
  User,
  ChevronRight,
  Eye,
  BadgeCheck,
  ChevronLeft,
} from "lucide-react"
import { useListingsStore, getListingById } from "@/lib/listings-store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Footer } from "@/components/footer"

export default function ListingDetailPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const pageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  const allListings = useListingsStore((state) => state.listings)
  const incrementViews = useListingsStore((state) => state.incrementViews)
  const listing = useMemo(() => getListingById(allListings, id), [allListings, id])

  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // ✅ Guard so we don't spam incrementViews and trigger a loop
  const hasIncrementedRef = useRef(false)

  useEffect(() => {
    if (!listing) return
    if (hasIncrementedRef.current) return

    incrementViews(id)
    hasIncrementedRef.current = true
  }, [listing, id, incrementViews])

  useEffect(() => {
    if (!listing) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } })

      tl.fromTo(
        imageRef.current,
        { opacity: 0, scale: 1.15, clipPath: "inset(15% 15% 15% 15%)" },
        { opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 1 },
      )

      tl.fromTo(
        contentRef.current?.children || [],
        { opacity: 0, x: 60, rotateY: 5 },
        { opacity: 1, x: 0, rotateY: 0, duration: 0.6, stagger: 0.1 },
        "-=0.5",
      )
    }, pageRef)

    return () => ctx.revert()
  }, [listing])

  const nextImage = () => {
    if (listing && listing.imageUrls.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % listing.imageUrls.length)
      gsap.fromTo(imageRef.current, { opacity: 0.5 }, { opacity: 1, duration: 0.3 })
    }
  }

  const prevImage = () => {
    if (listing && listing.imageUrls.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + listing.imageUrls.length) % listing.imageUrls.length)
      gsap.fromTo(imageRef.current, { opacity: 0.5 }, { opacity: 1, duration: 0.3 })
    }
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-20 h-20 bg-secondary rounded-3xl flex items-center justify-center mb-6">
          <Home className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-black text-foreground mb-2">Listing Not Found</h1>
        <p className="text-muted-foreground mb-6">The listing you&apos;re looking for doesn&apos;t exist.</p>
        <Button onClick={() => router.push("/browse")} className="rounded-full">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Listings
        </Button>
      </div>
    )
  }

  const genderLabels = {
    boys: "Boys Only",
    girls: "Girls Only",
    any: "Boys & Girls",
  }

  const typeLabels = {
    pg: "Paying Guest (PG)",
    flat: "Flat",
    hostel: "Hostel",
    room: "Room in Flat",
  }

  const occupancyLabels = {
    single: "Single Occupancy",
    double: "Double Sharing",
    triple: "Triple Sharing",
    dorm: "Dormitory",
  }

  const genderColors = {
    boys: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    girls: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
    any: "bg-primary/10 text-primary border-primary/20",
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/browse" className="hover:text-foreground transition-colors">
            Browse
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium truncate max-w-[200px]">{listing.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT: Image + price + quick info */}
          <div className="space-y-4">
            {/* Image Section */}
            <div ref={imageRef} className="relative" style={{ perspective: "1000px" }}>
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-secondary">
                <Image
                  src={
                    listing.imageUrls[currentImageIndex] ||
                    "/placeholder.svg?height=600&width=800&query=modern student room interior" ||
                    "/placeholder.svg"
                  }
                  alt={listing.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                {/* Image navigation */}
                {listing.imageUrls.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white/10 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-foreground" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white/10 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-foreground" />
                    </button>

                    {/* Image dots */}
                    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
                      {listing.imageUrls.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentImageIndex ? "bg-white w-6" : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}

                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className={`${genderColors[listing.forGender]} border font-semibold px-3 py-1`}>
                    {genderLabels[listing.forGender]}
                  </Badge>
                  {!listing.isAvailable && (
                    <Badge variant="destructive" className="font-semibold">
                      Not Available
                    </Badge>
                  )}
                </div>

                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  {listing.isVerified && (
                    <div className="flex items-center gap-1 bg-blue-500 text-white rounded-xl px-3 py-1.5">
                      <BadgeCheck className="w-4 h-4" />
                      <span className="text-sm font-semibold">Verified</span>
                    </div>
                  )}
                </div>

                <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-card/95 backdrop-blur-sm rounded-xl px-3 py-1.5">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-semibold">{listing.views || 0} views</span>
                </div>
              </div>

              {/* Thumbnail strip */}
              {listing.imageUrls.length > 1 && (
                <div className="flex gap-2 mt-4">
                  {listing.imageUrls.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? "border-primary"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image src={url || "/placeholder.svg"} alt={`Photo ${index + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price Card under image */}
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Monthly Rent</p>
                    <div className="flex items-center text-4xl font-black text-foreground">
                      <IndianRupee className="w-7 h-7" />
                      <span>{listing.rent.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Deposit</p>
                    <div className="flex items-center text-xl font-bold text-foreground justify-end">
                      <IndianRupee className="w-5 h-5" />
                      <span>{listing.deposit.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Info under image */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Home, label: "Type", value: typeLabels[listing.type] },
                { icon: Users, label: "Occupancy", value: occupancyLabels[listing.occupancy] },
                { icon: Utensils, label: "Food", value: listing.includesFood ? "Included" : "Not Included" },
                {
                  icon: Zap,
                  label: "Electricity",
                  value: listing.electricityType === "included" ? "Included" : "Extra",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 p-4 bg-secondary/50 rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-bold text-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Title, amenities, description, contact, date */}
          <div ref={contentRef} className="space-y-6" style={{ perspective: "1000px" }}>
            {/* Title & Location */}
            <div>
              <Badge variant="secondary" className="mb-3 font-semibold">
                {typeLabels[listing.type]}
              </Badge>
              <h1 className="text-3xl sm:text-4xl font-black text-foreground leading-tight mb-3">
                {listing.title}
              </h1>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="w-5 h-5 mr-2 flex-shrink-0 text-primary" />
                <span className="text-lg">
                  {listing.area}, {listing.city} &middot; {listing.landmark}
                </span>
              </div>
            </div>

            {/* Amenities */}
            <Card className="border-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold">Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {listing.amenities.map((amenity) => (
                    <Badge
                      key={amenity}
                      variant="secondary"
                      className="text-sm py-1.5 px-4 rounded-full font-medium"
                    >
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            {listing.description && (
              <Card className="border-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold">About this property</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {listing.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Contact Card */}
            <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  Contact Owner
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-bold text-foreground text-lg mb-4">{listing.ownerName}</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild className="flex-1 rounded-xl h-12 font-bold">
                    <a href={`tel:${listing.ownerPhone}`}>
                      <Phone className="w-5 h-5 mr-2" />
                      Call Now
                    </a>
                  </Button>
                  {listing.ownerWhatsapp && (
                    <Button
                      variant="outline"
                      asChild
                      className="flex-1 rounded-xl h-12 font-bold bg-transparent border-2 border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-950"
                    >
                      <a
                        href={`https://wa.me/${listing.ownerWhatsapp.replace(
                          /[^0-9]/g,
                          "",
                        )}?text=Hi, I'm interested in your listing "${listing.title}" on RoomSetu.`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="w-5 h-5 mr-2" />
                        WhatsApp
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Posted Date */}
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mr-2" />
              Posted on{" "}
              {new Date(listing.createdAt).toLocaleDateString("en-IN", {
                dateStyle: "long",
              })}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
