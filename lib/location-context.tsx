"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { cities } from "./data"

interface LocationState {
  city: string
  area: string | null
  loading: boolean
  error: string | null
  coordinates: { lat: number; lng: number } | null
  detectLocation: () => void
  setCity: (city: string) => void
  setArea: (area: string) => void
  availableAreas: string[]
}

const LocationContext = createContext<LocationState | undefined>(undefined)

const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  Prayagraj: { lat: 25.4358, lng: 81.8463 },
  Delhi: { lat: 28.6139, lng: 77.209 },
  Mumbai: { lat: 19.076, lng: 72.8777 },
  Bangalore: { lat: 12.9716, lng: 77.5946 },
  Hyderabad: { lat: 17.385, lng: 78.4867 },
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Kolkata: { lat: 22.5726, lng: 88.3639 },
  Pune: { lat: 18.5204, lng: 73.8567 },
  Jaipur: { lat: 26.9124, lng: 75.7873 },
  Lucknow: { lat: 26.8467, lng: 80.9462 },
  Ahmedabad: { lat: 23.0225, lng: 72.5714 },
  Chandigarh: { lat: 30.7333, lng: 76.7794 },
  Noida: { lat: 28.5355, lng: 77.391 },
  Gurgaon: { lat: 28.4595, lng: 77.0266 },
  Kota: { lat: 25.2138, lng: 75.8648 },
}

function getDistanceFromLatLng(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function findNearestCity(lat: number, lng: number): string {
  let nearestCity = "Delhi"
  let minDistance = Number.POSITIVE_INFINITY

  for (const [city, coords] of Object.entries(cityCoordinates)) {
    const distance = getDistanceFromLatLng(lat, lng, coords.lat, coords.lng)
    if (distance < minDistance) {
      minDistance = distance
      nearestCity = city
    }
  }

  return nearestCity
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const [city, setCity] = useState<string>("Delhi")
  const [area, setArea] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)

  const availableAreas = cities[city] || []

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported")
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setCoordinates({ lat: latitude, lng: longitude })
        const detectedCity = findNearestCity(latitude, longitude)
        setCity(detectedCity)
        setArea(null) // Reset area when city changes
        setLoading(false)
      },
      (err) => {
        setError("Location access denied")
        setLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  const handleSetCity = (newCity: string) => {
    setCity(newCity)
    setArea(null) // Reset area when city changes
    setError(null)
  }

  const handleSetArea = (newArea: string) => {
    setArea(newArea)
  }

  // Auto-detect on mount
  useEffect(() => {
    detectLocation()
  }, [])

  return (
    <LocationContext.Provider
      value={{
        city,
        area,
        loading,
        error,
        coordinates,
        detectLocation,
        setCity: handleSetCity,
        setArea: handleSetArea,
        availableAreas,
      }}
    >
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  const context = useContext(LocationContext)
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider")
  }
  return context
}
