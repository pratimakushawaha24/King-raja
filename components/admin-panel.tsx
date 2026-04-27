"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Plus, Edit, Trash2, Save, Eye, EyeOff, LogOut, Search, Copy, ClipboardCheck, ChevronLeft, ChevronRight, Globe, Lock } from "lucide-react"
import Image from "next/image"

import {
  getMovies,
  deleteMovie,
  getJoinLinks,
  updateJoinLink,
  addJoinLink,
  getMovieById,
  adminVerify,
  getGenres,
  clearCache,
  getAppSettings,
  updateAppSettings,
  supabase,
  type Movie,
  type JoinLink,
  type AppSettings,
  setMovieDownloads,
} from "@/lib/supabase"

interface AdminPanelProps {
  onClose: () => void
  onDataChange: () => void
}

const ITEMS_PER_PAGE = 20

export default function AdminPanel({ onClose, onDataChange }: AdminPanelProps) {
  const [sessionChecked, setSessionChecked] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [activeTab, setActiveTab] = useState<"list" | "form" | "join-links" | "settings">("list")
  const [appSettings, setAppSettings] = useState<AppSettings | null>(null)
  const [settingsForm, setSettingsForm] = useState({
    telegram_url: "",
    how_to_download_url: "",
    anime_url: "",
    hollywood_url: "",
    info_text: "",
    info_url: "",
  })
  const [loading, setLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [movies, setMovies] = useState<Movie[]>([])
  const [listSearch, setListSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const [editingMovie, setEditingMovie] = useState<Movie | null>(null)
  const [genreOptions, setGenreOptions] = useState<string[]>([])
  
  const [formData, setFormData] = useState({
    title: "",
    year: "",
    rating: "",
    duration: "",
    selectedGenres: [] as string[],
    imageUrl: "",
    screenshotUrl: "",
    trailerUrl: "",
    description: "",
    downloadLink1: "",
    downloadLink2: "",
    downloadLink3: "",
    featured: false,
    published: false,
    tagsInput: "",
  })
  const [joinLinks, setJoinLinks] = useState<JoinLink[]>([])
  const [editingJoinLink, setEditingJoinLink] = useState<JoinLink | null>(null)
  const [joinLinkForm, setJoinLinkForm] = useState({ title: "", description: "", url: "" })

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("ss_admin") // Cleaning old keys if any
    }
    const saved = typeof window !== "undefined" ? window.sessionStorage.getItem("filmyking@") : null
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed?.email) {
          setIsAuthenticated(true)
          void loadData()
        }
      } catch {}
    }
    setSessionChecked(true)
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [moviesData, joinLinksData, genreNames, settingsData] = await Promise.all([
        getMovies(),
        getJoinLinks(),
        getGenres(),
        getAppSettings(),
      ])
      
      setMovies(moviesData || [])
      setJoinLinks(joinLinksData || [])
      
      if (settingsData) {
        setAppSettings(settingsData)
        setSettingsForm({
          telegram_url: settingsData.telegram_url || "",
          how_to_download_url: settingsData.how_to_download_url || "",
          anime_url: settingsData.anime_url || "",
          hollywood_url: settingsData.hollywood_url || "",
          info_text: settingsData.info_text || "",
          info_url: settingsData.info_url || "",
        })
      } else {
        setAppSettings(null)
      }

      const uniq = Array.from(new Set((genreNames || []).concat(["Horror", "Action", "Drama", "Comedy", "Sci-Fi", "Thriller", "Romance", "Adventure"])))
      setGenreOptions(uniq)
    } catch (error) {
      console.error("Error loading data:", error)
    }
    setLoading(false)
  }

  const handleLogin = async () => {
    setAuthError(null)
    const ok = await adminVerify(email.trim(), password)
    if (!ok) {
      setAuthError("Invalid Credentails. Access Denied.")
      return
    }
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("filmyking@", JSON.stringify({ email: email.trim(), t: Date.now() }))
    }
    setIsAuthenticated(true)
    await loadData()
  }

  const handleLogout = async () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem("filmyking@")
    }
    setIsAuthenticated(false)
    setEmail("")
    setPassword("")
  }

  // --- SMART COPY & PASTE LOGIC ---
  const handleSmartCopy = () => {
    const downloadLinksArray = [];
    if(formData.downloadLink1) downloadLinksArray.push({url: formData.downloadLink1, quality: "Link 1", size: ""});
    if(formData.downloadLink2) downloadLinksArray.push({url: formData.downloadLink2, quality: "Link 2", size: ""});
    if(formData.downloadLink3) downloadLinksArray.push({url: formData.downloadLink3, quality: "Link 3", size: ""});

    const dataToCopy = {
      title: formData.title,
      year: formData.year,
      rating: formData.rating,
      duration: formData.duration,
      poster: formData.imageUrl,
      image_url: formData.imageUrl,
      genres: formData.selectedGenres,
      category: [],
      description: formData.description,
      trailerUrl: formData.trailerUrl,
      screenshots: formData.screenshotUrl ? [formData.screenshotUrl] : [],
      downloadLinks: downloadLinksArray,
      isTrending: formData.featured,
      seoTags: formData.tagsInput
    };
    navigator.clipboard.writeText(JSON.stringify(dataToCopy));
    alert("✅ Data Copied!");
  };

  const handleSmartPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const data = JSON.parse(text);
      
      if(!data.title && !data.poster && !data.image_url) return alert("❌ No valid movie data found in clipboard!");
      if(window.confirm("Paste data from clipboard?")) {
        let d1 = "", d2 = "", d3 = "";
        if (Array.isArray(data.downloadLinks)) {
            if (data.downloadLinks[0]) d1 = data.downloadLinks[0].url || "";
            if (data.downloadLinks[1]) d2 = data.downloadLinks[1].url || "";
            if (data.downloadLinks[2]) d3 = data.downloadLinks[2].url || "";
        } else {
            d1 = data.downloadLink1 || "";
            d2 = data.downloadLink2 || "";
            d3 = data.downloadLink3 || "";
        }

        let ss = "";
        if (Array.isArray(data.screenshots) && data.screenshots.length > 0) {
            ss = data.screenshots[0];
        } else if (typeof data.screenshot_url === 'string') {
            ss = data.screenshot_url;
        }

        setFormData(prev => ({
          ...prev,
          title: data.title || prev.title,
          year: data.year || prev.year,
          rating: data.rating || prev.rating, 
          duration: data.duration || prev.duration,
          imageUrl: data.poster || data.image_url || prev.imageUrl,
          screenshotUrl: ss || prev.screenshotUrl,
          selectedGenres: data.genres || data.genre || prev.selectedGenres,
          trailerUrl: data.trailerUrl || data.trailer_url || prev.trailerUrl,
          description: data.description || prev.description,
          downloadLink1: d1 || prev.downloadLink1,
          downloadLink2: d2 || prev.downloadLink2,
          downloadLink3: d3 || prev.downloadLink3,
          featured: data.isTrending || data.featured || false,
          tagsInput: data.seoTags || (Array.isArray(data.tags) ? data.tags.join(", ") : "") || prev.tagsInput
        }));
      }
    } catch (err) {
      alert("❌ Paste Failed: Invalid JSON format.");
      console.error(err);
    }
  };

  const handleTogglePublish = async (movie: Movie) => {
    const newStatus = !movie.is_published;
    setMovies(prev => prev.map(m => m.id === movie.id ? { ...m, is_published: newStatus } : m));
    const { error } = await supabase.from('movies').update({ is_published: newStatus }).eq('id', movie.id);
    if (error) {
        setMovies(prev => prev.map(m => m.id === movie.id ? { ...m, is_published: !newStatus } : m));
        alert("Failed to update status");
    } else {
        await clearCache();
    }
  };

  const handleMovieSubmit = async () => {
    if (!formData.title || !formData.year) {
      alert("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    try {
      const downloadLinks = [formData.downloadLink1, formData.downloadLink2, formData.downloadLink3]
        .filter((link) => link.trim())
        .map((url) => ({ url }))

      const tags = formData.tagsInput
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => tag.length > 0)

      const updateData = {
          title: formData.title,
          year: formData.year,
          rating: formData.rating,
          duration: formData.duration,
          genre: formData.selectedGenres,
          image_url: formData.imageUrl,
          screenshot_url: formData.screenshotUrl,
          trailer_url: formData.trailerUrl,
          description: formData.description,
          download_links: downloadLinks,
          featured: formData.featured,
          is_published: formData.published,
          tags,
      }

      if (editingMovie) {
        const { error } = await supabase.from("movies").update(updateData).eq("id", editingMovie.id).select()
        if (error) throw error
        const downloadUrls = [formData.downloadLink1, formData.downloadLink2, formData.downloadLink3].filter((link) => link.trim())
        if (downloadUrls.length > 0) {
          await setMovieDownloads(editingMovie.id, downloadUrls)
        }
        setEditingMovie(null)
      } else {
        const { error } = await supabase.from("movies").insert([updateData])
        if (error) throw error
      }
      
      resetForm()
      await clearCache()
      await loadData() 

    } catch (error) {
      console.error("Submit error:", error)
      alert("Error saving movie.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteMovie = async (movieId: number) => {
    if (confirm("Are you sure you want to delete this movie?")) {
      const success = await deleteMovie(movieId)
      if (success) {
        await clearCache()
        await loadData()
      } else {
        alert("Error deleting movie.")
      }
    }
  }

  const handleJoinLinkSubmit = async () => {
    setLoading(true)
    const linkData = { title: joinLinkForm.title, description: joinLinkForm.description, url: joinLinkForm.url }
    let success = false
    if (editingJoinLink) success = !!(await updateJoinLink(editingJoinLink.id, linkData))
    else success = !!(await addJoinLink(linkData))
    
    if (success) {
      resetJoinLinkForm()
      await loadData()
      clearCache("join:")
    } else {
      alert("Error saving join link.")
    }
    setLoading(false)
  }

  const handleSettingsSubmit = async () => {
    setIsSubmitting(true)
    try {
      const payload: any = {
        telegram_url: settingsForm.telegram_url,
        how_to_download_url: settingsForm.how_to_download_url,
        anime_url: settingsForm.anime_url,
        hollywood_url: settingsForm.hollywood_url,
        info_text: settingsForm.info_text,
        info_url: settingsForm.info_url,
      }
      if (appSettings && appSettings.id) {
        payload.id = appSettings.id
      }
      const updated = await updateAppSettings(payload)
      if (updated) {
        setAppSettings(updated)
        alert("✅ Settings updated successfully!")
      } else {
        throw new Error("Update failed. Server returned null.")
      }
    } catch (error) {
      console.error("Settings Update Error:", error)
      alert("❌ Error updating settings! Check Console for details.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      year: "",
      rating: "",
      duration: "",
      selectedGenres: [],
      imageUrl: "",
      screenshotUrl: "",
      trailerUrl: "",
      description: "",
      downloadLink1: "",
      downloadLink2: "",
      downloadLink3: "",
      featured: false,
      published: false,
      tagsInput: "",
    })
    setEditingMovie(null)
  }

  const resetJoinLinkForm = () => {
    setJoinLinkForm({ title: "", description: "", url: "" })
    setEditingJoinLink(null)
  }

  const handleEdit = async (movie: Movie) => {
    const withDownloads = await getMovieById(movie.id)
    const dls =
      withDownloads?.movie_downloads && withDownloads.movie_downloads.length > 0
        ? withDownloads.movie_downloads
        : (withDownloads?.download_links || []).map((x: any, i: number) => ({ url: x.url, position: i + 1 }))

    setEditingMovie(withDownloads || movie)
    setFormData({
      title: movie.title,
      year: movie.year,
      rating: movie.rating,
      duration: movie.duration,
      selectedGenres: movie.genre,
      imageUrl: movie.image_url,
      screenshotUrl: (withDownloads?.screenshot_url as string) || "",
      trailerUrl: (withDownloads?.trailer_url as string) || "",
      description: movie.description,
      downloadLink1: (dls as any)[0]?.url || "",
      downloadLink2: (dls as any)[1]?.url || "",
      downloadLink3: (dls as any)[2]?.url || "",
      featured: movie.featured,
      published: (withDownloads as any)?.is_published ?? true,
      tagsInput: movie.tags?.join(", ") || "",
    })
    setActiveTab("form")
  }

  const filteredMovies = useMemo(() => {
    const q = listSearch.trim().toLowerCase()
    if (!q) return movies
    return movies.filter((m) => m.title.toLowerCase().includes(q))
  }, [movies, listSearch])

  useEffect(() => {
    setCurrentPage(1)
  }, [listSearch])

  const paginatedMovies = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredMovies.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredMovies, currentPage])

  const totalPages = Math.ceil(filteredMovies.length / ITEMS_PER_PAGE)

  // --- LOGIN SCREEN (Vegamovies Style) ---
  if (!sessionChecked || !isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[#111] border-[#333] shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-[#f5c518] text-black font-black px-2 py-0.5 rounded text-xl shadow-[0_0_15px_#f5c518]">F</div>
                <CardTitle className="text-white text-xl uppercase tracking-tighter">filmy<span className="text-[#f5c518]">king</span></CardTitle>
              </div>
              <Button onClick={onClose} variant="ghost" size="sm" className="text-white hover:text-[#f5c518] hover:bg-white/5">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Label className="text-gray-400 text-xs font-bold uppercase ml-1">Gmail</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-[#1a1a1a] border-[#333] text-white h-12 rounded mt-1 focus:border-[#f5c518]" placeholder="admin@filmyking.." />
            </div>
            <div>
              <Label className="text-gray-400 text-xs font-bold uppercase ml-1">Password</Label>
              <div className="relative mt-1">
                <Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="bg-[#1a1a1a] border-[#333] text-white pr-12 h-12 rounded focus:border-[#f5c518]" placeholder="••••••••" />
                <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-4 text-gray-400 hover:text-white" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            {authError && <p className="text-red-500 text-xs font-bold bg-red-900/10 p-2 rounded border border-red-900/50">{authError}</p>}
            <Button onClick={handleLogin} className="w-full bg-[#f5c518] hover:bg-white text-black font-black uppercase tracking-widest h-12 rounded shadow-lg">Login</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // --- DASHBOARD (Vegamovies Style) ---
  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 overflow-y-auto">
      <div className="min-h-screen p-2 sm:p-4">
        <Card className="w-full max-w-7xl mx-auto bg-[#0a0a0a] border-[#222] shadow-2xl">
          <CardHeader className="p-4 sm:p-6 sticky top-0 bg-[#111] z-10 border-b border-[#222]">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                <div className="bg-[#f5c518] text-black font-black px-2 py-0.5 rounded text-lg shadow-[0_0_10px_#f5c518]">F</div>
                <CardTitle className="text-white text-lg sm:text-2xl uppercase tracking-tighter truncate">filmy<span className="text-[#f5c518]">king</span></CardTitle>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                 <Button onClick={handleLogout} variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-white/5 text-xs sm:text-sm">
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1 uppercase font-bold">Logout</span>
                </Button>
                <Button onClick={onClose} variant="ghost" size="sm" className="text-gray-400 hover:text-red-500 hover:bg-white/5"><X className="h-5 w-5" /></Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4 items-center overflow-x-auto no-scrollbar">
              <Button onClick={() => setActiveTab("list")} size="sm" className={activeTab === "list" ? "bg-[#f5c518] text-black font-bold border border-[#f5c518]" : "bg-[#1a1a1a] text-gray-400 border border-[#333] hover:text-white hover:border-white"}>Movies List</Button>
              <Button onClick={() => { setActiveTab("form"); resetForm() }} size="sm" className={activeTab === "form" ? "bg-[#f5c518] text-black font-bold border border-[#f5c518]" : "bg-[#1a1a1a] text-gray-400 border border-[#333] hover:text-white hover:border-white"}><Plus className="h-4 w-4 mr-1" />Add Movie</Button>
              <Button onClick={() => { setActiveTab("join-links"); resetJoinLinkForm() }} size="sm" className={activeTab === "join-links" ? "bg-[#f5c518] text-black font-bold border border-[#f5c518]" : "bg-[#1a1a1a] text-gray-400 border border-[#333] hover:text-white hover:border-white"}>Links</Button>
              <Button onClick={() => setActiveTab("settings")} size="sm" className={activeTab === "settings" ? "bg-[#f5c518] text-black font-bold border border-[#f5c518]" : "bg-[#1a1a1a] text-gray-400 border border-[#333] hover:text-white hover:border-white"}>Settings</Button>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-6 max-h-[calc(100vh-200px)] overflow-y-auto bg-[#0a0a0a]">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="w-10 h-10 border-4 border-[#f5c518] border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {!loading && activeTab === "list" && (
              <div className="space-y-4">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input placeholder="Search movies database..." value={listSearch} onChange={(e) => setListSearch(e.target.value)} className="pl-10 bg-[#1a1a1a] border-[#333] text-white focus:border-[#f5c518] h-11" />
                </div>

               {filteredMovies.length > 0 && (
                  <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase mb-2">
                    <span>Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredMovies.length)} of {filteredMovies.length}</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="border-[#333] text-gray-400 hover:text-white bg-transparent h-8 w-8 p-0"><ChevronLeft className="h-4 w-4" /></Button>
                      <Button variant="outline" size="sm" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)} className="border-[#333] text-gray-400 hover:text-white bg-transparent h-8 w-8 p-0"><ChevronRight className="h-4 w-4" /></Button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3">
                {paginatedMovies.map((movie) => {
                  // @ts-ignore
                  const isPub = movie.is_published !== false;
                  return (
                    <div key={movie.id} className={`bg-[#111] rounded border ${isPub ? 'border-[#222]' : 'border-red-900/30 bg-red-900/5'} hover:border-[#f5c518] transition-all overflow-hidden group`}>
                      <div className="flex flex-col sm:flex-row p-3 gap-4">
                        <div className="flex gap-4 flex-1 min-w-0">
                          <div className="w-16 h-24 rounded bg-[#1a1a1a] flex-shrink-0 relative border border-[#333] overflow-hidden">
                             <img src={movie.image_url || "/placeholder.svg"} alt={movie.title} className="w-full h-full object-cover" />
                             {!isPub && <div className="absolute inset-0 bg-black/80 flex items-center justify-center"><Lock className="w-4 h-4 text-red-500" /></div>}
                          </div>
                          <div className="flex flex-col justify-center min-w-0">
                             <h3 className="text-white font-bold text-sm sm:text-base leading-tight line-clamp-1 mb-1 group-hover:text-[#f5c518] transition-colors">{movie.title}</h3>
                             <p className="text-gray-500 text-xs mb-2 font-mono">{movie.year} • {movie.rating} ★</p>
                             <div className="flex flex-wrap gap-1">
                              {movie.genre.slice(0, 3).map((g) => (
                                <span key={g} className="bg-[#1a1a1a] text-gray-400 text-[10px] px-2 py-0.5 rounded border border-[#333] uppercase font-bold">{g}</span>
                               ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#222]">
                           <div className="flex gap-2">
                              <Button 
                                onClick={() => handleTogglePublish(movie)}
                                size="sm"
                                className={`h-8 px-3 text-xs font-bold uppercase tracking-wider ${isPub ? "bg-[#1a1a1a] hover:bg-red-900/20 text-gray-400 hover:text-red-500 border border-[#333]" : "bg-green-600 text-white hover:bg-green-700 border border-green-500"}`}
                              >
                                {isPub ? "Unpublish" : "Publish"}
                              </Button>

                              <Button onClick={() => handleEdit(movie)} size="sm" className="bg-[#f5c518] hover:bg-white text-black h-8 w-8 p-0">
                                 <Edit className="h-4 w-4" />
                              </Button>
                              <Button onClick={() => handleDeleteMovie(movie.id)} size="sm" className="bg-red-600 hover:bg-red-700 text-white h-8 w-8 p-0">
                                 <Trash2 className="h-4 w-4" />
                              </Button>
                           </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
                </div>

                {filteredMovies.length === 0 && (
                  <p className="text-gray-600 text-center py-12 uppercase font-bold tracking-widest text-sm">No movies found in database.</p>
                )}
              </div>
            )}

            {!loading && activeTab === "form" && (
              <div className="space-y-8">
                <div className="flex flex-wrap gap-4 mb-6 bg-[#111] p-4 rounded border border-dashed border-[#333] items-center justify-between">
                    <div className="flex gap-3">
                         <Button type="button" onClick={handleSmartPaste} className="bg-green-700 hover:bg-green-600 text-white font-bold uppercase text-xs">
                             <ClipboardCheck className="h-4 w-4 mr-2"/> Smart Paste
                         </Button>
                        {(editingMovie || formData.title) && (
                             <Button type="button" onClick={handleSmartCopy} className="bg-blue-700 hover:bg-blue-600 text-white font-bold uppercase text-xs">
                                <Copy className="h-4 w-4 mr-2"/> Copy Data
                             </Button>
                        )}
                    </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-[#111] rounded border border-[#222]">
                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="published"
                            checked={formData.published}
                            onCheckedChange={(checked) => setFormData({ ...formData, published: checked as boolean })}
                            className="w-5 h-5 border-[#f5c518] data-[state=checked]:bg-[#f5c518] data-[state=checked]:text-black"
                        />
                        <Label htmlFor="published" className="text-white font-bold text-sm cursor-pointer uppercase tracking-wider">
                            {formData.published ? "🟢 Status: Published" : "🔴 Status: Draft"}
                        </Label>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><Label className="text-gray-400 text-xs font-bold uppercase ml-1">Movie Name</Label><Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="bg-[#1a1a1a] border-[#333] text-white mt-1 h-11 focus:border-[#f5c518]" placeholder="Enter movie name" /></div>
                  <div><Label className="text-gray-400 text-xs font-bold uppercase ml-1">Year</Label><Input value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} className="bg-[#1a1a1a] border-[#333] text-white mt-1 h-11 focus:border-[#f5c518]" placeholder="2024" /></div>
                  <div><Label className="text-gray-400 text-xs font-bold uppercase ml-1">Rating</Label><Input value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: e.target.value })} className="bg-[#1a1a1a] border-[#333] text-white mt-1 h-11 focus:border-[#f5c518]" placeholder="8.5" /></div>
                  <div><Label className="text-gray-400 text-xs font-bold uppercase ml-1">Duration</Label><Input value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} className="bg-[#1a1a1a] border-[#333] text-white mt-1 h-11 focus:border-[#f5c518]" placeholder="120 min" /></div>
                </div>

                <div>
                  <Label className="text-gray-400 text-xs font-bold uppercase ml-1 mb-2 block">Genres</Label>
                  <div className="flex flex-wrap gap-2">
                    {genreOptions.map((g) => {
                      const checked = formData.selectedGenres.includes(g)
                      return (
                          <button key={g} type="button" onClick={() => { setFormData((prev) => { const exists = prev.selectedGenres.includes(g); return { ...prev, selectedGenres: exists ? prev.selectedGenres.filter((x) => x !== g) : [...prev.selectedGenres, g] } }) }} className={`px-3 py-1 rounded text-xs font-bold uppercase border transition ${checked ? "bg-[#f5c518] text-black border-[#f5c518]" : "bg-[#1a1a1a] text-gray-500 border-[#333] hover:text-white hover:border-gray-500"}`}>{g}</button>
                      )
                    })}
                  </div>
                </div>

                <div><Label className="text-gray-400 text-xs font-bold uppercase ml-1">Poster URL</Label><Input value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} className="bg-[#1a1a1a] border-[#333] text-white mt-1 h-11 focus:border-[#f5c518]" /></div>
                <div><Label className="text-gray-400 text-xs font-bold uppercase ml-1">Screenshot URL</Label><Input value={formData.screenshotUrl} onChange={(e) => setFormData({ ...formData, screenshotUrl: e.target.value })} className="bg-[#1a1a1a] border-[#333] text-white mt-1 h-11 focus:border-[#f5c518]" /></div>
                <div><Label className="text-gray-400 text-xs font-bold uppercase ml-1">Trailer URL</Label><Input value={formData.trailerUrl} onChange={(e) => setFormData({ ...formData, trailerUrl: e.target.value })} className="bg-[#1a1a1a] border-[#333] text-white mt-1 h-11 focus:border-[#f5c518]" /></div>
                <div><Label className="text-gray-400 text-xs font-bold uppercase ml-1">Description</Label><Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="bg-[#1a1a1a] border-[#333] text-white mt-1 focus:border-[#f5c518]" rows={5} /></div>
                <div><Label className="text-gray-400 text-xs font-bold uppercase ml-1">SEO Tags</Label><Textarea value={formData.tagsInput} onChange={(e) => setFormData({ ...formData, tagsInput: e.target.value })} className="bg-[#1a1a1a] border-[#333] text-white mt-1 focus:border-[#f5c518]" rows={3} placeholder="Comma separated tags..." /></div>

                <div className="space-y-4 border-t border-[#222] pt-6">
                  <Label className="text-[#f5c518] font-bold uppercase">Download Links</Label>
                  <div><Input placeholder="Link 1" value={formData.downloadLink1} onChange={(e) => setFormData({ ...formData, downloadLink1: e.target.value })} className="bg-[#1a1a1a] border-[#333] text-white h-11 focus:border-[#f5c518]" /></div>
                  <div><Input placeholder="Link 2" value={formData.downloadLink2} onChange={(e) => setFormData({ ...formData, downloadLink2: e.target.value })} className="bg-[#1a1a1a] border-[#333] text-white h-11 focus:border-[#f5c518]" /></div>
                  <div><Input placeholder="Link 3" value={formData.downloadLink3} onChange={(e) => setFormData({ ...formData, downloadLink3: e.target.value })} className="bg-[#1a1a1a] border-[#333] text-white h-11 focus:border-[#f5c518]" /></div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-[#111] rounded border border-[#222]">
                  <Checkbox id="featured" checked={formData.featured} onCheckedChange={(checked) => setFormData({ ...formData, featured: checked as boolean })} className="border-[#f5c518] data-[state=checked]:bg-[#f5c518] data-[state=checked]:text-black" />
                  <Label htmlFor="featured" className="text-white font-bold text-sm uppercase">Featured Movie (Hero Slider)</Label>
                </div>

                <Button onClick={handleMovieSubmit} disabled={isSubmitting} className="w-full bg-[#f5c518] hover:bg-white text-black font-black uppercase tracking-widest h-14 rounded shadow-[0_0_20px_rgba(245,197,24,0.3)] disabled:opacity-50">
                   {isSubmitting ? "Saving..." : (editingMovie ? "Update Movie" : "Add Movie")}
                </Button>
              </div>
            )}

            {!loading && activeTab === "join-links" && (
              <div className="space-y-6">
                <h3 className="text-lg font-black text-white uppercase tracking-widest border-b border-[#222] pb-2">Manage Links</h3>
                <div className="space-y-3 mb-8">
                  {joinLinks.map((link) => (
                    <div key={link.id} className="bg-[#111] p-4 rounded border border-[#222] flex items-center justify-between hover:border-[#f5c518] transition-colors">
                        <div>
                          <h4 className="text-white font-bold text-sm uppercase">{link.title}</h4>
                          <p className="text-gray-500 text-xs line-clamp-1">{link.url}</p>
                        </div>
                        <Button onClick={() => { setEditingJoinLink(link); setJoinLinkForm({ title: link.title, description: link.description, url: link.url }) }} size="sm" className="bg-[#f5c518] text-black"><Edit className="h-4 w-4" /></Button>
                    </div>
                  ))}
                </div>
                <div className="bg-[#111] p-6 rounded border border-[#222] space-y-4">
                    <div><Label className="text-gray-400 text-xs font-bold uppercase">Title</Label><Input value={joinLinkForm.title} onChange={(e) => setJoinLinkForm({ ...joinLinkForm, title: e.target.value })} className="bg-[#1a1a1a] border-[#333] text-white mt-1 focus:border-[#f5c518]" /></div>
                    <div><Label className="text-gray-400 text-xs font-bold uppercase">URL</Label><Input value={joinLinkForm.url} onChange={(e) => setJoinLinkForm({ ...joinLinkForm, url: e.target.value })} className="bg-[#1a1a1a] border-[#333] text-white mt-1 focus:border-[#f5c518]" /></div>
                    <Button onClick={handleJoinLinkSubmit} disabled={loading} className="w-full bg-[#f5c518] text-black font-bold uppercase">
                        {editingJoinLink ? "Update Link" : "Add New Link"}
                    </Button>
                </div>
              </div>
            )}

            {!loading && activeTab === "settings" && (
              <div className="space-y-6">
                <h3 className="text-lg font-black text-white uppercase tracking-widest border-b border-[#222] pb-2">Site Settings</h3>
                <div className="bg-[#111] p-6 rounded border border-[#222] space-y-4">
                    <div><Label className="text-gray-400 text-xs font-bold uppercase">Info Bar Text</Label><Input value={settingsForm.info_text} onChange={(e) => setSettingsForm({ ...settingsForm, info_text: e.target.value })} className="bg-[#1a1a1a] border-[#333] text-white mt-1 focus:border-[#f5c518]" /></div>
                    <div><Label className="text-gray-400 text-xs font-bold uppercase">Telegram URL</Label><Input value={settingsForm.telegram_url} onChange={(e) => setSettingsForm({ ...settingsForm, telegram_url: e.target.value })} className="bg-[#1a1a1a] border-[#333] text-white mt-1 focus:border-[#f5c518]" /></div>
                    <div><Label className="text-gray-400 text-xs font-bold uppercase">Anime Site URL</Label><Input value={settingsForm.anime_url} onChange={(e) => setSettingsForm({ ...settingsForm, anime_url: e.target.value })} className="bg-[#1a1a1a] border-[#333] text-white mt-1 focus:border-[#f5c518]" /></div>
                    <Button onClick={handleSettingsSubmit} disabled={isSubmitting} className="w-full bg-[#f5c518] text-black font-black uppercase h-12 mt-4">{isSubmitting ? "Saving..." : "Save Changes"}</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
