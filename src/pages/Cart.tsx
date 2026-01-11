import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, ShoppingCart, Package, Truck, Shield, CheckCircle, Sparkles } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { useEffect } from "react";
import { trackViewCart } from "@/lib/analytics";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  // Track cart view
  useEffect(() => {
    trackViewCart();
  }, []);

  return (
    <>
      <Helmet>
        <title>سلة التسوق | دريم للتجارة والتوريدات</title>
        <meta name="description" content="سلة التسوق الخاصة بك - دريم للتجارة والتوريدات" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-muted/30">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary py-8">
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                  <ShoppingBag className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">سلة التسوق</h1>
                  <p className="text-white/80 text-sm">{items.length} منتج في السلة</p>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8">
            {items.length === 0 ? (
              <div className="text-center py-20 bg-card rounded-3xl shadow-lg">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground/50" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">السلة فارغة</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  لم تقم بإضافة أي منتجات إلى سلة التسوق بعد. تصفح منتجاتنا واختر ما يناسبك!
                </p>
                <Link to="/products">
                  <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white rounded-full px-8 gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    تصفح المنتجات
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                  {items.map((item, index) => (
                    <div
                      key={item.product.id}
                      className="bg-card rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-lg transition-all flex flex-col sm:flex-row gap-4 opacity-0 animate-[slide-up_0.5s_ease-out_forwards]"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <Link to={`/product/${item.product.id}`} className="flex-shrink-0">
                        {item.product.image_url ? (
                          <img
                            src={item.product.image_url}
                            alt={item.product.name}
                            className="w-full sm:w-32 h-32 object-contain rounded-xl bg-muted p-2"
                          />
                        ) : (
                          <div className="w-full sm:w-32 h-32 rounded-xl bg-muted flex items-center justify-center">
                            <Package className="w-10 h-10 text-muted-foreground/50" />
                          </div>
                        )}
                      </Link>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <Link to={`/product/${item.product.id}`}>
                            <h3 className="font-bold text-foreground hover:text-secondary transition-colors line-clamp-2">
                              {item.product.name}
                            </h3>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mt-1"
                            onClick={() => removeFromCart(item.product.id)}
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                        <p className="text-muted-foreground text-sm mb-3">
                          {item.product.brand} • {item.product.capacity}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 bg-muted rounded-full p-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full hover:bg-secondary hover:text-white"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-bold">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full hover:bg-secondary hover:text-white"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-secondary font-bold text-xl">
                            {(item.product.price * item.quantity).toLocaleString()} <span className="text-sm text-muted-foreground">جنيه</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-dashed border-2 h-12 text-muted-foreground hover:text-destructive hover:border-destructive"
                    onClick={clearCart}
                  >
                    <Trash2 className="h-4 w-4 ml-2" />
                    إفراغ السلة
                  </Button>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-card rounded-3xl p-6 shadow-lg sticky top-24">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-secondary" />
                      </div>
                      <h2 className="text-xl font-bold text-foreground">ملخص الطلب</h2>
                    </div>

                    <div className="space-y-4 border-b border-border pb-6 mb-6">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">عدد المنتجات</span>
                        <span className="font-bold">{items.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">إجمالي الكميات</span>
                        <span className="font-bold">
                          {items.reduce((sum, item) => sum + item.quantity, 0)} قطعة
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">التوصيل</span>
                        <span className="text-green-600 font-bold flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          مجاني
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-6 p-4 bg-secondary/10 rounded-2xl">
                      <span className="text-lg font-bold text-foreground">الإجمالي</span>
                      <div className="text-left">
                        <span className="text-2xl font-bold text-secondary block">
                          {totalPrice.toLocaleString()}
                        </span>
                        <span className="text-sm text-muted-foreground">جنيه مصري</span>
                      </div>
                    </div>

                    <Link to="/checkout" className="block mb-3">
                      <Button size="lg" className="w-full bg-secondary hover:bg-secondary/90 text-white rounded-xl h-14 text-lg font-bold gap-2">
                        إتمام الشراء
                        <ArrowLeft className="h-5 w-5" />
                      </Button>
                    </Link>

                    <Link to="/products" className="block">
                      <Button variant="outline" className="w-full rounded-xl h-12">
                        <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                        متابعة التسوق
                      </Button>
                    </Link>

                    {/* Trust badges */}
                    <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Truck className="h-4 w-4 text-secondary" />
                        <span>توصيل سريع</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Shield className="h-4 w-4 text-secondary" />
                        <span>ضمان 5 سنوات</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Cart;
