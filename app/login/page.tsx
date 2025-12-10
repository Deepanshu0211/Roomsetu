"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { gsap } from "gsap"
import { Phone, ArrowRight, Loader2, Shield, Sparkles, CheckCircle, KeyRound, Home, GraduationCap } from "lucide-react"
import { useAuthStore } from "@/lib/auth-store"
import { mockUsers } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LoginPage() {
  const router = useRouter()
  const { login, sendOtp, isAuthenticated } = useAuthStore()

  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedTab, setSelectedTab] = useState<"landlord" | "student">("student")

  const pageRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const mockUsersRef = useRef<HTMLDivElement>(null)

  const fillMockUser = (mockPhone: string) => {
    setPhone(mockPhone.replace("+91", ""))
  }

  // Filter mock users by type
  const landlordUsers = mockUsers.filter((u) => u.userType === "landlord")
  const studentUsers = mockUsers.filter((u) => u.userType === "student")

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/profile")
      return
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } })

      tl.fromTo(".login-bg", { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1, duration: 1.5 })

      tl.fromTo(
        cardRef.current,
        { opacity: 0, y: 60, rotateX: 15 },
        { opacity: 1, y: 0, rotateX: 0, duration: 0.8 },
        "-=1",
      )

      if (featuresRef.current) {
        tl.fromTo(
          featuresRef.current.children,
          { opacity: 0, x: -30 },
          { opacity: 1, x: 0, duration: 0.5, stagger: 0.1 },
          "-=0.5",
        )
      }

      if (mockUsersRef.current) {
        tl.fromTo(mockUsersRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
      }
    }, pageRef)

    return () => ctx.revert()
  }, [isAuthenticated, router])

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number")
      gsap.fromTo(cardRef.current, { x: -10 }, { x: 10, duration: 0.1, repeat: 3, yoyo: true })
      return
    }

    setIsLoading(true)
    setError("")

    const result = await sendOtp(`+91${phone}`)
    if (result.success) {
      setStep("otp")
      gsap.fromTo(
        cardRef.current,
        { opacity: 0.5, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" },
      )
    } else {
      setError(result.error || "Failed to send OTP")
    }
    setIsLoading(false)
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit OTP")
      return
    }

    setIsLoading(true)
    setError("")

    const result = await login(`+91${phone}`, otp)
    if (result.success) {
      gsap.to(cardRef.current, {
        scale: 0.9,
        opacity: 0,
        duration: 0.3,
        onComplete: () => router.push("/profile"),
      })
    } else {
      setError(result.error || "Invalid OTP")
      gsap.fromTo(cardRef.current, { x: -10 }, { x: 10, duration: 0.1, repeat: 3, yoyo: true })
    }
    setIsLoading(false)
  }

  return (
    <div ref={pageRef} className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="login-bg absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Features */}
        <div className="hidden lg:block space-y-6">
          <div ref={featuresRef} className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                  <span className="text-primary-foreground font-black text-2xl">R</span>
                </div>
                <div>
                  <h1 className="text-3xl font-black text-foreground">RoomSetu</h1>
                  <p className="text-sm text-primary font-semibold">Login Portal</p>
                </div>
              </div>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {selectedTab === "landlord"
                  ? "List your property and connect with thousands of students looking for accommodation."
                  : "Find your perfect room, PG, or flat near your college. Verified listings only."}
              </p>
            </div>

            <div className="space-y-4">
              {selectedTab === "landlord" ? (
                <>
                  {[
                    { icon: Sparkles, title: "Reach More Students", desc: "Get discovered by thousands of students" },
                    { icon: Shield, title: "Verified Badge", desc: "Build trust with verified landlord status" },
                    { icon: CheckCircle, title: "Easy Management", desc: "Update availability & track views" },
                  ].map((feature, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-card border-2 border-border">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {[
                    { icon: Home, title: "Find Perfect Room", desc: "Browse verified PGs, flats & hostels" },
                    { icon: Shield, title: "Safe & Verified", desc: "All listings are manually verified" },
                    { icon: GraduationCap, title: "Student Friendly", desc: "Rooms near colleges & coaching centers" },
                  ].map((feature, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-card border-2 border-border">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          <div ref={mockUsersRef}>
            <Card className="border-2 border-primary/30 bg-primary/5 rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-primary" />
                  Demo Accounts
                </CardTitle>
                <CardDescription className="text-xs">Click to auto-fill. OTP: 123456</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as "landlord" | "student")}>
                  <TabsList className="grid w-full grid-cols-2 mb-3">
                    <TabsTrigger value="student" className="text-xs">
                      <GraduationCap className="w-3 h-3 mr-1" />
                      Students
                    </TabsTrigger>
                    <TabsTrigger value="landlord" className="text-xs">
                      <Home className="w-3 h-3 mr-1" />
                      Landlords
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="student" className="space-y-2 mt-0">
                    {studentUsers.map((user, i) => (
                      <button
                        key={i}
                        onClick={() => fillMockUser(user.phone)}
                        className="w-full text-left p-3 rounded-xl bg-card border-2 border-transparent hover:border-primary/30 transition-all group"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                              {user.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {user.phone} • {user.college}
                            </p>
                          </div>
                          <span className="text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                            Use
                          </span>
                        </div>
                      </button>
                    ))}
                  </TabsContent>
                  <TabsContent value="landlord" className="space-y-2 mt-0">
                    {landlordUsers.map((user, i) => (
                      <button
                        key={i}
                        onClick={() => fillMockUser(user.phone)}
                        className="w-full text-left p-3 rounded-xl bg-card border-2 border-transparent hover:border-primary/30 transition-all group"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                              {user.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {user.phone} • {user.city}
                            </p>
                          </div>
                          <span className="text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                            Use
                          </span>
                        </div>
                      </button>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Side - Login Card */}
        <Card
          ref={cardRef}
          className="border-2 rounded-3xl overflow-hidden shadow-2xl"
          style={{ perspective: "1000px" }}
        >
          <CardHeader className="bg-gradient-to-br from-primary/10 to-transparent pb-1 text-center ">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-black">{step === "phone" ? "Welcome Back" : "Verify OTP"}</CardTitle>
            <CardDescription>
              {step === "phone" ? "Enter your phone number to continue" : `We sent a code to +91 ${phone}`}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            {step === "phone" ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="font-semibold">
                    Phone Number
                  </Label>
                  <div className="flex">
                    <div className="flex items-center px-4 bg-secondary rounded-l-xl border-2 border-r-0 border-input">
                      <span className="text-sm font-bold text-muted-foreground">+91</span>
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      className="rounded-l-none rounded-r-xl h-12 border-2 text-lg font-semibold tracking-wider"
                    />
                  </div>
                  {error && <p className="text-sm text-destructive font-medium">{error}</p>}
                </div>

                <Button type="submit" className="w-full h-12 rounded-xl font-bold text-base" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>

                <div className="lg:hidden p-3 rounded-xl bg-primary/5 border border-primary/20">
                  <p className="text-xs text-center text-muted-foreground mb-2">
                    <span className="font-semibold text-primary">Demo Student:</span> 9111111111
                  </p>
                  <p className="text-xs text-center text-muted-foreground">
                    <span className="font-semibold text-primary">Demo Landlord:</span> 9876543210 | OTP: 123456
                  </p>
                </div>

                <p className="text-center text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link href="/register" className="text-primary font-bold hover:underline">
                    Register
                  </Link>
                </p>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="space-y-4">
                  <Label className="font-semibold text-center block">Enter 6-digit OTP</Label>
                  <div className="flex justify-center">
                    <InputOTP maxLength={6} value={otp} onChange={setOtp} className="gap-2">
                      <InputOTPGroup className="gap-2">
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                          <InputOTPSlot key={i} index={i} className="w-12 h-14 text-xl font-bold rounded-xl border-2" />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  {error && <p className="text-sm text-destructive font-medium text-center">{error}</p>}
                  <p className="text-xs text-center text-muted-foreground">
                    Demo OTP: <span className="font-bold text-primary">123456</span>
                  </p>
                </div>

                <Button type="submit" className="w-full h-12 rounded-xl font-bold text-base" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify & Login
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full font-semibold"
                  onClick={() => {
                    setStep("phone")
                    setOtp("")
                    setError("")
                  }}
                >
                  Change Phone Number
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
