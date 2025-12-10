"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { gsap } from "gsap"
import {
  ArrowLeft,
  Upload,
  Home,
  MapPin,
  IndianRupee,
  Sparkles,
  ImageIcon,
  Phone,
  CheckCircle,
  Plus,
  Check,
  X,
  Loader2,
} from "lucide-react"
import { useListingsStore } from "@/lib/listings-store"
import { useAuthStore } from "@/lib/auth-store"
import { useLocation } from "@/lib/location-context"
import { cities, allCities, amenities as amenitiesList } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Footer } from "@/components/footer"

export default function AddListingPage() {
  const router = useRouter()
  const addListing = useListingsStore((state) => state.addListing)
  const { user, isAuthenticated } = useAuthStore()
  const { city: detectedCity } = useLocation()

  const pageRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const successRef = useRef<HTMLDivElement>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>(["", "", ""])

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
    ownerName: "",
    ownerPhone: "",
    ownerWhatsapp: "",
  })

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        ownerName: prev.ownerName || user.name,
        ownerPhone: prev.ownerPhone || user.phone,
        city: prev.city || user.city,
      }))
    }
  }, [user])

  useEffect(() => {
    if (detectedCity && !formData.city && !user?.city) {
      setFormData((prev) => ({ ...prev, city: detectedCity }))
    }
  }, [detectedCity, user?.city, formData.city])

  const availableAreas = formData.city ? cities[formData.city] || [] : []

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(pageRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 })

      const cards = formRef.current?.querySelectorAll(".form-card")
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 60, scale: 0.92, rotateX: 10 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power4.out",
            delay: 0.2,
          },
        )
      }
    }, pageRef)

    return () => ctx.revert()
  }, [])

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

  const handleImageUrlChange = (index: number, value: string) => {
    const newUrls = [...imageUrls]
    newUrls[index] = value
    setImageUrls(newUrls)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const validImageUrls = imageUrls.filter((url) => url.trim() !== "")

    await new Promise((resolve) => setTimeout(resolve, 1000))

    addListing({
      title: formData.title,
      description: formData.description,
      type: formData.type as "pg" | "flat" | "hostel" | "room",
      forGender: formData.forGender as "boys" | "girls" | "any",
      occupancy: formData.occupancy as "single" | "double" | "triple" | "dorm",
      city: formData.city,
      area: formData.area,
      landmark: formData.landmark,
      rent: Number.parseInt(formData.rent),
      deposit: Number.parseInt(formData.deposit),
      includesFood: formData.includesFood,
      electricityType: formData.electricityType as "included" | "extra",
      amenities: selectedAmenities,
      imageUrls: validImageUrls.length > 0 ? validImageUrls : ["/cozy-reading-nook.png"],
      ownerName: formData.ownerName,
      ownerPhone: formData.ownerPhone,
      ownerWhatsapp: formData.ownerWhatsapp || undefined,
      ownerId: user?.id,
    })

    setIsSubmitting(false)
    setIsSuccess(true)

    gsap.fromTo(
      successRef.current,
      { opacity: 0, scale: 0.8, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" },
    )
  }

  if (isSuccess) {
    return (
      <div ref={pageRef} className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card ref={successRef} className="max-w-md w-full border-2 rounded-3xl text-center">
          <CardContent className="pt-12 pb-8">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-3xl font-black text-foreground mb-3">Listing Submitted!</h1>
            <p className="text-muted-foreground mb-8">
              Your property has been submitted for review. It will appear once approved by our team.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="flex-1 rounded-xl font-bold">
                <Link href="/browse">Browse Listings</Link>
              </Button>
              <Button variant="outline" asChild className="flex-1 rounded-xl font-bold bg-transparent">
                <Link href="/profile">My Properties</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={() => router.back()} className="rounded-xl bg-transparent">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-black text-foreground">List Your Property</h1>
            <p className="text-muted-foreground">Fill in the details to list your room or PG</p>
          </div>
        </div>

        {/* Login prompt */}
        {!isAuthenticated && (
          <Card className="mb-6 border-2 border-primary/30 rounded-2xl bg-primary/5">
            <CardContent className="py-4 flex items-center justify-between">
              <p className="text-sm font-medium">Login to manage your listings from your profile</p>
              <Button asChild size="sm" className="rounded-xl">
                <Link href="/login">Login</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* FORM AS GRID */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          style={{ perspective: "1000px" }}
        >
          {/* Property Details - full width */}
          <Card className="form-card border-2 rounded-3xl overflow-hidden lg:col-span-2">
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
                <Label className="font-semibold">Property Title *</Label>
                <Input
                  name="title"
                  placeholder="e.g., Spacious Single Room PG near College"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="rounded-xl h-12 border-2"
                />
              </div>

              <div className="space-y-2">
                <Label className="font-semibold">Description</Label>
                <Textarea
                  name="description"
                  placeholder="Describe your property, nearby landmarks, facilities..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="rounded-xl border-2"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="font-semibold">Property Type *</Label>
                  <Select value={formData.type} onValueChange={(v) => handleSelectChange("type", v)} required>
                    <SelectTrigger className="rounded-xl h-12 border-2">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pg">PG</SelectItem>
                      <SelectItem value="hostel">Hostel</SelectItem>
                      <SelectItem value="flat">Flat</SelectItem>
                      <SelectItem value="room">Room</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-semibold">For *</Label>
                  <Select value={formData.forGender} onValueChange={(v) => handleSelectChange("forGender", v)} required>
                    <SelectTrigger className="rounded-xl h-12 border-2">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="boys">Boys</SelectItem>
                      <SelectItem value="girls">Girls</SelectItem>
                      <SelectItem value="any">Boys & Girls</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-semibold">Occupancy *</Label>
                  <Select value={formData.occupancy} onValueChange={(v) => handleSelectChange("occupancy", v)} required>
                    <SelectTrigger className="rounded-xl h-12 border-2">
                      <SelectValue placeholder="Select" />
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
                  <CardDescription>Where is your property located?</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-semibold">City *</Label>
                  <Select value={formData.city} onValueChange={(v) => handleSelectChange("city", v)} required>
                    <SelectTrigger className="rounded-xl h-12 border-2">
                      <SelectValue placeholder="Select city" />
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
                  <Select
                    value={formData.area}
                    onValueChange={(v) => handleSelectChange("area", v)}
                    required
                    disabled={!formData.city}
                  >
                    <SelectTrigger className="rounded-xl h-12 border-2">
                      <SelectValue placeholder={formData.city ? "Select area" : "Select city first"} />
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
                <Label className="font-semibold">Landmark</Label>
                <Input
                  name="landmark"
                  placeholder="e.g., Near XYZ College Main Gate"
                  value={formData.landmark}
                  onChange={handleInputChange}
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
                  <CardDescription>Set your rent and deposit</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-semibold">Monthly Rent (Rs) *</Label>
                  <Input
                    name="rent"
                    type="number"
                    placeholder="e.g., 6500"
                    value={formData.rent}
                    onChange={handleInputChange}
                    required
                    className="rounded-xl h-12 border-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold">Security Deposit (Rs) *</Label>
                  <Input
                    name="deposit"
                    type="number"
                    placeholder="e.g., 10000"
                    value={formData.deposit}
                    onChange={handleInputChange}
                    required
                    className="rounded-xl h-12 border-2"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-secondary/30 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={formData.includesFood}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, includesFood: checked }))}
                  />
                  <Label className="font-semibold cursor-pointer">Food Included</Label>
                </div>
                <Select
                  value={formData.electricityType}
                  onValueChange={(v) => handleSelectChange("electricityType", v)}
                >
                  <SelectTrigger className="w-[180px] rounded-xl border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="included">Electricity Included</SelectItem>
                    <SelectItem value="extra">Electricity Extra</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Amenities - full width */}
          <Card className="form-card border-2 rounded-3xl overflow-hidden lg:col-span-2">
            <CardHeader className="bg-secondary/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="font-bold">Amenities</CardTitle>
                  <CardDescription>Select all amenities available in your property</CardDescription>
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
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                          : "bg-secondary text-foreground hover:bg-secondary/80 border-2 border-transparent hover:border-primary/20"
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
              {selectedAmenities.length > 0 && (
                <p className="text-sm text-muted-foreground mt-4">{selectedAmenities.length} amenities selected</p>
              )}
            </CardContent>
          </Card>

          {/* Photos */}
          <Card className="form-card border-2 rounded-3xl overflow-hidden">
            <CardHeader className="bg-secondary/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="font-bold">Photos (Up to 3)</CardTitle>
                  <CardDescription>Add image URLs for your property photos</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {imageUrls.map((url, index) => (
                <div key={index} className="space-y-2">
                  <Label className="font-semibold">
                    Photo {index + 1} URL {index === 0 && "*"}
                  </Label>
                  <div className="flex gap-3">
                    <Input
                      placeholder="https://example.com/image.jpg"
                      value={url}
                      onChange={(e) => handleImageUrlChange(index, e.target.value)}
                      required={index === 0}
                      className="rounded-xl h-12 border-2 flex-1"
                    />
                    {url && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleImageUrlChange(index, "")}
                        className="rounded-xl h-12 w-12 bg-transparent"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  {url && (
                    <div className="relative w-32 h-20 rounded-xl overflow-hidden border-2">
                      <Image
                        src={url || "/placeholder.svg"}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src = "/cozy-reading-nook.png"
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
              <p className="text-xs text-muted-foreground">
                Tip: Use free image hosting like Imgur or Cloudinary for your photos
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="form-card border-2 rounded-3xl overflow-hidden">
            <CardHeader className="bg-secondary/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="font-bold">Contact Information</CardTitle>
                  <CardDescription>How can tenants reach you?</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="font-semibold">Your Name *</Label>
                <Input
                  name="ownerName"
                  placeholder="Enter your name"
                  value={formData.ownerName}
                  onChange={handleInputChange}
                  required
                  className="rounded-xl h-12 border-2"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-semibold">Phone Number *</Label>
                  <Input
                    name="ownerPhone"
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.ownerPhone}
                    onChange={handleInputChange}
                    required
                    className="rounded-xl h-12 border-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold">WhatsApp Number</Label>
                  <Input
                    name="ownerWhatsapp"
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.ownerWhatsapp}
                    onChange={handleInputChange}
                    className="rounded-xl h-12 border-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit - full width */}
          <div className="lg:col-span-2">
            <Button
              type="submit"
              size="lg"
              className="w-full h-14 rounded-2xl font-bold text-lg shadow-xl shadow-primary/25"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 mr-2" />
                  Submit for Review
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
