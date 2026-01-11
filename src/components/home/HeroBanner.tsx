import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface HeroBannerData {
  id: string;
  image_url: string;
  mobile_image_url: string | null;
  link_url: string | null;
  is_active: boolean;
}

const HeroBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch hero banners from database
  const { data: banners } = useQuery({
    queryKey: ["hero-banners"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("hero_banners")
        .select("*")
        .eq("is_active", true)
        .order("display_order");

      if (error) {
        console.error("Error fetching hero banners:", error);
        return [];
      }
      return (data || []) as HeroBannerData[];
    },
  });

  // Auto-play carousel
  useEffect(() => {
    if (!banners || banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners]);

  const nextSlide = () => {
    if (banners) {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }
  };

  const prevSlide = () => {
    if (banners) {
      setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    }
  };

  // Default banner if no banners in database - Enhanced design
  if (!banners || banners.length === 0) {
    return (
      <section className="relative w-full bg-gradient-to-br from-primary via-primary to-secondary overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/30 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
          {/* Pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative w-full aspect-[16/7] md:aspect-[16/5] lg:aspect-[16/4] flex items-center justify-center">
          <motion.div
            className="text-center text-white px-4 max-w-4xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.15
                }
              }
            }}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6"
              variants={{
                hidden: { opacity: 0, scale: 0.8, y: -20 },
                visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
              }}
            >
              <Sparkles className="h-4 w-4" />
              <span>وكيل معتمد للماركات العالمية</span>
            </motion.div>
            <motion.h1
              className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 15 } }
              }}
            >
              مع <span className="text-secondary-foreground bg-secondary/30 px-3 py-1 rounded-lg">دريم</span> للتجارة والتوريدات
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl lg:text-2xl opacity-90 mb-8"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 15 } }
              }}
            >
              أفضل الأسعار • ضمان 5 سنوات • توصيل سريع
            </motion.p>
            <motion.div
              className="flex flex-wrap gap-4 justify-center"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 15 } }
              }}
            >
              <Link to="/products">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white rounded-full px-8 gap-2 font-bold h-14 text-lg">
                    تصفح المنتجات
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
              <a href="https://wa.me/201289006310" target="_blank" rel="noopener noreferrer">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary rounded-full px-8 gap-2 font-bold h-14 text-lg">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    تواصل معنا
                  </Button>
                </motion.div>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full overflow-hidden">
      {/* Banners Container */}
      <div className="relative w-full">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`w-full transition-all duration-700 ${index === currentIndex ? "block opacity-100" : "hidden opacity-0"
              }`}
          >
            {banner.link_url ? (
              <Link to={banner.link_url} className="block w-full">
                <picture>
                  {/* Mobile image if exists */}
                  {banner.mobile_image_url && (
                    <source
                      media="(max-width: 768px)"
                      srcSet={banner.mobile_image_url}
                    />
                  )}
                  {/* Desktop/default image */}
                  <img
                    src={banner.image_url}
                    alt="Banner"
                    className="w-full h-auto block"
                  />
                </picture>
              </Link>
            ) : (
              <picture>
                {banner.mobile_image_url && (
                  <source
                    media="(max-width: 768px)"
                    srcSet={banner.mobile_image_url}
                  />
                )}
                <img
                  src={banner.image_url}
                  alt="Banner"
                  className="w-full h-auto block"
                />
              </picture>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows - Enhanced */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white shadow-lg rounded-full p-2.5 md:p-3.5 transition-all hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white shadow-lg rounded-full p-2.5 md:p-3.5 transition-all hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          </button>
        </>
      )}

      {/* Dots Indicator - Enhanced */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all rounded-full ${index === currentIndex
                ? "bg-secondary w-8 h-3"
                : "bg-white/70 hover:bg-white w-3 h-3"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroBanner;
