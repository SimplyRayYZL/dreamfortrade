import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageBanner from "@/components/common/PageBanner";
import { Button } from "@/components/ui/button";
import { Filter, ChevronDown, Loader2, X, SlidersHorizontal } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts, useBrands } from "@/hooks/useProducts";
import ProductCard from "@/components/products/ProductCard";
import { usePageBanner, defaultPageBanners } from "@/hooks/usePageBanner";
import productsBanner from "@/assets/banners/products-banner.jpg";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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

  // Pagination State
  const [visibleCount, setVisibleCount] = useState(12);

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

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(12);
  }, [selectedBrand, selectedCapacity, selectedType, selectedInverter]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 12);
  };

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

          {/* Filters Bar (Desktop & Mobile Trigger) */}
          <div className="bg-gradient-to-r from-card to-card/80 border-b border-border shadow-sm sticky top-[72px] md:top-[136px] z-40 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-3 md:py-5">
              <div className="flex flex-wrap items-center justify-between gap-4">

                {/* Mobile: Filter Sheet Trigger */}
                <div className="md:hidden w-full flex gap-2">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="flex-1 gap-2 h-12 text-base font-medium border-secondary/20 bg-secondary/5 hover:bg-secondary/10 hover:border-secondary">
                        <SlidersHorizontal className="h-5 w-5 text-secondary" />
                        تصفية متقدمة
                        {hasActiveFilters && (
                          <span className="bg-secondary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full mr-1">
                            !
                          </span>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-[85vh] rounded-t-[20px] px-0">
                      <SheetHeader className="px-6 pb-4 border-b">
                        <SheetTitle className="text-xl font-bold flex items-center gap-2">
                          <Filter className="h-5 w-5 text-secondary" />
                          تصفية المنتجات
                        </SheetTitle>
                        <SheetDescription>
                          قم باختيار المواصفات التي تناسب احتياجاتك
                        </SheetDescription>
                      </SheetHeader>
                      <div className="px-6 py-6 space-y-6 overflow-y-auto max-h-[calc(85vh-120px)]">
                        {/* Mobile Filters Content */}
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">الماركة</label>
                            <div className="grid grid-cols-2 gap-2">
                              {brandOptions.map(brand => (
                                <button
                                  key={brand}
                                  onClick={() => handleBrandChange(brand)}
                                  className={`p-3 rounded-xl border text-sm font-medium transition-all ${selectedBrand === brand ? 'border-secondary bg-secondary/10 text-secondary' : 'border-border hover:border-secondary/50'}`}
                                >
                                  {brand === "الكل" ? "جميع الماركات" : brand}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">القدرة</label>
                            <div className="grid grid-cols-2 gap-2">
                              {capacityOptions.map(cap => (
                                <button
                                  key={cap}
                                  onClick={() => handleCapacityChange(cap)}
                                  className={`p-3 rounded-xl border text-sm font-medium transition-all ${selectedCapacity === cap ? 'border-secondary bg-secondary/10 text-secondary' : 'border-border hover:border-secondary/50'}`}
                                >
                                  {cap === "الكل" ? "كل القدرات" : cap}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">النوع</label>
                            <div className="flex gap-2">
                              {typeOptions.map(type => (
                                <button
                                  key={type}
                                  onClick={() => handleTypeChange(type)}
                                  className={`flex-1 p-3 rounded-xl border text-sm font-medium transition-all ${selectedType === type ? 'border-secondary bg-secondary/10 text-secondary' : 'border-border hover:border-secondary/50'}`}
                                >
                                  {type === "الكل" ? "الكل" : type}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">التقنية</label>
                            <div className="flex gap-2">
                              {inverterFilterOptions.map(tech => (
                                <button
                                  key={tech}
                                  onClick={() => handleInverterChange(tech)}
                                  className={`flex-1 p-3 rounded-xl border text-sm font-medium transition-all ${selectedInverter === tech ? 'border-secondary bg-secondary/10 text-secondary' : 'border-border hover:border-secondary/50'}`}
                                >
                                  {tech === "الكل" ? "الكل" : tech}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Mobile Reset Button */}
                        {hasActiveFilters && (
                          <Button
                            variant="destructive"
                            className="w-full gap-2 mt-4"
                            onClick={() => {
                              resetFilters();
                              // Optional: Close sheet logic if controlled
                            }}
                          >
                            <X className="h-4 w-4" />
                            مسح جميع الفلاتر
                          </Button>
                        )}
                      </div>
                    </SheetContent>
                  </Sheet>

                  {/* Result Count Mobile */}
                  <div className="flex items-center justify-center bg-secondary/10 rounded-xl px-4 min-w-[100px]">
                    <span className="font-bold text-secondary">{filteredProducts.length}</span>
                    <span className="text-xs text-muted-foreground mr-1">منتج</span>
                  </div>
                </div>

                {/* Desktop Filters (Hidden on Mobile) */}
                <div className="hidden md:flex flex-wrap items-center gap-3 flex-1">
                  <div className="flex items-center gap-2 text-secondary ml-4">
                    <div className="w-9 h-9 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <Filter className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-foreground">تصفية المنتجات</span>
                  </div>

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

                  {/* Desktop Count */}
                  <div className="mr-auto flex items-center gap-2 bg-secondary/10 rounded-full px-4 py-2">
                    <span className="text-xl font-bold text-secondary">{filteredProducts.length}</span>
                    <span className="text-sm text-muted-foreground">منتج</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Products Grid */}
          <section className="py-12 bg-background">
            <div className="container mx-auto px-4">
              <div className="flex flex-col gap-8">
                {isLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-10 w-10 animate-spin text-secondary" />
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                      {filteredProducts.slice(0, visibleCount).map((product, index) => (
                        <ProductCard key={product.id} product={product} index={index} />
                      ))}
                    </div>

                    {/* Load More Button */}
                    {visibleCount < filteredProducts.length && (
                      <div className="flex justify-center mt-8">
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={handleLoadMore}
                          className="min-w-[200px] border-secondary text-secondary hover:bg-secondary hover:text-white transition-all transform hover:scale-105"
                        >
                          عرض المزيد من المنتجات ({filteredProducts.length - visibleCount})
                        </Button>
                      </div>
                    )}
                  </>
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
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Products;

