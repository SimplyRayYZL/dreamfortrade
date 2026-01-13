/**
 * Image Utilities
 * Note: Supabase Image Transformation requires Pro Plan.
 * For now, these functions return original URLs.
 * When upgrading to Pro, enable the transformation logic.
 */

/**
 * Returns optimized image URL (currently returns original since Pro plan required)
 */
export function getOptimizedImageUrl(originalUrl: string | null | undefined): string {
    if (!originalUrl) return '';
    return originalUrl;
}

/**
 * Get thumbnail URL for product cards
 */
export function getProductThumbnail(url: string | null | undefined): string {
    return getOptimizedImageUrl(url);
}

/**
 * Get brand logo URL
 */
export function getBrandLogo(url: string | null | undefined): string {
    return getOptimizedImageUrl(url);
}

/**
 * Get banner image URL
 */
export function getBannerImage(url: string | null | undefined, _isMobile: boolean = false): string {
    return getOptimizedImageUrl(url);
}

/**
 * Get full product image for detail page
 */
export function getProductDetailImage(url: string | null | undefined): string {
    return getOptimizedImageUrl(url);
}
