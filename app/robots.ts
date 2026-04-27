import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  // ✅ NEW DOMAIN
  const BASE_URL = "https://www.movieshub.in"

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",      // Admin panel hide rahega
        "/private",    // Private folders hide rahenge
        "/search",     // Search results index nahi honge (Duplicate content se bachne ke liye)
        "/*?*",        // Query parameters (?category=, ?sort=) ignore honge taaki "Poor URL" ka issue na aaye
      ],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
