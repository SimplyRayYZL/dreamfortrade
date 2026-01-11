import { Link } from "react-router-dom";
import { Loader2, Sparkles } from "lucide-react";
import { useBrands } from "@/hooks/useProducts";

// Fallback logos
import sharpLogo from "@/assets/brands/sharp.png";
import carrierLogo from "@/assets/brands/carrier.png";
import mideaLogo from "@/assets/brands/midea.png";
import haierLogo from "@/assets/brands/haier.png";
import tornadoLogo from "@/assets/brands/tornado.png";

const fallbackLogos: Record<string, string> = {
  "Sharp": sharpLogo,
  "Carrier": carrierLogo,
  "Midea": mideaLogo,
  "Haier": haierLogo,
  "Tornado": tornadoLogo,
};

const BrandsSection = () => {
  const { data: brands = [], isLoading } = useBrands();

  // Filter out Fresh, FreeAir, and General brands
  const filteredBrands = brands.filter(brand =>
    !brand.name.toLowerCase().includes('fresh') &&
    !brand.name.toLowerCase().includes('freeair') &&
    !brand.name.toLowerCase().includes('free air') &&
    !brand.name.toLowerCase().includes('general')
  );

  const getBrandLogo = (brand: typeof brands[0]) => {
    // Use logo_url from database if it exists (supports http, https, or relative paths)
    if (brand.logo_url && brand.logo_url.trim() !== '') {
      return brand.logo_url;
    }
    // Fallback to local logos
    return fallbackLogos[brand.name] || sharpLogo;
  };

  return (
    <section className="py-20 bg-gradient-to-b from-card to-background overflow-hidden relative">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-secondary rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Section Header with animation */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-4 opacity-0 animate-[scale-in_0.5s_ease-out_forwards]">
            <Sparkles className="h-4 w-4" />
            <span>وكيل معتمد</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 opacity-0 animate-[slide-up_0.8s_ease-out_0.1s_forwards]">
            ماركاتنا <span className="text-secondary">المعتمدة</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto opacity-0 animate-[slide-up_0.8s_ease-out_0.2s_forwards]">
            نفتخر بكوننا الوكيل المعتمد لأشهر الماركات العالمية في مجال التكييفات
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-secondary" />
          </div>
        ) : (
          /* Brands Grid with staggered animations - centered */
          <div className="flex flex-wrap justify-center gap-6 lg:gap-8">
            {filteredBrands.map((brand, index) => (
              <Link
                key={brand.id}
                to={`/products?brand=${brand.name}`}
                className="group cursor-pointer opacity-0 animate-[scale-in_0.5s_ease-out_forwards]"
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                <div className="relative w-36 h-36 md:w-44 md:h-44 lg:w-48 lg:h-48 rounded-3xl bg-card border-2 border-border p-4 flex flex-col items-center justify-center transition-all duration-500 group-hover:shadow-2xl group-hover:border-secondary group-hover:-translate-y-3 overflow-hidden">
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/0 to-secondary/0 group-hover:from-secondary/5 group-hover:to-transparent transition-all duration-500" />

                  {/* Brand Logo */}
                  <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 flex items-center justify-center mb-3 transition-transform duration-500 group-hover:scale-110 relative z-10">
                    <img
                      src={getBrandLogo(brand)}
                      alt={`${brand.name_ar} logo`}
                      className="max-w-full max-h-full object-contain filter group-hover:drop-shadow-lg"
                    />
                  </div>
                  <span className="text-sm md:text-base font-bold text-muted-foreground group-hover:text-secondary transition-colors text-center relative z-10">
                    {brand.name_ar}
                  </span>

                  {/* Decorative corner */}
                  <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-secondary/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BrandsSection;
