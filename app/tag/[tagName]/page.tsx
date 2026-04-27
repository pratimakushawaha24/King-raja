import { Suspense } from "react"
import TagPageClient from "./tag-page-client"
import { getMoviesByTag } from "@/lib/supabase"
import type { Metadata } from "next"

// CHANGE: 0 ko hata kar 3600 karein.
// Tag pages server par load na dalein, isliye cache zaroori hai.
export const revalidate = 3600; 

// ✅ Next.js 15 Fix: Params ab ek Promise hota hai
interface TagPageProps {
  params: Promise<{ tagName: string }>
}

const SITE_NAME = "movieshub";

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const rawTag = decodeURIComponent(resolvedParams.tagName)
  const tagName = rawTag.replace(/-/g, ' ')
  const displayTag = tagName.charAt(0).toUpperCase() + tagName.slice(1)

  return {
    title: `${displayTag} Movies Download | 480p 720p 1080p - ${SITE_NAME}`,
    description: `Download ${displayTag} movies in HD. Best collection of ${displayTag} films, Dual Audio, Hindi Dubbed 480p, 720p, 1080p on filmyking.`,
    keywords: [`${displayTag} movies`, "filmyking", "Download movies", "720p movies", "Hindi Dubbed"],
    openGraph: {
        title: `${displayTag} Movies Download | ${SITE_NAME}`,
        description: `Download latest ${displayTag} movies in Dual Audio.`,
    },
    // Robots tag add karein taaki Google ise index kare
    other: {
      "robots": "index, follow",
    }
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const resolvedParams = await params
  const rawTag = decodeURIComponent(resolvedParams.tagName)
  const cleanTagName = rawTag.replace(/-/g, ' ')

  try {
    const movies = await getMoviesByTag(cleanTagName)

    return (
      <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a] text-[#f5c518] flex items-center justify-center font-bold uppercase tracking-widest">Loading Collection...</div>}>
        <TagPageClient tagName={cleanTagName} initialMovies={movies || []} />
      </Suspense>
    )
  } catch (error) {
    console.error("Error fetching movies by tag:", error)
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-[#f5c518] text-xl font-bold mb-2">Error Loading Data</h1>
                <p className="text-gray-500 text-sm">Please refresh the page.</p>
            </div>
        </div>
    )
  }
}
