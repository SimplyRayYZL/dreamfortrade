import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageBanner from "@/components/common/PageBanner";
import { Button } from "@/components/ui/button";
import { Filter, ChevronDown, Loader2 } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts, useBrands } from "@/hooks/useProducts";
import ProductCard from "@/components/products/ProductCard";
import productsBanner from "@/assets/banners/products-banner.jpg";

const capacities = ["1 حصان", "1.5 حصان", "2.25 حصان", "3 حصان", "4 حصان", "5 حصان"];
const types = ["بارد فقط", "بارد ساخن"];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const brandFromUrl = searchParams.get("brand");
  
  const [selectedBrand, setSelectedBrand] = useState(brandFromUrl || "الكل");
  const [selectedCapacity, setSelectedCapacity] = useState("الكل");
  const [selectedType, setSelectedType] = useState("الكل");

  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: brands = [], isLoading: brandsLoading } = useBrands();

  // Update selected brand when URL changes
  useEffect(() => {
    if (brandFromUrl) {
      setSelectedBrand(brandFromUrl);
    }
  }, [brandFromUrl]);

  // Update URL when brand filter changes
  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    if (brand === "الكل") {
      searchParams.delete("brand");
    } else {
      searchParams.set("brand", brand);
    }
    setSearchParams(searchParams);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const brandMatch = selectedBrand === "الكل" || product.brand === selectedBrand;
      const capacityMatch = selectedCapacity === "الكل" || product.capacity === selectedCapacity;
      const typeMatch = selectedType === "الكل" || product.type === selectedType;
      return brandMatch && capacityMatch && typeMatch;
    });
  }, [products, selectedBrand, selectedCapacity, selectedType]);

  const brandOptions = useMemo(() => {
    return ["الكل", ...brands.map(b => b.name)];
  }, [brands]);

  const capacityOptions = ["الكل", ...capacities];
  const typeOptions = ["الكل", ...types];

  const resetFilters = () => {
    setSelectedBrand("الكل");
    setSelectedCapacity("الكل");
    setSelectedType("الكل");
    setSearchParams({});
  };

  const isLoading = productsLoading || brandsLoading;

  return (
    <>
      <Helmet>
        <title>منتجاتنا | Dream For Trade - أفضل تكييفات في مصر</title>
        <meta name="description" content="تصفح مجموعتنا الواسعة من التكييفات من أشهر الماركات العالمية - جنرال، كاريير، شارب، فريش، ميديا والمزيد" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {/* Page Banner */}
          <PageBanner
            title={selectedBrand !== "الكل" ? `تكييفات ${selectedBrand}` : "منتجاتنا"}
            subtitle="اكتشف مجموعتنا الواسعة من التكييفات العصرية بأفضل الأسعار"
            backgroundImage={productsBanner}
            showCTA={false}
          />

          {/* Filters */}
          <div className="bg-card border-b border-border sticky top-[72px] md:top-[136px] z-40">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Filter className="h-5 w-5" />
                  <span className="font-medium">تصفية:</span>
                </div>

                {/* Brand Filter */}
                <div className="relative">
                  <select
                    value={selectedBrand}
                    onChange={(e) => handleBrandChange(e.target.value)}
                    className="appearance-none bg-muted border border-border rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                  >
                    {brandOptions.map((brand) => (
                      <option key={brand} value={brand}>{brand === "الكل" ? "جميع الماركات" : brand}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>

                {/* Capacity Filter */}
                <div className="relative">
                  <select
                    value={selectedCapacity}
                    onChange={(e) => setSelectedCapacity(e.target.value)}
                    className="appearance-none bg-muted border border-border rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                  >
                    {capacityOptions.map((capacity) => (
                      <option key={capacity} value={capacity}>{capacity === "الكل" ? "جميع القدرات" : capacity}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>

                {/* Type Filter */}
                <div className="relative">
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="appearance-none bg-muted border border-border rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                  >
                    {typeOptions.map((type) => (
                      <option key={type} value={type}>{type === "الكل" ? "جميع الأنواع" : type}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>

                <span className="text-sm text-muted-foreground mr-auto">{filteredProducts.length} منتج</span>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <section className="py-12 bg-background">
            <div className="container mx-auto px-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-10 w-10 animate-spin text-secondary" />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>
              )}

              {!isLoading && filteredProducts.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-xl text-muted-foreground">لا توجد منتجات تطابق معايير البحث</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={resetFilters}
                  >
                    إعادة تعيين الفلاتر
                  </Button>
                </div>
              )}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Products;
