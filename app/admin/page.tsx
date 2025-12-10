"use client"

import type React from "react"
import { useEffect, useRef, useState, useMemo } from "react"
import { gsap } from "gsap"
import {
  Eye,
  EyeOff,
  IndianRupee,
  Lock,
  MapPin,
  CheckCircle,
  Shield,
  Loader2,
  BadgeCheck,
  Search,
  Home,
} from "lucide-react"
import { useListingsStore } from "@/lib/listings-store"
import type { Listing } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Footer } from "@/components/footer"

const ADMIN_PASSWORD = "admin123"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "pending" | "hidden">("all")

  const loginRef = useRef<HTMLDivElement>(null)
  const dashboardRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  const listings = useListingsStore((state) => state.listings)
  const updateListingStatus = useListingsStore((state) => state.updateListingStatus)
  const toggleVerified = useListingsStore((state) => state.toggleVerified)

  const stats = useMemo(() => {
    const totalViews = listings.reduce((sum, l) => sum + (l.views || 0), 0)
    const verifiedCount = listings.filter((l) => l.isVerified).length

    return {
      total: listings.length,
      approved: listings.filter((l) => l.status === "approved").length,
      pending: listings.filter((l) => l.status === "pending").length,
      hidden: listings.filter((l) => l.status === "hidden").length,
      verified: verifiedCount,
      totalViews,
    }
  }, [listings])

  const filteredListings = useMemo(() => {
    return listings.filter((l) => {
      const matchesSearch =
        l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.city.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" || l.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [listings, searchQuery, statusFilter])

  useEffect(() => {
    if (isAuthenticated) {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } })

        if (statsRef.current) {
          tl.fromTo(
            statsRef.current.children,
            { opacity: 0, y: 40, scale: 0.85, rotateX: 15 },
            { opacity: 1, y: 0, scale: 1, rotateX: 0, duration: 0.6, stagger: 0.08 },
          )
        }

        tl.fromTo(dashboardRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.3")
      })

      return () => ctx.revert()
    } else {
      gsap.fromTo(
        loginRef.current,
        { opacity: 0, scale: 0.9, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" },
      )
    }
  }, [isAuthenticated])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 500))

    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setError("")
    } else {
      setError("Incorrect password")
      gsap.fromTo(loginRef.current, { x: -15 }, { x: 15, duration: 0.08, repeat: 5, yoyo: true, ease: "power2.inOut" })
    }
    setIsLoading(false)
  }

  const toggleStatus = (id: string, currentStatus: Listing["status"]) => {
    const newStatus = currentStatus === "approved" ? "hidden" : "approved"
    updateListingStatus(id, newStatus)

    gsap.fromTo(
      `[data-row-id="${id}"]`,
      { backgroundColor: "rgba(var(--primary), 0.2)" },
      { backgroundColor: "transparent", duration: 0.6 },
    )
  }

  const handleToggleVerified = (id: string) => {
    toggleVerified(id)
    gsap.fromTo(`[data-row-id="${id}"]`, { scale: 0.97 }, { scale: 1, duration: 0.3, ease: "back.out(2)" })
  }

  const statusColors = {
    approved: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    hidden: "bg-muted text-muted-foreground border-muted",
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

        <Card ref={loginRef} className="relative z-10 w-full max-w-md border-2 rounded-3xl overflow-hidden shadow-2xl">
          <CardHeader className="text-center bg-gradient-to-br from-primary/10 to-transparent pb-8 pt-8">
            <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-2xl font-black">Admin Dashboard</CardTitle>
            <CardDescription className="text-base">Enter password to access moderation panel</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="font-semibold">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl h-12 border-2"
                />
                {error && <p className="text-sm text-destructive font-medium">{error}</p>}
              </div>
              <Button type="submit" className="w-full h-12 rounded-xl font-bold" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Access Dashboard
                  </>
                )}
              </Button>
              <p className="text-xs text-center text-muted-foreground">Password: admin123</p>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Shield className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage listings, verify properties, moderate content</p>
            </div>
          </div>
        </div>

        {/* Stats Grid - Removed review stats */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8"
          style={{ perspective: "1000px" }}
        >
          <Card className="border-2 rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Home className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-black">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-black">{stats.approved}</p>
                  <p className="text-xs text-muted-foreground">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-black">{stats.pending}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <BadgeCheck className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-black">{stats.verified}</p>
                  <p className="text-xs text-muted-foreground">Verified</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-black">{stats.totalViews}</p>
                  <p className="text-xs text-muted-foreground">Views</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search listings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 rounded-xl border-2"
            />
          </div>
          <Tabs
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
            className="w-full sm:w-auto"
          >
            <TabsList className="h-12 rounded-xl bg-secondary p-1">
              <TabsTrigger value="all" className="rounded-lg font-semibold">
                All
              </TabsTrigger>
              <TabsTrigger value="approved" className="rounded-lg font-semibold">
                Approved
              </TabsTrigger>
              <TabsTrigger value="pending" className="rounded-lg font-semibold">
                Pending
              </TabsTrigger>
              <TabsTrigger value="hidden" className="rounded-lg font-semibold">
                Hidden
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div ref={dashboardRef}>
          {/* Desktop Table */}
          <div className="hidden md:block border-2 border-border rounded-3xl overflow-hidden bg-card">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                  <TableHead className="font-bold">Property</TableHead>
                  <TableHead className="font-bold">Location</TableHead>
                  <TableHead className="font-bold">Rent</TableHead>
                  <TableHead className="font-bold">Views</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold">Verified</TableHead>
                  <TableHead className="font-bold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredListings.map((listing) => (
                  <TableRow key={listing.id} data-row-id={listing.id} className="hover:bg-secondary/30">
                    <TableCell>
                      <div>
                        <p className="font-semibold line-clamp-1">{listing.title}</p>
                        <p className="text-xs text-muted-foreground capitalize">{listing.type}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>
                          {listing.area}, {listing.city}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center font-semibold">
                        <IndianRupee className="w-4 h-4" />
                        {listing.rent.toLocaleString("en-IN")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Eye className="w-4 h-4" />
                        {listing.views || 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${statusColors[listing.status]} border font-semibold`}>{listing.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant={listing.isVerified ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleToggleVerified(listing.id)}
                        className={`rounded-full font-semibold ${listing.isVerified ? "bg-blue-500 hover:bg-blue-600" : "bg-transparent"}`}
                      >
                        <BadgeCheck className="w-4 h-4 mr-1" />
                        {listing.isVerified ? "Verified" : "Verify"}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant={listing.status === "approved" ? "outline" : "default"}
                        size="sm"
                        onClick={() => toggleStatus(listing.id, listing.status)}
                        className={`rounded-full font-semibold ${listing.status === "approved" ? "bg-transparent" : ""}`}
                      >
                        {listing.status === "approved" ? (
                          <>
                            <EyeOff className="w-4 h-4 mr-1.5" />
                            Hide
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-1.5" />
                            Approve
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {filteredListings.map((listing) => (
              <Card key={listing.id} data-row-id={listing.id} className="border-2 rounded-2xl overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <h3 className="font-bold text-foreground line-clamp-1">{listing.title}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {listing.area}, {listing.city}
                      </p>
                    </div>
                    <Badge className={`${statusColors[listing.status]} border font-semibold flex-shrink-0`}>
                      {listing.status}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
                    <div className="flex items-center gap-1.5">
                      <IndianRupee className="w-4 h-4 text-primary" />
                      <span className="font-bold">{listing.rent.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Eye className="w-4 h-4" />
                      {listing.views || 0} views
                    </div>
                    {listing.isVerified && (
                      <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                        <BadgeCheck className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant={listing.isVerified ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleToggleVerified(listing.id)}
                      className={`flex-1 rounded-xl font-semibold ${listing.isVerified ? "bg-blue-500 hover:bg-blue-600" : "bg-transparent"}`}
                    >
                      <BadgeCheck className="w-4 h-4 mr-1" />
                      {listing.isVerified ? "Verified" : "Verify"}
                    </Button>
                    <Button
                      variant={listing.status === "approved" ? "outline" : "default"}
                      size="sm"
                      onClick={() => toggleStatus(listing.id, listing.status)}
                      className={`flex-1 rounded-xl font-semibold ${listing.status === "approved" ? "bg-transparent" : ""}`}
                    >
                      {listing.status === "approved" ? (
                        <>
                          <EyeOff className="w-4 h-4 mr-1.5" />
                          Hide
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-1.5" />
                          Approve
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredListings.length === 0 && (
            <Card className="border-2 border-dashed rounded-3xl">
              <CardContent className="py-16 text-center">
                <Home className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="font-semibold text-foreground">No listings found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
