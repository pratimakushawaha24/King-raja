"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Settings, ChevronLeft, ChevronRight, Info, Calendar, Globe, WifiOff, RefreshCcw, Film, Clapperboard, Video, Tv, PlayCircle, Star, TrendingUp, ShieldCheck, Menu, X, Download, ExternalLink, Send, Smartphone } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef, useState, useTransition, useCallback } from "react"
import dynamic from "next/dynamic"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { getMoviesPaged, type Movie, type AppSettings } from "@/lib/supabase"
import MovieCard from "@/components/movie-card"
import SocialShareButtons from "@/components/social-share-buttons"
import InstallAppButton from "@/components/install-app-button"

// Admin Panel Lazy Load
const AdminPanel = dynamic(() => import("@/components/admin-panel"), { ssr: false })

// --- ULTRA AGGRESSIVE SEO KEYWORDS (Hidden) ---
const HIDDEN_SEO_KEYWORDS = "movieshub, Vegamovie, Hdhub4u, Filmyfly, Katarmovie, Dotmovie, 9xmovies, Mkvcage, Worldfree4u, Bolly4u, Download Hindi Dubbed Movies, 300MB Movies, 480p, 720p, 1080p, 4k Movies, Netflix Free Download, Amazon Prime cracks, Hotstar Specials download";

const MovieSkeleton = () => (
  <div className="flex flex-col gap-2 animate-pulse h-full">
    <div className="aspect-[2/3] w-full rounded-md bg-[#222] border border-[#333]" />
    <div className="h-4 w-3/4 bg-[#222] rounded mt-2" />
    <div className="h-3 w-1/2 bg-[#222] rounded" />
  </div>
)

const getMovieSlug = (movie: Movie) => movie.slug || movie.id.toString()

export default function HomePageContent({ 
  initialMovies, 
  featuredMovies, 
  genres, 
  appSettings, 
  totalMoviesInit 
}: { initialMovies: Movie[], featuredMovies: Movie[], genres: string[], appSettings: AppSettings | null, totalMoviesInit: number }) {
  
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const moviesSectionRef = useRef<HTMLElement>(null)

  const [movies, setMovies] = useState<Movie[]>(initialMovies)
  const [searchSuggestions, setSearchSuggestions] = useState<Movie[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [listLoading, setListLoading] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [searchInput, setSearchInput] = useState("")
  
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All")
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1)
  const [totalMovies, setTotalMovies] = useState(totalMoviesInit)
  const [isPending, startTransition] = useTransition()

  const pageSize = 24 
  const totalPages = Math.max(1, Math.ceil(totalMovies / pageSize))
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0)

  // Scroll to Grid
  const scrollToGrid = () => {
    if (moviesSectionRef.current) {
        const yOffset = -80;
        const element = moviesSectionRef.current;
        const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  // Hero Slider Logic
  const nextHero = useCallback(() => {
    if (featuredMovies.length > 0) setCurrentHeroIndex((prev) => (prev + 1) % featuredMovies.length)
  }, [featuredMovies.length])

  const prevHero = useCallback(() => {
    if (featuredMovies.length > 0) setCurrentHeroIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length)
  }, [featuredMovies.length])

  useEffect(() => {
    if (featuredMovies.length > 1) {
      const interval = setInterval(() => nextHero(), 5000)
      return () => clearInterval(interval)
    }
  }, [featuredMovies.length, nextHero])

  // Search Suggestions Logic
  useEffect(() => {
    const id = setTimeout(async () => {
      const trimmed = searchInput.trim()
      if (trimmed.length > 0) {
        const result = await getMoviesPaged({ page: 1, pageSize: 6, search: trimmed })
        setSearchSuggestions(result.items || [])
        setShowSuggestions(true)
      } else {
        setShowSuggestions(false)
      }
    }, 300)
    return () => clearTimeout(id)
  }, [searchInput])

  // Main Data Fetching
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    
    setListLoading(true)
    scrollToGrid();
    const fetchMovies = async () => {
      const pageData = await getMoviesPaged({ 
        page: currentPage, 
        pageSize, 
        search: searchInput, 
        category: selectedCategory === "All" ? undefined : selectedCategory 
      })
      if (pageData) { setMovies(pageData.items || []); setTotalMovies(pageData.total || 0); }
      setListLoading(false)
    }
    fetchMovies()
  }, [currentPage, selectedCategory, searchInput])

  const handleCategoryChange = (category: string) => {
    startTransition(() => { setSelectedCategory(category); setCurrentPage(1); })
  }

  const handlePageChange = (newPage: number) => {
    startTransition(() => { setCurrentPage(newPage); })
  }

  const handleQuickSearch = (term: string) => {
    startTransition(() => {
      setSearchInput(term)
      setCurrentPage(1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    })
  }

  const getPageNumbers = () => {
    const delta = 2;
    const range = []; const rangeWithDots = []; let l;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) range.push(i)
    }
    for (const i of range) {
      if (l) {
        if (i - l === 2) rangeWithDots.push(l + 1)
        else if (i - l !== 1) rangeWithDots.push("...")
      }
      rangeWithDots.push(i); l = i
    }
    return rangeWithDots
  }

  const currentHeroMovie = featuredMovies[currentHeroIndex]

  return (
    <div className="w-full bg-[#0a0a0a] text-[#e0e0e0] overflow-x-hidden font-sans selection:bg-[#f5c518] selection:text-black">
      ull bg-[#0a0a0a] text-[#e0e0e0] overflow-x-hidden font-sans selection:bg-[#f5c518] selection:text-black">
     
      <div className="hidden">{HIDDEN_SEO_KEYWORDS}</div>

      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} onDataChange={() => window.location.reload()} />}

      {/* --- HEADER --- */}
      <header className="bg-[#111] border-b border-[#222] sticky top-0 z-50 shadow-xl h-16">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
            <Link href="/" aria-label="Home" className="flex items-center gap-2 group z-50">
              <div className="bg-[#f5c518] text-black font-black px-2 py-0.5 rounded text-xl shadow-[0_0_15px_#f5c518]">F</div>
              <span className="text-2xl font-black text-white tracking-tighter uppercase">filmy<span className="text-[#f5c518]">king</span></span>
            </Link>

            <div className="flex items-center space-x-3">
              <div className="relative hidden md:flex items-center">
                 <input 
                    placeholder="Search movies..." 
                    value={searchInput} 
                    onChange={(e) => setSearchInput(e.target.value)} 
                    className="bg-[#1a1a1a] border border-[#333] rounded-full px-4 py-1.5 w-60 focus:border-[#f5c518] focus:outline-none text-sm transition-all"
                    onKeyDown={(e) => e.key === 'Enter' && handlePageChange(1)}
                 />
                 <Search className="absolute right-3 top-2 text-gray-400 w-4 h-4 cursor-pointer hover:text-[#f5c518]" onClick={() => handlePageChange(1)} />
                 
                 {showSuggestions && searchSuggestions.length > 0 && (
                    <div className="absolute top-10 left-0 w-full bg-[#1a1a1a] border border-[#333] rounded-lg shadow-xl z-50 overflow-hidden">
                        {searchSuggestions.map(m => (
                            <Link href={`/movie/${getMovieSlug(m)}`} key={m.id} className="block px-4 py-2 hover:bg-[#333] text-xs text-gray-300 hover:text-[#f5c518] border-b border-[#222] last:border-0 truncate">
                                {m.title}
                            </Link>
                        ))}
                    </div>
                 )}
              </div>

              <Link href="/join">
                <Button size="sm" className="bg-[#f5c518] hover:bg-white hover:text-black text-black font-black rounded-full uppercase tracking-wider text-xs shadow-lg transition-all">
                    Join
                </Button>
              </Link>

              <Button onClick={() => setShowAdmin(true)} size="icon" variant="ghost" className="text-gray-400 hover:text-[#f5c518] hover:bg-white/5 rounded-full">
                  <Settings className="h-5 w-5" />
              </Button>
            </div>
        </div>
        
        <div className="md:hidden px-4 pb-3 relative z-30 bg-[#111] border-b border-[#222]">
           <div className="relative flex items-center bg-[#1a1a1a] border border-[#333] rounded-full px-3 h-10">
              <input 
                aria-label="Mobile Search" 
                placeholder="Search..." 
                value={searchInput} 
                onChange={(e) => setSearchInput(e.target.value)} 
                className="bg-transparent border-0 text-white w-full h-full focus:outline-none text-sm placeholder:text-gray-600" 
              />
              <Search className="text-gray-500 h-4 w-4" onClick={() => handlePageChange(1)} />
           </div>
           {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-14 left-4 right-4 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-xl z-50">
                    {searchSuggestions.map(m => (
                        <Link href={`/movie/${getMovieSlug(m)}`} key={m.id} className="block px-4 py-3 hover:bg-[#333] text-sm text-gray-300 border-b border-[#222] truncate">
                            {m.title}
                        </Link>
                    ))}
                </div>
            )}
        </div>
      </header>

      <main id="main-content">
        {/* --- FEATURED SECTION (BADA SIZE & CLICKABLE) --- */}
        {currentHeroMovie ? (
          <section className="relative w-full border-b border-[#222]">
            {/* Height set to 75vh for a much bigger impact */}
            <div 
              onClick={() => router.push(`/movie/${getMovieSlug(currentHeroMovie)}`)}
              className="relative w-full h-[65vh] sm:h-[85vh] bg-black overflow-hidden group cursor-pointer"
            >
                <Image 
                src={currentHeroMovie.image_url || "/placeholder.svg"} 
                alt={currentHeroMovie.title} 
                fill 
                className="object-cover opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" 
                priority 
                />
              
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/20 to-transparent" />
              
              {/* Overlay Content */}
              <div className="absolute bottom-10 left-4 sm:left-12 z-30 max-w-4xl pr-4">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-[#f5c518] text-black text-[11px] sm:text-[13px] font-black px-3 py-1 rounded uppercase shadow-[0_0_20px_rgba(245,197,24,0.4)]">
                        Featured Movie
                    </span>
                    <span className="bg-white/10 backdrop-blur-md text-white text-[11px] sm:text-[13px] font-bold px-3 py-1 rounded uppercase border border-white/20">
                        HD Quality
                    </span>
                  </div>
                  
                  {/* --- SMALLER TITLE WITH ELLIPSIS --- */}
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase drop-shadow-2xl mb-4 leading-tight group-hover:text-[#f5c518] transition-colors truncate">
                      {currentHeroMovie.title}
                  </h1>
                  
                  <div className="flex items-center gap-5 text-xs sm:text-base font-bold text-gray-300 uppercase">
                      <span className="flex items-center gap-2 text-[#f5c518]"><Star className="w-4 h-4 fill-[#f5c518]"/> {currentHeroMovie.rating || "8.5"}</span>
                      <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {currentHeroMovie.year}</span>
                      <span className="text-white bg-red-600 px-2 py-0.5 rounded text-[10px]">New Release</span>
                  </div>

                  <div className="mt-8 flex gap-4">
                     <Button className="bg-[#f5c518] hover:bg-white text-black font-black px-6 py-5 rounded-none uppercase text-xs flex items-center gap-2">
                        <PlayCircle className="w-4 h-4" /> Watch Now
                     </Button>
                  </div>
              </div>

              {/* Slider Arrows */}
              <div className="absolute bottom-10 right-4 sm:right-12 z-30 flex gap-2">
                 <button onClick={(e) => {e.preventDefault(); e.stopPropagation(); prevHero()}} className="p-2.5 rounded-full bg-white/5 hover:bg-[#f5c518] text-white hover:text-black border border-white/10 backdrop-blur-md transition-all"><ChevronLeft className="w-5 h-5"/></button>
                 <button onClick={(e) => {e.preventDefault(); e.stopPropagation(); nextHero()}} className="p-2.5 rounded-full bg-white/5 hover:bg-[#f5c518] text-white hover:text-black border border-white/10 backdrop-blur-md transition-all"><ChevronRight className="w-5 h-5"/></button>
              </div>
            </div>
          </section>
        ) : (
          <div className="h-[70vh] flex items-center justify-center bg-[#111] animate-pulse"><div className="w-12 h-12 border-4 border-[#f5c518] border-t-transparent rounded-full animate-spin"/></div>
        )}

        {/* --- INFO BAR --- */}
        {appSettings?.info_text && (
          <section className="bg-[#151515] border-y border-[#222] py-2 relative z-20">
            <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
              <p className="text-[#f5c518] text-[10px] sm:text-xs font-bold flex items-center gap-2 animate-pulse">
                  <ShieldCheck className="w-3 h-3" /> {appSettings.info_text}
              </p>
            </div>
          </section>
        )}

        {/* --- CATEGORIES --- */}
        <section className="container mx-auto px-4 py-6 relative z-10">
          <div className="flex flex-wrap gap-2 justify-center">
              {["All", ...genres].map((cat) => (
                  <button key={cat} onClick={() => handleCategoryChange(cat)} className={`px-4 py-1.5 rounded text-[10px] sm:text-xs font-bold uppercase tracking-wider border transition-all ${cat === selectedCategory ? "bg-[#f5c518] border-[#f5c518] text-black shadow-lg" : "bg-[#1a1a1a] border-[#333] text-gray-400 hover:border-[#f5c518] hover:text-white"}`}>
                      {cat}
                  </button>
              ))}
          </div>
        </section>

        {/* --- MOVIE GRID --- */}
        <section ref={moviesSectionRef} className="container mx-auto px-4 pb-20 min-h-screen">
           <div className="flex justify-between items-end mb-6 border-l-4 border-[#f5c518] pl-4">
             <div>
               <h2 className="text-xl sm:text-2xl font-black text-white uppercase leading-none mb-1">
                   {selectedCategory === "All" ? "Latest Updates" : selectedCategory}
               </h2>
               <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">High Quality Downloads</p>
             </div>
             {listLoading && <span className="text-xs text-[#f5c518] animate-pulse">Loading...</span>}
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5">
             {movies.length > 0 ? movies.map((m) => (
               <div key={m.id} className="group relative bg-[#151515] rounded overflow-hidden border border-[#222] hover:border-[#f5c518] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
                   <MovieCard movie={m} />
                   <div className="absolute top-2 right-2 bg-[#f5c518] text-black text-[9px] font-bold px-1 rounded-sm z-10 shadow-sm">HD</div>
               </div>
            )) : Array.from({length:12}).map((_,i)=><MovieSkeleton key={i}/>)}
          </div>

          {/* --- PAGINATION --- */}
          {totalMovies > pageSize && (
            <div className="mt-16 flex justify-center gap-2 flex-wrap items-center">
              <Button disabled={currentPage <= 1 || listLoading} onClick={() => handlePageChange(currentPage - 1)} variant="outline" className="border-[#333] bg-[#1a1a1a] text-white hover:bg-[#f5c518] hover:text-black font-bold uppercase h-9 text-xs">
                <ChevronLeft className="w-3 h-3 mr-1"/> Prev
              </Button>
              <div className="flex items-center gap-1 bg-[#1a1a1a] p-1 rounded border border-[#333]">
                {getPageNumbers().map((pageNum, index) => (
                   typeof pageNum === 'number' ? (
                    <button key={index} onClick={() => handlePageChange(pageNum)} className={`w-8 h-8 rounded text-xs font-bold flex items-center justify-center transition-all ${currentPage === pageNum ? 'bg-[#f5c518] text-black shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>{pageNum}</button>
                  ) : <span key={index} className="px-2 text-gray-600 font-bold">...</span>
                ))}
              </div>
              <Button disabled={currentPage >= totalPages || listLoading} onClick={() => handlePageChange(currentPage + 1)} variant="outline" className="border-[#333] bg-[#1a1a1a] text-white hover:bg-[#f5c518] hover:text-black font-bold uppercase h-9 text-xs">
                Next <ChevronRight className="w-3 h-3 ml-1"/>
              </Button>
            </div>
          )}
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-[#050505] border-t border-[#222] pt-12 text-center relative z-20">
         <div className="container mx-auto px-4 flex flex-col items-center gap-8 pb-8">
            
            <div className="flex flex-wrap justify-center gap-3 mb-4">
                <button onClick={() => handleQuickSearch("Bollywood")} className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] rounded text-[10px] font-bold uppercase hover:bg-[#f5c518] hover:text-black transition-all border border-[#333] text-gray-400"><Film className="w-3 h-3" /> Bollywood</button>
                <button onClick={() => handleQuickSearch("Hollywood")} className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] rounded text-[10px] font-bold uppercase hover:bg-[#f5c518] hover:text-black transition-all border border-[#333] text-gray-400"><Clapperboard className="w-3 h-3" /> Hollywood</button>
                <button onClick={() => handleQuickSearch("South")} className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] rounded text-[10px] font-bold uppercase hover:bg-[#f5c518] hover:text-black transition-all border border-[#333] text-gray-400"><Video className="w-3 h-3" /> South</button>
                <button onClick={() => handleQuickSearch("Webseries")} className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] rounded text-[10px] font-bold uppercase hover:bg-[#f5c518] hover:text-black transition-all border border-[#333] text-gray-400"><Tv className="w-3 h-3" /> Webseries</button>
            </div>

            {/* --- MASSIVE SEO BLOCK --- */}
            <div className="w-full max-w-4xl bg-[#0f0f0f] border border-[#1f1f1f] rounded p-6 text-left space-y-6">
                <div>
                    <h3 className="text-[#f5c518] font-black text-sm uppercase mb-2">filmyking - No.1 Movie Download Site</h3>
                    <p className="text-[10px] sm:text-xs text-gray-500 leading-relaxed text-justify">
                  filmyking (formerly SmartSaathi) is the best website to download <strong>300MB Movies</strong>, <strong>Bollywood Movies</strong>, <strong>Hollywood Hindi Dubbed Movies</strong>, and <strong>Web Series</strong> in 480p, 720p, 1080p, and 4K quality. We provide direct Google Drive download links with high speed. moviemod is the best alternative to <em className="text-gray-400">Hdhub4u, Filmyfly, Katarmovie, Mp4moviez, 9xmovies, Worldfree4u, Bolly4u, and Downloadhub</em>.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="text-white font-bold text-xs uppercase mb-2">Why Choose Us?</h4>
                        <ul className="text-[10px] text-gray-500 list-disc pl-4 space-y-1">
                            <li>Fastest Download Servers (G-Drive)</li>
                            <li>No Pop-up Ads (Clean Experience)</li>
                            <li>Daily Updates (Netflix, Prime, Hotstar)</li>
                            <li>Request Movie Feature</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-xs uppercase mb-2">Popular Tags</h4>
                        <div className="flex flex-wrap gap-1">
                            {["filmyking", "Hdhub4u", "Filmyfly", "Katarmovie", "Dual Audio", "Hindi Dubbed", "Netflix Free", "720p Movies", "South Hindi", "Web Series"].map(tag => (
                                <span key={tag} className="bg-[#1a1a1a] text-gray-600 text-[9px] px-1.5 py-0.5 rounded border border-[#222]">#{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="flex flex-col items-center gap-4 w-full border-t border-[#1a1a1a] pt-6">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-[#f5c518] text-black font-black px-1.5 py-0.5 rounded text-lg">F</div>
                    <span className="text-lg font-black text-white tracking-tighter uppercase">filmy<span className="text-[#f5c518]">king</span></span>
                </Link>
                
                <nav className="flex flex-wrap justify-center gap-6 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                   <Link href="/dmca" className="hover:text-[#f5c518] transition-colors">DMCA</Link>
                   <Link href="/privacy-policy" className="hover:text-[#f5c518] transition-colors">Privacy</Link>
                   <Link href="/contact" className="hover:text-[#f5c518] transition-colors">Contact</Link>
                </nav>
                
                <div className="pt-2"><InstallAppButton /></div>
                
                <p className="text-[#333] text-[9px] mt-2 font-mono">
                    Disclaimer:filmyking does not host any files on its servers. All contents are from third party websites.
                    <br/><span className="text-gray-600">&copy; 2026 filmyking.</span>
                </p>
            </div>
        </div>
      </footer>
    </div>
  )
}
