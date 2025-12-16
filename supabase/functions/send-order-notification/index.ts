import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = "ahmedhossa20008@gmail.com";

interface OrderData {
    orderId: string;
    customerName: string;
    phone: string;
    customerEmail: string;
    address: string;
    city: string;
    notes: string;
    total: number;
    items?: Array<{
        name: string;
        quantity: number;
        price: number;
    }>;
}

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const orderData: OrderData = await req.json();

        // Format items list
        const itemsList = orderData.items?.map((item) =>
            `• ${item.name} (الكمية: ${item.quantity}) - ${item.price} ج.م`
        ).join("\n") || "لا توجد تفاصيل";

        // Send email to admin
        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: "Target Air Conditioning <onboarding@resend.dev>",
                to: [ADMIN_EMAIL],
                subject: `🛒 طلب جديد #${orderData.orderId.slice(0, 8)}`,
                html: `
          <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #0057A0 0%, #003366 100%); color: white; padding: 20px; border-radius: 10px; text-align: center;">
              <h1 style="margin: 0;">🎉 طلب جديد!</h1>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-top: 20px;">
              <h2 style="color: #0057A0;">تفاصيل العميل:</h2>
              <p><strong>الاسم:</strong> ${orderData.customerName}</p>
              <p><strong>رقم الهاتف:</strong> ${orderData.phone}</p>
              <p><strong>البريد الإلكتروني:</strong> ${orderData.customerEmail || "غير متوفر"}</p>
              <p><strong>العنوان:</strong> ${orderData.address}, ${orderData.city}</p>
            </div>
            
            <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 10px; margin-top: 20px;">
              <h2 style="color: #0057A0;">المنتجات:</h2>
              <pre style="background: #f4f4f4; padding: 10px; border-radius: 5px; white-space: pre-wrap;">${itemsList}</pre>
            </div>
            
            <div style="background: #0057A0; color: white; padding: 20px; border-radius: 10px; margin-top: 20px; text-align: center;">
              <h2 style="margin: 0;">الإجمالي: ${orderData.total.toLocaleString()} ج.م</h2>
            </div>
            
            <p style="text-align: center; color: #666; margin-top: 20px;">
              Target Air Conditioning - تارجت لأعمال التكييف
            </p>
          </div>
        `,
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to send email");
        }

        return new Response(JSON.stringify({ success: true, data }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        console.error("Error sending email:", error);
        return new Response(JSON.stringify({ error: (error as Error).message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
        });
    }
});
