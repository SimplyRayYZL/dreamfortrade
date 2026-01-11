import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Star, Loader2, Sparkles, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { useSiteSettings } from "@/hooks/useSettings";
import { toast } from "sonner";

// Fallback images
import acProduct1 from "@/assets/products/ac-white-1.png";
import acProduct2 from "@/assets/products/ac-white-2.png";
import acProduct3 from "@/assets/products/ac-white-3.png";
import acProduct4 from "@/assets/products/ac-white-4.png";

const fallbackImages = [acProduct1, acProduct2, acProduct3, acProduct4];

const ProductsSection = () => {
  const { data: products = [], isLoading } = useProducts();
  const { addToCart } = useCart();
  const { data: settings } = useSiteSettings();
  const whatsappNumber = settings?.store_whatsapp || "201289006310";

  // Get first 6 products for homepage
  const featuredProducts = products.slice(0, 6);

  const getProductImage = (product: typeof products[0], index: number) => {
    if (product.image_url) {
      return product.image_url;
    }
    return fallbackImages[index % fallbackImages.length];
  };

  const handleAddToCart = (e: React.MouseEvent, product: typeof products[0]) => {
    e.preventDefault();
    e.stopPropagation();
    const result = addToCart(product);
    if (result === 'added') {
      toast.success("تمت الإضافة إلى السلة");
    }
    // 'exists' case already shows toast in addToCart
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30 overflow-hidden relative">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-10 w-72 h-72 bg-secondary rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Section Header with animation */}
        <div className="text-center mb-14">
          <div data-aos="zoom-in" className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            <span>أفضل العروض</span>
          </div>
          <h2 data-aos="fade-up" data-aos-delay="100" className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            أحدث <span className="text-secondary">المنتجات</span>
          </h2>
          <p data-aos="fade-up" data-aos-delay="200" className="text-muted-foreground max-w-xl mx-auto">
            اكتشف مجموعتنا الواسعة من التكييفات العصرية بأفضل الأسعار
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-secondary" />
          </div>
        ) : (
          /* Products Grid - 2 columns on mobile, 3 on desktop */
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {featuredProducts.map((product, index) => (
              <div
                key={product.id}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="group bg-card rounded-2xl lg:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
              >
                {/* Product Image */}
                <Link to={`/product/${product.id}`}>
                  <div className="relative aspect-square bg-gradient-to-br from-muted to-background overflow-hidden">
                    {/* Discount Badge */}
                    {product.oldPrice && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-rose-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10 shadow-lg">
                        خصم {Math.round((1 - product.price / product.oldPrice) * 100)}%
                      </div>
                    )}

                    {/* Wishlist */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 z-10">
                      <button className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors">
                        <Heart className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Product Image with hover zoom */}
                    <img
                      src={getProductImage(product, index)}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-contain p-4 transition-all duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.src = fallbackImages[index % fallbackImages.length];
                      }}
                    />

                    {/* Brand Badge */}
                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-secondary z-10 shadow">
                      {product.brand}
                    </div>
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-4 lg:p-5 space-y-3">
                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${i < Math.floor(product.rating)
                            ? "fill-dream-gold text-dream-gold"
                            : "text-muted"
                            }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({product.reviews})
                    </span>
                  </div>

                  {/* Title */}
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-bold text-sm md:text-base text-foreground group-hover:text-secondary transition-colors line-clamp-2 min-h-[2.5rem]">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1.5">
                    {product.features.slice(0, 2).map((feature) => (
                      <span
                        key={feature}
                        className="text-[10px] bg-muted text-muted-foreground px-2 py-1 rounded-md"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 pt-1">
                    {product.price > 0 ? (
                      <>
                        <span className="text-lg md:text-xl font-bold text-secondary">
                          {product.price.toLocaleString()}
                        </span>
                        <span className="text-xs text-muted-foreground">ج.م</span>
                        {product.oldPrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            {product.oldPrice.toLocaleString()}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-sm font-bold text-secondary">اتصل للسعر</span>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col gap-2 pt-2">
                    <a
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                        `🛒 *استفسار عن منتج*\n\n` +
                        `📦 *المنتج:* ${product.name}\n` +
                        `🏷️ *الماركة:* ${product.brand}\n` +
                        `💰 *السعر:* ${product.price > 0 ? `${product.price.toLocaleString()} ج.م` : 'اتصل للسعر'}\n` +
                        (product.oldPrice ? `🔥 *السعر قبل الخصم:* ${product.oldPrice.toLocaleString()} ج.م\n` : '') +
                        `\nأريد الاستفسار عن هذا المنتج`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-full"
                    >
                      <Button
                        className="w-full bg-green-500 hover:bg-green-600 text-white h-10 gap-2 rounded-xl text-sm font-semibold"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        واتساب
                      </Button>
                    </a>
                    <Button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="w-full bg-secondary hover:bg-accent text-white gap-2 transition-all duration-300 h-10 rounded-xl text-sm font-semibold"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      أضف للسلة
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12 opacity-0 animate-[slide-up_0.8s_ease-out_0.5s_forwards]">
          <Link to="/products">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white rounded-full px-8 gap-2 font-bold">
              عرض جميع المنتجات
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
