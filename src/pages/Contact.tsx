import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageBanner from "@/components/common/PageBanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, Facebook, Sparkles, CheckCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSiteSettings } from "@/hooks/useSettings";
import { usePageBanner, defaultPageBanners } from "@/hooks/usePageBanner";
import contactBanner from "@/assets/banners/contact-banner.jpg";

const Contact = () => {
  const { data: settings } = useSiteSettings();
  const { data: pageBanner } = usePageBanner("contact");
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic contact info from settings
  const contactInfo = [
    { icon: Phone, title: "اتصل بنا", value: settings?.store_phone || "01289006310", href: `tel:${settings?.store_phone || "01289006310"}`, description: "متاحين طوال الأسبوع", color: "from-blue-500 to-cyan-500" },
    { icon: MessageCircle, title: "واتساب", value: settings?.store_phone || "01289006310", href: `https://wa.me/${settings?.store_whatsapp || "201289006310"}`, description: "رد سريع على استفساراتك", color: "from-green-500 to-emerald-500" },
    { icon: Mail, title: "البريد الإلكتروني", value: settings?.store_email || "info@dreamfortrade.com", href: `mailto:${settings?.store_email || "info@dreamfortrade.com"}`, description: "نرد خلال 24 ساعة", color: "from-purple-500 to-violet-500" },
    { icon: Facebook, title: "فيسبوك", value: "DreamCommercialAgencies", href: "https://www.facebook.com/DreamCommercialAgencies", description: "تابعنا للعروض الجديدة", color: "from-blue-600 to-blue-700" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("تم إرسال رسالتك بنجاح! سنتواصل معك قريباً");
    setFormData({ name: "", phone: "", email: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <>
      <Helmet>
        <title>تواصل معنا | دريم للتجارة والتوريدات</title>
        <meta name="description" content="تواصل معنا للاستفسار عن منتجاتنا أو للحصول على عرض سعر - دريم للتجارة والتوريدات" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {/* Page Banner */}
          <PageBanner
            title={pageBanner?.title || defaultPageBanners.contact.title}
            subtitle={pageBanner?.subtitle || defaultPageBanners.contact.subtitle}
            backgroundImage={pageBanner?.image_url || contactBanner}
            breadcrumbs={[{ label: "تواصل معنا" }]}
          />

          {/* Contact Cards - Floating above */}
          <section className="py-8 -mt-16 relative z-10">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {contactInfo.map((info, index) => (
                  <a
                    key={info.title}
                    href={info.href}
                    target={info.href.startsWith("http") ? "_blank" : undefined}
                    rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="bg-card rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 text-center group opacity-0 animate-[scale-in_0.5s_ease-out_forwards]"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <info.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-bold text-foreground text-sm mb-1">{info.title}</h3>
                    <p className="text-muted-foreground text-xs">{info.description}</p>
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Content */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                {/* Contact Form - Wider */}
                <div className="lg:col-span-3">
                  <div className="bg-card rounded-3xl p-8 shadow-lg">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                        <Send className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-foreground">أرسل لنا رسالة</h2>
                        <p className="text-muted-foreground text-sm">سنرد عليك في أقرب وقت</p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium text-foreground">الاسم الكامل *</label>
                          <Input
                            id="name"
                            placeholder="أدخل اسمك"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="h-12 rounded-xl bg-muted border-0 focus:ring-2 focus:ring-secondary"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="phone" className="text-sm font-medium text-foreground">رقم الهاتف *</label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="01xxxxxxxxx"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                            className="h-12 rounded-xl bg-muted border-0 focus:ring-2 focus:ring-secondary"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-foreground">البريد الإلكتروني (اختياري)</label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="example@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="h-12 rounded-xl bg-muted border-0 focus:ring-2 focus:ring-secondary"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium text-foreground">رسالتك *</label>
                        <Textarea
                          id="message"
                          placeholder="اكتب رسالتك أو استفسارك هنا..."
                          rows={5}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          required
                          className="rounded-xl bg-muted border-0 focus:ring-2 focus:ring-secondary resize-none"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full h-14 rounded-xl bg-secondary hover:bg-secondary/90 text-white text-lg font-bold gap-2"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          "جاري الإرسال..."
                        ) : (
                          <>
                            <Send className="h-5 w-5" />
                            إرسال الرسالة
                          </>
                        )}
                      </Button>
                    </form>
                  </div>
                </div>

                {/* Contact Info Sidebar */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Quick Contact */}
                  <div className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-6 text-white">
                    <div className="flex items-center gap-3 mb-6">
                      <Sparkles className="h-6 w-6" />
                      <h3 className="text-xl font-bold">تواصل سريع</h3>
                    </div>

                    <div className="space-y-4">
                      <a href={`tel:${settings?.store_phone || "01289006310"}`} className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                        <Phone className="h-5 w-5" />
                        <span className="font-medium">{settings?.store_phone || "01289006310"}</span>
                      </a>
                      <a href={`https://wa.me/${settings?.store_whatsapp || "201289006310"}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                        <MessageCircle className="h-5 w-5" />
                        <span className="font-medium">راسلنا واتساب</span>
                      </a>
                    </div>
                  </div>

                  {/* Working Hours */}
                  <div className="bg-card rounded-3xl p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-secondary" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground">ساعات العمل</h3>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 rounded-xl bg-muted/50">
                        <span className="text-muted-foreground">السبت - الخميس</span>
                        <span className="text-foreground font-bold">9:00 ص - 10:00 م</span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-xl bg-muted/50">
                        <span className="text-muted-foreground">الجمعة</span>
                        <span className="text-foreground font-bold">2:00 م - 10:00 م</span>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="bg-card rounded-3xl p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-secondary" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground">موقعنا</h3>
                    </div>
                    <p className="text-muted-foreground">{settings?.store_address || "القاهرة - مصر"}</p>

                    <div className="mt-4 space-y-2">
                      {["توصيل لجميع المحافظات", "تركيب مجاني", "ضمان شامل"].map((item) => (
                        <div key={item} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Google Map */}
          <section id="map" className="h-96 relative">
            <iframe
              src={settings?.store_map_embed || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.0987738426833!2d31.235711!3d30.044419!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDAyJzM5LjkiTiAzMcKwMTQnMDguNiJF!5e0!3m2!1sar!2seg!4v1234567890"}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="موقع دريم للتجارة والتوريدات على الخريطة"
              className="grayscale hover:grayscale-0 transition-all duration-500"
            />
            <div className="absolute top-4 right-4 bg-card/95 backdrop-blur-sm p-4 rounded-2xl shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-foreground">دريم للتجارة والتوريدات</p>
                  <p className="text-sm text-muted-foreground">القاهرة - مصر</p>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Contact;
