import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
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
    <section className="py-16 bg-card overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header with animation */}
        <div className="text-center mb-12 opacity-0 animate-[slide-up_0.8s_ease-out_forwards]">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            ماركاتنا <span className="text-secondary">المعتمدة</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
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
          <div className="flex flex-wrap justify-center gap-6">
            {filteredBrands.map((brand, index) => (
              <Link
                key={brand.id}
                to={`/products?brand=${brand.name}`}
                className="group cursor-pointer opacity-0 animate-[slide-up_0.6s_ease-out_forwards]"
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              >
                <div className="w-28 md:w-32 lg:w-36 aspect-square rounded-2xl bg-background border border-border p-4 flex flex-col items-center justify-center transition-all duration-500 group-hover:shadow-xl group-hover:border-secondary group-hover:bg-secondary/5 group-hover:-translate-y-2">
                  {/* Brand Logo */}
                  <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center mb-3 transition-transform duration-500 group-hover:scale-110">
                    <img
                      src={getBrandLogo(brand)}
                      alt={`${brand.name_ar} logo`}
                      className="max-w-full max-h-full object-contain filter group-hover:drop-shadow-lg"
                    />
                  </div>
                  <span className="text-sm md:text-base font-semibold text-muted-foreground group-hover:text-secondary transition-colors text-center">
                    {brand.name_ar}
                  </span>
                  {brand.product_count > 0 && (
                    <span className="text-xs text-muted-foreground mt-1">
                      ({brand.product_count} منتج)
                    </span>
                  )}
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
