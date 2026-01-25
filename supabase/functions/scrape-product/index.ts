// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
import { DOMParser } from "deno_dom";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { url } = await req.json();

        if (!url) {
            return new Response(JSON.stringify({ error: 'URL is required' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        console.log(`Scraping URL: ${url}`);

        // Fetch the HTML content
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch URL: ${response.statusText}`);
        }

        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, "text/html");

        if (!doc) {
            throw new Error("Failed to parse HTML");
        }

        // Helper to get content from multiple selectors
        const getContent = (selectors: string[]) => {
            for (const selector of selectors) {
                const element = doc.querySelector(selector);
                if (element) {
                    if (element.tagName === 'META') {
                        const content = element.getAttribute('content');
                        if (content) return content.trim();
                    }
                    const text = element.textContent;
                    if (text && text.trim().length > 0) return text.trim();
                }
            }
            return null;
        };

        // Helper to get image URL
        const getImage = (selectors: string[]) => {
            for (const selector of selectors) {
                const element = doc.querySelector(selector);
                if (element) {
                    if (element.tagName === 'META') {
                        return element.getAttribute('content');
                    }
                    if (element.tagName === 'IMG') {
                        return element.getAttribute('src') || element.getAttribute('data-src');
                    }
                }
            }
            return null;
        };

        // 1. Title Extraction
        const name = getContent([
            'meta[property="og:title"]',
            'meta[name="twitter:title"]',
            'h1.product_title',
            'h1.product-title',
            'h1.entry-title',
            'h1',
            'title'
        ]) || "";

        // 2. Description Extraction
        const description = getContent([
            'meta[property="og:description"]',
            'meta[name="twitter:description"]',
            'meta[name="description"]',
            '.product-short-description',
            '.woocommerce-product-details__short-description',
            '.description',
            '#description'
        ]) || "";

        // 3. Image Extraction
        let image_url = getImage([
            'meta[property="og:image"]',
            'meta[name="twitter:image"]',
            '.woocommerce-product-gallery__image img',
            '.product-image img',
            '.images img',
            'img[itemprop="image"]'
        ]) || "";

        // Handle relative URLs
        if (image_url && !image_url.startsWith('http')) {
            try {
                image_url = new URL(image_url, url).toString();
            } catch (e) {
                console.warn("Failed to resolve relative image URL", e);
            }
        }

        // 4. Price Extraction (The tricky part)
        let price = 0;

        // Strategy A: Meta tags (most reliable)
        const priceMeta = getContent([
            'meta[property="product:price:amount"]',
            'meta[itemprop="price"]',
            'meta[name="price"]'
        ]);

        if (priceMeta) {
            price = parseFloat(priceMeta);
        }

        // Strategy B: Common E-commerce classes
        if (!price || isNaN(price)) {
            const priceSelectors = [
                '.price .amount', // WooCommerce
                '.product-price',
                '.offer-price',
                '.price',
                '[itemprop="price"]'
            ];

            for (const selector of priceSelectors) {
                const el = doc.querySelector(selector);
                if (el) {
                    // Get only the first text node usually, or clean the whole string
                    const rawPrice = el.textContent || "";
                    // Regex to extract the first valid number group (allowing for commas as thousands separators)
                    const match = rawPrice.match(/(\d{1,3}(?:[,\s]\d{3})*(?:\.\d+)?)/);
                    if (match) {
                        // Remove commas and spaces before parsing
                        const cleanNum = match[0].replace(/[,\s]/g, '');
                        const parsed = parseFloat(cleanNum);
                        if (!isNaN(parsed) && parsed > 0) {
                            price = parsed;
                            break;
                        }
                    }
                }
            }
        }

        // Strategy C: Regex Search in Body (Last Resort)
        if (!price || isNaN(price)) {
            const bodyText = doc.body?.textContent || "";
            // Search for "EGP 15,000" or "15000 ج.م" patterns near the top of the body (first 5000 chars)
            const snippet = bodyText.substring(0, 10000);
            const priceMatch = snippet.match(/(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:ج\.م|L\.E|EGP|جنيه)/i) ||
                snippet.match(/(?:ج\.م|L\.E|EGP|جنيه)\s*(\d{1,3}(?:,\d{3})*(?:\.\d+)?)/i);

            if (priceMatch) {
                const cleanNum = priceMatch[1].replace(/,/g, '');
                price = parseFloat(cleanNum);
            }
        }

        const data = {
            name: name.trim(),
            description: description.trim(),
            image_url: image_url,
            price: price || 0,
        };

        console.log(`Scraped Data:`, data);

        return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (error: any) {
        console.error("Scrape error:", error);
        return new Response(JSON.stringify({ error: error.message || 'Unknown error' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
