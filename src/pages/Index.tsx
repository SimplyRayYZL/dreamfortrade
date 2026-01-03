import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroBanner from "@/components/home/HeroBanner";
import BrandsSection from "@/components/home/BrandsSection";
import BrandBanners from "@/components/home/BrandBanners";
import ProductsSection from "@/components/home/ProductsSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import PromoBanner from "@/components/home/PromoBanner";

const Index = () => {
  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "Target Air Conditioning",
    "description": "شركة تارجت لأعمال التكييف - تكييفات شارب، كاريير، جنرال، ميديا، تورنيدو في مصر",
    "url": "https://targetaircool.com",
    "telephone": "+201208000550",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "القاهرة",
      "addressCountry": "EG"
    },
    "priceRange": "$$",
    "openingHours": ["Sa-Th 09:00-22:00", "Fr 14:00-22:00"],
    "sameAs": [
      "https://www.facebook.com/Target.shiraton",
      "https://wa.me/201208000550"
    ]
  };

  return (
    <>
      <Helmet>
        <title>تارجت لأعمال التكييف | تكييفات في مصر</title>
        <meta
          name="description"
          content="شركة تارجت لأعمال التكييف - تكييفات شارب، كاريير، جنرال، ميديا، تورنيدو في مصر. أفضل الأسعار، ضمان شامل، وتوصيل مجاني."
        />
        <meta name="keywords" content="تكييفات, شارب, كاريير, جنرال, ميديا, تورنيدو, مصر, تارجت" />
        <link rel="canonical" href="https://targetaircool.com" />

        {/* Open Graph */}
        <meta property="og:title" content="تارجت لأعمال التكييف | تكييفات في مصر" />
        <meta property="og:description" content="أفضل أسعار التكييفات في مصر مع ضمان شامل وتوصيل مجاني" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://targetaircool.com" />
        <meta property="og:locale" content="ar_EG" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="تارجت لأعمال التكييف | تكييفات بأفضل الأسعار" />
        <meta name="twitter:description" content="شركة تارجت لأعمال التكييف في مصر" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <HeroBanner />
          <BrandsSection />
          <BrandBanners />
          <ProductsSection />
          <PromoBanner variant="features" />
          <TestimonialsSection />
          <PromoBanner variant="contact" />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;

