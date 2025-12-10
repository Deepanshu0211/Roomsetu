"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { mockUsers } from "./data"

export interface User {
  id: string
  name: string
  phone: string
  email?: string
  city: string
  createdAt: string
  isVerified: boolean
  userType: "landlord" | "student"
  // Student-specific fields
  college?: string
  course?: string
}

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  login: (phone: string, otp: string) => Promise<{ success: boolean; error?: string }>
  register: (data: {
    name: string
    phone: string
    email?: string
    city: string
    userType: "landlord" | "student"
    college?: string
    course?: string
  }) => Promise<{
    success: boolean
    error?: string
  }>
  logout: () => void
  sendOtp: (phone: string) => Promise<{ success: boolean; error?: string }>
  verifyOtp: (phone: string, otp: string) => Promise<boolean>
  updateProfile: (data: Partial<User>) => void
}

const otpStore: Record<string, string> = {}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      sendOtp: async (phone: string) => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        otpStore[phone] = otp
        return { success: true }
      },

      verifyOtp: async (phone: string, otp: string) => {
        await new Promise((resolve) => setTimeout(resolve, 500))
        return otp === "123456" || otpStore[phone] === otp
      },

      login: async (phone: string, otp: string) => {
        const isValid = await get().verifyOtp(phone, otp)
        if (!isValid) {
          return { success: false, error: "Invalid OTP. Use 123456 for demo." }
        }

        const users = JSON.parse(localStorage.getItem("roomsetu_users") || "[]")
        const existingUser = users.find((u: User) => u.phone === phone)

        if (existingUser) {
          set({ user: existingUser, isAuthenticated: true })
          return { success: true }
        }

        const mockUser = mockUsers.find((u) => u.phone === phone)
        if (mockUser) {
          const newUser: User = {
            id: Date.now().toString(),
            name: mockUser.name,
            phone: mockUser.phone,
            city: mockUser.city,
            createdAt: new Date().toISOString(),
            isVerified: true,
            userType: mockUser.userType,
            college: mockUser.college,
            course: mockUser.course,
          }
          const updatedUsers = [...users, newUser]
          localStorage.setItem("roomsetu_users", JSON.stringify(updatedUsers))
          set({ user: newUser, isAuthenticated: true })
          return { success: true }
        }

        return { success: false, error: "No account found. Please register first." }
      },

      register: async (data) => {
        const newUser: User = {
          id: Date.now().toString(),
          name: data.name,
          phone: data.phone,
          email: data.email,
          city: data.city,
          createdAt: new Date().toISOString(),
          isVerified: false,
          userType: data.userType,
          college: data.college,
          course: data.course,
        }

        const users = JSON.parse(localStorage.getItem("roomsetu_users") || "[]")
        users.push(newUser)
        localStorage.setItem("roomsetu_users", JSON.stringify(users))

        set({ user: newUser, isAuthenticated: true })
        return { success: true }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },

      updateProfile: (data) => {
        const currentUser = get().user
        if (!currentUser) return

        const updatedUser = { ...currentUser, ...data }
        set({ user: updatedUser })

        const users = JSON.parse(localStorage.getItem("roomsetu_users") || "[]")
        const index = users.findIndex((u: User) => u.id === currentUser.id)
        if (index !== -1) {
          users[index] = updatedUser
          localStorage.setItem("roomsetu_users", JSON.stringify(users))
        }
      },
    }),
    {
      name: "roomsetu-auth",
    },
  ),
)
