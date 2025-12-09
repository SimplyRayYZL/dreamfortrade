import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Brand category URLs on the website
const BRAND_CATEGORY_URLS: Record<string, string> = {
  "Tornado": "https://dreamfortrade.com/product-category/%d8%aa%d9%83%d9%8a%d9%8a%d9%81-%d8%aa%d9%88%d8%b1%d9%86%d9%8a%d8%af%d9%88/",
  "General": "https://dreamfortrade.com/product-category/%d8%aa%d9%83%d9%8a%d9%8a%d9%81-%d8%ac%d9%86%d8%b1%d8%a7%d9%84/",
  "Sharp": "https://dreamfortrade.com/product-category/%d8%aa%d9%83%d9%8a%d9%8a%d9%81-%d8%b4%d8%a7%d8%b1%d8%a8/",
  "Carrier": "https://dreamfortrade.com/product-category/%d8%aa%d9%83%d9%8a%d9%8a%d9%81-%d9%83%d8%a7%d8%b1%d9%8a%d9%8a%d8%b1/",
  "Midea": "https://dreamfortrade.com/product-category/%d8%aa%d9%83%d9%8a%d9%8a%d9%81-%d9%85%d9%8a%d8%af%d9%8a%d8%a7/",
  "Haier": "https://dreamfortrade.com/product-category/%d8%aa%d9%83%d9%8a%d9%8a%d9%81-%d9%87%d8%a7%d9%8a%d8%b1/",
  "Fresh": "https://dreamfortrade.com/product-category/%d8%aa%d9%83%d9%8a%d9%8a%d9%81-%d9%81%d8%b1%d9%8a%d8%b4/",
};

interface ProductData {
  name: string;
  brand: string;
  description: string;
  image_url: string;
  capacity: string | null;
  type: string | null;
  features: string[];
  model: string | null;
}

function extractCapacity(text: string): string | null {
  const capacityPatterns = [
    /(\d+(?:\.\d+)?)\s*حصان/,
    /(\d+(?:\.\d+)?)\s*hp/i,
  ];
  
  for (const pattern of capacityPatterns) {
    const match = text.match(pattern);
    if (match) {
      return `${match[1]} حصان`;
    }
  }
  return null;
}

function extractType(text: string): string | null {
  const lowerText = text.toLowerCase();
  if (lowerText.includes("بارد ساخن") || lowerText.includes("بارد – ساخن") || lowerText.includes("بارد - ساخن") || lowerText.includes("cool hot") || lowerText.includes("cool heat")) {
    return "بارد ساخن";
  } else if (lowerText.includes("بارد فقط") || lowerText.includes("بارد") || lowerText.includes("cool only") || lowerText.includes("cooling only")) {
    return "بارد فقط";
  }
  return null;
}

function extractModel(name: string): string | null {
  // Extract model number patterns
  const modelPatterns = [
    /([A-Z]{2,4}-[A-Z0-9]+)/i,
    /([A-Z]{2,4}[0-9]{2,4}[A-Z0-9]*)/i,
  ];
  
  for (const pattern of modelPatterns) {
    const match = name.match(pattern);
    if (match) {
      return match[1].toUpperCase();
    }
  }
  return null;
}

function parseFeatures(description: string): string[] {
  const features: string[] = [];
  // Split by br tags or li tags
  const lines = description.split(/<br\s*\/?>/i);
  
  for (const line of lines) {
    let cleanLine = line.replace(/<[^>]*>/g, "").trim();
    // Remove HTML entities
    cleanLine = cleanLine.replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
    if (cleanLine && cleanLine.length > 5 && cleanLine.length < 100) {
      features.push(cleanLine);
    }
  }
  
  // Also extract from li tags
  const liPattern = /<li[^>]*>([^<]+)<\/li>/gi;
  let liMatch;
  while ((liMatch = liPattern.exec(description)) !== null) {
    const cleanLi = liMatch[1].replace(/&nbsp;/g, " ").trim();
    if (cleanLi && cleanLi.length > 5 && !features.includes(cleanLi)) {
      features.push(cleanLi);
    }
  }
  
  return features.slice(0, 6); // Max 6 features
}

function parseProductsFromHTML(html: string, defaultBrand: string): ProductData[] {
  const products: ProductData[] = [];
  
  // Match product items using a more flexible pattern
  const productPattern = /<li class="product[^"]*post-\d+[^"]*"[^>]*>([\s\S]*?)<\/li>/g;
  let match;
  
  while ((match = productPattern.exec(html)) !== null) {
    const productHTML = match[1];
    
    // Extract product name - try multiple patterns
    let name = "";
    const namePatterns = [
      /<h2 class="woocommerce-loop-product__title">([^<]+)<\/h2>/,
      /class="woocommerce-loop-product__title"[^>]*>([^<]+)</,
    ];
    
    for (const pattern of namePatterns) {
      const nameMatch = productHTML.match(pattern);
      if (nameMatch) {
        name = nameMatch[1].trim();
        break;
      }
    }
    
    if (!name) {
      console.log("Could not extract product name, skipping");
      continue;
    }
    
    // Use the default brand passed for this category
    const brand = defaultBrand;
    
    // Extract image URL - try multiple patterns
    let image_url = "";
    const imagePatterns = [
      /src="([^"]+)"\s+class="attachment-woocommerce_thumbnail/,
      /src="([^"]+\.(?:jpg|png|jpeg|webp))"/i,
    ];
    
    for (const pattern of imagePatterns) {
      const imageMatch = productHTML.match(pattern);
      if (imageMatch) {
        image_url = imageMatch[1];
        break;
      }
    }
    
    // Get higher resolution image
    image_url = image_url.replace(/-\d+x\d+\.(jpg|png|jpeg|webp)$/i, ".$1");
    
    // Extract description
    const descPatterns = [
      /<div class="woocommerce-product-details__short-description">([\s\S]*?)<\/div>/,
      /<div class="product-short-description">([\s\S]*?)<\/div>/,
    ];
    
    let description = "";
    let rawDescription = "";
    for (const pattern of descPatterns) {
      const descMatch = productHTML.match(pattern);
      if (descMatch) {
        rawDescription = descMatch[1];
        description = rawDescription.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
        break;
      }
    }
    
    // Extract features from description
    const features = rawDescription ? parseFeatures(rawDescription) : [];
    
    // Extract capacity, type and model
    const fullText = `${name} ${description}`;
    const capacity = extractCapacity(fullText);
    const type = extractType(fullText);
    const model = extractModel(name);
    
    console.log(`Found product: ${name} | Brand: ${brand} | Capacity: ${capacity} | Type: ${type}`);
    
    products.push({
      name,
      brand,
      description,
      image_url,
      capacity,
      type,
      features,
      model,
    });
  }
  
  return products;
}

async function fetchPage(url: string): Promise<string> {
  console.log(`Fetching: ${url}`);
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "ar,en;q=0.5",
    },
  });
  
  if (!response.ok) {
    console.log(`Failed to fetch ${url}: ${response.status}`);
    return "";
  }
  
  return await response.text();
}

async function fetchAllPagesForBrand(baseUrl: string, brandName: string): Promise<ProductData[]> {
  const allProducts: ProductData[] = [];
  
  // Fetch first page
  let html = await fetchPage(baseUrl);
  if (!html || html.includes("error404")) {
    console.log(`Category page not found for ${brandName}`);
    return allProducts;
  }
  
  let products = parseProductsFromHTML(html, brandName);
  allProducts.push(...products);
  console.log(`${brandName} Page 1: Found ${products.length} products`);

  // Check for pagination
  const pageLinks = html.match(/page\/(\d+)\/?["']/g);
  if (pageLinks) {
    const pageNumbers = pageLinks.map(p => {
      const num = p.match(/page\/(\d+)/);
      return num ? parseInt(num[1]) : 0;
    });
    const maxPage = Math.max(...pageNumbers);
    
    for (let page = 2; page <= maxPage; page++) {
      try {
        html = await fetchPage(`${baseUrl}page/${page}/`);
        if (html && !html.includes("error404")) {
          products = parseProductsFromHTML(html, brandName);
          allProducts.push(...products);
          console.log(`${brandName} Page ${page}: Found ${products.length} products`);
        }
      } catch (e) {
        console.error(`Error fetching ${brandName} page ${page}:`, e);
      }
    }
  }
  
  return allProducts;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("Starting product scraping from brand categories...");

    // Get brands from database
    const { data: brandsData, error: brandsError } = await supabase
      .from("brands")
      .select("id, name");

    if (brandsError) {
      throw new Error(`Failed to fetch brands: ${brandsError.message}`);
    }

    const brandIdMap: Record<string, string> = {};
    for (const brand of brandsData || []) {
      brandIdMap[brand.name.toLowerCase()] = brand.id;
    }

    console.log("Brands loaded:", Object.keys(brandIdMap));

    // Scrape products for each brand category
    const allProducts: ProductData[] = [];
    
    for (const [brandName, categoryUrl] of Object.entries(BRAND_CATEGORY_URLS)) {
      console.log(`\n--- Scraping ${brandName} products ---`);
      const brandProducts = await fetchAllPagesForBrand(categoryUrl, brandName);
      allProducts.push(...brandProducts);
      console.log(`Total from ${brandName}: ${brandProducts.length}`);
    }

    console.log(`\nTotal products scraped: ${allProducts.length}`);

    // Insert products into database
    let insertedCount = 0;
    let skippedCount = 0;
    let duplicateCount = 0;
    const brandProductCounts: Record<string, number> = {};

    for (const product of allProducts) {
      const brandId = brandIdMap[product.brand.toLowerCase()];
      if (!brandId) {
        console.log(`Skipping product (brand not in DB): ${product.name} - ${product.brand}`);
        skippedCount++;
        continue;
      }

      // Check if product already exists by name
      const { data: existingProduct } = await supabase
        .from("products")
        .select("id")
        .eq("name", product.name)
        .maybeSingle();

      if (existingProduct) {
        console.log(`Product already exists: ${product.name}`);
        duplicateCount++;
        continue;
      }

      const { error: insertError } = await supabase.from("products").insert({
        name: product.name,
        brand_id: brandId,
        description: product.description || null,
        image_url: product.image_url || null,
        capacity: product.capacity,
        type: product.type,
        features: product.features.length > 0 ? product.features : null,
        model: product.model,
        price: 0, // Price not available on website
        rating: 4.5,
        is_active: true,
      });

      if (insertError) {
        console.error(`Failed to insert product: ${product.name}`, insertError);
        skippedCount++;
      } else {
        insertedCount++;
        brandProductCounts[product.brand] = (brandProductCounts[product.brand] || 0) + 1;
        console.log(`Inserted: ${product.name}`);
      }
    }

    // Update brand product counts
    for (const [brandName, count] of Object.entries(brandProductCounts)) {
      const brandId = brandIdMap[brandName.toLowerCase()];
      if (brandId) {
        // Get current count and add to it
        const { data: currentBrand } = await supabase
          .from("brands")
          .select("product_count")
          .eq("id", brandId)
          .single();
        
        const newCount = (currentBrand?.product_count || 0) + count;
        
        await supabase
          .from("brands")
          .update({ product_count: newCount })
          .eq("id", brandId);
      }
    }

    console.log(`\nScraping complete!`);
    console.log(`Inserted: ${insertedCount}, Skipped: ${skippedCount}, Duplicates: ${duplicateCount}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `تم سحب ${insertedCount} منتج جديد بنجاح`,
        details: {
          total_scraped: allProducts.length,
          inserted: insertedCount,
          skipped: skippedCount,
          duplicates: duplicateCount,
          by_brand: brandProductCounts,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Scraping error:", error);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
