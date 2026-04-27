"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Smartphone } from "lucide-react"

export default function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check karein ki app pehle se installed toh nahi hai
    if (typeof window !== "undefined" && window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
    }

    // Browser se 'Install Prompt' capture karein
    const handleBeforeInstallPrompt = (e: any) => {
      // Default behavior rokein (taaki hum button se trigger karein)
      e.preventDefault()
      // Event ko save kar lein
      setDeferredPrompt(e)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // 👇 DIRECT NATIVE INSTALL DIALOG OPEN HOGA
    deferredPrompt.prompt()

    // User ke response ka wait karein
    const { outcome } = await deferredPrompt.userChoice
    
    // Agar user ne install kar liya, to prompt clear karein
    if (outcome === "accepted") {
      setDeferredPrompt(null)
    }
  }

  // Agar App installed hai, toh Button mat dikhao
  if (isInstalled) return null

  // Agar Browser ready nahi hai install ke liye, toh Button mat dikhao
  // (Isse wo ganda wala message kabhi nahi aayega)
  if (!deferredPrompt) return null

  return (
    <Button 
      onClick={handleInstallClick}
      className="bg-gradient-to-r from-orange-500 to-teal-500 text-white rounded-full font-bold shadow-lg hover:scale-105 transition-transform animate-pulse"
    >
      <Smartphone className="mr-2 h-4 w-4" /> Install App
    </Button>
  )
}

