"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { gsap } from "gsap"
import {
  User,
  Phone,
  Mail,
  MapPin,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Home,
  LogOut,
  Shield,
  IndianRupee,
  Calendar,
  ToggleLeft,
  ToggleRight,
  Loader2,
  GraduationCap,
  Building2,
  BookOpen,
  Search,
  Heart,
} from "lucide-react"
import { useAuthStore } from "@/lib/auth-store"
import { useListingsStore } from "@/lib/listings-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Footer } from "@/components/footer"
import { allCities } from "@/lib/data"
import type { Listing } from "@/lib/data"

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, logout, updateProfile } = useAuthStore()
  const listings = useListingsStore((state) => state.listings)
  const toggleAvailability = useListingsStore((state) => state.toggleAvailability)
  const deleteListing = useListingsStore((state) => state.deleteListing)

  const pageRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const listingsRef = useRef<HTMLDivElement>(null)

  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    city: user?.city || "",
    college: user?.college || "",
    course: user?.course || "",
  })

  // Get user's listings (for landlords)
  const myListings = useMemo(() => {
    if (user?.userType === "student") return []
    return listings.filter((l) => l.ownerId === user?.id || l.ownerPhone === user?.phone)
  }, [listings, user?.id, user?.phone, user?.userType])

  // Get recommended listings for students based on their city
  const recommendedListings = useMemo(() => {
    if (user?.userType !== "student") return []
    return listings.filter((l) => l.city === user.city && l.status === "approved" && l.isAvailable).slice(0, 4)
  }, [listings, user?.city, user?.userType])

  const totalViews = useMemo(() => myListings.reduce((sum, l) => sum + (l.views || 0), 0), [myListings])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    // Update edit form when user changes
    if (user) {
      setEditForm({
        name: user.name || "",
        email: user.email || "",
        city: user.city || "",
        college: user.college || "",
        course: user.course || "",
      })
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } })

      tl.fromTo(pageRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 })

      if (statsRef.current) {
        tl.fromTo(
          statsRef.current.children,
          { opacity: 0, y: 40, scale: 0.9, rotateY: 10 },
          { opacity: 1, y: 0, scale: 1, rotateY: 0, duration: 0.6, stagger: 0.1 },
          "-=0.3",
        )
      }

      if (listingsRef.current) {
        tl.fromTo(
          listingsRef.current.children,
          { opacity: 0, x: -40 },
          { opacity: 1, x: 0, duration: 0.5, stagger: 0.08 },
          "-=0.4",
        )
      }
    }, pageRef)

    return () => ctx.revert()
  }, [isAuthenticated, router, user])

  const handleProfileUpdate = () => {
    updateProfile(editForm)
    setIsEditingProfile(false)
    gsap.fromTo(".profile-card", { scale: 0.98 }, { scale: 1, duration: 0.3, ease: "back.out(2)" })
  }

  const handleToggleAvailability = (id: string) => {
    toggleAvailability(id)
    gsap.fromTo(`[data-listing-id="${id}"]`, { scale: 0.98 }, { scale: 1, duration: 0.3, ease: "back.out(2)" })
  }

  const handleDeleteListing = (id: string) => {
    gsap.to(`[data-listing-id="${id}"]`, {
      opacity: 0,
      x: -100,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => deleteListing(id),
    })
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const isStudent = user.userType === "student"

  return (
    <div ref={pageRef} className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          {/* Profile Card */}
          <Card className="profile-card flex-1 border-2 rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent pb-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-3xl bg-primary/20 flex items-center justify-center">
                    {isStudent ? (
                      <GraduationCap className="w-10 h-10 text-primary" />
                    ) : (
                      <User className="w-10 h-10 text-primary" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-black">{user.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Phone className="w-4 h-4" />
                      {user.phone}
                    </CardDescription>
                    {isStudent ? (
                      <Badge className="mt-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
                        <GraduationCap className="w-3 h-3 mr-1" />
                        Student
                      </Badge>
                    ) : user.isVerified ? (
                      <Badge className="mt-2 bg-primary/10 text-primary border-primary/20">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified Landlord
                      </Badge>
                    ) : (
                      <Badge className="mt-2 bg-muted text-muted-foreground">
                        <Home className="w-3 h-3 mr-1" />
                        Landlord
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" className="rounded-xl bg-transparent">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-3xl">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-black">Edit Profile</DialogTitle>
                        <DialogDescription>Update your profile information</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Name</Label>
                          <Input
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            className="rounded-xl"
                          />
                        </div>
                        {/* Student-specific edit fields */}
                        {isStudent && (
                          <>
                            <div className="space-y-2">
                              <Label>College / Institute</Label>
                              <Input
                                value={editForm.college}
                                onChange={(e) => setEditForm({ ...editForm, college: e.target.value })}
                                className="rounded-xl"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Course</Label>
                              <Input
                                value={editForm.course}
                                onChange={(e) => setEditForm({ ...editForm, course: e.target.value })}
                                className="rounded-xl"
                              />
                            </div>
                          </>
                        )}
                        <div className="space-y-2">
                          <Label>City</Label>
                          <select
                            value={editForm.city}
                            onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                            className="w-full h-10 rounded-xl border-2 bg-background px-3"
                          >
                            {allCities.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>
                        <Button onClick={handleProfileUpdate} className="w-full rounded-xl">
                          Save Changes
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-xl text-destructive hover:bg-destructive/10 bg-transparent"
                    onClick={logout}
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                {user.email && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {user.city}
                </div>
                {/* Student-specific info */}
                {isStudent && user.college && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="w-4 h-4" />
                    {user.college}
                  </div>
                )}
                {isStudent && user.course && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <BookOpen className="w-4 h-4" />
                    {user.course}
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  Joined {new Date(user.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div ref={statsRef} className="grid grid-cols-2 gap-4 lg:flex-1">
            {isStudent ? (
              <>
                <Card className="border-2 rounded-2xl">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                      <Search className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-3xl font-black text-foreground">{recommendedListings.length}</p>
                    <p className="text-xs text-muted-foreground font-medium">Near You</p>
                  </CardContent>
                </Card>
                {/* <Card className="border-2 rounded-2xl">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center mx-auto mb-2">
                      <Heart className="w-6 h-6 text-pink-500" />
                    </div>
                    <p className="text-3xl font-black text-foreground">0</p>
                    <p className="text-xs text-muted-foreground font-medium">Saved</p>
                  </CardContent>
                </Card> */}
              </>
            ) : (
              <>
                <Card className="border-2 rounded-2xl">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                      <Home className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-3xl font-black text-foreground">{myListings.length}</p>
                    <p className="text-xs text-muted-foreground font-medium">Properties</p>
                  </CardContent>
                </Card>
                <Card className="border-2 rounded-2xl">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-2">
                      <Eye className="w-6 h-6 text-blue-500" />
                    </div>
                    <p className="text-3xl font-black text-foreground">{totalViews}</p>
                    <p className="text-xs text-muted-foreground font-medium">Total Views</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>

        {/* Content Section - Different for students vs landlords */}
        {isStudent ? (
          // Student View - Recommended Listings
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-foreground">Rooms Near You</h2>
                <p className="text-muted-foreground">Verified listings in {user.city}</p>
              </div>
              <Button asChild className="rounded-xl font-bold">
                <Link href="/browse">
                  <Search className="w-4 h-4 mr-2" />
                  Browse All
                </Link>
              </Button>
            </div>

            {recommendedListings.length === 0 ? (
              <Card className="border-2 border-dashed rounded-3xl">
                <CardContent className="py-16 text-center">
                  <div className="w-20 h-20 rounded-3xl bg-secondary flex items-center justify-center mx-auto mb-4">
                    <Search className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">No listings in {user.city} yet</h3>
                  <p className="text-muted-foreground mb-6">Try browsing other cities or check back later</p>
                  <Button asChild className="rounded-xl">
                    <Link href="/browse">
                      <Search className="w-4 h-4 mr-2" />
                      Browse All Cities
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div ref={listingsRef} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendedListings.map((listing) => (
                  <StudentListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </div>
        ) : (
          // Landlord View - My Properties
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-foreground">My Properties</h2>
                <p className="text-muted-foreground">Manage your listed properties</p>
              </div>
              <Button asChild className="rounded-xl font-bold">
                <Link href="/add-listing">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Property
                </Link>
              </Button>
            </div>

            {myListings.length === 0 ? (
              <Card className="border-2 border-dashed rounded-3xl">
                <CardContent className="py-16 text-center">
                  <div className="w-20 h-20 rounded-3xl bg-secondary flex items-center justify-center mx-auto mb-4">
                    <Home className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">No properties listed yet</h3>
                  <p className="text-muted-foreground mb-6">Start by adding your first property</p>
                  <Button asChild className="rounded-xl">
                    <Link href="/add-listing">
                      <Plus className="w-4 h-4 mr-2" />
                      List Your Property
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div ref={listingsRef} className="space-y-4">
                {myListings.map((listing) => (
                  <ListingManagementCard
                    key={listing.id}
                    listing={listing}
                    onToggleAvailability={() => handleToggleAvailability(listing.id)}
                    onDelete={() => handleDeleteListing(listing.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

// Student view listing card
function StudentListingCard({ listing }: { listing: Listing }) {
  return (
    <Link href={`/listing/${listing.id}`}>
      <Card className="border-2 rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all group cursor-pointer">
        <CardContent className="p-0">
          <div className="flex">
            <div className="relative w-32 h-28 flex-shrink-0">
              <Image
                src={listing.imageUrls[0] || "/placeholder.svg?height=200&width=200&query=room"}
                alt={listing.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {listing.isVerified && (
                <div className="absolute top-2 left-2">
                  <Badge className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5">
                    <Shield className="w-2.5 h-2.5 mr-0.5" />
                    Verified
                  </Badge>
                </div>
              )}
            </div>
            <div className="flex-1 p-3">
              <h3 className="font-bold text-foreground text-sm line-clamp-1 group-hover:text-primary transition-colors">
                {listing.title}
              </h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3" />
                {listing.area}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-primary font-bold text-sm">₹{listing.rent.toLocaleString("en-IN")}</span>
                <span className="text-xs text-muted-foreground">/month</span>
              </div>
              <div className="flex gap-1 mt-2 flex-wrap">
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  {listing.type.toUpperCase()}
                </Badge>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  {listing.forGender === "any" ? "Co-ed" : listing.forGender}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

// Landlord view listing management card
function ListingManagementCard({
  listing,
  onToggleAvailability,
  onDelete,
}: {
  listing: Listing
  onToggleAvailability: () => void
  onDelete: () => void
}) {
  const statusColors = {
    approved: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    hidden: "bg-muted text-muted-foreground border-muted",
  }

  return (
    <Card
      data-listing-id={listing.id}
      className="border-2 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
    >
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="relative w-full sm:w-48 h-40 sm:h-auto flex-shrink-0">
            <Image
              src={listing.imageUrls[0] || "/placeholder.svg?height=200&width=200&query=room"}
              alt={listing.title}
              fill
              className="object-cover"
            />
            {!listing.isAvailable && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <Badge variant="secondary" className="text-sm font-bold">
                  Not Available
                </Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-4 sm:p-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-foreground line-clamp-1">{listing.title}</h3>
                  {listing.isVerified && (
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {listing.area}, {listing.city}
                </p>
              </div>
              <Badge className={`${statusColors[listing.status]} border font-semibold flex-shrink-0`}>
                {listing.status}
              </Badge>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
              <div className="flex items-center gap-1.5">
                <IndianRupee className="w-4 h-4 text-primary" />
                <span className="font-bold">{listing.rent.toLocaleString("en-IN")}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Eye className="w-4 h-4" />
                <span className="font-medium">{listing.views || 0} views</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{new Date(listing.createdAt).toLocaleDateString("en-IN")}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={listing.isAvailable ? "default" : "outline"}
                size="sm"
                onClick={onToggleAvailability}
                className="rounded-xl font-semibold"
              >
                {listing.isAvailable ? (
                  <>
                    <ToggleRight className="w-4 h-4 mr-1.5" />
                    Available
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-4 h-4 mr-1.5" />
                    Unavailable
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm" asChild className="rounded-xl font-semibold bg-transparent">
                <Link href={`/listing/${listing.id}`}>
                  <Eye className="w-4 h-4 mr-1.5" />
                  View
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="rounded-xl font-semibold bg-transparent">
                <Link href={`/edit-listing/${listing.id}`}>
                  <Edit2 className="w-4 h-4 mr-1.5" />
                  Edit
                </Link>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl font-semibold text-destructive hover:bg-destructive/10 bg-transparent"
                  >
                    <Trash2 className="w-4 h-4 mr-1.5" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-3xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this property?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your property listing.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete} className="rounded-xl bg-destructive hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
