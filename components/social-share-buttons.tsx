"use client"

import { Button } from "@/components/ui/button"
import { Share2, Send, Download, Tv } from "lucide-react"
import { useEffect, useState } from "react"
import { getAppSettings, type AppSettings } from "@/lib/supabase"

export default function SocialShareButtons() {
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [shareMessage, setShareMessage] = useState("")

  useEffect(() => {
    const load = async () => {
      try {
        const s = await getAppSettings()
        setSettings(s)
      } catch (error) {
        console.log("[v0] Settings load error (expected if table doesn't exist):", error)
        setSettings(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleShare = async () => {
    const shareData = {
      title: "Smart Saathi",
      text: "Check out Smart Saathi - Your ultimate destination for movies!",
      url: typeof window !== "undefined" ? window.location.origin : "",
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.log("[v0] Share error:", error)
        }
      }
    } else {
      const text = `${shareData.title}\n${shareData.text}\n${shareData.url}`
      try {
        await navigator.clipboard.writeText(text)
        setShareMessage("✓ Link copied to clipboard!")
        setTimeout(() => setShareMessage(""), 3000)
      } catch (error) {
        console.log("[v0] Clipboard error:", error)
        setShareMessage("Unable to share. Please try again.")
        setTimeout(() => setShareMessage(""), 3000)
      }
    }
  }

  const handleTelegram = () => {
    if (settings?.telegram_url) {
      window.open(settings.telegram_url, "_blank", "noopener,noreferrer")
    }
  }

  const handleHowToDownload = () => {
    if (settings?.how_to_download_url) {
      window.open(settings.how_to_download_url, "_blank", "noopener,noreferrer")
    }
  }

  const handleAnimeHollywood = () => {
    if (settings?.anime_url || settings?.hollywood_url) {
      const url = settings.anime_url || settings.hollywood_url
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer")
      }
    }
  }

  if (loading) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-6 sm:gap-8 justify-center items-start">
      {/* Share Button - Always visible */}
      <div className="flex flex-col items-center gap-2">
        <div className="relative">
          <Button
            onClick={handleShare}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:scale-105 transition-transform duration-300 shadow-lg flex items-center gap-2"
            title="Share Smart Saathi website"
          >
            <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Share</span>
          </Button>
          {shareMessage && (
            <div className="absolute top-full mt-2 bg-black/80 text-white text-xs px-3 py-1 rounded whitespace-nowrap z-10">
              {shareMessage}
            </div>
          )}
        </div>
        <span className="text-white/80 text-xs sm:text-sm font-medium">Share</span>
      </div>

      {/* Telegram Button - only show if URL is configured */}
      {settings?.telegram_url && (
        <div className="flex flex-col items-center gap-2">
          <Button
            onClick={handleTelegram}
            className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:scale-105 transition-transform duration-300 shadow-lg flex items-center gap-2"
            title="Join our Telegram channel"
          >
            <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Telegram</span>
          </Button>
          <span className="text-white/80 text-xs sm:text-sm font-medium">Telegram</span>
        </div>
      )}

      {/* How to Download Button - only show if URL is configured */}
      {settings?.how_to_download_url && (
        <div className="flex flex-col items-center gap-2">
          <Button
            onClick={handleHowToDownload}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:scale-105 transition-transform duration-300 shadow-lg flex items-center gap-2 animate-pulse"
            title="Learn how to download movies"
          >
            <Download className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline font-semibold">How to Download</span>
          </Button>
          <span className="text-white/80 text-xs sm:text-sm font-medium">How to Download</span>
        </div>
      )}

      {(settings?.anime_url || settings?.hollywood_url) && (
        <div className="flex flex-col items-center gap-2">
          <Button
            onClick={handleAnimeHollywood}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:scale-105 transition-transform duration-300 shadow-lg flex items-center gap-2"
            title="Anime & Hollywood content"
          >
            <Tv className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Anime & Hollywood</span>
          </Button>
          <span className="text-white/80 text-xs sm:text-sm font-medium">Anime & Hollywood</span>
        </div>
      )}
    </div>
  )
}
