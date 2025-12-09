import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing required environment variables");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { productId, processAll, limit = 10 } = await req.json();

    let products: Array<{ id: string; name: string; image_url: string | null }> = [];

    if (productId) {
      // Process single product
      const { data, error } = await supabase
        .from("products")
        .select("id, name, image_url")
        .eq("id", productId)
        .single();
      
      if (error) throw error;
      if (data) products = [data];
    } else if (processAll) {
      // Process all products that have external image URLs (not from our storage)
      const { data, error } = await supabase
        .from("products")
        .select("id, name, image_url")
        .not("image_url", "is", null)
        .not("image_url", "ilike", "%supabase%")
        .limit(limit);
      
      if (error) throw error;
      products = data || [];
    }

    console.log(`Processing ${products.length} products`);

    const results = [];

    for (const product of products) {
      try {
        if (!product.image_url) {
          results.push({ id: product.id, status: "skipped", reason: "no image" });
          continue;
        }

        console.log(`Processing: ${product.name}`);

        // Use Lovable AI to enhance the image - remove background and improve quality
        const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-image-preview",
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: "Remove the background from this air conditioner product image. Make it have a clean, pure white background. Keep the product crisp and clear. Enhance the image quality and make colors more vibrant. Output a professional e-commerce product photo."
                  },
                  {
                    type: "image_url",
                    image_url: {
                      url: product.image_url
                    }
                  }
                ]
              }
            ],
            modalities: ["image", "text"]
          }),
        });

        if (!aiResponse.ok) {
          const errorText = await aiResponse.text();
          console.error(`AI error for ${product.name}:`, errorText);
          
          if (aiResponse.status === 429) {
            results.push({ id: product.id, status: "rate_limited", name: product.name });
            // Wait a bit before continuing
            await new Promise(resolve => setTimeout(resolve, 5000));
            continue;
          }
          
          results.push({ id: product.id, status: "ai_error", error: errorText });
          continue;
        }

        const aiData = await aiResponse.json();
        const enhancedImageUrl = aiData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

        if (!enhancedImageUrl) {
          console.error(`No image returned for ${product.name}`);
          results.push({ id: product.id, status: "no_image_returned", name: product.name });
          continue;
        }

        // Extract base64 data and upload to storage
        const base64Data = enhancedImageUrl.replace(/^data:image\/\w+;base64,/, "");
        const imageBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

        // Generate unique filename
        const filename = `${product.id}_enhanced.png`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filename, imageBuffer, {
            contentType: "image/png",
            upsert: true,
          });

        if (uploadError) {
          console.error(`Upload error for ${product.name}:`, uploadError);
          results.push({ id: product.id, status: "upload_error", error: uploadError.message });
          continue;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(filename);

        // Update product with new image URL
        const { error: updateError } = await supabase
          .from("products")
          .update({ image_url: urlData.publicUrl })
          .eq("id", product.id);

        if (updateError) {
          console.error(`Update error for ${product.name}:`, updateError);
          results.push({ id: product.id, status: "update_error", error: updateError.message });
          continue;
        }

        console.log(`Successfully enhanced: ${product.name}`);
        results.push({ 
          id: product.id, 
          status: "success", 
          name: product.name,
          newUrl: urlData.publicUrl 
        });

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (productError) {
        console.error(`Error processing ${product.name}:`, productError);
        results.push({ 
          id: product.id, 
          status: "error", 
          error: productError instanceof Error ? productError.message : "Unknown error" 
        });
      }
    }

    const successCount = results.filter(r => r.status === "success").length;
    const errorCount = results.filter(r => r.status !== "success" && r.status !== "skipped").length;

    return new Response(
      JSON.stringify({ 
        message: `Processed ${products.length} products. Success: ${successCount}, Errors: ${errorCount}`,
        results 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in enhance-product-images:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
