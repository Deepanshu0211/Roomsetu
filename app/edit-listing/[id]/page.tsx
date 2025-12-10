"use client"

import type React from "react"
import { useEffect, useRef, useState, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import { gsap } from "gsap"
import { Check, Plus, Home, MapPin, IndianRupee, Camera, User, ArrowLeft, Loader2 } from "lucide-react"
import { allCities, cities, amenities as amenitiesList } from "@/lib/data"
import { useListingsStore, getListingById } from "@/lib/listings-store"
import { useAuthStore } from "@/lib/auth-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Footer } from "@/components/footer"
import Link from "next/link"

export default function EditListingPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const pageRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const listings = useListingsStore((state) => state.listings)
  const updateListing = useListingsStore((state) => state.updateListing)
  const listing = useMemo(() => getListingById(listings, id), [listings, id])

  const { user, isAuthenticated } = useAuthStore()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    forGender: "",
    occupancy: "",
    city: "",
    area: "",
    landmark: "",
    rent: "",
    deposit: "",
    includesFood: false,
    electricityType: "extra",
    imageUrl: "",
    ownerName: "",
    ownerPhone: "",
    ownerWhatsapp: "",
  })

  // Load listing data
  useEffect(() => {
    if (listing) {
      setFormData({
        title: listing.title,
        description: listing.description || "",
        type: listing.type,
        forGender: listing.forGender,
        occupancy: listing.occupancy,
        city: listing.city,
        area: listing.area,
        landmark: listing.landmark,
        rent: listing.rent.toString(),
        deposit: listing.deposit.toString(),
        includesFood: listing.includesFood,
        electricityType: listing.electricityType,
        imageUrl: listing.imageUrls[0] || "",
        ownerName: listing.ownerName,
        ownerPhone: listing.ownerPhone,
        ownerWhatsapp: listing.ownerWhatsapp || "",
      })
      setSelectedAmenities(listing.amenities || [])
    }
  }, [listing])

  const availableAreas = formData.city ? cities[formData.city] || [] : []

  useEffect(() => {
    gsap.fromTo(pageRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 })

    const cards = formRef.current?.querySelectorAll(".form-card")
    if (cards) {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out", delay: 0.1 },
      )
    }
  }, [listing])

  // Check ownership
  const isOwner = listing && (listing.ownerId === user?.id || listing.ownerPhone === user?.phone)

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading listing...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !isOwner) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-20 h-20 bg-destructive/10 rounded-3xl flex items-center justify-center mb-6">
          <User className="w-10 h-10 text-destructive" />
        </div>
        <h1 className="text-2xl font-black text-foreground mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-6 text-center">You can only edit your own listings.</p>
        <Button asChild className="rounded-full">
          <Link href="/profile">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go to Profile
          </Link>
        </Button>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (name === "city") {
      setFormData((prev) => ({ ...prev, area: "" }))
    }
  }

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) => (prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 600))

    updateListing(id, {
      title: formData.title,
      description: formData.description,
      type: formData.type as "pg" | "flat" | "hostel" | "room",
      forGender: formData.forGender as "boys" | "girls" | "any",
      occupancy: formData.occupancy as "single" | "double" | "triple" | "dorm",
      city: formData.city,
      area: formData.area,
      landmark: formData.landmark,
      rent: Number(formData.rent),
      deposit: Number(formData.deposit),
      includesFood: formData.includesFood,
      electricityType: formData.electricityType as "included" | "extra",
      amenities: selectedAmenities,
      imageUrls: formData.imageUrl ? [formData.imageUrl] : [],
      ownerName: formData.ownerName,
      ownerPhone: formData.ownerPhone,
      ownerWhatsapp: formData.ownerWhatsapp || undefined,
    })

    setIsSubmitting(false)
    setShowSuccess(true)

    gsap.to(pageRef.current, {
      opacity: 0.8,
      scale: 0.98,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      onComplete: () => router.push("/profile"),
    })
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" asChild className="rounded-xl bg-transparent">
            <Link href="/profile">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-black text-foreground">Edit Listing</h1>
            <p className="text-muted-foreground">Update your property details</p>
          </div>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          {/* Property Details */}
          <Card className="form-card border-2 rounded-3xl overflow-hidden">
            <CardHeader className="bg-secondary/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Home className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="font-bold">Property Details</CardTitle>
                  <CardDescription>Basic information about your property</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="font-semibold">
                  Property Title *
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="rounded-xl h-12 border-2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="font-semibold">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="rounded-xl border-2"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="font-semibold">Property Type *</Label>
                  <Select value={formData.type} onValueChange={(v) => handleSelectChange("type", v)}>
                    <SelectTrigger className="rounded-xl h-12 border-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pg">PG</SelectItem>
                      <SelectItem value="flat">Flat</SelectItem>
                      <SelectItem value="hostel">Hostel</SelectItem>
                      <SelectItem value="room">Room in Flat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-semibold">For *</Label>
                  <Select value={formData.forGender} onValueChange={(v) => handleSelectChange("forGender", v)}>
                    <SelectTrigger className="rounded-xl h-12 border-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="boys">Boys</SelectItem>
                      <SelectItem value="girls">Girls</SelectItem>
                      <SelectItem value="any">Any</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-semibold">Occupancy *</Label>
                  <Select value={formData.occupancy} onValueChange={(v) => handleSelectChange("occupancy", v)}>
                    <SelectTrigger className="rounded-xl h-12 border-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="double">Double</SelectItem>
                      <SelectItem value="triple">Triple</SelectItem>
                      <SelectItem value="dorm">Dorm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card className="form-card border-2 rounded-3xl overflow-hidden">
            <CardHeader className="bg-secondary/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="font-bold">Location</CardTitle>
                  <CardDescription>Property location details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-semibold">City *</Label>
                  <Select value={formData.city} onValueChange={(v) => handleSelectChange("city", v)}>
                    <SelectTrigger className="rounded-xl h-12 border-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {allCities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-semibold">Area *</Label>
                  <Select value={formData.area} onValueChange={(v) => handleSelectChange("area", v)}>
                    <SelectTrigger className="rounded-xl h-12 border-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableAreas.map((area) => (
                        <SelectItem key={area} value={area}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="landmark" className="font-semibold">
                  Landmark *
                </Label>
                <Input
                  id="landmark"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleInputChange}
                  required
                  className="rounded-xl h-12 border-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="form-card border-2 rounded-3xl overflow-hidden">
            <CardHeader className="bg-secondary/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <IndianRupee className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="font-bold">Pricing</CardTitle>
                  <CardDescription>Rent and deposit details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rent" className="font-semibold">
                    Monthly Rent (₹) *
                  </Label>
                  <Input
                    id="rent"
                    name="rent"
                    type="number"
                    value={formData.rent}
                    onChange={handleInputChange}
                    required
                    className="rounded-xl h-12 border-2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deposit" className="font-semibold">
                    Deposit (₹) *
                  </Label>
                  <Input
                    id="deposit"
                    name="deposit"
                    type="number"
                    value={formData.deposit}
                    onChange={handleInputChange}
                    required
                    className="rounded-xl h-12 border-2"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 pt-2">
                <div className="flex items-center justify-between sm:justify-start gap-4 p-4 bg-secondary/50 rounded-2xl">
                  <Label htmlFor="includesFood" className="font-semibold cursor-pointer">
                    Includes Food
                  </Label>
                  <Switch
                    id="includesFood"
                    checked={formData.includesFood}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, includesFood: checked }))}
                  />
                </div>

                <div className="space-y-2 flex-1">
                  <Label className="font-semibold">Electricity</Label>
                  <Select
                    value={formData.electricityType}
                    onValueChange={(v) => handleSelectChange("electricityType", v)}
                  >
                    <SelectTrigger className="rounded-xl h-12 border-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="included">Included in Rent</SelectItem>
                      <SelectItem value="extra">Extra (As per usage)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card className="form-card border-2 rounded-3xl overflow-hidden">
            <CardHeader className="bg-secondary/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Check className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="font-bold">Amenities</CardTitle>
                  <CardDescription>Select available amenities</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2">
                {amenitiesList.map((amenity) => {
                  const isSelected = selectedAmenities.includes(amenity)
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-lg"
                          : "bg-secondary text-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {isSelected ? (
                        <Check className="w-4 h-4 inline mr-1.5" />
                      ) : (
                        <Plus className="w-4 h-4 inline mr-1.5" />
                      )}
                      {amenity}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Photo */}
          <Card className="form-card border-2 rounded-3xl overflow-hidden">
            <CardHeader className="bg-secondary/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Camera className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="font-bold">Photo</CardTitle>
                  <CardDescription>Property photo URL</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <Input
                id="imageUrl"
                name="imageUrl"
                type="url"
                placeholder="https://example.com/photo.jpg"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="rounded-xl h-12 border-2"
              />
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="form-card border-2 rounded-3xl overflow-hidden">
            <CardHeader className="bg-secondary/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="font-bold">Contact Information</CardTitle>
                  <CardDescription>Your contact details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ownerName" className="font-semibold">
                  Your Name *
                </Label>
                <Input
                  id="ownerName"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleInputChange}
                  required
                  className="rounded-xl h-12 border-2"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ownerPhone" className="font-semibold">
                    Phone Number *
                  </Label>
                  <Input
                    id="ownerPhone"
                    name="ownerPhone"
                    type="tel"
                    value={formData.ownerPhone}
                    onChange={handleInputChange}
                    required
                    className="rounded-xl h-12 border-2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownerWhatsapp" className="font-semibold">
                    WhatsApp (Optional)
                  </Label>
                  <Input
                    id="ownerWhatsapp"
                    name="ownerWhatsapp"
                    type="tel"
                    value={formData.ownerWhatsapp}
                    onChange={handleInputChange}
                    className="rounded-xl h-12 border-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex-1 h-14 rounded-2xl text-lg font-bold bg-transparent"
              onClick={() => router.push("/profile")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="lg"
              className="flex-1 h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/25"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  )
}
