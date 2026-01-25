
const SUPABASE_URL = "https://ddebombdcqzjwtmvbrbb.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZWJvbWJkY3F6and0bXZicmJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MTEzNTIsImV4cCI6MjA4MzI4NzM1Mn0.aMR4-g3Oxt4PTdBVXIzUV_V7fLeTtYLYoDnX7f1nnBc";

async function invoke(functionName, body) {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/${functionName}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${ANON_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        throw new Error(`Function ${functionName} failed: ${response.status} ${await response.text()}`);
    }
    return response.json();
}

async function run() {
    try {
        const categoryUrl = "https://springairstore.com/product-category/haier/";
        console.error(`Fetching category locally: ${categoryUrl}`);

        const response = await fetch(categoryUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`Local fetch failed: ${response.status}`);
        }

        const html = await response.text();
        // Regex to find product links
        const linkRegex = /href="([^"]*\/product\/[^"]*)"/g;
        const links = new Set();
        let match;
        while ((match = linkRegex.exec(html)) !== null) {
            let link = match[1];
            if (!link.startsWith('http')) {
                if (link.startsWith('/')) {
                    link = 'https://springairstore.com' + link;
                }
            }
            links.add(link);
        }

        const productLinks = Array.from(links).filter(l => !l.includes('/page/') && !l.includes('add-to-cart'));
        console.error(`Found ${productLinks.length} product links.`);

        const products = [];

        for (const link of productLinks) {
            console.error(`Scraping product: ${link}`);
            try {
                const product = await invoke('scrape-product', { url: link });
                if (product.error) {
                    console.error(`API Error for ${link}: ${product.error}`);
                    continue;
                }
                product.scrape_url = link;
                products.push(product);
                // small delay
                await new Promise(r => setTimeout(r, 1000));
            } catch (e) {
                console.error(`Failed to scrape ${link}:`, e.message);
            }
        }

        console.error(`Scraped ${products.length} products. Importing to DB...`);

        try {
            const result = await invoke('import-products', {
                products: products,
                brand_name: "Haier"
            });
            console.log("Import Result:", JSON.stringify(result, null, 2));
        } catch (err) {
            console.error("Import failed:", err.message);
        }

    } catch (e) {
        console.error("Script failed:", e);
        process.exit(1);
    }
}

run();
