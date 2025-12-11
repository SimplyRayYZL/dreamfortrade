import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroBanner from "@/components/home/HeroBanner";
import BrandsSection from "@/components/home/BrandsSection";
import ProductsSection from "@/components/home/ProductsSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import PromoBanner from "@/components/home/PromoBanner";

const Index = () => {
  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "Dream For Trade",
    "description": "الوكيل المعتمد لتكييفات شارب، كاريير، جنرال، ميديا، تورنيدو وفريش في مصر",
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
      "https://wa.me/201289006310"
    ]
  };

  return (
    <>
      <Helmet>
        <title>Dream For Trade | الوكيل المعتمد لأكبر الماركات العالمية للتكييفات</title>
        <meta
          name="description"
          content="Dream For Trade - الوكيل المعتمد لتكييفات شارب، كاريير، جنرال، ميديا، تورنيدو وفريش في مصر. أفضل الأسعار، ضمان شامل، وتوصيل مجاني."
        />
        <meta name="keywords" content="تكييفات, شارب, كاريير, جنرال, ميديا, تورنيدو, فريش, مصر, توكيل معتمد" />
        <link rel="canonical" href="https://dreamfortrade.com" />

        {/* Open Graph */}
        <meta property="og:title" content="Dream For Trade | الوكيل المعتمد لأكبر الماركات العالمية للتكييفات" />
        <meta property="og:description" content="أفضل أسعار التكييفات في مصر مع ضمان شامل وتوصيل مجاني" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dreamfortrade.com" />
        <meta property="og:locale" content="ar_EG" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Dream For Trade | تكييفات بأفضل الأسعار" />
        <meta name="twitter:description" content="الوكيل المعتمد لأكبر الماركات العالمية للتكييفات في مصر" />

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
          <ProductsSection />
          <PromoBanner variant="quality" />
          <FeaturesSection />
          <TestimonialsSection />
          <PromoBanner variant="contact" />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
