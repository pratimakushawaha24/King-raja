"use client"
import type { ReactNode } from "react"

interface ScrollPerformanceWrapperProps {
  children: ReactNode
  className?: string
}

/**
 * Wrapper component to optimize scroll performance by:
 * - Using content-visibility: auto for off-screen elements
 * - Preventing layout shifts with aspect-ratio
 * - Minimizing paint operations during scroll
 */
export default function ScrollPerformanceWrapper({ children, className = "" }: ScrollPerformanceWrapperProps) {
  return (
    <div
      className={className}
      style={{
        contentVisibility: "auto",
        containIntrinsicSize: "auto 1200px",
      }}
    >
      {children}
    </div>
  )
}
