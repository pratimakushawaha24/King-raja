import { Skeleton } from "@/components/ui/skeleton"

export default function HomeLoading() {
  return (
    // Background updated to Vegamovies Black
    <div className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0]">
      
      {/* --- HEADER SKELETON --- */}
      <div className="border-b border-[#222] bg-[#111] h-16 px-4 flex justify-between items-center sticky top-0 z-50">
        {/* Logo Area */}
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#222] rounded animate-pulse" />
            <div className="w-32 h-6 bg-[#222] rounded animate-pulse hidden md:block" />
        </div>
        
        {/* Search Bar Area */}
        <div className="flex gap-4">
            <div className="w-48 h-9 bg-[#222] rounded-full animate-pulse hidden md:block" />
            <div className="w-8 h-8 bg-[#222] rounded-full animate-pulse" />
        </div>
      </div>

      {/* --- HERO SECTION SKELETON --- */}
      <div className="w-full h-[50vh] md:h-[60vh] bg-[#111] animate-pulse relative border-b border-[#222]">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        
        <div className="absolute bottom-8 left-4 md:left-10 space-y-4 max-w-xl">
           {/* Badge */}
           <div className="w-20 h-5 bg-[#222] rounded-full" />
           {/* Title */}
           <div className="w-3/4 md:w-96 h-8 md:h-12 bg-[#222] rounded" />
           {/* Meta Info */}
           <div className="flex gap-3">
               <div className="w-12 h-4 bg-[#222] rounded" />
               <div className="w-12 h-4 bg-[#222] rounded" />
               <div className="w-20 h-4 bg-[#222] rounded" />
           </div>
        </div>
      </div>

      {/* --- MOVIE GRID SKELETON --- */}
      <div className="container mx-auto px-4 py-8">
        {/* Section Title */}
        <div className="flex items-end gap-3 mb-6 border-l-4 border-[#222] pl-4">
            <div className="space-y-2">
                <div className="w-48 h-8 bg-[#222] rounded animate-pulse" />
                <div className="w-32 h-3 bg-[#222] rounded animate-pulse" />
            </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2 group">
              {/* Poster Card */}
              <div className="aspect-[2/3] w-full bg-[#151515] rounded-md animate-pulse border border-[#222] relative overflow-hidden">
                  {/* Subtle Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#222]/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
              </div>
              
              {/* Text Lines */}
              <div className="w-3/4 h-3 bg-[#1a1a1a] rounded" />
              <div className="w-1/2 h-2 bg-[#1a1a1a] rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
