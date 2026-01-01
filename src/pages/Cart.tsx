import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, ShoppingCart, Package } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  const handleCheckout = () => {
    toast.success("سيتم التواصل معك قريباً لإتمام الطلب!");
  };

  return (
    <>
      <Helmet>
        <title>سلة التسوق | تارجت لأعمال التكييف</title>
        <meta name="description" content="سلة التسوق الخاصة بك - ????? ?????? ???????" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-8 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 mb-8">
              <ShoppingBag className="h-8 w-8 text-secondary" />
              <h1 className="text-3xl font-bold text-foreground">سلة التسوق</h1>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-16 card-dream">
                <ShoppingCart className="h-24 w-24 text-muted-foreground/30 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-foreground mb-4">السلة فارغة</h2>
                <p className="text-muted-foreground mb-8">
                  لم تقم بإضافة أي منتجات إلى سلة التسوق بعد
                </p>
                <Link to="/products">
                  <Button className="btn-dream-primary">
                    <ShoppingBag className="h-5 w-5" />
                    تصفح المنتجات
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="card-dream flex flex-col sm:flex-row gap-4"
                    >
                      <Link to={`/product/${item.product.id}`}>
                        {item.product.image_url ? (
                          <img
                            src={item.product.image_url}
                            alt={item.product.name}
                            className="w-full sm:w-32 h-32 object-contain rounded-xl bg-muted"
                          />
                        ) : (
                          <div className="w-full sm:w-32 h-32 rounded-xl bg-muted flex items-center justify-center">
                            <Package className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                      </Link>
                      <div className="flex-1">
                        <Link to={`/product/${item.product.id}`}>
                          <h3 className="font-bold text-foreground hover:text-secondary transition-colors">
                            {item.product.name}
                          </h3>
                        </Link>
                        <p className="text-muted-foreground text-sm mt-1">
                          {item.product.brand} • {item.product.capacity}
                        </p>
                        <p className="text-secondary font-bold text-xl mt-2">
                          {(item.product.price || 0).toLocaleString()} جنيه
                        </p>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-10 text-center font-bold text-lg">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => removeFromCart(item.product.id)}
                          >
                            <Trash2 className="h-5 w-5 ml-2" />
                            حذف
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={clearCart}
                  >
                    <Trash2 className="h-4 w-4 ml-2" />
                    إفراغ السلة
                  </Button>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="card-dream sticky top-24">
                    <h2 className="text-xl font-bold text-foreground mb-6">ملخص الطلب</h2>

                    <div className="space-y-3 border-b pb-4 mb-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">عدد المنتجات:</span>
                        <span className="font-semibold">{items.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">إجمالي الكميات:</span>
                        <span className="font-semibold">
                          {items.reduce((sum, item) => sum + item.quantity, 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">التوصيل:</span>
                        <span className="text-green-600 font-semibold">مجاني</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-6">
                      <span className="text-lg font-bold">الإجمالي:</span>
                      <span className="text-2xl font-bold text-secondary">
                        {totalPrice.toLocaleString()} جنيه
                      </span>
                    </div>

                    <Link to="/checkout" className="block">
                      <Button className="w-full btn-dream-primary mb-3">
                        إتمام الشراء
                      </Button>
                    </Link>

                    <Link to="/products" className="block">
                      <Button variant="outline" className="w-full">
                        <ArrowLeft className="h-4 w-4 ml-2" />
                        متابعة التسوق
                      </Button>
                    </Link>
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

