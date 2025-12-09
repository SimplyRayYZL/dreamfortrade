import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Eye, Star, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
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

  // Get first 6 products for homepage
  const featuredProducts = products.slice(0, 6);

  const getProductImage = (product: typeof products[0], index: number) => {
    if (product.image_url) {
      return product.image_url;
    }
    return fallbackImages[index % fallbackImages.length];
  };

  const handleAddToCart = (e: React.MouseEvent, product: typeof products[0], index: number) => {
    e.preventDefault();
    e.stopPropagation();
    const cartProduct = {
      id: parseInt(product.id) || index + 1,
      name: product.name,
      brand: product.brand,
      price: product.price,
      oldPrice: product.oldPrice || undefined,
      rating: product.rating,
      reviews: product.reviews,
      capacity: product.capacity || "",
      type: product.type || "",
      features: product.features,
      model: product.model || undefined,
      image: product.image_url || fallbackImages[index % fallbackImages.length],
    };
    addToCart(cartProduct);
    toast.success("تمت الإضافة إلى السلة");
  };

  return (
    <section className="py-16 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header with animation */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 opacity-0 animate-[slide-up_0.8s_ease-out_forwards]">
          <div className="text-center md:text-right mb-6 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              أحدث <span className="text-secondary">المنتجات</span>
            </h2>
            <p className="text-muted-foreground max-w-xl">
              اكتشف مجموعتنا الواسعة من التكييفات العصرية بأفضل الأسعار
            </p>
          </div>
          <Link to="/products">
            <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground transition-all duration-300 hover:scale-105">
              عرض جميع المنتجات
            </Button>
          </Link>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-secondary" />
          </div>
        ) : (
          /* Products Grid with staggered animations */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product, index) => (
              <div
                key={product.id}
                className="group card-dream overflow-hidden opacity-0 animate-[slide-up_0.6s_ease-out_forwards]"
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                {/* Product Image */}
                <Link to={`/product/${product.id}`}>
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-muted to-background rounded-xl mb-4 overflow-hidden">
                    {/* Discount Badge */}
                    {product.oldPrice && (
                      <div className="absolute top-3 right-3 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-bold z-10 animate-pulse">
                        خصم {Math.round((1 - product.price / product.oldPrice) * 100)}%
                      </div>
                    )}

                    {/* Wishlist & Quick View */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 z-10">
                      <button className="w-9 h-9 rounded-full bg-card shadow-md flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors">
                        <Heart className="h-4 w-4" />
                      </button>
                      <button className="w-9 h-9 rounded-full bg-card shadow-md flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Product Image with hover zoom */}
                    <img 
                      src={getProductImage(product, index)} 
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-contain p-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
                      onError={(e) => {
                        e.currentTarget.src = fallbackImages[index % fallbackImages.length];
                      }}
                    />

                    {/* Brand Badge */}
                    <div className="absolute bottom-3 right-3 bg-card/90 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-medium z-10">
                      {product.brand}
                    </div>
                  </div>
                </Link>

                {/* Product Info */}
                <div className="space-y-3">
                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 transition-all duration-300 ${
                            i < Math.floor(product.rating)
                              ? "fill-dream-gold text-dream-gold"
                              : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({product.reviews} تقييم)
                    </span>
                  </div>

                  {/* Title */}
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-bold text-lg text-foreground group-hover:text-secondary transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2">
                    {product.features.slice(0, 3).map((feature, featureIndex) => (
                      <span
                        key={feature}
                        className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md transition-all duration-300 hover:bg-secondary/20"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      {product.price > 0 ? (
                        <>
                          <span className="text-2xl font-bold text-secondary">
                            {product.price.toLocaleString()}
                          </span>
                          <span className="text-sm text-muted-foreground">ج.م</span>
                          {product.oldPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              {product.oldPrice.toLocaleString()}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-lg font-bold text-secondary">اتصل للسعر</span>
                      )}
                    </div>
                  </div>

                  {/* Add to Cart */}
                  <Button 
                    onClick={(e) => handleAddToCart(e, product, index)}
                    className="w-full bg-secondary hover:bg-accent text-secondary-foreground gap-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    أضف للسلة
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;
