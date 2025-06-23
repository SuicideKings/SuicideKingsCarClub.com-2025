/**
 * Image optimization utility functions
 *
 * These functions help with image optimization and processing
 * to ensure faster page loading times across the site.
 */

/**
 * Get optimized image size based on viewport
 * @param defaultSize Default image size
 * @param viewportWidth Current viewport width
 * @returns Optimized image size
 */
export function getOptimizedImageSize(defaultSize: number, viewportWidth: number): number {
  if (viewportWidth < 640) {
    return Math.round(defaultSize * 0.5)
  } else if (viewportWidth < 1024) {
    return Math.round(defaultSize * 0.75)
  }
  return defaultSize
}

/**
 * Generate responsive image sizes string for Next.js Image component
 * @param sizes Array of breakpoints and sizes
 * @returns Sizes string for Next.js Image component
 */
export function generateResponsiveSizes(sizes: Array<{ breakpoint: number; size: string }>): string {
  return sizes.map(({ breakpoint, size }) => `(max-width: ${breakpoint}px) ${size}`).join(", ")
}

/**
 * Calculate optimal image quality based on connection speed
 * This is a placeholder function that would normally use the Network Information API
 * @returns Optimal image quality (1-100)
 */
export function getOptimalImageQuality(): number {
  // In a real implementation, this would check connection speed
  // For now, return a reasonable default
  return 85
}
