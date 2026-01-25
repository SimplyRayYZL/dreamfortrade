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

        console.log(`Scraping Category URL: ${url}`);

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

        // Heuristic to find product links
        const productLinks = new Set<string>();
        const anchors = doc.querySelectorAll("a");
        const baseUrl = new URL(url);

        for (const anchor of anchors) {
            let href = anchor.getAttribute("href");
            if (!href) continue;

            // Resolve relative URLs
            try {
                // If it starts with slash or is relative, resolve it
                if (!href.startsWith('http')) {
                    href = new URL(href, baseUrl.origin).toString();
                }
            } catch (e) {
                continue;
            }

            // Standardize
            const fullUrl = href;
            const path = new URL(fullUrl).pathname;

            // Common patterns for product pages
            // springairstore.com uses /product/slug/
            // 3b-shop.com uses /product/slug/
            // generic WooCommerce: /product/
            // Shopify: /products/

            const isProduct =
                path.includes("/product/") ||
                path.includes("/products/") ||
                path.includes("/item/") ||
                path.includes("/p/") ||
                // Check if the link is inside a known product card container
                (anchor.closest('.product') || anchor.closest('.product-card') || anchor.closest('.product_item'));

            if (isProduct) { // Filter out non-product links
                // Exclude common false positives
                if (
                    path.includes("/category/") ||
                    path.includes("/cart") ||
                    path.includes("/checkout") ||
                    path.includes("/account") ||
                    path.includes("/login") ||
                    path.endsWith(".jpg") ||
                    path.endsWith(".png")
                ) {
                    continue;
                }

                productLinks.add(fullUrl);
            }
        }

        const links = Array.from(productLinks);
        console.log(`Found ${links.length} potential product links`);

        return new Response(JSON.stringify({ links, count: links.length }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (error: any) {
        console.error("Category scrape error:", error);
        return new Response(JSON.stringify({ error: error.message || 'Unknown error' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
