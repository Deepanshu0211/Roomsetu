"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowRight, Search, MapPin, Zap, Shield, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLocation } from "@/lib/location-context"

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { value: "500+", label: "Verified Rooms" },
  { value: "10min", label: "Avg. Response" },
  { value: "0", label: "Brokerage" },
]

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subtextRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const floatingRef = useRef<HTMLDivElement>(null)
  const { city, area } = useLocation()

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } })

      // Badge elastic bounce
      tl.fromTo(
        badgeRef.current,
        { scale: 0, opacity: 0, rotate: -10 },
        { scale: 1, opacity: 1, rotate: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" },
      )

      // Headline split text animation effect
      if (headlineRef.current) {
        tl.fromTo(
          headlineRef.current,
          {
            y: 120,
            opacity: 0,
            clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
          },
          {
            y: 0,
            opacity: 1,
            clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)",
            duration: 1.2,
            ease: "power4.out",
          },
          "-=0.3",
        )
      }

      // Subtext with blur reveal
      tl.fromTo(
        subtextRef.current,
        { y: 50, opacity: 0, filter: "blur(10px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.8 },
        "-=0.6",
      )

      // CTA buttons with stagger and scale
      tl.fromTo(
        ctaRef.current?.children || [],
        { y: 40, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.15, ease: "back.out(1.7)" },
        "-=0.4",
      )

      // Stats with counter-like effect
      tl.fromTo(
        statsRef.current?.children || [],
        { y: 60, opacity: 0, scale: 0.7 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.12, ease: "back.out(1.4)" },
        "-=0.3",
      )

      // Floating elements with complex animation
      const floatingElements = floatingRef.current?.children || []
      gsap.to(floatingElements, {
        y: -20,
        rotation: "random(-5, 5)",
        duration: "random(2, 3)",
        ease: "sine.inOut",
        stagger: { each: 0.2, repeat: -1, yoyo: true },
      })

      // Parallax scroll effect
      gsap.to(heroRef.current, {
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  const scrollToBrowse = () => {
    const browseSection = document.getElementById("featured-listings")
    if (browseSection) {
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: browseSection, offsetY: 80 },
        ease: "power3.inOut",
      })
    }
  }

  return (
    <section
      ref={heroRef}
      className="relative min-h-[100vh] flex items-center justify-center overflow-hidden bg-background"
    >
      {/* Background gradients */}
<div className="absolute inset-0 pointer-events-none overflow-hidden ">
  {/* Base Gradient */}
  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/10 " />

  {/* Primary Glow Orb */}
  <div className="
    absolute top-0 right-0 
    w-[900px] h-[900px]
    bg-primary/10
    rounded-full 
    blur-[140px]
    -translate-y-1/2 translate-x-1/2
    animate-[float_10s_ease-in-out_infinite]
    will-change-transform
  " />

  {/* Secondary Glow Orb */}
  <div className="
    absolute bottom-0 left-0 
    w-[650px] h-[650px]
    bg-accent/20
    rounded-full
    blur-[120px]
    translate-y-1/2 -translate-x-1/2
    animate-[floatReverse_12s_ease-in-out_infinite]
    will-change-transform
  " />

  {/* Micro grain for cinematic texture */}
  <div className="absolute inset-0 opacity-[0.04] bg-[url('/noise.png')]" />
</div>

      {/* Floating decorative elements */}
      {/* <div ref={floatingRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[10%] w-20 h-20 rounded-3xl bg-primary/20 backdrop-blur-sm flex items-center justify-center shadow-xl">
          <Zap className="w-8 h-8 text-primary" />
        </div>
        <div className="absolute top-[15%] right-[15%] w-16 h-16 rounded-2xl bg-accent/30 backdrop-blur-sm flex items-center justify-center shadow-lg">
          <Shield className="w-6 h-6 text-foreground/60" />
        </div>
        <div className="absolute bottom-[25%] right-[10%] w-14 h-14 rounded-xl bg-primary/15 backdrop-blur-sm flex items-center justify-center shadow-lg">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
      </div> */}

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 pb-10">
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 mb-8 shadow-lg"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-sm font-bold text-primary">Live in {city}</span>
        </div>

        <h1
          ref={headlineRef}
          className="text-5xl sm:text-6xl lg:text-8xl font-black text-foreground leading-[0.95] tracking-tight"
        >
          Find your
          <br />
          <span className="text-primary relative inline-block">
            perfect room
            <svg
              className="absolute -bottom-2 left-0 w-full h-4 text-primary/30"
              viewBox="0 0 200 12"
              preserveAspectRatio="none"
            >
              <path
                d="M0,6 Q50,12 100,6 T200,6"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <br />
          <span className="text-muted-foreground">in minutes</span>
        </h1>

        <p ref={subtextRef} className="mt-8 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {city && (
            <>
              Showing verified rooms in <span className="font-bold text-foreground">{city}</span>
              {area && (
                <>
                  {" "}
                  near <span className="font-bold text-primary">{area}</span>
                </>
              )}
              . Zero brokerage. Direct owner contact.
            </>
          )}
        </p>

        <div ref={ctaRef} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            className="text-base px-8 py-7 rounded-2xl font-bold shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 group"
            onClick={scrollToBrowse}
          >
            <Search className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            Browse Rooms
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="text-base px-8 py-7 rounded-2xl font-bold bg-card/50 backdrop-blur-sm border-2 hover:bg-card hover:border-primary/50 transition-all duration-300"
            asChild
          >
            <Link href="/add-listing">List Your Property</Link>
          </Button>
        </div>

        <div ref={statsRef} className="mt-16 flex flex-wrap items-center justify-center gap-8 sm:gap-16">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center group cursor-default">
              <div className="text-4xl sm:text-5xl font-black text-foreground group-hover:text-primary transition-colors">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Location indicator */}
        {city && (
          <div className="mt-12 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-card border border-border shadow-lg">
            <MapPin className="w-5 h-5 text-primary animate-bounce" />
            <span className="text-sm font-medium text-foreground">
              Detecting rooms in <span className="font-bold text-primary">{city}</span>
            </span>
          </div>
        )}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1">
          <div className="w-1.5 h-3 rounded-full bg-primary animate-bounce" />
        </div>
      </div>
    </section>
  )
}
