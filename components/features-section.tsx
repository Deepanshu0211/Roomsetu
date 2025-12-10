"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Shield, Phone, MapPin, Banknote, Zap, Clock } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

const features = [
  {
    icon: Zap,
    title: "Instant Connect",
    description: "Get owner contact in seconds. No waiting, no forms.",
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    icon: Shield,
    title: "100% Verified",
    description: "Every listing is personally verified by our team.",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: Banknote,
    title: "Zero Brokerage",
    description: "Save thousands. No middlemen, no hidden charges.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: MapPin,
    title: "Location Based",
    description: "Auto-detect your location and find nearby rooms.",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    icon: Phone,
    title: "Direct Contact",
    description: "Call or WhatsApp owners directly. No intermediaries.",
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
  {
    icon: Clock,
    title: "24/7 Available",
    description: "Browse listings anytime. Owners respond fast.",
    color: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
]

export function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      )

      // Staggered feature cards
      const cards = cardsRef.current?.children
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 40, rotateX: -10 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headingRef} className="text-center mb-16">
          <span className="text-sm font-bold text-primary uppercase tracking-wider">Why RoomSetu</span>
          <h2 className="text-4xl sm:text-5xl font-black text-foreground mt-3 tracking-tight">
            The smartest way to
            <br />
            find your room
          </h2>
          <p className="text-muted-foreground mt-4 text-lg max-w-2xl mx-auto">
            We&apos;ve built every feature students asked for. Zero compromise on quality.
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="group bg-card rounded-3xl p-8 border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-xl"
              >
                <div
                  className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-xl text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
