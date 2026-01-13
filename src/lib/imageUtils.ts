/**
 * Image Optimization Utilities
 * Uses Supabase Storage Image Transformation API to serve optimized images
 * https://supabase.com/docs/guides/storage/serving/image-transformations
 */

interface ImageTransformOptions {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'origin';
    resize?: 'contain' | 'cover' | 'fill';
}

/**
 * Transforms a Supabase storage URL to include optimization parameters
 * This dramatically reduces image file sizes for mobile devices
 */
export function getOptimizedImageUrl(
    originalUrl: string | null | undefined,
    options: ImageTransformOptions = {}
): string {
    // Return empty string if no URL provided
    if (!originalUrl) return '';

    // Check if it's a Supabase storage URL
    const isSupabaseUrl = originalUrl.includes('supabase.co/storage/v1/object/public/');

    if (!isSupabaseUrl) {
        // For non-Supabase URLs (local assets, external URLs), return as-is
        return originalUrl;
    }

    // Default optimization settings for mobile
    const {
        width = 400,
        height,
        quality = 75,
        format = 'webp',
        resize = 'contain'
    } = options;

    // Convert public URL to render URL with transformations
    // Original: .../storage/v1/object/public/bucket/path
    // Transform: .../storage/v1/render/image/public/bucket/path?width=X&quality=Y
    const transformedUrl = originalUrl.replace(
        '/storage/v1/object/public/',
        '/storage/v1/render/image/public/'
    );

    // Build query string
    const params = new URLSearchParams();
    if (width) params.append('width', width.toString());
    if (height) params.append('height', height.toString());
    if (quality) params.append('quality', quality.toString());
    if (format && format !== 'origin') params.append('format', format);
    if (resize) params.append('resize', resize);

    // Check if URL already has query params
    const separator = transformedUrl.includes('?') ? '&' : '?';

    return `${transformedUrl}${separator}${params.toString()}`;
}

/**
 * Get thumbnail URL for product cards (small, fast loading)
 */
export function getProductThumbnail(url: string | null | undefined): string {
    return getOptimizedImageUrl(url, {
        width: 300,
        height: 300,
        quality: 70,
        format: 'webp',
        resize: 'contain'
    });
}

/**
 * Get brand logo URL (small logos)
 */
export function getBrandLogo(url: string | null | undefined): string {
    return getOptimizedImageUrl(url, {
        width: 150,
        height: 150,
        quality: 80,
        format: 'webp',
        resize: 'contain'
    });
}

/**
 * Get banner image URL optimized for device
 */
export function getBannerImage(url: string | null | undefined, isMobile: boolean = false): string {
    return getOptimizedImageUrl(url, {
        width: isMobile ? 800 : 1920,
        quality: isMobile ? 70 : 85,
        format: 'webp',
        resize: 'cover'
    });
}

/**
 * Get full product image for detail page
 */
export function getProductDetailImage(url: string | null | undefined): string {
    return getOptimizedImageUrl(url, {
        width: 800,
        quality: 85,
        format: 'webp',
        resize: 'contain'
    });
}
