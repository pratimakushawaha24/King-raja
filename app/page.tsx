import { Suspense } from "react"
import { getMoviesPaged, getFeaturedMovies, getGenres, getAppSettings } from "@/lib/supabase"
import HomePageContent from "./home-page-client"
import HomeLoading from "@/components/home-loading"
import { Metadata } from "next"

// --- SUPER SEO SETTINGS ---
// CHANGE: 0 ko hata kar 3600 (1 Hour) karein.
// Isse Server fast rahega aur Google indexing badhegi.
export const revalidate = 0; 

export const metadata: Metadata = {
  title: "filmyking - Download 300MB Movies, 480p, 720p, 1080p, Dual Audio",
  description: "filmyking - The best site to download 300MB Movies, Bollywood, Hollywood, South Hindi Dubbed movies in 480p, 720p, 1080p. Direct Download Links.",
  keywords: "filmyking, moviemod , Vegamovies, dot movies , how to download movies,Vegamovie, Hdhub4u, Filmyfly, Katarmovie, Download Movies, Dual Audio, 720p, 1080p",
  other: {
    // Yahan apna asli Google Verification Code dalna na bhulein
    "google-site-verification": "verification_code_here", 
    "robots": "index, follow", // Ye line add karein taaki home page pakka index ho
  }
}

export default async function HomePage() {
  
  // Parallel fetching for high performance (Speed maintained)
  const [
    genres, 
    featuredMovies, 
    appSettings,
    initialMoviesData
  ] = await Promise.all([
    getGenres(),
    getFeaturedMovies(5), // Top 5 Featured
    getAppSettings(),
    getMoviesPaged({ page: 1, pageSize: 24 }) // Thoda jada data load karenge
  ])

  return (
    <Suspense fallback={<HomeLoading />}>
      <HomePageContent 
        initialMovies={initialMoviesData.items}
        totalMoviesInit={initialMoviesData.total}
        featuredMovies={featuredMovies}
        genres={Array.from(new Set(genres))}
        appSettings={appSettings}
      />
    </Suspense>
  )
}
