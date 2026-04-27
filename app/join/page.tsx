"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ExternalLink, ShieldCheck, Zap, Star, Tag, Mail, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { getJoinLinks, type JoinLink } from "@/lib/supabase"

export default function JoinPage() {
  const [joinLinks, setJoinLinks] = useState<JoinLink[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadJoinLinks()
  }, [])

  const loadJoinLinks = async () => {
    setLoading(true)
    const links = await getJoinLinks()
    setJoinLinks(links)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#f5c518] rounded-full p-1 animate-spin shadow-[0_0_20px_#f5c518]">
             <div className="w-full h-full bg-black rounded-full flex items-center justify-center font-black text-[#f5c518]">F</div>
          </div>
          <p className="text-[#f5c518] text-xl animate-pulse font-black tracking-widest uppercase">LOADING...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0] overflow-x-hidden font-sans selection:bg-[#f5c518] selection:text-black">
      
      {/* --- HEADER --- */}
      <header className="border-b border-[#222] bg-[#111]/95 backdrop-blur-md sticky top-0 z-50 p-3 flex justify-between items-center shadow-xl">
        <Link href="/" aria-label="Vegamovies Home" className="flex items-center gap-2 group">
           <div className="bg-[#f5c518] text-black font-black px-2 py-0.5 rounded text-xl shadow-[0_0_15px_#f5c518]">f</div>
           <span className="text-xl font-black text-white tracking-tighter uppercase">filmy<span className="text-[#f5c518]">king</span></span>
        </Link>
        <Link href="/" aria-label="Back to Homepage">
            <Button variant="ghost" className="text-gray-400 hover:text-[#f5c518] hover:bg-white/5 font-bold uppercase text-xs border border-[#333]">
               <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
        </Link>
      </header>

      <main id="main-content">
        {/* --- HERO SECTION --- */}
        <section className="container mx-auto px-4 py-16 md:py-20 text-center relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[#f5c518]/5 blur-[100px] rounded-full -z-10" />
          
          <h1 className="text-4xl md:text-7xl font-black text-white mb-6 leading-tight uppercase tracking-tighter animate-fade-in-up">
            Join the <span className="text-[#f5c518]">Official</span> Community
          </h1>
          <p className="text-gray-400 text-sm md:text-lg max-w-3xl mx-auto leading-relaxed font-medium">
            Get instant access to the latest Bollywood, Hollywood, and South Hindi Dubbed movies in 480p, 720p, 1080p.
            <span className="text-white font-bold block mt-2">Join 100,0000+✨ filmyking users today!</span>
          </p>
        </section>

        {/* --- JOIN LINKS CARDS --- */}
        <section className="container mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {joinLinks.map((link) => (
              <Card key={link.id} className="bg-[#151515] border border-[#333] rounded-2xl overflow-hidden hover:border-[#f5c518] transition-all duration-300 group shadow-lg hover:shadow-[0_0_30px_rgba(245,197,24,0.1)]">
                 <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-[#f5c518]/10 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-inner group-hover:bg-[#f5c518] transition-colors">
                     <ExternalLink className="w-8 h-8 text-[#f5c518] group-hover:text-black" />
                  </div>
              
                  <h2 className="text-2xl font-black text-white mb-3 uppercase tracking-tight">{link.title}</h2>
                  <p className="text-gray-500 mb-8 text-sm leading-relaxed">{link.description}</p>
                  
                  <Button onClick={() => window.open(link.url, "_blank")} className="w-full h-14 bg-[#f5c518] text-black hover:bg-white text-lg font-black rounded-xl shadow-lg transition-all uppercase tracking-widest flex items-center justify-center gap-2">
                    Join Now <ArrowRight className="w-5 h-5" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* --- SEO CONTENT: About Vegamovies --- */}
        <section className="container mx-auto px-4 py-16 border-t border-[#222]">
           <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-black mb-8 text-center text-white uppercase"><span className="text-[#f5c518]">About</span>filmyking</h2>
            <div className="space-y-6 text-gray-400 text-sm md:text-base leading-relaxed text-justify">
              <p>
                <strong>filmyking(filmyking.com)</strong> is India's leading platform for movie enthusiasts who seek high-quality cinematic experiences. Our mission is to provide the fastest download links for <strong className="text-white">Bollywood 2026 movies</strong>, <strong className="text-white">Hollywood Hindi Dubbed dual audio</strong> content, and the latest <strong className="text-white">South Indian Hindi Dubbed blockbusters</strong>.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
                <div className="p-6 bg-[#111] rounded border border-[#222] flex items-start gap-4 hover:border-[#f5c518] transition-colors">
                   <Zap className="text-[#f5c518] w-6 h-6 shrink-0" />
                   <div><h3 className="font-bold text-white mb-1 uppercase text-sm">Fastest Servers</h3><p className="text-xs text-gray-500">We use high-speed G-Drive servers to ensure you get max download speed.</p></div>
                </div>
                <div className="p-6 bg-[#111] rounded border border-[#222] flex items-start gap-4 hover:border-[#f5c518] transition-colors">
                   <ShieldCheck className="text-[#f5c518] w-6 h-6 shrink-0" />
                   <div><h3 className="font-bold text-white mb-1 uppercase text-sm">Secure Links</h3><p className="text-xs text-gray-500">Every link is manually verified and scanned daily for a safe experience.</p></div>
                </div>
              </div>

              <p>
                Why search anywhere else when you can find <strong className="text-white">480p, 720p, 1080p, and 4K UHD movies</strong> all in one place?filmyking covers everything from Anime to Web Series on platforms like Netflix, Prime Video, and Disney+ Hotstar, making it the best alternative to <em className="text-gray-500">Filmyfly, Hdhub4u, and Katarmovie</em>.
              </p>
            </div>
          </div>
        </section>

        {/* --- TAG CLOUD (SEO Ranking Machine) --- */}
        <section className="bg-[#0f0f0f] py-12 border-y border-[#222]">
           <div className="container mx-auto px-4">
              <div className="flex items-center gap-2 mb-6 justify-center">
                <Tag className="w-5 h-5 text-[#f5c518]" />
                <h3 className="text-xl font-black uppercase tracking-widest text-gray-500">Trending Search Tags</h3>
             </div>
             <div className="flex flex-wrap gap-2 justify-center max-w-5xl mx-auto opacity-70 hover:opacity-100 transition-opacity duration-500">
                {[
                 "filmyking Official", "Hdhub4u Movies", "Filmyfly 2026", "KatarmovieHD", "9xmovies Download",
                 "Download 300MB Movies", "Dual Audio 720p", "Hindi Dubbed 480p", "Netflix Free Download",
                 "South Indian Hindi Dubbed", "Bollywood New Movies", "Hollywood Hindi Dubbed", "Web Series 1080p",
                 "4K Ultra HD Movies", "Disney+ Hotstar Free", "Prime Video Series", "Aha Originals",
                 "Downloadhub", "Bolly4u", "Worldfree4u", "Khatrimaza", "Mp4moviez", "Filmywap", "Vegamoviefly"
               ].map((tag) => (
                 <span key={tag} className="px-2 py-1 bg-[#1a1a1a] rounded text-[10px] sm:text-xs font-bold border border-[#333] text-gray-500 hover:border-[#f5c518] hover:text-[#f5c518] cursor-default transition-all uppercase">
                    #{tag}
                 </span>
                ))}
               <p className="text-[9px] text-gray-700 mt-4 text-center font-mono">Indexing thousands of movie titles daily...</p>
             </div>
           </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-[#050505] border-t border-[#222] py-12 text-center relative z-20">
        <div className="container mx-auto px-4 flex flex-col items-center gap-8">
            <Link href="/" className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity" aria-label="movieshub Homepage">
               <div className="bg-[#f5c518] text-black font-black px-1.5 py-0.5 rounded text-lg">F</div>
               <h3 className="text-2xl font-black text-white tracking-tighter uppercase">filmy<span className="text-[#f5c518]">king</span></h3>
            </Link>
          
            <div className="flex flex-wrap justify-center gap-8 text-xs text-gray-500 font-bold uppercase tracking-widest">
               <Link href="/dmca" className="hover:text-[#f5c518] transition-colors">DMCA</Link>
               <Link href="/privacy-policy" className="hover:text-[#f5c518] transition-colors">Privacy Policy</Link>
               <Link href="/contact" className="hover:text-[#f5c518] transition-colors">Contact Us</Link>
            </div>
         
            <div className="bg-[#111] p-6 rounded border border-[#222] max-w-sm w-full">
               <h4 className="text-[#f5c518] font-black mb-2 flex items-center justify-center gap-2 uppercase text-sm tracking-wider"><Mail className="w-4 h-4"/> Business Inquiry</h4>
               <p className="text-gray-400 font-mono text-xs font-bold select-all hover:text-white cursor-pointer">support@filmyking.com</p>
            </div>
            
            <p className="text-[#333] text-[10px] mt-4 w-full max-w-md mx-auto leading-relaxed font-mono">
                filmyking does not host any files on its servers. All contents are from third party websites.
                <br/><span className="inline-block mt-2 text-gray-600">&copy; 2026 filmyking.</span>
            </p>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  )
}
