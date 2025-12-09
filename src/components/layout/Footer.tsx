import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, MessageCircle } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Dream For Trade" className="h-14 w-auto" />
              <div className="flex flex-col">
                <span className="text-xl font-bold">Dream</span>
                <span className="text-xs text-primary-foreground/70 -mt-1">For Trade</span>
              </div>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              الوكيل المعتمد لأكبر الماركات العالمية للتكييفات في مصر. نوفر لكم أفضل المنتجات بأفضل الأسعار مع ضمان الجودة وخدمة ما بعد البيع.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">روابط سريعة</h3>
            <ul className="space-y-2">
              {[
                { name: "الرئيسية", href: "/" },
                { name: "منتجاتنا", href: "/products" },
                { name: "الماركات", href: "/brands" },
                { name: "عن الشركة", href: "/about" },
                { name: "اتصل بنا", href: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">تواصل معنا</h3>
            <ul className="space-y-3">
              <li>
                <a href="tel:01017174696" className="flex items-center gap-3 text-primary-foreground/80 hover:text-secondary transition-colors text-sm">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>01017174696</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@dreamfortrade.com" className="flex items-center gap-3 text-primary-foreground/80 hover:text-secondary transition-colors text-sm">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span>info@dreamfortrade.com</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-primary-foreground/80 text-sm">
                <MapPin className="h-4 w-4 flex-shrink-0 mt-1" />
                <span>مصر - القاهرة</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">تابعنا</h3>
            <div className="flex items-center gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://wa.me/201017174696"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} Dream For Trade. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
