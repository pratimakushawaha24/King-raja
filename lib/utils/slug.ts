export function generateSlug(title: string, year?: string): string {
  // Convert to lowercase and remove special characters
  let slug = title
    .toLowerCase()
    .trim()
    // Replace spaces and special chars with hyphens
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "")

  // Append year if provided
  if (year) {
    slug = `${slug}-${year}`
  }

  return slug
}

export function generateMovieUrl(movie: { id: number; title: string; year: string; slug?: string }): string {
  // If slug exists in database, use it
  if (movie.slug) {
    return `/movie/${movie.slug}`
  }

  // Otherwise generate slug on the fly from title and year
  const generatedSlug = generateSlug(movie.title, movie.year)
  return `/movie/${movie.id}-${generatedSlug}`
}
