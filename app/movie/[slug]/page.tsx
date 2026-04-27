import { notFound } from "next/navigation"
import { getMovieBySlug, getMoviesPaged } from "@/lib/supabase"
import MoviePageClient from "./movie-page-client"
import { Suspense } from "react"
import Script from "next/script"
import { Metadata } from "next"

// --- CACHE CONTROL (FIXED) ---
export const revalidate = 0; 
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const dynamicParams = true;

interface MoviePageProps {
  params: { slug: string }
}

const SITE_NAME = "movieshub";
const SITE_DOMAIN = "https://filmyking.com/";

function getSafeRating(rating: any) {
  let r = parseFloat(rating);
  if (isNaN(r) || r <= 0) return 8.5;
  if (r > 10) return 10;
  return r;
}

// --- SEO & METADATA GENERATION ---
export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const movie = await getMovieBySlug(params.slug)
  if (!movie) return { title: `Movie Not Found | ${SITE_NAME}` }

  const seoTitle = `Download ${movie.title} (${movie.year}) Dual Audio | ${SITE_NAME}`;
  const seoDesc = `Download ${movie.title} (${movie.year}) in 480p, 720p, 1080p. Watch ${movie.title} Full Movie. Story: ${movie.description ? movie.description.substring(0, 100) : movie.title}...`;

  return {
    title: seoTitle,
    description: seoDesc,
    keywords: [
      movie.title,
      `Download ${movie.title}`,
      "Hindi Dubbed",
      "480p", "720p", "1080p",
      "Vegamovies"
    ],
    alternates: { 
      canonical: `${SITE_DOMAIN}/movie/${movie.slug || movie.id}` 
    },
    openGraph: {
      title: seoTitle,
      description: seoDesc,
      url: `${SITE_DOMAIN}/movie/${movie.slug || movie.id}`,
      siteName: SITE_NAME,
      images: [
        {
          url: movie.image_url || `${SITE_DOMAIN}/logo.png`,
          width: 1200,
          height: 630,
          alt: movie.title,
        },
      ],
      type: "video.movie",
    },
    other: {
      "robots": "index, follow, max-image-preview:large",
    }
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  const movie = await getMovieBySlug(params.slug)
  
  if (!movie) notFound();

  // Suggestions Logic - Now fetches fresh due to force-dynamic
  const { items: allMovies } = await getMoviesPaged({ page: 1, pageSize: 60 })
  let suggestions: any[] = []
  if (allMovies) {
    const filtered = allMovies.filter((m) => m.id !== movie.id)
    suggestions = filtered.sort(() => 0.5 - Math.random()).slice(0, 12)
  }

  const displayRating = getSafeRating(movie.rating)

  const movieSchema = {
    "@context": "https://schema.org",
    "@type": "Movie",
    "name": movie.title,
    "datePublished": movie.year ? `${movie.year}-01-01` : undefined,
    "description": movie.description ? movie.description.substring(0, 300) : movie.title,
    "image": movie.image_url || `${SITE_DOMAIN}/logo.png`,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": displayRating,
      "bestRating": "10",
      "worstRating": "1",
      "ratingCount": "50" 
    },
    "offers": {
      "@type": "Offer",
      "url": `${SITE_DOMAIN}/movie/${movie.slug || movie.id}`,
      "availability": "https://schema.org/InStock",
      "price": "0",
      "priceCurrency": "USD"
    }
  }

  return (
    <>
      <Script
        id={`movie-schema-${movie.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(movieSchema) }}
      />
      <Suspense fallback={<div className="min-h-screen bg-black text-[#f5c518] flex items-center justify-center font-bold">Loading...</div>}>
        <MoviePageClient movie={movie} suggestions={suggestions} />
      </Suspense>
    </>
  )
}
