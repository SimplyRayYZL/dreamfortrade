import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Heart, Trash2, ShoppingCart, Star, ShoppingBag, Package } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const Wishlist = () => {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product: typeof items[0]) => {
    addToCart(product);
    toast.success("تمت الإضافة إلى السلة");
  };

  const handleAddAllToCart = () => {
    items.forEach(product => addToCart(product));
    toast.success("تمت إضافة جميع المنتجات للسلة");
  };

  return (
    <>
      <Helmet>
        <title>قائمة المفضلة | دريم للتجارة والتوريدات</title>
        <meta name="description" content="قائمة المفضلة الخاصة بك - دريم للتجارة والتوريدات" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-muted/30">
          {/* Header */}
          <div className="bg-gradient-to-r from-rose-500 to-pink-500 py-8">
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Heart className="h-7 w-7 text-white fill-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">قائمة المفضلة</h1>
                  <p className="text-white/80 text-sm">{items.length} منتج محفوظ</p>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8">
            {items.length === 0 ? (
              <div className="text-center py-20 bg-card rounded-3xl shadow-lg">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-rose-100 flex items-center justify-center">
                  <Heart className="h-12 w-12 text-rose-300" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">القائمة فارغة</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  لم تقم بإضافة أي منتجات إلى قائمة المفضلة بعد. تصفح منتجاتنا واحفظ ما يعجبك!
                </p>
                <Link to="/products">
                  <Button size="lg" className="bg-rose-500 hover:bg-rose-600 text-white rounded-full px-8 gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    تصفح المنتجات
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                {/* Action buttons */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <Button
                    onClick={handleAddAllToCart}
                    className="bg-secondary hover:bg-secondary/90 text-white rounded-full gap-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    أضف الكل للسلة
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearWishlist}
                    className="rounded-full border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    مسح الكل
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {items.map((product, index) => (
                    <div
                      key={product.id}
                      className="bg-card rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-500 group opacity-0 animate-[scale-in_0.5s_ease-out_forwards]"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="relative overflow-hidden rounded-xl mb-4 bg-muted aspect-square">
                        <Link to={`/product/${product.id}`}>
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-16 w-16 text-muted-foreground/30" />
                            </div>
                          )}
                        </Link>

                        {/* Discount badge */}
                        {product.oldPrice && (
                          <div className="absolute top-2 right-2 bg-rose-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                            خصم {Math.round((1 - product.price / product.oldPrice) * 100)}%
                          </div>
                        )}

                        {/* Remove button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white/90 shadow hover:bg-rose-500 hover:text-white transition-colors"
                          onClick={() => removeFromWishlist(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <span className="text-xs font-semibold text-secondary">{product.brand}</span>
                        <Link to={`/product/${product.id}`}>
                          <h3 className="font-bold text-sm text-foreground line-clamp-2 hover:text-secondary transition-colors">
                            {product.name}
                          </h3>
                        </Link>

                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${i < Math.floor(product.rating)
                                ? "fill-dream-gold text-dream-gold"
                                : "text-muted"
                                }`}
                            />
                          ))}
                          <span className="text-xs text-muted-foreground mr-1">
                            ({product.reviews})
                          </span>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-lg font-bold text-secondary">
                            {product.price.toLocaleString()}
                          </span>
                          <span className="text-xs text-muted-foreground">جنيه</span>
                          {product.oldPrice && (
                            <span className="text-xs text-muted-foreground line-through">
                              {product.oldPrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        <Button
                          className="w-full bg-secondary hover:bg-secondary/90 text-white rounded-xl h-10 gap-2 mt-3"
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingCart className="h-4 w-4" />
                          أضف للسلة
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Wishlist;
