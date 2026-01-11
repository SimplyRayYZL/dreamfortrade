import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageBanner from "@/components/common/PageBanner";
import { Button } from "@/components/ui/button";
import { Filter, ChevronDown, Loader2, X } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts, useBrands } from "@/hooks/useProducts";
import ProductCard from "@/components/products/ProductCard";
import { usePageBanner, defaultPageBanners } from "@/hooks/usePageBanner";
import productsBanner from "@/assets/banners/products-banner.jpg";

const capacities = ["1.5 حصان", "2.25 حصان", "3 حصان", "4 حصان", "5 حصان"];
const types = ["بارد فقط", "بارد ساخن"];
const inverterOptions = ["عادي", "انفرتر"];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Fetch dynamic page banner
  const { data: pageBanner } = usePageBanner("products");

  // Read all filters from URL
  const brandFromUrl = searchParams.get("brand") || "الكل";
  const capacityFromUrl = searchParams.get("capacity") || "الكل";
  const typeFromUrl = searchParams.get("type") || "الكل";
  const inverterFromUrl = searchParams.get("inverter") || "الكل";

  const [selectedBrand, setSelectedBrand] = useState(brandFromUrl);
  const [selectedCapacity, setSelectedCapacity] = useState(capacityFromUrl);
  const [selectedType, setSelectedType] = useState(typeFromUrl);
  const [selectedInverter, setSelectedInverter] = useState(inverterFromUrl);

  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: brands = [], isLoading: brandsLoading } = useBrands();

  // Sync state with URL on mount and URL changes
  useEffect(() => {
    setSelectedBrand(searchParams.get("brand") || "الكل");
    setSelectedCapacity(searchParams.get("capacity") || "الكل");
    setSelectedType(searchParams.get("type") || "الكل");
    setSelectedInverter(searchParams.get("inverter") || "الكل");
  }, [searchParams]);

  // Generic function to update URL params
  const updateUrlParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === "الكل") {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  // Filter handlers
  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    updateUrlParam("brand", brand);
  };

  const handleCapacityChange = (capacity: string) => {
    setSelectedCapacity(capacity);
    updateUrlParam("capacity", capacity);
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    updateUrlParam("type", type);
  };

  const handleInverterChange = (inverter: string) => {
    setSelectedInverter(inverter);
    updateUrlParam("inverter", inverter);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const brandMatch = selectedBrand === "الكل" || product.brand === selectedBrand;
      const capacityMatch = selectedCapacity === "الكل" || product.capacity === selectedCapacity;
      const typeMatch = selectedType === "الكل" || product.type === selectedType;

      // Inverter filter logic - check if product name contains "انفرتر" or "Inverter"
      let inverterMatch = true;
      if (selectedInverter === "انفرتر") {
        inverterMatch = product.name?.toLowerCase().includes("انفرتر") ||
          product.name?.toLowerCase().includes("inverter");
      } else if (selectedInverter === "عادي") {
        inverterMatch = !product.name?.toLowerCase().includes("انفرتر") &&
          !product.name?.toLowerCase().includes("inverter");
      }

      return brandMatch && capacityMatch && typeMatch && inverterMatch;
    });
  }, [products, selectedBrand, selectedCapacity, selectedType, selectedInverter]);

  const brandOptions = useMemo(() => {
    return ["الكل", ...brands.map(b => b.name)];
  }, [brands]);

  const capacityOptions = ["الكل", ...capacities];
  const typeOptions = ["الكل", ...types];
  const inverterFilterOptions = ["الكل", ...inverterOptions];

  const resetFilters = () => {
    setSelectedBrand("الكل");
    setSelectedCapacity("الكل");
    setSelectedType("الكل");
    setSelectedInverter("الكل");
    setSearchParams({});
  };

  const hasActiveFilters = selectedBrand !== "الكل" || selectedCapacity !== "الكل" ||
    selectedType !== "الكل" || selectedInverter !== "الكل";

  const isLoading = productsLoading || brandsLoading;

  return (
    <>
      <Helmet>
        <title>منتجاتنا | دريم للتجارة والتوريدات - أفضل تكييفات كاريير، هاير، ميديا</title>
        <meta name="description" content="تصفح مجموعتنا الواسعة من التكييفات من أشهر الماركات العالمية في مصر. كاريير، هاير، ميديا بأسعار تبدأ من 15,000 جنيه. توصيل وتركيب مجاني." />
        <meta name="keywords" content="تكييفات, تكييف كاريير, تكييف هاير, تكييف ميديا, تكييف انفرتر, اسعار التكييفات في مصر 2025" />
        <link rel="canonical" href="https://dreamfortrade.com/products" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {/* Page Banner */}
          <PageBanner
            title={selectedBrand !== "الكل" ? `تكييفات ${selectedBrand}` : (pageBanner?.title || defaultPageBanners.products.title)}
            subtitle={pageBanner?.subtitle || defaultPageBanners.products.subtitle}
            backgroundImage={pageBanner?.image_url || productsBanner}
            showCTA={false}
          />

          {/* Filters */}
          <div className="bg-gradient-to-r from-card to-card/80 border-b border-border shadow-sm sticky top-[72px] md:top-[136px] z-40 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-5">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-secondary">
                  <div className="w-9 h-9 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <Filter className="h-5 w-5" />
                  </div>
                  <span className="font-bold text-foreground">تصفية المنتجات</span>
                </div>

                <div className="flex flex-wrap items-center gap-3 flex-1">
                  {/* Brand Filter */}
                  <div className="relative group">
                    <select
                      value={selectedBrand}
                      onChange={(e) => handleBrandChange(e.target.value)}
                      className={`appearance-none cursor-pointer bg-background border-2 rounded-xl px-5 py-2.5 pr-10 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary hover:border-secondary/50 ${selectedBrand !== "الكل" ? "border-secondary bg-secondary/5 text-secondary" : "border-border"}`}
                    >
                      {brandOptions.map((brand) => (
                        <option key={brand} value={brand}>{brand === "الكل" ? "الماركة" : brand}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none group-hover:text-secondary transition-colors" />
                  </div>

                  {/* Capacity Filter */}
                  <div className="relative group">
                    <select
                      value={selectedCapacity}
                      onChange={(e) => handleCapacityChange(e.target.value)}
                      className={`appearance-none cursor-pointer bg-background border-2 rounded-xl px-5 py-2.5 pr-10 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary hover:border-secondary/50 ${selectedCapacity !== "الكل" ? "border-secondary bg-secondary/5 text-secondary" : "border-border"}`}
                    >
                      {capacityOptions.map((capacity) => (
                        <option key={capacity} value={capacity}>{capacity === "الكل" ? "القدرة" : capacity}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none group-hover:text-secondary transition-colors" />
                  </div>

                  {/* Type Filter (Hot/Cold) */}
                  <div className="relative group">
                    <select
                      value={selectedType}
                      onChange={(e) => handleTypeChange(e.target.value)}
                      className={`appearance-none cursor-pointer bg-background border-2 rounded-xl px-5 py-2.5 pr-10 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary hover:border-secondary/50 ${selectedType !== "الكل" ? "border-secondary bg-secondary/5 text-secondary" : "border-border"}`}
                    >
                      {typeOptions.map((type) => (
                        <option key={type} value={type}>{type === "الكل" ? "النوع" : type}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none group-hover:text-secondary transition-colors" />
                  </div>

                  {/* Inverter Filter */}
                  <div className="relative group">
                    <select
                      value={selectedInverter}
                      onChange={(e) => handleInverterChange(e.target.value)}
                      className={`appearance-none cursor-pointer bg-background border-2 rounded-xl px-5 py-2.5 pr-10 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary hover:border-secondary/50 ${selectedInverter !== "الكل" ? "border-secondary bg-secondary/5 text-secondary" : "border-border"}`}
                    >
                      {inverterFilterOptions.map((inv) => (
                        <option key={inv} value={inv}>{inv === "الكل" ? "التقنية" : inv}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none group-hover:text-secondary transition-colors" />
                  </div>

                  {/* Reset Filters Button */}
                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetFilters}
                      className="border-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive rounded-xl px-4 py-2 font-medium transition-all duration-200"
                    >
                      <X className="h-4 w-4 ml-1" />
                      مسح الكل
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-2 bg-secondary/10 rounded-full px-4 py-2">
                  <span className="text-xl font-bold text-secondary">{filteredProducts.length}</span>
                  <span className="text-sm text-muted-foreground">منتج</span>
                </div>
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
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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

