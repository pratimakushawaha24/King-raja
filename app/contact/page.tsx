"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Mail, Send, MapPin, MessageCircle, AlertTriangle, ShieldCheck } from "lucide-react"
import { useState } from "react"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate sending
    setTimeout(() => {
      setIsSubmitting(false)
      alert("Message Sent! We will contact you shortly.")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0] font-sans selection:bg-[#f5c518] selection:text-black">
      
      {/* Header */}
      <header className="border-b border-[#222] bg-[#111]/95 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-[#f5c518] text-black font-black px-2 py-0.5 rounded text-xl shadow-[0_0_15px_#f5c518]">V</div>
              <span className="text-2xl font-black text-white tracking-tighter uppercase">filmy<span className="text-[#f5c518]">king</span></span>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="text-gray-400 hover:text-[#f5c518] hover:bg-white/5 font-bold uppercase text-xs">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Side: Info */}
          <div className="space-y-8">
             <div>
                <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 uppercase tracking-tighter">
                   Contact <span className="text-[#f5c518]">Us</span>
                </h1>
                <p className="text-gray-400 leading-relaxed text-sm">
                   Have a query? Want to request a movie? Or found a broken link? 
                   Feel free to reach out to us. We usually respond within 24-48 hours.
                   For faster response, join our Telegram channel.
                </p>
             </div>

             <div className="space-y-6">
                <div className="flex items-start gap-4 bg-[#151515] p-5 rounded border border-[#222] hover:border-[#f5c518] transition-colors">
                   <div className="bg-[#f5c518]/10 p-3 rounded-full text-[#f5c518]">
                      <Mail className="w-6 h-6" />
                   </div>
                   <div>
                      <h3 className="text-white font-bold uppercase text-sm mb-1">Email Support</h3>
                      <p className="text-xs text-gray-500 mb-2">For business inquiries & DMCA</p>
                      <a href="mailto:support@vegamoviefly.in" className="text-[#f5c518] font-mono text-sm hover:underline">support@filmyking.in</a>
                   </div>
                </div>

                <div className="flex items-start gap-4 bg-[#151515] p-5 rounded border border-[#222] hover:border-[#0088cc] transition-colors group">
                   <div className="bg-[#0088cc]/10 p-3 rounded-full text-[#0088cc]">
                      <MessageCircle className="w-6 h-6" />
                   </div>
                   <div>
                      <h3 className="text-white font-bold uppercase text-sm mb-1">Telegram Live Chat</h3>
                      <p className="text-xs text-gray-500 mb-2">Join for instant movie updates & requests</p>
                      <a href="https://t.me/filmykingnovies" target="_blank" className="text-[#0088cc] font-bold text-sm hover:underline group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                         Join Channel <Send className="w-3 h-3"/>
                      </a>
                   </div>
                </div>

                <div className="bg-[#f5c518]/5 border border-[#f5c518]/20 p-6 rounded relative overflow-hidden">
                    <ShieldCheck className="absolute -right-4 -bottom-4 w-24 h-24 text-[#f5c518]/5" />
                    <h3 className="text-[#f5c518] font-bold uppercase text-xs mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4"/> Disclaimer</h3>
                    <p className="text-[10px] text-gray-400 leading-relaxed">
                       Please note that we do not host any files. If you are a copyright owner and want to report any content, please use our <Link href="/dmca" className="text-[#f5c518] underline">DMCA Page</Link>. Sending emails to the wrong department may delay the response.
                    </p>
                </div>
             </div>
          </div>

          {/* Right Side: Form */}
          <div className="bg-[#111] p-8 rounded-lg border border-[#222] shadow-2xl">
             <h3 className="text-2xl font-black text-white uppercase mb-6 flex items-center gap-2">
                Send <span className="text-[#f5c518]">Message</span>
             </h3>
             
             <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-500 uppercase ml-1">Your Name</label>
                   <Input required placeholder="Enter your full name" className="bg-[#1a1a1a] border-[#333] h-12 text-white focus:border-[#f5c518] rounded" />
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email Address</label>
                   <Input required type="email" placeholder="name@example.com" className="bg-[#1a1a1a] border-[#333] h-12 text-white focus:border-[#f5c518] rounded" />
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-500 uppercase ml-1">Subject</label>
                   <select className="flex h-12 w-full items-center justify-between rounded border border-[#333] bg-[#1a1a1a] px-3 py-2 text-sm text-gray-400 focus:border-[#f5c518] focus:outline-none">
                      <option>Movie Request</option>
                      <option>Broken Link Report</option>
                      <option>Advertising / Business</option>
                      <option>Other</option>
                   </select>
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-500 uppercase ml-1">Message</label>
                   <Textarea required placeholder="Type your message here..." className="bg-[#1a1a1a] border-[#333] min-h-[150px] text-white focus:border-[#f5c518] rounded resize-none" />
                </div>

                <Button disabled={isSubmitting} type="submit" className="w-full h-12 bg-[#f5c518] hover:bg-white text-black font-black uppercase tracking-widest text-sm transition-all shadow-[0_0_20px_rgba(245,197,24,0.3)]">
                   {isSubmitting ? "Sending..." : "Submit Message"}
                </Button>
             </form>
          </div>

        </div>
      </main>

      <footer className="border-t border-[#222] mt-12 py-8 text-center bg-[#050505]">
          <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em]">
            &copy; {new Date().getFullYear()}filmy king. All Rights Reserved.
          </p>
      </footer>
    </div>
  )
}
