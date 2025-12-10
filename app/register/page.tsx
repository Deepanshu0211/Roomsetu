"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { gsap } from "gsap"
import {
  ArrowRight,
  Loader2,
  User,
  Mail,
  MapPin,
  Sparkles,
  GraduationCap,
  Home,
  Building2,
  BookOpen,
} from "lucide-react"
import { useAuthStore } from "@/lib/auth-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { allCities } from "@/lib/data"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function RegisterPage() {
  const router = useRouter()
  const { register, sendOtp, verifyOtp, isAuthenticated } = useAuthStore()

  const [step, setStep] = useState<"details" | "otp">("details")
  const [userType, setUserType] = useState<"student" | "landlord">("student")
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "Prayagraj",
    college: "",
    course: "",
  })
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const pageRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/profile")
      return
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } })

      tl.fromTo(".register-bg", { opacity: 0 }, { opacity: 1, duration: 0.8 })

      tl.fromTo(
        infoRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.4",
      )

      tl.fromTo(
        cardRef.current,
        { opacity: 0, y: 60, rotateX: 10 },
        { opacity: 1, y: 0, rotateX: 0, duration: 0.8 },
        "-=0.5",
      )
    }, pageRef)

    return () => ctx.revert()
  }, [isAuthenticated, router])

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      setError("Please enter your name")
      return
    }
    if (formData.phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number")
      return
    }
    if (userType === "student" && !formData.college.trim()) {
      setError("Please enter your college/institute name")
      return
    }

    setIsLoading(true)
    setError("")

    const result = await sendOtp(`+91${formData.phone}`)
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit OTP")
      return
    }

    setIsLoading(true)
    setError("")

    const isValid = await verifyOtp(`+91${formData.phone}`, otp)
    if (!isValid) {
      setError("Invalid OTP. Use 123456 for demo.")
      gsap.fromTo(cardRef.current, { x: -10 }, { x: 10, duration: 0.1, repeat: 3, yoyo: true })
      setIsLoading(false)
      return
    }

    const result = await register({
      name: formData.name,
      phone: `+91${formData.phone}`,
      email: formData.email,
      city: formData.city,
      userType: userType,
      college: userType === "student" ? formData.college : undefined,
      course: userType === "student" ? formData.course : undefined,
    })

    if (result.success) {
      gsap.to(cardRef.current, {
        scale: 0.9,
        opacity: 0,
        duration: 0.3,
        onComplete: () => router.push("/profile"),
      })
    } else {
      setError(result.error || "Registration failed")
    }
    setIsLoading(false)
  }

  return (
    <div
      ref={pageRef}
      className="min-h-screen relative overflow-hidden flex items-center justify-center px-4"
    >
      {/* Background */}
      <div className="register-bg absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />

      {/* Main centered square-ish container */}
      <div className="relative z-10 w-full max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* LEFT SIDE – info */}
          <div
            ref={infoRef}
            className="hidden lg:flex flex-col justify-center gap-5 pr-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
              <Sparkles className="w-4 h-4" />
              No brokerage • Verified owners • Built for students
            </div>

            <h1 className="text-3xl font-black text-foreground leading-tight">
              Join <span className="text-primary">RoomSetu</span>
              <br />
              and simplify your stay.
            </h1>

            <p className="text-muted-foreground text-sm max-w-md">
              One profile to{" "}
              <span className="font-semibold text-foreground">find rooms, PGs, hostels</span> in your city
              or{" "}
              <span className="font-semibold text-foreground">list your property</span> for students.
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-background/70 border flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-primary" />
                  <span className="font-semibold">Students</span>
                </div>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Filter by area & budget</li>
                  <li>• Direct owner contact</li>
                </ul>
              </div>

              <div className="p-3 rounded-2xl bg-background/70 border flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-primary" />
                  <span className="font-semibold">Landlords</span>
                </div>
                <ul className="text-muted-foreground space-y-1">
                  <li>• List in minutes</li>
                  <li>• Reach students easily</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>OTP-based login. No passwords to remember.</span>
            </div>
          </div>

          {/* RIGHT SIDE – auth card */}
          <Card
            ref={cardRef}
            className="w-full h-full border-2 rounded-3xl overflow-hidden shadow-2xl bg-background/90 backdrop-blur flex flex-col"
          >
            <CardHeader className="bg-gradient-to-br from-primary/10 to-transparent pb-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <CardTitle className="text-xl font-black">
                {step === "details" ? "Create Account" : "Verify Phone"}
              </CardTitle>
              <CardDescription className="text-xs">
                {step === "details"
                  ? "Join RoomSetu to find or list properties"
                  : `Enter the OTP sent to +91 ${formData.phone}`}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 pt-4 flex-1 overflow-y-auto">
              {step === "details" ? (
                <form onSubmit={handleSendOtp} className="space-y-3">
                  {/* User Type Selector */}
                  <Tabs
                    value={userType}
                    onValueChange={(v) => setUserType(v as "student" | "landlord")}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2 h-10 rounded-xl">
                      <TabsTrigger
                        value="student"
                        className="rounded-lg text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        <GraduationCap className="w-3 h-3 mr-1.5" />
                        Student
                      </TabsTrigger>
                      <TabsTrigger
                        value="landlord"
                        className="rounded-lg text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        <Home className="w-3 h-3 mr-1.5" />
                        Landlord
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="font-semibold text-xs">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="pl-9 h-10 rounded-xl border-2 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="font-semibold text-xs">
                      Phone Number
                    </Label>
                    <div className="flex">
                      <div className="flex items-center px-3 bg-secondary rounded-l-xl border-2 border-r-0 border-input">
                        <span className="text-xs font-bold text-muted-foreground">+91</span>
                      </div>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="9876543210"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                          })
                        }
                        className="rounded-l-none rounded-r-xl h-10 border-2 text-sm font-semibold tracking-wide"
                      />
                    </div>
                  </div>

                  {/* Student-specific fields */}
                  {userType === "student" && (
                    <>
                      <div className="space-y-1.5">
                        <Label htmlFor="college" className="font-semibold text-xs">
                          College / Institute
                        </Label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="college"
                            placeholder="e.g., IIIT Allahabad"
                            value={formData.college}
                            onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                            className="pl-9 h-10 rounded-xl border-2 text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="course" className="font-semibold text-xs">
                          Course (Optional)
                        </Label>
                        <div className="relative">
                          <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="course"
                            placeholder="e.g., B.Tech CSE"
                            value={formData.course}
                            onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                            className="pl-9 h-10 rounded-xl border-2 text-sm"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="font-semibold text-xs">
                      Email (Optional)
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-9 h-10 rounded-xl border-2 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="city" className="font-semibold text-xs">
                      City
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                      <select
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full h-10 pl-9 pr-4 rounded-xl border-2 bg-background text-sm appearance-none cursor-pointer"
                      >
                        {allCities.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {error && <p className="text-xs text-destructive font-medium">{error}</p>}

                  <Button
                    type="submit"
                    className="w-full h-10 rounded-xl font-bold text-sm mt-1"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary font-bold hover:underline">
                      Login
                    </Link>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-5">
                  <div className="space-y-3">
                    <Label className="font-semibold text-center block text-sm">Enter 6-digit OTP</Label>
                    <div className="flex justify-center">
                      <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                        <InputOTPGroup className="gap-2">
                          {[0, 1, 2, 3, 4, 5].map((i) => (
                            <InputOTPSlot
                              key={i}
                              index={i}
                              className="w-10 h-12 text-lg font-bold rounded-xl border-2"
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    {error && (
                      <p className="text-xs text-destructive font-medium text-center">{error}</p>
                    )}
                    <p className="text-[11px] text-center text-muted-foreground">
                      Demo OTP: <span className="font-bold text-primary">123456</span>
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-10 rounded-xl font-bold text-sm"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full font-semibold text-xs"
                    onClick={() => {
                      setStep("details")
                      setOtp("")
                      setError("")
                    }}
                  >
                    Go Back
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
