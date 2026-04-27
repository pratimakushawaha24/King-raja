"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

/**
 * Hook to manage loading state during navigation
 * Shows visual feedback when user navigates between pages
 */
export function useNavigationLoading() {
  const [isNavigating, setIsNavigating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Detect navigation start via NProgress or custom handler
    const handleStart = () => setIsNavigating(true)
    const handleStop = () => setIsNavigating(false)

    // Listen to router events
    window.addEventListener("beforeunload", handleStart)

    return () => {
      window.removeEventListener("beforeunload", handleStart)
    }
  }, [])

  return { isNavigating, setIsNavigating }
}
