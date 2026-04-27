"use server"

import { revalidatePath } from "next/cache"

// Ye function pure website ka cache clear karega
export async function refreshWebsite() {
  try {
    // 'layout' parameter se Home, Movie Page, sab refresh ho jayenge
    revalidatePath("/", "layout")
    return { success: true }
  } catch (error) {
    console.error("Cache clear error:", error)
    return { success: false }
  }
}
