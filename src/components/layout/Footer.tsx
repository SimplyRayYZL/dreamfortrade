import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, MessageCircle, Send, ArrowUp } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSettings";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Footer = () => {
  const { data: settings } = useSiteSettings();
  const [email, setEmail] = useState("");

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative">
      {/* Main Footer */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* About */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <img src={settings?.store_logo || "/logo.png"} alt={settings?.store_name || "دريم للتجارة والتوريدات"} className="h-16 w-auto bg-white rounded-lg p-2" />
              </div>
              <p className="text-primary-foreground/80 text-sm leading-relaxed">
                {settings?.footer_text || "شركة دريم للتجارة والتوريدات - وكيلك المعتمد لأكبر الماركات العالمية"}. نوفر لكم أفضل المنتجات بأفضل الأسعار مع ضمان الجودة وخدمة ما بعد البيع.
              </p>
              {/* Social Media */}
              <div className="flex items-center gap-3">
                <a
                  href="https://www.facebook.com/DreamCommercialAgencies"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary hover:scale-110 transition-all"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href={`https://wa.me/${settings?.store_whatsapp || "201289006310"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-500 hover:scale-110 transition-all"
                >
                  <MessageCircle className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold border-b border-white/20 pb-3">روابط سريعة</h3>
              <ul className="space-y-3">
                {[
                  { name: "الرئيسية", href: "/" },
                  { name: "منتجاتنا", href: "/products" },
                  { name: "المدونة", href: "/blog" },
                  { name: "من نحن", href: "/about" },
                  { name: "تواصل معنا", href: "/contact" },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-primary-foreground/70 hover:text-secondary hover:pr-2 transition-all text-sm flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold border-b border-white/20 pb-3">خدماتنا</h3>
              <ul className="space-y-3">
                {[
                  "بيع التكييفات",
                  "التركيب المجاني",
                  "الصيانة والإصلاح",
                  "قطع الغيار الأصلية",
                  "ضمان 5 سنوات",
                ].map((service) => (
                  <li key={service} className="text-primary-foreground/70 text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    {service}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold border-b border-white/20 pb-3">تواصل معنا</h3>
              <ul className="space-y-4">
                <li>
                  <a href={`tel:${settings?.store_phone || "01289006310"}`} className="flex items-center gap-3 text-primary-foreground/70 hover:text-secondary transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-secondary transition-colors">
                      <Phone className="h-4 w-4" />
                    </div>
                    <span className="text-sm">{settings?.store_phone || "01289006310"}</span>
                  </a>
                </li>
                <li>
                  <a href={`mailto:${settings?.store_email || "info@dreamfortrade.com"}`} className="flex items-center gap-3 text-primary-foreground/70 hover:text-secondary transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-secondary transition-colors">
                      <Mail className="h-4 w-4" />
                    </div>
                    <span className="text-sm">{settings?.store_email || "info@dreamfortrade.com"}</span>
                  </a>
                </li>
                <li className="flex items-start gap-3 text-primary-foreground/70">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <span className="text-sm pt-2">{settings?.store_address || "مصر - القاهرة"}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-primary/95 border-t border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-center text-sm text-primary-foreground/60">
              © {new Date().getFullYear()} {settings?.store_name || "دريم للتجارة والتوريدات"}. جميع الحقوق محفوظة.
            </p>
            <div className="flex items-center gap-4 text-sm text-primary-foreground/60">
              <Link to="/privacy" className="hover:text-secondary transition-colors">سياسة الخصوصية</Link>
              <span>|</span>
              <Link to="/terms" className="hover:text-secondary transition-colors">الشروط والأحكام</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-24 right-4 w-11 h-11 bg-secondary/90 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-secondary hover:scale-110 transition-all z-40"
        aria-label="العودة لأعلى"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </footer>
  );
};

export default Footer;
