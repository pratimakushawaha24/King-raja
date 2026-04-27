"use client"

import type { Movie } from "@/lib/supabase"
import MovieCard from "@/components/movie-card"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tag, Home, Search, Film } from "lucide-react"

interface TagPageClientProps {
  tagName: string
  initialMovies: Movie[]
}

export default function TagPageClient({ tagName, initialMovies }: TagPageClientProps) {
  const tagDisplayName = tagName.charAt(0).toUpperCase() + tagName.slice(1)

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans selection:bg-[#f5c518] selection:text-black">
      
      {/* --- HEADER (Movie Hub Style) --- */}
      <header className="border-b border-[#1a1a1a] sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl shadow-2xl">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-[#f5c518] text-black font-black px-2 py-0.5 rounded-md text-xl shadow-[0_0_20px_rgba(245,197,24,0.4)] group-hover:scale-110 transition-transform">M</div>
              <span className="text-2xl font-black text-white tracking-tighter uppercase">Movie<span className="text-[#f5c518]">Hub</span></span>
          </Link>
  
          <Link href="/">
            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-[#f5c518] hover:bg-white/5 font-bold uppercase text-xs transition-all">
              <Home className="w-4 h-4 mr-2" /> Home
            </Button>
          </Link>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <section className="container mx-auto px-4 py-12 min-h-[60vh]">
        
        {/* Title Section */}
        <div className="mb-12 relative border-l-4 border-[#f5c518] pl-6 py-2 bg-gradient-to-r from-[#f5c518]/10 to-transparent">
          <div className="flex items-center gap-3 mb-2">
            <Film className="w-6 h-6 text-[#f5c518]" />
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tighter uppercase">
               {tagDisplayName} <span className="text-[#f5c518]">Collection</span>
            </h1>
          </div>
          <p className="text-gray-500 text-sm font-medium tracking-wide uppercase">
             Direct download links for <span className="text-white font-bold">{tagDisplayName}</span> movies on <span className="text-[#f5c518]">movieshub.in</span>.
          </p>
        </div>

        {/* Movie Grid */}
        {!initialMovies || initialMovies.length === 0 ? (
          <div className="text-center py-24 bg-[#0a0a0a] rounded-xl border border-[#1a1a1a] shadow-inner">
            <Search className="w-16 h-16 text-[#222] mx-auto mb-6" />
            <p className="text-gray-500 text-xl font-bold mb-6 uppercase">No movies found in this hub</p>
            <Link href="/"><Button className="bg-[#f5c518] hover:bg-white text-black font-black px-8 h-12 uppercase tracking-wider transition-colors">Back to Home</Button></Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6">
            {initialMovies.map((movie) => (
               <div key={movie.id} className="group relative bg-[#0f0f0f] rounded-lg overflow-hidden border border-[#1a1a1a] hover:border-[#f5c518]/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                  <MovieCard movie={movie} />
                  <div className="absolute top-2 right-2 bg-[#f5c518] text-black text-[9px] font-black px-1.5 py-0.5 rounded-sm z-10 shadow-md">ULTRA HD</div>
               </div>
            ))}
          </div>
        )}
      </section>

      {/* --- SEO FOOTER (Advance Styling) --- */}
      <footer className="bg-[#030303] border-t border-[#1a1a1a] mt-24 py-16 text-center">
          <div className="container mx-auto px-4">
            
            <div className="w-full max-w-5xl mx-auto bg-[#080808] border border-[#111] rounded-xl p-8 text-left space-y-8 mb-12 shadow-2xl">
                
                <section>
                    <h3 className="text-[#f5c518] font-black text-sm uppercase mb-3 tracking-[0.2em] flex items-center gap-2">
                        <span className="w-8 h-[2px] bg-[#f5c518]"></span> Movie Hub – movieshub.in Official
                    </h3>
                    <p className="text-[11px] text-gray-400 leading-relaxed text-justify opacity-80">
                        Movie Hub (movieshub.in) is your ultimate destination for Bollywood, Hollywood, and South Indian cinema. We provide high-quality encodes including 480p, 720p, 1080p, and 4K UHD. [span_1](start_span)Our platform is optimized for fast browsing and secure direct downloads.[span_1](end_span)
                    </p>
                </section>

                <section className="border-t border-[#111] pt-8">
                    <h3 className="text-[#f5c518] font-black text-sm uppercase mb-3 tracking-widest">MoviesHub – Filmyzilla & Vegamovies Alternative</h3>
                    <p className="text-[11px] text-gray-500 leading-relaxed text-justify">
                        At Movie Hub, we list the latest content from top sources like Filmyzilla, Vegamovies, and Bolly4u, ensuring our users get the best quality x264 and x265 HEVC files. Browse by Genre, Year, or Audio quality with our advanced navigation system.
                    </p>
                </section>
            </div>

            {/* Copyright */}
            <div className="flex flex-col items-center gap-4">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                   <div className="bg-[#f5c518] text-black font-black px-2 py-0.5 rounded text-sm">M</div>
                   <span className="text-lg font-black text-white tracking-tighter uppercase">Movie<span className="text-[#f5c518]">Hub</span></span>
                </Link>
                <div className="flex gap-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                    <span>movieshub.in</span>
                    <span>•</span>
                    <span>Privacy Policy</span>
                    <span>•</span>
                    <span>DMCA</span>
                </div>
                <p className="text-gray-700 text-[9px] font-medium uppercase tracking-[0.3em] mt-4">
                    &copy; {new Date().getFullYear()} Movie Hub Media Inc.
                </p>
            </div>
          </div>
      </footer>
    </div>
  )
}
