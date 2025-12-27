import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY")
const ADMIN_EMAIL = "hossamlotfyabdelmonam@gmail.com"
const SENDER_EMAIL = "info@targetaircool.com"
const SENDER_NAME = "Target Air Conditioning"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

interface OrderEmailData {
  orderId: string
  customerName: string
  customerEmail: string
  phone: string
  address: string
  city: string
  notes?: string
  items: {
    name: string
    quantity: number
    price: number
  }[]
  total: number
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const orderData: OrderEmailData = await req.json()

    const itemsHtml = orderData.items
      .map(
        (item) =>
          `<tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.name}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: left;">${item.price.toLocaleString()} ج.م</td>
          </tr>`
      )
      .join("")

    // Admin Email Template
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head><meta charset="UTF-8"></head>
      <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(135deg, #0057A0, #003366); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0;">🛒 طلب جديد!</h1>
            <p style="margin: 10px 0 0;">${SENDER_NAME}</p>
          </div>
          <div style="padding: 30px;">
            <div style="background: #f0f7ff; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
              <p style="margin: 0 0 5px; color: #666;">رقم الطلب</p>
              <span style="font-size: 24px; font-weight: bold; color: #0057A0;">#${orderData.orderId.slice(0, 8).toUpperCase()}</span>
            </div>
            <div style="background: #fafafa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="margin-top: 0; color: #333; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">👤 معلومات العميل</h3>
              <p><strong>الاسم:</strong> ${orderData.customerName}</p>
              <p><strong>الهاتف:</strong> <a href="tel:${orderData.phone}">${orderData.phone}</a></p>
              <p><strong>الإيميل:</strong> ${orderData.customerEmail || "غير متوفر"}</p>
              <p><strong>العنوان:</strong> ${orderData.address}, ${orderData.city}</p>
              ${orderData.notes ? `<p style="background: #fff3cd; padding: 10px; border-radius: 5px;">📝 ملاحظات: ${orderData.notes}</p>` : ""}
            </div>
            <div style="background: #fafafa; padding: 20px; border-radius: 8px;">
              <h3 style="margin-top: 0; color: #333; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">📦 المنتجات</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr>
                    <th style="background: #0057A0; color: white; padding: 12px; text-align: right;">المنتج</th>
                    <th style="background: #0057A0; color: white; padding: 12px; text-align: center;">الكمية</th>
                    <th style="background: #0057A0; color: white; padding: 12px; text-align: left;">السعر</th>
                  </tr>
                </thead>
                <tbody>${itemsHtml}</tbody>
                <tfoot>
                  <tr style="background: #f59e0b; color: white; font-size: 18px;">
                    <td colspan="2" style="padding: 15px; font-weight: bold;">الإجمالي</td>
                    <td style="padding: 15px; font-weight: bold; text-align: left;">${orderData.total.toLocaleString()} ج.م</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          <div style="background: #f5f5f5; padding: 20px; text-align: center; color: #666; font-size: 12px;">
            <p>تم الطلب في ${new Date().toLocaleString("ar-EG")}</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Customer Confirmation Template
    const customerEmailHtml = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head><meta charset="UTF-8"></head>
      <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(135deg, #0057A0, #003366); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0;">✅ شكراً لطلبك!</h1>
            <p style="margin: 10px 0 0;">${SENDER_NAME}</p>
          </div>
          <div style="padding: 30px;">
            <p style="font-size: 18px; color: #333;">مرحباً ${orderData.customerName}،</p>
            <p style="color: #666;">شكراً لثقتك بنا! تم استلام طلبك بنجاح وسيقوم فريقنا بالتواصل معك قريباً لتأكيد تفاصيل الشحن.</p>
            <div style="background: #f0f7ff; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <p style="margin: 0 0 5px; color: #666;">رقم الطلب الخاص بك</p>
              <span style="font-size: 24px; font-weight: bold; color: #0057A0;">#${orderData.orderId.slice(0, 8).toUpperCase()}</span>
            </div>
            <div style="background: #fafafa; padding: 20px; border-radius: 8px;">
              <h3 style="margin-top: 0; color: #333;">📦 ملخص الطلب</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr>
                    <th style="background: #0057A0; color: white; padding: 12px; text-align: right;">المنتج</th>
                    <th style="background: #0057A0; color: white; padding: 12px; text-align: center;">الكمية</th>
                    <th style="background: #0057A0; color: white; padding: 12px; text-align: left;">السعر</th>
                  </tr>
                </thead>
                <tbody>${itemsHtml}</tbody>
                <tfoot>
                  <tr style="background: #0057A0; color: white; font-size: 18px;">
                    <td colspan="2" style="padding: 15px; font-weight: bold;">الإجمالي</td>
                    <td style="padding: 15px; font-weight: bold; text-align: left;">${orderData.total.toLocaleString()} ج.م</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          <div style="background: #0057A0; padding: 20px; text-align: center; color: white; font-size: 12px;">
            <p style="margin: 0;">${SENDER_NAME} - تارجت لأعمال التكييف</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Send emails using Brevo API
    const brevoEndpoint = "https://api.brevo.com/v3/smtp/email"
    const commonHeaders = {
      "Content-Type": "application/json",
      "api-key": BREVO_API_KEY!,
    }

    // Email to Admin
    const adminRes = await fetch(brevoEndpoint, {
      method: "POST",
      headers: commonHeaders,
      body: JSON.stringify({
        sender: { name: SENDER_NAME, email: SENDER_EMAIL },
        to: [{ email: ADMIN_EMAIL, name: "Admin" }],
        subject: `🛒 طلب جديد #${orderData.orderId.slice(0, 8).toUpperCase()} - ${orderData.customerName}`,
        htmlContent: adminEmailHtml,
      }),
    })

    if (!adminRes.ok) {
      const error = await adminRes.json()
      console.error("Brevo Admin Email Error:", error)
    }

    // Email to Customer
    if (orderData.customerEmail) {
      const customerRes = await fetch(brevoEndpoint, {
        method: "POST",
        headers: commonHeaders,
        body: JSON.stringify({
          sender: { name: SENDER_NAME, email: SENDER_EMAIL },
          to: [{ email: orderData.customerEmail, name: orderData.customerName }],
          subject: `✅ تم استلام طلبك #${orderData.orderId.slice(0, 8).toUpperCase()} - ${SENDER_NAME}`,
          htmlContent: customerEmailHtml,
        }),
      })

      if (!customerRes.ok) {
        const error = await customerRes.json()
        console.error("Brevo Customer Email Error:", error)
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error in Edge Function:", error)
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
