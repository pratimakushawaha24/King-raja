import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Lock, Eye, Cookie, Server, Shield, Info, Globe } from "lucide-react"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans selection:bg-[#f5c518] selection:text-black">
      
      {/* --- HEADER --- */}
      <header className="border-b border-[#1a1a1a] bg-[#0a0a0a]/90 backdrop-blur-xl sticky top-0 z-50 shadow-2xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-[#f5c518] text-black font-black px-2 py-0.5 rounded-md text-xl shadow-[0_0_20px_rgba(245,197,24,0.3)] group-hover:scale-110 transition-transform">F</div>
              <span className="text-2xl font-black text-white tracking-tighter uppercase">filmy<span className="text-[#f5c518]">king</span></span>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="text-gray-400 hover:text-[#f5c518] hover:bg-white/5 font-bold uppercase text-xs transition-all">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-4xl">
         
         {/* Hero Section */}
         <div className="text-center mb-20">
            <div className="inline-block p-4 rounded-full bg-[#f5c518]/10 mb-6 border border-[#f5c518]/20">
                <Lock className="w-12 h-12 text-[#f5c518]" />
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tighter mb-4">Privacy <span className="text-[#f5c518]">Policy</span></h1>
            <p className="text-gray-500 text-sm max-w-xl mx-auto font-medium leading-relaxed">
               Your privacy is our priority. At filmy king, we follow strict principles to protect your data and ensure a secure browsing experience.
            </p>
         </div>

         <div className="space-y-10 text-gray-400 leading-relaxed text-sm md:text-base">
            
            {/* General Information */}
            <section className="relative pl-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-[#f5c518]">
                <h2 className="text-xl font-black text-white mb-4 uppercase flex items-center gap-2">
                    <Globe className="w-5 h-5 text-[#f5c518]"/> General Information
                </h2>
                <p>
                 filmy king, accessible from <strong className="text-white">https://filmyking.com/</strong>, is committed to protecting the privacy of our visitors. This Privacy Policy document outlines the types of information we collect and how we utilize it to improve your experience.
                </p>
                <p className="mt-3">
                    If you have any questions about our privacy practices or require further information, please feel free to reach out to our support team.
                </p>
            </section>

            {/* Log Files Card */}
            <section className="bg-[#0a0a0a] p-8 rounded-xl border border-[#1a1a1a] shadow-inner">
                <h2 className="text-xl font-black text-white mb-4 uppercase flex items-center gap-2">
                    <Server className="w-5 h-5 text-[#f5c518]"/> Log Files & Analytics
                </h2>
                <p>
                    Movie Hub follows a standard procedure of using log files. These files log visitors when they visit the website. The information collected includes IP addresses, browser types, Internet Service Providers (ISP), date and time stamps, and referring/exit pages.
                </p>
                <div className="mt-4 flex items-start gap-3 bg-white/5 p-4 rounded-lg border border-white/5">
                    <Info className="w-5 h-5 text-[#f5c518] shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-500 leading-normal">
                        Note: This data is not linked to any information that is personally identifiable. It is used solely for analyzing trends, administering the site, and tracking user movement for optimization.
                    </p>
                </div>
            </section>

            {/* Cookies */}
            <section>
                <h2 className="text-xl font-black text-white mb-4 uppercase flex items-center gap-2">
                    <Cookie className="w-5 h-5 text-[#f5c518]"/> Cookies and Web Beacons
                </h2>
                <p>
                    Like any other professional website, <span className="text-white">filmy king</span> uses 'cookies'. These are used to store visitors' preferences and the specific pages accessed. We use this information to customize our web page content based on your browser type to provide a seamless movie browsing experience.
                </p>
            </section>

            {/* Google DART */}
            <section className="bg-gradient-to-br from-[#111] to-[#050505] p-8 rounded-xl border-l-4 border-[#0088cc] shadow-xl">
                <h2 className="text-xl font-black text-white mb-4 uppercase flex items-center gap-2">
                    <Eye className="w-5 h-5 text-[#0088cc]"/> Google DoubleClick DART Cookie
                </h2>
                <p className="mb-4">
                    Google, as a third-party vendor, uses DART cookies to serve ads based on your visit to <span className="text-white font-bold tracking-tight">filmy king</span> and other sites on the internet.
                </p>
                <a 
                    href="https://policies.google.com/technologies/ads" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-[#0088cc]/10 hover:bg-[#0088cc]/20 text-[#0088cc] px-4 py-2 rounded-full text-xs font-bold transition-all border border-[#0088cc]/20"
                >
                    Manage Google Ad Settings →
                </a>
            </section>

            {/* Rights Sections */}
            <div className="grid md:grid-cols-2 gap-8">
                <section className="bg-[#0a0a0a] p-6 rounded-xl border border-[#1a1a1a]">
                    <h2 className="text-lg font-black text-white mb-4 uppercase border-b border-[#1a1a1a] pb-2">CCPA Privacy Rights</h2>
                    <ul className="space-y-3 text-xs md:text-sm text-gray-500">
                        <li className="flex gap-2"><span>•</span> Request disclosure of collected data categories.</li>
                        <li className="flex gap-2"><span>•</span> Request deletion of any personal data collected.</li>
                        <li className="flex gap-2"><span>•</span> Request that a business does not sell your personal data.</li>
                    </ul>
                </section>

                <section className="bg-[#0a0a0a] p-6 rounded-xl border border-[#1a1a1a]">
                    <h2 className="text-lg font-black text-white mb-4 uppercase border-b border-[#1a1a1a] pb-2">GDPR Data Protection</h2>
                    <ul className="space-y-3 text-xs md:text-sm text-gray-500">
                        <li className="flex gap-2"><span>•</span> Right to access and request copies of data.</li>
                        <li className="flex gap-2"><span>•</span> Right to rectify inaccurate information.</li>
                        <li className="flex gap-2"><span>•</span> Right to erasure and data portability.</li>
                    </ul>
                </section>
            </div>

            {/* Children's Info */}
            <section className="pt-8 border-t border-[#1a1a1a]">
                <h2 className="text-xl font-black text-white mb-4 uppercase flex items-center gap-2">
                    <Shield className="w-5 h-5 text-red-500"/> Children&apos;s Information
                </h2>
                <p>
                  filmy king does not knowingly collect any Personal Identifiable Information from children under the age of 13. We encourage parents to monitor their online activity. If you believe your child has provided such information, contact us immediately for prompt removal.
                </p>
            </section>

         </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="border-t border-[#1a1a1a] mt-20 py-12 text-center bg-[#030303]">
          <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2">
                 <div className="bg-[#f5c518] text-black font-black px-1.5 py-0.5 rounded text-xs">F</div>
                 <span className="text-sm font-black text-white tracking-tighter uppercase">filmy<span className="text-[#f5c518]">king</span></span>
              </div>
              <p className="text-gray-700 text-[10px] font-bold uppercase tracking-[0.3em]">
                &copy; {new Date().getFullYear()} Movie Hub Media Group • filmyking.com
              </p>
          </div>
      </footer>
    </div>
  )
}
