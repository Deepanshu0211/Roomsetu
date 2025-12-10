"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Search,
  PlusCircle,
  Menu,
  X,
  MapPin,
  ChevronDown,
  Loader2,
  Navigation,
  User,
  LogIn,
  GraduationCap,
} from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { gsap } from "gsap"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "./theme-toggle"
import { useLocation } from "@/lib/location-context"
import { useAuthStore } from "@/lib/auth-store"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { allCities } from "@/lib/data"

export function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { city, area, loading, detectLocation, setCity, setArea, availableAreas } = useLocation()
  const { isAuthenticated, user } = useAuthStore()
  const logoRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLElement>(null)

  const baseLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/browse", label: "Browse", icon: Search },
  ]

  // Only show "List Property" for landlords or non-logged in users
  const links =
    user?.userType === "student"
      ? baseLinks
      : [...baseLinks, { href: "/add-listing", label: "List Property", icon: PlusCircle }]

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } })

    tl.fromTo(navRef.current, { y: -100, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 })

    if (logoRef.current) {
      gsap.to(logoRef.current?.querySelector(".logo-icon"), {
        scale: 1.1,
        duration: 0.6,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        repeatDelay: 3,
      })
    }
  }, [])

  return (
    <nav ref={navRef} className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3" ref={logoRef as any}>
            <div className="logo-icon w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25">
              <span className="text-primary-foreground font-black text-lg">R</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-black text-foreground tracking-tight">RoomSetu</span>
              <span className="block text-[10px] font-medium text-primary -mt-1 tracking-wider uppercase">
                Find rooms in minutes
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {/* City Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/20"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  ) : (
                    <MapPin className="w-4 h-4 text-primary" />
                  )}
                  <span className="text-sm font-bold text-foreground">{city}</span>
                  {area && <span className="text-xs text-muted-foreground">• {area}</span>}
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-64 max-h-[400px] overflow-y-auto">
                <DropdownMenuItem onClick={detectLocation} className="text-primary font-bold">
                  <Navigation className="w-4 h-4 mr-2" />
                  Auto-detect Location
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs text-muted-foreground uppercase">Select City</DropdownMenuLabel>
                {allCities.map((c) => (
                  <DropdownMenuItem
                    key={c}
                    onClick={() => setCity(c)}
                    className={cn(city === c && "bg-primary/10 text-primary font-bold")}
                  >
                    {c}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Area Selector */}
            {availableAreas.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 px-3 py-2 rounded-full bg-transparent">
                    <span className="text-sm font-medium">{area || "All Areas"}</span>
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-48 max-h-[300px] overflow-y-auto">
                  <DropdownMenuItem
                    onClick={() => setArea("")}
                    className={cn(!area && "bg-primary/10 text-primary font-bold")}
                  >
                    All Areas
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {availableAreas.map((a) => (
                    <DropdownMenuItem
                      key={a}
                      onClick={() => setArea(a)}
                      className={cn(area === a && "bg-primary/10 text-primary font-bold")}
                    >
                      {a}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              )
            })}

            <div className="w-px h-6 bg-border mx-2" />

            {isAuthenticated ? (
              <Link
                href="/profile"
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200",
                  pathname === "/profile"
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                )}
              >
                {user?.userType === "student" ? <GraduationCap className="w-4 h-4" /> : <User className="w-4 h-4" />}
                {user?.name?.split(" ")[0] || "Profile"}
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            )}

            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2 rounded-full hover:bg-secondary transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 space-y-2">
            {/* Mobile Location Selector */}
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-primary/10 mb-2">
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
              ) : (
                <MapPin className="w-4 h-4 text-primary" />
              )}
              <span className="text-sm font-bold">{city}</span>
              {area && <span className="text-xs text-muted-foreground">• {area}</span>}
              <button onClick={detectLocation} className="ml-auto text-xs text-primary font-bold">
                Detect
              </button>
            </div>

            {/* Mobile City Selector */}
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-secondary text-foreground font-medium border-0"
            >
              {allCities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {links.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              )
            })}

            {isAuthenticated ? (
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all",
                  pathname === "/profile"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                )}
              >
                {user?.userType === "student" ? <GraduationCap className="w-5 h-5" /> : <User className="w-5 h-5" />}
                My Profile
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold bg-primary text-primary-foreground"
              >
                <LogIn className="w-5 h-5" />
                Login / Register
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
