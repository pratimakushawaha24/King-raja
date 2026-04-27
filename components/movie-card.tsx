"use client"

import { Badge } from "@/components/ui/badge"
import { Star, Play } from "lucide-react"
import React, { useState, useEffect, useRef } from "react"
import type { Movie } from "@/lib/supabase"
import Link from "next/link"

const defaultMovie: Movie = {
  id: 0,
  title: "Movie",
  year: "2024",
  rating: "0.0",
  duration: "0 min",
  genre: [],
  image_url: "",
  description: "",
  featured: false,
  created_at: "",
  updated_at: "",
}

type Props = {
  movie?: Movie
}

function MovieCardBase({ movie = defaultMovie }: Props) {
  const [isLoaded, setIsLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  
  const movieUrl = movie.slug ? `/movie/${movie.slug}` : `/movie/${movie.id}`

  useEffect(() => {
    if (imgRef.current?.complete) {
      setIsLoaded(true)
    }
  }, [])

  return (
    <Link href={movieUrl} prefetch={false} className="block w-full h-full">
      <div className="group relative w-full h-full rounded bg-[#1a1a1a] border border-[#333] hover:border-[#f5c518] transition-all duration-300 shadow-md hover:shadow-[0_0_15px_rgba(245,197,24,0.15)] overflow-hidden">
        
        {/* Poster Container */}
        <div className="relative aspect-[2/3] w-full bg-[#111] overflow-hidden">
          <img
            ref={imgRef}
            src={movie.image_url || "/placeholder.svg"}
            alt={movie.title}
            loading="lazy"      
            decoding="async"    
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:opacity-80 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setIsLoaded(true)}
          />

          {/* Loading Placeholder */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-[#111] animate-pulse flex items-center justify-center">
              <span className="text-[#f5c518]/20 font-black uppercase tracking-widest text-xs">Vegamovies</span>
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
          
          {/* Rating Badge */}
          <div className="absolute top-2 right-2 z-10">
            <Badge className="bg-[#f5c518] text-black text-[10px] px-1.5 py-0.5 font-bold border-0 rounded-sm shadow-md">
              <Star className="w-2.5 h-2.5 mr-1 fill-black" />
              {movie.rating || "N/A"}
            </Badge>
          </div>

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
            <div className="bg-[#f5c518] p-3 rounded-full shadow-[0_0_20px_rgba(245,197,24,0.6)] scale-75 group-hover:scale-100 transition-transform">
               <Play className="h-5 w-5 text-black fill-black ml-0.5" />
            </div>
          </div>
        </div>

        {/* Movie Info */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent">
          <h3 className="text-white font-bold text-xs sm:text-sm line-clamp-2 leading-tight drop-shadow-md group-hover:text-[#f5c518] transition-colors">
            {movie.title}
          </h3>
          <div className="flex items-center justify-between mt-1">
             <p className="text-gray-400 text-[10px] font-bold">
                 {movie.year}
             </p>
             <span className="text-[9px] text-black bg-[#f5c518] px-1 rounded font-bold">HD</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

const MovieCard = React.memo(MovieCardBase)
MovieCard.displayName = "MovieCard"

export default MovieCard
