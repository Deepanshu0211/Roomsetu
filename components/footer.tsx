"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { MapPin, Phone, Mail, ArrowUpRight } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

export function Footer() {
  const footerRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        },
      )
    }, footerRef)

    return () => ctx.revert()
  }, [])

  return (
    <footer ref={footerRef} className="bg-foreground dark:bg-card py-16">
      <div ref={contentRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-black text-xl">R</span>
              </div>
              <div>
                <span className="text-2xl font-black text-background dark:text-foreground">RoomSetu</span>
                <span className="block text-xs font-semibold text-primary">Find rooms in minutes</span>
              </div>
            </div>
            <p className="text-muted dark:text-muted-foreground text-sm max-w-md leading-relaxed">
              India&apos;s fastest way to find student accommodation. Zero brokerage, verified listings, direct owner
              contact. Made with love for students in Prayagraj.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a
                href="tel:+919876543210"
                className="flex items-center gap-2 text-sm text-muted dark:text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4" />
                +91 98765 43210
              </a>
              <a
                href="mailto:hello@roomsetu.com"
                className="flex items-center gap-2 text-sm text-muted dark:text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
                hello@roomsetu.com
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-background dark:text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: "Browse Listings", href: "/browse" },
                { label: "List Your Property", href: "/add-listing" },
                { label: "Admin", href: "/admin" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted dark:text-muted-foreground hover:text-primary text-sm transition-colors flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Areas */}
          <div>
            <h4 className="font-bold text-background dark:text-foreground mb-4">Popular Areas</h4>
            <ul className="space-y-3">
              {["Civil Lines", "Naini", "Jhunsi", "Tagore Town", "Katra"].map((area) => (
                <li key={area}>
                  <Link
                    href={`/browse?area=${encodeURIComponent(area)}`}
                    className="text-muted dark:text-muted-foreground hover:text-primary text-sm transition-colors flex items-center gap-2"
                  >
                    <MapPin className="w-3 h-3" />
                    {area}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-muted/20 dark:border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted dark:text-muted-foreground">
            © {new Date().getFullYear()} RoomSetu. Made for students, by students.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted dark:text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
