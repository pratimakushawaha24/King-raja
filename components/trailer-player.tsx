"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { Play } from "lucide-react"

type TrailerPlayerProps = {
  url: string
  title: string
  posterFallback?: string
  autoLoadWhenInView?: boolean
  className?: string
  rounded?: boolean
}

function getYouTubeId(url: string) {
  try {
    const u = new URL(url)
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1)
    if (u.hostname.includes("youtube")) {
      if (u.searchParams.get("v")) return u.searchParams.get("v")
      const parts = u.pathname.split("/").filter(Boolean)
      if (parts[0] === "embed" && parts[1]) return parts[1]
      if (parts[0] === "shorts" && parts[1]) return parts[1]
    }
  } catch {}
  return null
}

function getVimeoId(url: string) {
  try {
    const u = new URL(url)
    if (u.hostname.includes("vimeo.com")) {
      const parts = u.pathname.split("/").filter(Boolean)
      if (parts[0] && /^\d+$/.test(parts[0])) return parts[0]
    }
  } catch {}
  return null
}

export default function TrailerPlayer({
  url,
  title,
  posterFallback = "/movie-trailer-placeholder.png",
  autoLoadWhenInView = false,
  className = "",
  rounded = true,
}: TrailerPlayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [aspect, setAspect] = useState<number | null>(null) // width / height for direct video

  const ytId = useMemo(() => getYouTubeId(url), [url])
  const vimeoId = useMemo(() => getVimeoId(url), [url])
  const isDirect = !ytId && !vimeoId

  const thumbnail = useMemo(() => {
    if (ytId) return `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`
    return posterFallback
  }, [ytId, posterFallback])

  useEffect(() => {
    if (!autoLoadWhenInView || !containerRef.current) return
    const el = containerRef.current
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShouldLoad(true)
            io.disconnect()
            break
          }
        }
      },
      { rootMargin: "250px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [autoLoadWhenInView])

  // If direct mp4, read metadata to set real aspect ratio
  useEffect(() => {
    if (!isDirect) return
    const v = document.createElement("video")
    v.preload = "metadata"
    v.src = url
    const onMeta = () => {
      if (v.videoWidth && v.videoHeight) {
        setAspect(v.videoWidth / v.videoHeight)
      }
    }
    v.addEventListener("loadedmetadata", onMeta)
    return () => v.removeEventListener("loadedmetadata", onMeta)
  }, [isDirect, url])

  const loadAndPlay = () => {
    setShouldLoad(true)
    setIsPlaying(true)
  }

  const styleAspect = aspect && isDirect ? { aspectRatio: `${aspect}` } : { aspectRatio: "16 / 9" } // YouTube/Vimeo default

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden ${rounded ? "rounded-xl" : ""} ${className}`}
      style={{
        ...styleAspect,
        contentVisibility: "auto",
        containIntrinsicSize: "640px 360px",
      }}
    >
      {/* Direct MP4 */}
      {isDirect && shouldLoad ? (
        <video
          src={url}
          controls
          playsInline
          preload="metadata"
          poster={thumbnail}
          className="h-full w-full object-contain bg-black"
        />
      ) : null}

      {/* YouTube iframe (nocookie) */}
      {ytId && shouldLoad ? (
        <iframe
          title={title}
          src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=${isPlaying ? 1 : 0}&modestbranding=1&rel=0&playsinline=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          loading="lazy"
          className="h-full w-full"
        />
      ) : null}

      {/* Vimeo */}
      {vimeoId && shouldLoad ? (
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?autoplay=${isPlaying ? 1 : 0}`}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="h-full w-full"
        />
      ) : null}

      {/* Poster/Play overlay */}
      {!shouldLoad && (
        <button onClick={loadAndPlay} className="group absolute inset-0" aria-label="Play trailer">
          <Image
            src={thumbnail || posterFallback}
            alt={`${title} trailer thumbnail`}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-gradient-to-r from-orange-500 to-teal-500 p-4 shadow-lg transition-transform duration-300 group-active:scale-95">
              <Play className="h-7 w-7 text-white" />
            </div>
          </div>
        </button>
      )}
    </div>
  )
}
