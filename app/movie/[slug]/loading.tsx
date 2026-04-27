"use client"

import { Film, Loader2 } from "lucide-react"

export default function MovieLoading() {
  return (
    // Background: Deep Black Cinema Theme
    <div className="relative min-h-screen w-full bg-[#050505] flex flex-col items-center justify-center overflow-hidden z-50">
      
      {/* 1. TOP SPOTLIGHT EFFECT (Yellowish Glow) */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[60vh] h-[60vh] bg-gradient-to-b from-[#f5c518]/10 via-white/5 to-transparent rounded-full blur-[80px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center">
        
        {/* 2. ANIMATED FILM REEL ICON */}
        <div className="relative mb-8">
            {/* Rotating Dashed Circle */}
            <div className="absolute inset-[-15px] border border-dashed border-[#f5c518]/30 rounded-full animate-[spin_8s_linear_infinite]" />
            
            {/* Main Circle */}
            <div className="w-24 h-24 bg-[#111] border border-[#f5c518]/20 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(245,197,24,0.15)] relative">
                <Film className="w-10 h-10 text-[#f5c518] animate-pulse drop-shadow-[0_0_10px_rgba(245,197,24,0.8)]" />
                
                {/* Orbiting Dot (Yellow) */}
                <div className="absolute inset-0 animate-spin">
                    <div className="w-2 h-2 bg-[#f5c518] rounded-full absolute top-2 left-1/2 -translate-x-1/2 shadow-[0_0_10px_#f5c518]"></div>
                </div>
            </div>
        </div>

        {/* 3. TEXT ANIMATION */}
        <div className="text-center space-y-3">
            <h2 className="text-2xl font-black uppercase tracking-wide text-white">
                Fetching <span className="text-[#f5c518] animate-pulse">filmyking</span>
            </h2>
            
            <div className="flex items-center justify-center gap-2 text-gray-500 text-[10px] uppercase tracking-[0.2em] font-mono">
                <Loader2 className="w-3 h-3 animate-spin text-[#f5c518]" />
                <span>Preparing High Speed Link</span>
            </div>
        </div>
        
        {/* 4. Bounce Dots Loader */}
        <div className="mt-8 flex gap-2">
            <div className="w-2 h-2 rounded-full bg-[#f5c518] animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 rounded-full bg-[#f5c518] animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 rounded-full bg-[#f5c518] animate-bounce"></div>
        </div>

      </div>
    </div>
  )
}
