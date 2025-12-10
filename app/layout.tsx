import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Navbar } from "@/components/navbar"
import { ThemeProvider } from "@/components/theme-provider"
import { LocationProvider } from "@/lib/location-context"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })
const _jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RoomSetu - Student Rooms & PGs in Minutes",
  description:
    "Find verified student rooms, PGs, flats in Prayagraj. Zero brokerage. Direct owner contact. Auto-detect your location.",
  generator: "v0.app",
  keywords: [
    "student rooms",
    "PG",
    "paying guest",
    "hostel",
    "flat",
    "Prayagraj",
    "Allahabad",
    "student accommodation",
    "broker free",
  ],
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#a3e635" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LocationProvider>
            <Navbar />
            <main>{children}</main>
            <Analytics />
          </LocationProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
