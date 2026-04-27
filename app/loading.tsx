"use client"

import Image from "next/image"

export default function RootLoading() {
  return (
    // Main Container -filmy king
    <div className="relative min-h-screen w-full bg-[#0a0a0a] flex flex-col items-center justify-center overflow-hidden">
      
      {/* Background Glow (Yellow Ambient) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
         {/* Center Yellow Glow */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#f5c518]/5 rounded-full blur-[100px] animate-pulse" />
      </div>
      
      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col items-center space-y-6">
        
        {/* LOGO ANIMATION */}
        <div className="relative w-24 h-24 flex items-center justify-center">
            {/* Spinning Ring */}
            <div className="absolute inset-0 border-2 border-t-[#f5c518] border-r-[#f5c518]/50 border-b-transparent border-l-transparent rounded-full animate-spin" />
            
            {/* Logo Box */}
            <div className="bg-[#f5c518] text-black font-black text-4xl w-16 h-16 rounded flex items-center justify-center shadow-[0_0_30px_rgba(245,197,24,0.4)] animate-bounce">
                F
            </div>
        </div>

        {/* Text Section */}
        <div className="text-center">
          <h1 className="text-3xl font-black tracking-tighter text-white uppercase mb-2">
            filmy<span className="text-[#f5c518]">king</span>
          </h1>
          
          {/* Custom Loading Bar */}
          <div className="w-32 h-1 bg-[#222] rounded-full overflow-hidden mx-auto mt-4 relative">
              <div className="absolute inset-0 bg-[#f5c518] animate-[loading_1.5s_ease-in-out_infinite]" style={{width: '50%'}}></div>
          </div>
          
          <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] font-bold mt-4 animate-pulse">
            Loading Content...
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  )
}
