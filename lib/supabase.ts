import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://tofqvrfizqnoupkvvbcw.supabase.co"
const supabaseAnonKey =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvZnF2cmZpenFub3Vwa3Z2YmN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTMxODcsImV4cCI6MjA5MDU4OTE4N30.pZ63P7fRcpPsrMD1q9GdGlQcopc479KDCx0AA_S_iYk"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/* -------------------- Lightweight client-side cache -------------------- */
interface CacheEntry<T> { data: T; ts: number }
const cache = new Map<string, CacheEntry<any>>()
const TTL = 30_000 // 30s keeps UI snappy but avoids long stale data

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

/* -------------------- Retry helper for network errors -------------------- */
async function withRetry<T>(fn: () => Promise<T>, retries = 2, delay = 500): Promise<T> {
let lastError: any
for (let i = 0; i <= retries; i++) {
try {
return await fn()
} catch (err: any) {
lastError = err
if (i < retries && (err?.message?.includes("fetch") || err?.message?.includes("network"))) {
await new Promise((r) => setTimeout(r, delay * (i + 1)))
continue
}
throw err
}
}
throw lastError
}

/* -------------------- Types -------------------- */
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
slug?: string // ✅ ADDED: Missing slug field
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

/* -------------------- Admin verify (improved) -------------------- */
export async function adminVerify(email: string, password: string): Promise<boolean> {
try {
const { data, error } = await supabase.rpc("admin_verify", { p_email: email, p_plain_password: password })
if (error) {
console.warn("admin_verify RPC error:", error.message)
return false
}
return !!data
} catch (err) {
console.warn("admin_verify exception:", err)
return false
}
}

/* -------------------- Genres -------------------- */
const DEFAULT_GENRES = ["Action", "Adventure", "Drama", "Sci-Fi", "Crime", "Comedy", "Thriller", "Romance", "Horror"]

export async function getGenres(): Promise<string[]> {
try {
const { data, error } = await supabase.from("genres").select("name").order("name", { ascending: true })
if (error) throw error
const names = (data || []).map((g: any) => g.name).filter(Boolean)
const merged = Array.from(new Set([...(names.length ? names : DEFAULT_GENRES)]))
if (!merged.includes("Horror")) merged.push("Horror")
return merged
} catch {
return DEFAULT_GENRES
}
}

/* -------------------- Movies list with paging (PUBLIC) -------------------- */
export interface GetMoviesPagedParams {
page?: number
pageSize?: number
search?: string
category?: string
}

export interface MoviesPage {
items: Movie[]
total: number
page: number
pageSize: number
}

export async function getMoviesPaged(params: GetMoviesPagedParams = {}): Promise<MoviesPage> {
const page = Math.max(1, params.page ?? 1)
const pageSize = Math.max(1, params.pageSize ?? 40)

const key = `movies:${page}:${pageSize}:${params.search ?? ""}:${params.category ?? ""}`
const cached = getCache<MoviesPage>(key)
if (cached) return cached

const from = (page - 1) * pageSize
const to = from + pageSize - 1

try {
const result = await withRetry(async () => {
let query = supabase
.from("movies")
.select(
"id, title, year, rating, duration, genre, image_url, description, tags, trailer_url, featured, created_at, is_published, slug",
{ count: "exact" },
)
.eq("is_published", true)

if (params.search && params.search.trim().length > 0) {  
    query = query.ilike("title", `%${params.search.trim()}%`)  
  }  

  if (params.category && params.category !== "All") {  
    query = query.contains("genre", [params.category])  
  }  

  const { data, error, count } = await query.order("created_at", { ascending: false }).range(from, to)  

  if (error) throw error  
  return { data, count }  
})  

const value = { items: (result.data || []) as Movie[], total: result.count ?? 0, page, pageSize }  
setCache(key, value)  
return value

} catch (error) {
console.error("Error fetching paged movies:", error)
return { items: [], total: 0, page, pageSize }
}
}

/* -------------------- Featured (PUBLIC) -------------------- */
export async function getFeaturedMovies(limit = 3): Promise<Movie[]> {
const key = `featured:${limit}`
const cached = getCache<Movie[]>(key)
if (cached) return cached

try {
const { data, error } = await supabase
.from("movies")
.select("id, title, year, rating, genre, image_url, featured, created_at, is_published, slug")
.eq("featured", true)
.eq("is_published", true)
.order("created_at", { ascending: false })
.limit(Math.max(1, limit))

if (error) throw error  

const items = (data || []) as Movie[]  
setCache(key, items)  
return items

} catch (error) {
console.error("Error fetching featured movies:", error)
return []
}
}

/* -------------------- Admin list (ADMIN ONLY) -------------------- */
export async function getMovies(): Promise<Movie[]> {
const { data, error } = await supabase.from("movies").select("*").order("created_at", { ascending: false })
if (error) {
console.error("Error fetching movies:", error)
return []
}
return data || []
}

/* -------------------- Movie detail (Internal Helper) -------------------- */
export async function getMovieById(id: number): Promise<Movie | null> {
const key = `movie:${id}`
const cached = getCache<Movie | null>(key)
if (cached !== null && cached !== undefined) return cached

const { data: movie, error: movieErr } = await supabase.from("movies").select("*").eq("id", id).single()
if (movieErr || !movie) {
console.error("Error fetching movie:", movieErr)
setCache(key, null)
return null
}

let tableDownloads: MovieDownload[] = []
const { data: dls, error: dlErr } = await supabase
.from("movie_downloads")
.select("*")
.eq("movie_id", id)
.order("position", { ascending: true })

if (!dlErr && dls && dls.length > 0) {
tableDownloads = dls as MovieDownload[]
} else {
const legacy = (movie as any).download_links
if (Array.isArray(legacy) && legacy.length > 0) {
tableDownloads = legacy.map((x: any, idx: number) => ({ 
url: x?.url ?? "", 
position: idx + 1,
movie_id: id
}))
}
}

const full = { ...(movie as Movie), movie_downloads: tableDownloads }
setCache(key, full)
return full
}

/* -------------------- Movie Slug (PUBLIC) -------------------- */
export async function getMovieBySlug(slug: string): Promise<Movie | null> {
const key = `movie-slug:${slug}`
const cached = getCache<Movie | null>(key)
if (cached !== null && cached !== undefined) return cached

const idMatch = slug.match(/^(\d+)/)
const movieId = idMatch ? Number.parseInt(idMatch[1], 10) : null

try {
if (movieId) {
const movie = await getMovieById(movieId)
if (movie && movie.is_published === false) return null;

if (movie) {  
    setCache(key, movie)  
    return movie  
  }  
}  

const { data: movie, error: slugErr } = await supabase.from("movies").select("*").eq("slug", slug).single()  
  
if (!slugErr && movie) {  
  if (movie.is_published === false) return null;  

  let tableDownloads: MovieDownload[] = []  
  const { data: dls, error: dlErr } = await supabase  
    .from("movie_downloads")  
    .select("*")  
    .eq("movie_id", movie.id)  
    .order("position", { ascending: true })  

  if (!dlErr && dls && dls.length > 0) {  
    tableDownloads = dls as MovieDownload[]  
  } else {  
    const legacy = (movie as any).download_links  
    if (Array.isArray(legacy) && legacy.length > 0) {  
      tableDownloads = legacy.map((x: any, idx: number) => ({ 
        url: x?.url ?? "", 
        position: idx + 1,
        movie_id: movie.id
      }))  
    }  
  }  

  const full = { ...(movie as Movie), movie_downloads: tableDownloads }  
  setCache(key, full)  
  return full  
}  

setCache(key, null)  
return null

} catch (err: any) {
console.error("Error fetching movie by slug:", err)
setCache(key, null)
return null
}
}

/* -------------------- Mutations (Admin) -------------------- */
export async function addMovie(
movie: Omit<Movie, "id" | "created_at" | "updated_at" | "movie_downloads">,
): Promise<Movie | null> {
const { data, error } = await supabase.from("movies").insert([movie]).select().single()
if (error) {
console.error("Error adding movie:", error)
return null
}
clearCache("movies:")
clearCache("featured:")
return data as Movie
}

export async function updateMovie(id: number, movie: Partial<Movie>): Promise<Movie | null> {
const { data, error } = await supabase.from("movies").update(movie).eq("id", id).select().single()
if (error) {
console.error("Error updating movie:", error)
return null
}
clearCache(`movie:${id}`)
clearCache("movies:")
clearCache("featured:")
clearCache("movie-slug:")
return data as Movie
}

export async function deleteMovie(id: number): Promise<boolean> {
const { error } = await supabase.from("movies").delete().eq("id", id)
if (error) {
console.error("Error deleting movie:", error)
return false
}
clearCache(`movie:${id}`)
clearCache("movies:")
clearCache("featured:")
return true
}

function isRelationMissing(err: any) {
const code = err?.code || ""
const msg = err?.message || err?.details || ""
return code === "42P01" || /relation .* does not exist/i.test(msg)
}

export async function setMovieDownloads(movieId: number, urls: string[]) {
const filtered = (urls || []).map((u) => (u || "").trim()).filter((u) => u.length > 0)
const rows = filtered.map((url, idx) => ({ movie_id: movieId, url, position: idx + 1 }))

try {
const delRes = await supabase.from("movie_downloads").delete().eq("movie_id", movieId)
if (delRes.error) throw delRes.error

if (rows.length > 0) {  
  const insRes = await supabase.from("movie_downloads").insert(rows)  
  if (insRes.error) throw insRes.error  
}  
clearCache(`movie:${movieId}`)  
return

} catch (err: any) {
if (isRelationMissing(err)) {
const jsonb = filtered.map((url) => ({ url }))
await supabase.from("movies").update({ download_links: jsonb }).eq("id", movieId)
clearCache(`movie:${movieId}`)
return
}
console.error("Error saving downloads:", err)
}
}

/* -------------------- Join Links -------------------- */
export async function getJoinLinks(): Promise<JoinLink[]> {
const { data, error } = await supabase.from("join_links").select("*").order("id", { ascending: true })
if (error) {
console.error("Error fetching join links:", error)
return []
}
return data || []
}

export async function updateJoinLink(id: number, joinLink: Partial<JoinLink>): Promise<JoinLink | null> {
const { data, error } = await supabase.from("join_links").update(joinLink).eq("id", id).select().single()
if (error) {
console.error("Error updating join link:", error)
return null
}
return data
}

export async function addJoinLink(
joinLink: Omit<JoinLink, "id" | "created_at" | "updated_at">,
): Promise<JoinLink | null> {
const { data, error } = await supabase.from("join_links").insert([joinLink]).select().single()
if (error) {
console.error("Error adding join link:", error)
return null
}
return data
}

/* -------------------- App Settings -------------------- */
export async function getAppSettings(): Promise<AppSettings> {
try {
const { data, error } = await supabase.from("app_settings").select("*").eq("id", 1).single()
if (error || !data) {
return {
id: 1,
telegram_url: null,
how_to_download_url: null,
anime_url: null,
hollywood_url: null,
info_text: null,
info_url: null,
created_at: "",
updated_at: "",
}
}
return data as AppSettings
} catch {
return {
id: 1,
telegram_url: null,
how_to_download_url: null,
anime_url: null,
hollywood_url: null,
info_text: null,
info_url: null,
created_at: "",
updated_at: "",
}
}
}

export async function updateAppSettings(settings: Partial<AppSettings>): Promise<AppSettings | null> {
const { data, error } = await supabase
.from("app_settings")
.upsert({ id: 1, ...settings }, { onConflict: "id" })
.select()
.single()
if (error) {
console.error("Error updating app settings:", error)
return null
}
return data as AppSettings
}

/* -------------------- Movies by tag (PUBLIC) -------------------- */
export async function getMoviesByTag(tag: string): Promise<Movie[]> {
const key = `tag:${tag}`
const cached = getCache<Movie[]>(key)
if (cached) return cached

try {
const { data, error } = await supabase
.from("movies")
.select("*")
.contains("tags", [tag.toLowerCase()])
.eq("is_published", true)
.order("created_at", { ascending: false })

if (error) throw error  

const items = (data || []) as Movie[]  
setCache(key, items)  
return items

} catch (error) {
console.error("Error fetching movies by tag:", error)
return []
}
}  id?: number
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
