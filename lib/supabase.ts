import { createClient } from "@supabase/supabase-js"

/* -------------------- SUPABASE -------------------- */
const supabaseUrl = "https://tofqvrfizqnoupkvvbcw.supabase.co"

const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvZnF2cmZpenFub3Vwa3Z2YmN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTMxODcsImV4cCI6MjA5MDU4OTE4N30.pZ63P7fRcpPsrMD1q9GdGlQcopc479KDCx0AA_S_iYk"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/* -------------------- CACHE -------------------- */
type CacheEntry<T> = { data: T; ts: number }

const cache = new Map<string, CacheEntry<any>>()
const TTL = 30000

function getCache<T>(key: string): T | null {
  const e = cache.get(key)
  if (!e) return null
  if (Date.now() - e.ts > TTL) {
    cache.delete(key)
    return null
  }
  return e.data as T
}

function setCache<T>(key: string, data: T) {
  cache.set(key, { data, ts: Date.now() })
}

export function clearCache(prefix?: string) {
  if (!prefix) cache.clear()
  else {
    for (const k of cache.keys()) {
      if (k.startsWith(prefix)) cache.delete(k)
    }
  }
}

/* -------------------- RETRY -------------------- */
async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 2,
  delay = 500
): Promise<T> {
  let lastError: any
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn()
    } catch (err: any) {
      lastError = err
      if (
        i < retries &&
        (err?.message?.includes("fetch") ||
          err?.message?.includes("network"))
      ) {
        await new Promise((r) => setTimeout(r, delay * (i + 1)))
        continue
      }
      throw err
    }
  }
  throw lastError
}

/* -------------------- TYPES -------------------- */
export interface MovieDownload {
  id?: number
  movie_id?: number
  url: string
  position: number
  created_at?: string
  updated_at?: string
}

export interface Movie {
  id: number
  title: string
  year: string
  rating: string
  duration: string
  genre: string[]
  image_url: string
  description: string
  tags?: string[]
  trailer_url?: string | null
  screenshot_url?: string | null
  featured: boolean
  is_published?: boolean
  created_at: string
  updated_at: string
  download_links?: Array<{ url: string }>
  movie_downloads?: MovieDownload[]
}

export interface JoinLink {
  id: number
  title: string
  description: string
  url: string
  created_at: string
  updated_at: string
}

export interface Genre {
  id?: number
  name: string
}

export interface AppSettings {
  id: number
  telegram_url: string | null
  how_to_download_url: string | null
  anime_url: string | null
  hollywood_url: string | null
  info_text: string | null
  info_url: string | null
  created_at: string
  updated_at: string
}

/* -------------------- ADMIN -------------------- */
export async function adminVerify(email: string, password: string): Promise<boolean> {
  const { data, error } = await supabase.rpc("admin_verify", {
    p_email: email,
    p_plain_password: password,
  })
  if (error) {
    console.warn("admin_verify RPC error:", error)
    return false
  }
  return !!data
}

/* -------------------- GENRES -------------------- */
const DEFAULT_GENRES = ["Action","Adventure","Drama","Sci-Fi","Crime","Comedy","Thriller","Romance","Horror"]

export async function getGenres(): Promise<string[]> {
  try {
    const { data, error } = await supabase.from("genres").select("name")
    if (error) throw error
    return (data || []).map((g: any) => g.name)
  } catch {
    return DEFAULT_GENRES
  }
}

/* -------------------- MOVIES PAGED -------------------- */
export async function getMoviesPaged(params: any = {}) {
  const page = Math.max(1, params.page ?? 1)
  const pageSize = Math.max(1, params.pageSize ?? 40)

  const key = `movies:${page}:${pageSize}:${params.search ?? ""}:${params.category ?? ""}`
  const cached = getCache<any>(key)
  if (cached) return cached

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  try {
    let query = supabase.from("movies").select("*", { count: "exact" }).eq("is_published", true)

    if (params.search) {
      query = query.ilike("title", `%${params.search}%`)
    }

    const { data, error, count } = await query.order("created_at", { ascending: false }).range(from, to)
    if (error) throw error

    const value = { items: data || [], total: count || 0 }
    setCache(key, value)
    return value
  } catch (e) {
    console.error(e)
    return { items: [], total: 0 }
  }
}

/* -------------------- FEATURED -------------------- */
export async function getFeaturedMovies(limit = 3) {
  const key = `featured:${limit}`
  const cached = getCache<Movie[]>(key)
  if (cached) return cached

  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .eq("featured", true)
    .eq("is_published", true)
    .limit(limit)

  if (error) return []
  setCache(key, data || [])
  return data || []
}

/* -------------------- CRUD -------------------- */
export async function getMovies(): Promise<Movie[]> {
  const { data } = await supabase.from("movies").select("*")
  return data || []
}

export async function addMovie(movie: any) {
  const { data } = await supabase.from("movies").insert([movie]).select().single()
  return data
}

export async function updateMovie(id: number, movie: any) {
  const { data } = await supabase.from("movies").update(movie).eq("id", id).select().single()
  return data
}

export async function deleteMovie(id: number) {
  await supabase.from("movies").delete().eq("id", id)
}
