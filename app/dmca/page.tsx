import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShieldAlert, Gavel, FileWarning, AlertOctagon } from "lucide-react"

export default function DmcaPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0] font-sans selection:bg-[#f5c518] selection:text-black">
      
      {/* --- Header --- */}
      <header className="border-b border-[#222] bg-[#111]/95 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-[#f5c518] text-black font-black px-2 py-0.5 rounded text-xl shadow-[0_0_10px_#f5c518]">F</div>
              <span className="text-2xl font-black text-white tracking-tighter uppercase">filmy<span className="text-[#f5c518]">king</span></span>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="text-gray-400 hover:text-[#f5c518] hover:bg-white/5 font-bold uppercase text-xs">
              <ArrowLeft className="w-4 h-4 mr-2" /> Home
            </Button>
          </Link>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="container mx-auto px-4 py-12 md:py-16 max-w-4xl overflow-hidden">
         
         <div className="mb-10 border-l-4 md:border-l-8 border-[#f5c518] pl-4 md:pl-6">
            <h1 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter mb-2">DMCA <span className="text-[#f5c518]">Policy</span></h1>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] md:text-sm">Digital Millennium Copyright Act Notice</p>
         </div>

         <div className="space-y-8 md:space-y-10 text-gray-300 leading-relaxed text-sm md:text-base text-justify">
            
            {/* Disclaimer Block */}
            <section className="bg-[#111] p-5 md:p-8 rounded border border-[#222]">
                <div className="flex items-center gap-3 mb-4 text-[#f5c518]">
                    <ShieldAlert className="w-6 h-6 shrink-0" />
                    <h2 className="text-lg md:text-xl font-black uppercase">Important Disclaimer</h2>
                </div>
                <p className="mb-4">
                    <strong>filmyking (filmyking.in)</strong> does not host any files on its servers. All contents are provided by non-affiliated third parties. We strictly monitor all content to ensure it aligns with copyright laws.
                </p>
                <p>
                   filmyking is an Online Service Provider under Title II of the Digital Millennium Copyright Act, 17 U.S.C. Section 512 ("DMCA"). We treat copyright infringement very seriously and will vigorously protect the rights of legal copyright owners.
                </p>
            </section>

            <section>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-2"><Gavel className="w-5 h-5 text-[#f5c518] shrink-0"/> Copyright Infringement Notification</h2>
                <p className="mb-4">
                    If you are the copyright owner of content which appears on the Vegamovies website and you did not authorize the use of the content you must notify us in writing in order for us to identify the allegedly infringing content and take action.
                </p>
                <p className="mb-4">
                    We will be unable to take any action if you do not provide us with the required information, so please fill out all fields accurately and completely. Alternatively, you may make a written notice via email to the DMCA Agent as listed below.
                </p>
            </section>

            <section className="bg-[#151515] p-5 md:p-6 rounded border-l-4 border-red-600">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><FileWarning className="w-5 h-5 text-red-500 shrink-0"/> Requirements for Takedown Notice</h2>
                <p className="mb-2 text-xs uppercase font-bold text-gray-500">Your written notice must include the following:</p>
                <ul className="list-disc pl-5 space-y-2 text-gray-400 text-xs md:text-sm">
                    <li>Specific identification of the copyrighted work which you are alleging to have been infringed.</li>
                    <li>Specific identification of the location (URL) and description of the material that is claimed to be infringing.</li>
                    <li>Information reasonably sufficient to allow us to contact the complaining party (Email/Phone).</li>
                    <li>A statement that the complaining party has a good faith belief that use of the material is not authorized.</li>
                    <li>A statement that the information in the notification is accurate, under penalty of perjury.</li>
                </ul>
            </section>

            {/* Email Section (Fixed Overflow Issue) */}
            <section className="bg-[#f5c518]/10 border border-[#f5c518]/30 p-6 md:p-8 rounded text-center w-full">
                <AlertOctagon className="w-10 h-10 md:w-12 md:h-12 text-[#f5c518] mx-auto mb-4" />
                <h2 className="text-xl md:text-2xl font-black text-white uppercase mb-2">Send Notice To</h2>
                <p className="text-gray-400 mb-6 text-xs md:text-sm">
                    Please allow 1-3 business days for an email response.
                </p>
                
                {/* Break-all ensures long emails don't overflow on mobile */}
                <div className="max-w-full overflow-hidden">
                    <a href="mailto:dmca@vegamoviefly.in" className="inline-block w-full max-w-md bg-[#f5c518] hover:bg-white text-black font-black text-sm md:text-lg px-4 py-3 md:px-8 md:py-4 rounded shadow-lg uppercase tracking-widest transition-all break-all whitespace-normal">
                        dmca@filmyking.com
                    </a>
                </div>
            </section>

         </div>
      </main>

      <footer className="border-t border-[#222] mt-12 py-8 text-center bg-[#050505]">
          <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em]">
            &copy; {new Date().getFullYear()} filmyking.com. All Rights Reserved.
          </p>
      </footer>
    </div>
  )
}
