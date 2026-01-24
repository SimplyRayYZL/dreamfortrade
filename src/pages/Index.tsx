import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroBanner from "@/components/home/HeroBanner";
import BrandsSection from "@/components/home/BrandsSection";
import ProductsSection from "@/components/home/ProductsSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import PromoBanner from "@/components/home/PromoBanner";
import PromoSection from "@/components/home/PromoSection";
import { useSiteSettings, HomepageSection } from "@/hooks/useSettings";
import { supabase } from "@/integrations/supabase/client";
import CountUp from "react-countup";
import { useState, useEffect } from "react";

const Index = () => {
  const { data: settings } = useSiteSettings();

  // Fetch CTA banner background
  const { data: ctaBanner } = useQuery({
    queryKey: ["cta_banner"],
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from("page_banners")
        .select("*")
        .eq("page_name", "cta_section")
        .eq("is_active", true)
        .single();
      return data as { image_url: string | null; title: string | null; subtitle: string | null } | null;
    },
  });

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "Dream Trade & Supplies",
    "description": "شركة دريم للتجارة والتوريدات - تكييفات شارب، كاريير، جنرال، ميديا، تورنيدو في مصر",
    "url": "https://dreamfortrade.com",
    "telephone": "+201289006310",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "القاهرة",
      "addressCountry": "EG"
    },
    "priceRange": "$$",
    "openingHours": ["Sa-Th 09:00-22:00", "Fr 14:00-22:00"],
    "sameAs": [
      "https://www.facebook.com/DreamCommercialAgencies",
      "https://wa.me/201289006310"
    ]
  };

  return (
    <>
      <Helmet>
        <title>دريم للتجارة والتوريدات | تكييفات في مصر</title>
        <meta
          name="description"
          content="شركة دريم للتجارة والتوريدات - تكييفات شارب، كاريير، جنرال، ميديا، تورنيدو في مصر. أفضل الأسعار، ضمان شامل، وتوصيل سريع."
        />
        <meta name="keywords" content="تكييفات, شارب, كاريير, جنرال, ميديا, تورنيدو, مصر, دريم" />
        <link rel="canonical" href="https://dreamfortrade.com" />

        {/* Open Graph */}
        <meta property="og:title" content="دريم للتجارة والتوريدات | تكييفات في مصر" />
        <meta property="og:description" content="أفضل أسعار التكييفات في مصر مع ضمان شامل وتوصيل سريع" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dreamfortrade.com" />
        <meta property="og:locale" content="ar_EG" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="دريم للتجارة والتوريدات | تكييفات بأفضل الأسعار" />
        <meta name="twitter:description" content="شركة دريم للتجارة والتوريدات في مصر" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {/* Dynamic Sections Renderer */}
          {settings?.homepage_sections?.filter(s => s.isEnabled).sort((a, b) => a.order - b.order).map((section) => {
            switch (section.type) {
              case 'hero':
                return <HeroBanner key={section.id} />;
              case 'features':
                return <FeaturesSection key={section.id} />;
              case 'products':
                return <ProductsSection key={section.id} />;
              case 'brands':
                return <BrandsSection key={section.id} />;
              case 'testimonials':
                return <TestimonialsSection key={section.id} />;
              case 'custom':
                // Handle Promo Sections mapped by ID or generic custom sections
                if (section.id === 'promo1') return <PromoSection key={section.id} group="group1" />;
                if (section.id === 'promo2') return <PromoSection key={section.id} group="group2" />;
                // Fallback or generic custom component if needed
                return null;
              case 'contact':
              case 'cta':
                return (
                  <section
                    key={section.id}
                    className="py-16 md:py-20 relative overflow-hidden"
                    style={{
                      backgroundImage: ctaBanner?.image_url && ctaBanner.image_url.trim() !== ''
                        ? `url(${ctaBanner.image_url})`
                        : 'linear-gradient(to bottom right, #185a9d, #185a9d, #3b82f6)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    {/* Decorative elements - only show when no image */}
                    {(!ctaBanner?.image_url || ctaBanner.image_url.trim() === '') && (
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/30 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
                      </div>
                    )}

                    <div className="container mx-auto px-4 relative">
                      <div className="text-center text-white max-w-3xl mx-auto">
                        <h2 data-aos="fade-up" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                          {ctaBanner?.title || section.title || "جاهز تشتري تكييفك الجديد؟"}
                        </h2>
                        <p data-aos="fade-up" data-aos-delay="100" className="text-lg md:text-xl opacity-90 mb-8">
                          {ctaBanner?.subtitle || section.subtitle || "تواصل معنا دلوقتي واحصل على أفضل سعر مع ضمان 5 سنوات وتركيب مجاني"}
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 md:gap-8 mb-10">
                          <div data-aos="zoom-in" data-aos-delay="100" className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 group hover:bg-white/20 transition-all duration-300">
                            <div className="text-3xl md:text-4xl font-bold text-secondary-foreground">
                              +<CountUp end={50} duration={2.5} suffix="K" enableScrollSpy scrollSpyOnce />
                            </div>
                            <div className="text-sm md:text-base opacity-80">عميل سعيد</div>
                          </div>
                          <div data-aos="zoom-in" data-aos-delay="200" className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 group hover:bg-white/20 transition-all duration-300">
                            <div className="text-3xl md:text-4xl font-bold text-secondary-foreground">
                              <CountUp end={5} duration={2} enableScrollSpy scrollSpyOnce />
                            </div>
                            <div className="text-sm md:text-base opacity-80">سنوات ضمان</div>
                          </div>
                          <div data-aos="zoom-in" data-aos-delay="300" className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 group hover:bg-white/20 transition-all duration-300">
                            <div className="text-3xl md:text-4xl font-bold text-secondary-foreground">
                              <CountUp end={24} duration={2} suffix="/7" enableScrollSpy scrollSpyOnce />
                            </div>
                            <div className="text-sm md:text-base opacity-80">دعم فني</div>
                          </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-4 justify-center">
                          <a href={`https://wa.me/${settings?.store_phone?.replace(/\D/g, '') || "201289006310"}`} target="_blank" rel="noopener noreferrer" className="flex-1 max-w-xs">
                            <button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-full px-8 py-4 font-bold text-lg flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-lg animate-pulse-glow">
                              <svg className="h-6 w-6 animate-wave" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                              </svg>
                              تواصل واتساب
                            </button>
                          </a>
                          <a href={`tel:${settings?.store_phone || "+201289006310"}`} className="flex-1 max-w-xs">
                            <button className="w-full bg-white/20 hover:bg-white/30 text-white border-2 border-white rounded-full px-8 py-4 font-bold text-lg flex items-center justify-center gap-2 transition-all hover:scale-105 shimmer-effect">
                              <span className="animate-wave">📞</span> اتصل الآن
                            </button>
                          </a>
                        </div>
                      </div>
                    </div>
                  </section>
                );
              default:
                return null;
            }
          })}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;

