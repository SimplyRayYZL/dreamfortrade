import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Heart, Trash2, ShoppingCart, Star } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

import acProduct5 from "@/assets/products/ac-product-5.png";
import acProduct6 from "@/assets/products/ac-product-6.png";
import acProduct7 from "@/assets/products/ac-product-7.png";
import acProduct8 from "@/assets/products/ac-product-8.png";

const productImages = [acProduct5, acProduct6, acProduct7, acProduct8];

const getProductImage = (index: number) => {
  return productImages[index % productImages.length];
};

const Wishlist = () => {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product: typeof items[0]) => {
    addToCart(product);
    toast.success("تمت الإضافة إلى السلة");
  };

  return (
    <>
      <Helmet>
        <title>قائمة الأمنيات | Dream For Trade</title>
        <meta name="description" content="قائمة الأمنيات الخاصة بك - Dream For Trade" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-8 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Heart className="h-8 w-8 text-destructive" />
                <h1 className="text-3xl font-bold text-foreground">قائمة الأمنيات</h1>
                <span className="text-muted-foreground">({items.length} منتج)</span>
              </div>
              {items.length > 0 && (
                <Button variant="outline" onClick={clearWishlist}>
                  <Trash2 className="h-4 w-4 ml-2" />
                  مسح الكل
                </Button>
              )}
            </div>

            {items.length === 0 ? (
              <div className="text-center py-16 card-dream">
                <Heart className="h-24 w-24 text-muted-foreground/30 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-foreground mb-4">القائمة فارغة</h2>
                <p className="text-muted-foreground mb-8">
                  لم تقم بإضافة أي منتجات إلى قائمة الأمنيات بعد
                </p>
                <Link to="/products">
                  <Button className="btn-dream-primary">
                    تصفح المنتجات
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((product, index) => (
                  <div key={product.id} className="card-dream group">
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <Link to={`/product/${product.id}`}>
                        <img
                          src={getProductImage(index)}
                          alt={product.name}
                          className="w-full h-48 object-contain bg-muted group-hover:scale-105 transition-transform"
                        />
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 left-2 bg-card/80 hover:bg-destructive hover:text-white"
                        onClick={() => removeFromWishlist(product.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-secondary">{product.brand}</span>
                      <Link to={`/product/${product.id}`}>
                        <h3 className="font-bold text-foreground line-clamp-2 hover:text-secondary transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating)
                                ? "fill-dream-gold text-dream-gold"
                                : "text-muted"
                            }`}
                          />
                        ))}
                        <span className="text-sm text-muted-foreground mr-2">
                          ({product.reviews})
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-secondary">
                          {product.price.toLocaleString()} جنيه
                        </span>
                        {product.oldPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {product.oldPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <Button
                        className="w-full btn-dream-primary mt-4"
                        onClick={() => handleAddToCart(product)}
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
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Wishlist;
