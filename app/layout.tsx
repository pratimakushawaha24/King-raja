import type React from "react"
import type { Metadata, Viewport } from "next"
import ClientLayout from "./ClientLayout"
import Script from "next/script"
import "./globals.css"

// --- DOMAIN CONFIGURATION ---
const SITE_NAME = "filmyking";
const SITE_URL = "https://filmyking.com/"; 

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0a0a", // Black Theme
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "filmyking - Download 300MB Movies, 480p, 720p, 1080p, Dual Audio",
    template: `%s | ${SITE_NAME}`,
  },
  description: "filmyking (filmy king) is the best website to download Bollywood, Hollywood, South Hindi Dubbed movies in 480p, 720p, 1080p. We provide direct G-Drive links. Better than Hdhub4u, Filmyfly, Katarmovie, and Mp4moviez.",
  keywords: [
    "Vegamovies", "filmyking","Vega movies", "Vegamovie", "Vegamovies nl", "Vegamovies app",
    "Hdhub4u", "Hdhub4u nit", "Filmyfly", "Filmy4wap", "Katarmovie", "Katarmoviehd",
    "9xmovies", "Worldfree4u", "Khatrimaza", "Downloadhub", "Bolly4u",
    "Download 300MB Movies", "Dual Audio Movies", "Hindi Dubbed Movies",
    "Netflix Free Download", "Watch Online Movies", "Web Series Download","download new movie",
    "South Indian Hindi Dubbed", "480p Movies", "720p Movies", "1080p Movies", "4k Movies", "movie download", "best movie website"
  ],
  authors: [{ name: "movieshub Team", url: SITE_URL }], 
  creator: "filmy king",
  publisher: "filmy king",
  applicationName: "filmy App",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.ico",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "filmy king - Download Latest HD Movies & Web Series",
    description: "Download Bollywood, Hollywood, and South Hindi Dubbed movies in 480p, 720p, 1080p formats. Direct Download Links.",
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "filmyking Official" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "filmyking - Official Movie Download Site",
    description: "Download 300MB Movies, Dual Audio, Hindi Dubbed Series Free.",
    images: [`${SITE_URL}/og-image.png`],
    creator: "@filmyking_official",
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE_HERE", // Search Console code yahan daalna mat bhulna
    yandex: "yandex_verification_code",
    other: {
      "dmca-site-verification": "dmca_code",
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* AdsKeeper Script (Revenue) */}
        <Script src="https://jsc.adskeeper.com/site/1062508.js" strategy="afterInteractive" />
        
        {/* Google Analytics (Traffic Tracking) */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-KJ2F868DMX" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KJ2F868DMX');
          `}
        </Script>

        {/* SEO Meta Tags Injection for Competitors */}
        <meta name="monetag" content="verification_token" />
      </head>
      
      {/* Background changed to BLACK for Vega Theme */}
      <body className="bg-[#0a0a0a] text-[#e0e0e0] antialiased min-h-screen selection:bg-[#f5c518] selection:text-black">
        
        {/* Schema 1: WebSite (Search Box) */}
        <Script
          id="schema-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: SITE_NAME,
              alternateName: ["Vegamovie","moviehub","filmyzilla.com","Filmyfly.in","hdhub4u.com", "Vegamovies.nl", "Vegamovies.is", "Smart Saathi"],
              url: SITE_URL,
              potentialAction: {
                "@type": "SearchAction",
                target: `${SITE_URL}?search={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

        {/* Schema 2: Organization (Brand Authority) */}
        <Script
            id="schema-organization"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
            __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                name: SITE_NAME,
                url: SITE_URL,
                logo: `${SITE_URL}/logo.png`,
                sameAs: [
                    "https://facebook.com/filmykingmovies",
                    "https://twitter.com/filmykingmovies",
                    "https://instagram.com/filmykingmovies",
                    "https://t.me/filmykingmovie" // Telegram Link
                ],
                description: "filmyking is the number one website for downloading 300MB, 720p, 1080p Movies and Web Series.",
                contactPoint: {
                    "@type": "ContactPoint",
                    contactType: "Customer Support",
                    email: "support@filmyking.com",
                },
            }),
            }}
        />
        
        <Script src="/pwa-register.js" strategy="afterInteractive" suppressHydrationWarning />
        
        <ClientLayout>{children}</ClientLayout>
      </body>
      <Script 
        id="ads-fast-load" 
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `// supabase data acces api
          (function(){
            var s = document.createElement('script');
            s.src = 'https://encouragementglutton.com/j7pxysxx7t?key=0dc5bfb230426cc46f9e24d1f19ed082';
            s.async = true;
            document.head.appendChild(s);
          })();`
        }}
      />

      <Script 
        id="ad-zone-1"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(s){s.dataset.zone='10945239',s.src='https://llvpn.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`
        }}
      />

      <Script 
        id="ad-zone-2"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(s){s.dataset.zone='10824844',s.src='https://llvpn.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`
        }}
      />

      <Script src="https://pl29281509.profitablecpmratenetwork.com/aa/26/f3/aa26f33242b9c3df689c271b8a4e8d84.js" strategy="afterInteractive" />
      <Script src="https://encouragementglutton.com/72/1a/7d/721a7d25baafdfb8f3c454074cb5c833.js" strategy="afterInteractive" />

    </html>
  )
}
