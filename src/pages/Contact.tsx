import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageBanner from "@/components/common/PageBanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import contactBanner from "@/assets/banners/contact-banner.jpg";
import { useSiteSettings } from "@/hooks/useSettings";

const Contact = () => {
  const { data: settings } = useSiteSettings();
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic contact info from settings
  const contactInfo = [
    { icon: Phone, title: "اتصل بنا", value: settings?.store_phone || "01208000550", href: `tel:${settings?.store_phone || "01208000550"}`, description: "متاحين من 9 صباحاً حتى 10 مساءً" },
    { icon: MessageCircle, title: "واتساب", value: settings?.store_phone || "01208000550", href: `https://wa.me/${settings?.store_whatsapp || "201208000550"}`, description: "رد سريع على استفساراتك" },
    { icon: Mail, title: "البريد الإلكتروني", value: settings?.store_email || "info@target-ac.com", href: `mailto:${settings?.store_email || "info@target-ac.com"}`, description: "نرد خلال 24 ساعة" },
    { icon: MapPin, title: "العنوان", value: settings?.store_address || "القاهرة - مصر", href: "#map", description: "زيارة المعرض" },
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
        <title>اتصل بنا | تارجت لأعمال التكييف</title>
        <meta name="description" content="تواصل معنا للاستفسار عن منتجاتنا أو للحصول على عرض سعر - تارجت لأعمال التكييف" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {/* Page Banner */}
          <PageBanner
            title="اتصل بنا"
            subtitle="نحن هنا لمساعدتك في أي وقت - فريق الدعم جاهز للرد على استفساراتك"
            backgroundImage={contactBanner}
          />

          {/* Contact Content */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div className="card-dream animate-fade-in">
                  <h2 className="text-2xl font-bold text-foreground mb-6">أرسل لنا رسالة</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-foreground">الاسم الكامل</label>
                        <Input
                          id="name"
                          placeholder="أدخل اسمك"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          className="bg-muted border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium text-foreground">رقم الهاتف</label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="01xxxxxxxxx"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                          className="bg-muted border-border"
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
                        className="bg-muted border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium text-foreground">رسالتك</label>
                      <Textarea
                        id="message"
                        placeholder="اكتب رسالتك أو استفسارك هنا..."
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        className="bg-muted border-border resize-none"
                      />
                    </div>
                    <Button type="submit" className="w-full btn-dream-primary" disabled={isSubmitting}>
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

                {/* Contact Info */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-foreground mb-6">معلومات التواصل</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {contactInfo.map((info, index) => (
                      <a
                        key={info.title}
                        href={info.href}
                        target={info.href.startsWith("http") ? "_blank" : undefined}
                        rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="card-dream group animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/20 to-accent/10 flex items-center justify-center flex-shrink-0 group-hover:from-secondary group-hover:to-accent transition-all">
                            <info.icon className="h-6 w-6 text-secondary group-hover:text-secondary-foreground transition-colors" />
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground mb-1">{info.title}</h3>
                            <p className="text-secondary font-medium">{info.value}</p>
                            <p className="text-sm text-muted-foreground mt-1">{info.description}</p>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>

                  {/* Working Hours */}
                  <div className="card-dream animate-fade-in" style={{ animationDelay: "0.4s" }}>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/20 to-accent/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground mb-3">ساعات العمل</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">السبت - الخميس</span>
                            <span className="text-foreground font-medium">9:00 ص - 10:00 م</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">الجمعة</span>
                            <span className="text-foreground font-medium">2:00 م - 10:00 م</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Google Map */}
          <section id="map" className="h-96 relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.0987738426833!2d31.235711!3d30.044419!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDAyJzM5LjkiTiAzMcKwMTQnMDguNiJF!5e0!3m2!1sar!2seg!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="موقع تارجت لأعمال التكييف على الخريطة"
              className="grayscale hover:grayscale-0 transition-all duration-500"
            />
            <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm p-4 rounded-xl shadow-lg">
              <div className="flex items-center gap-3">
                <MapPin className="h-6 w-6 text-secondary" />
                <div>
                  <p className="font-bold text-foreground">Target Air Conditioning</p>
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
