/**
 * URL utilities for generating SEO-friendly URLs
 */

export interface CategoryUrlMapping {
  id: number
  slug: string
  name: string
}

// Category ID to slug mappings for SEO-friendly URLs
export const CATEGORY_SLUGS: CategoryUrlMapping[] = [
  { id: 1, slug: "general-discussion", name: "General Discussion" },
  { id: 2, slug: "technical-help", name: "Technical Help" },
  { id: 3, slug: "parts-exchange", name: "Parts Exchange" },
  { id: 4, slug: "chapter-discussions", name: "Chapter Discussions" },
  { id: 5, slug: "events-meetups", name: "Events & Meetups" },
  { id: 6, slug: "restoration-projects", name: "Restoration Projects" },
]

/**
 * Generate a URL-safe slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Get category slug by ID
 */
export function getCategorySlug(categoryId: number): string | null {
  const category = CATEGORY_SLUGS.find(cat => cat.id === categoryId)
  return category?.slug || null
}

/**
 * Get category ID by slug
 */
export function getCategoryIdBySlug(slug: string): number | null {
  const category = CATEGORY_SLUGS.find(cat => cat.slug === slug)
  return category?.id || null
}

/**
 * Generate SEO-friendly forum category URL
 */
export function getForumCategoryUrl(categoryId: number): string {
  const slug = getCategorySlug(categoryId)
  if (!slug) {
    // Fallback to ID-based URL if slug not found
    return `/forum/category/${categoryId}`
  }
  return `/forum/${slug}`
}

/**
 * Generate SEO-friendly forum topic URL
 */
export function getForumTopicUrl(topicId: number, title: string, categoryId?: number): string {
  const titleSlug = generateSlug(title)
  const categorySlug = categoryId ? getCategorySlug(categoryId) : null
  
  if (categorySlug) {
    return `/forum/${categorySlug}/${titleSlug}-${topicId}`
  }
  
  return `/forum/topic/${titleSlug}-${topicId}`
}

/**
 * Parse topic ID from SEO URL
 */
export function parseTopicIdFromUrl(url: string): number | null {
  const match = url.match(/-(\d+)$/)
  return match ? parseInt(match[1], 10) : null
}

/**
 * Check if URL is a legacy format that needs redirecting
 */
export function isLegacyForumUrl(pathname: string): boolean {
  return /^\/forum\/category\/\d+$/.test(pathname) || /^\/forum\/topic\/\d+$/.test(pathname)
}

/**
 * Convert legacy URL to SEO-friendly URL
 */
export function convertLegacyUrl(pathname: string): string | null {
  // Handle category URLs: /forum/category/2 -> /forum/technical-help
  const categoryMatch = pathname.match(/^\/forum\/category\/(\d+)$/)
  if (categoryMatch) {
    const categoryId = parseInt(categoryMatch[1], 10)
    const slug = getCategorySlug(categoryId)
    return slug ? `/forum/${slug}` : null
  }
  
  // Handle topic URLs: /forum/topic/123 -> /forum/category-slug/topic-title-123
  // This would require database lookup for topic title and category, so return null for now
  // In a real implementation, you'd query the database here
  
  return null
}