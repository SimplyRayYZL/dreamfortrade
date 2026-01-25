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

        // Extract Metadata (OpenGraph & Schema.org preference)
        const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content');
        const twitterTitle = doc.querySelector('meta[name="twitter:title"]')?.getAttribute('content');
        const titleTag = doc.querySelector('title')?.textContent;
        const h1 = doc.querySelector('h1')?.textContent;

        const ogDescription = doc.querySelector('meta[property="og:description"]')?.getAttribute('content');
        const twitterDescription = doc.querySelector('meta[name="twitter:description"]')?.getAttribute('content');
        const descriptionTag = doc.querySelector('meta[name="description"]')?.getAttribute('content');

        const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content');
        const twitterImage = doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content');

        // Attempt to find price (heuristic)
        let price = 0;
        const priceMeta = doc.querySelector('meta[property="product:price:amount"]')?.getAttribute('content');

        if (priceMeta) {
            price = parseFloat(priceMeta);
        } else {
            const bodyText = doc.body?.innerText || "";
            const priceMatch = bodyText.match(/(\d{1,3}(,\d{3})*(\.\d+)?)(\s?ج\.م|\s?EGP|\s?LE)/);
            if (priceMatch) {
                price = parseFloat(priceMatch[1].replace(/,/g, ''));
            }
        }

        const data = {
            name: ogTitle || twitterTitle || h1 || titleTag || "",
            description: ogDescription || twitterDescription || descriptionTag || "",
            image_url: ogImage || twitterImage || "",
            price: price || 0,
        };

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
