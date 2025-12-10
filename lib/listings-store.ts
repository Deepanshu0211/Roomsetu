"use client"

import { type Listing, demoListings } from "./data"
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface ListingsStore {
  listings: Listing[]
  addListing: (
    listing: Omit<Listing, "id" | "createdAt" | "status" | "isAvailable" | "isVerified" | "views">,
  ) => Listing
  updateListing: (id: string, data: Partial<Listing>) => void
  updateListingStatus: (id: string, status: Listing["status"]) => void
  toggleAvailability: (id: string) => void
  toggleVerified: (id: string) => void
  incrementViews: (id: string) => void
  deleteListing: (id: string) => void
  getListingsByOwner: (ownerId: string) => Listing[]
}

export const useListingsStore = create<ListingsStore>()(
  persist(
    (set, get) => ({
      listings: [...demoListings],

      addListing: (listing) => {
        const newListing: Listing = {
          ...listing,
          id: Date.now().toString(),
          createdAt: new Date().toISOString().split("T")[0],
          status: "pending",
          isAvailable: true,
          isVerified: false,
          views: 0,
        }
        set((state) => ({ listings: [newListing, ...state.listings] }))
        return newListing
      },

      updateListing: (id, data) => {
        set((state) => ({
          listings: state.listings.map((l) => (l.id === id ? { ...l, ...data } : l)),
        }))
      },

      updateListingStatus: (id, status) => {
        set((state) => ({
          listings: state.listings.map((l) => (l.id === id ? { ...l, status } : l)),
        }))
      },

      toggleAvailability: (id) => {
        set((state) => ({
          listings: state.listings.map((l) => (l.id === id ? { ...l, isAvailable: !l.isAvailable } : l)),
        }))
      },

      toggleVerified: (id) => {
        set((state) => ({
          listings: state.listings.map((l) => (l.id === id ? { ...l, isVerified: !l.isVerified } : l)),
        }))
      },

      incrementViews: (id) => {
        set((state) => ({
          listings: state.listings.map((l) => (l.id === id ? { ...l, views: (l.views || 0) + 1 } : l)),
        }))
      },

      deleteListing: (id) => {
        set((state) => ({
          listings: state.listings.filter((l) => l.id !== id),
        }))
      },

      getListingsByOwner: (ownerId) => {
        return get().listings.filter((l) => l.ownerId === ownerId)
      },
    }),
    {
      name: "roomsetu-listings",
    },
  ),
)

export function getApprovedListings(listings: Listing[]): Listing[] {
  return listings.filter((l) => l.status === "approved")
}

export function getListingById(listings: Listing[], id: string): Listing | undefined {
  return listings.find((l) => l.id === id)
}

export function filterListings(
  listings: Listing[],
  filters: {
    area?: string
    city?: string
    minBudget?: number
    maxBudget?: number
    type?: string
    occupancy?: string
    forGender?: string
  },
): Listing[] {
  return getApprovedListings(listings).filter((listing) => {
    if (!listing.isAvailable) return false
    if (filters.city && filters.city !== "all" && listing.city !== filters.city) return false
    if (filters.area && filters.area !== "all" && listing.area !== filters.area) return false
    if (filters.minBudget && listing.rent < filters.minBudget) return false
    if (filters.maxBudget && listing.rent > filters.maxBudget) return false
    if (filters.type && filters.type !== "all" && listing.type !== filters.type) return false
    if (filters.occupancy && filters.occupancy !== "all" && listing.occupancy !== filters.occupancy) return false
    if (filters.forGender && filters.forGender !== "all" && listing.forGender !== filters.forGender) return false
    return true
  })
}
