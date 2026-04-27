"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"

type Props = {
  children: React.ReactNode
  rootMargin?: string
  placeholder?: React.ReactNode
  className?: string
}

export default function LazyVisible({ children, rootMargin = "400px", placeholder, className }: Props) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let observer: IntersectionObserver | null = null
    const el = ref.current
    if (!el) return

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          const shouldBeVisible = entries.some((entry) => entry.isIntersecting)
          if (shouldBeVisible) {
            setVisible(true)
            observer?.disconnect()
          }
        },
        { root: null, rootMargin, threshold: 0.01 },
      )
      observer.observe(el)
    } else {
      setVisible(true)
    }

    return () => observer?.disconnect()
  }, [rootMargin])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        contentVisibility: "auto",
        containIntrinsicSize: "auto 300px",
        contain: "layout style paint",
      }}
    >
      {visible
        ? children
        : (placeholder ?? (
            <div className="rounded-xl border border-white/10 overflow-hidden">
              <div className="aspect-[2/3] sm:aspect-[3/4.5] bg-white/5" />
              <div className="h-8 bg-white/5" />
            </div>
          ))}
    </div>
  )
}
