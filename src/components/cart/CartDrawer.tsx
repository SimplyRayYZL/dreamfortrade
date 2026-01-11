import { Link } from "react-router-dom";
import { ShoppingBag, Trash2, Plus, Minus, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { ScrollArea } from "@/components/ui/scroll-area";

import acProduct5 from "@/assets/products/ac-product-5.png";
import acProduct6 from "@/assets/products/ac-product-6.png";
import acProduct7 from "@/assets/products/ac-product-7.png";
import acProduct8 from "@/assets/products/ac-product-8.png";

const productImages = [acProduct5, acProduct6, acProduct7, acProduct8];

const getProductImage = (index: number) => {
  return productImages[index % productImages.length];
};

interface CartDrawerProps {
  children: React.ReactNode;
}

const CartDrawer = ({ children }: CartDrawerProps) => {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="left" className="w-full sm:max-w-md">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <ShoppingBag className="h-6 w-6 text-secondary" />
            سلة التسوق
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <ShoppingBag className="h-20 w-20 text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">السلة فارغة</h3>
            <p className="text-muted-foreground mb-6">أضف منتجات إلى سلة التسوق</p>
            <Link to="/products">
              <Button className="btn-dream-primary">تصفح المنتجات</Button>
            </Link>
          </div>
        ) : (
          <>
            <ScrollArea className="h-[calc(100vh-280px)] mt-4">
              <div className="space-y-4 pr-4">
                {items.map((item, index) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-3 rounded-xl bg-muted/50"
                  >
                    <img
                      src={getProductImage(index)}
                      alt={item.product.name}
                      className="w-20 h-20 object-contain rounded-lg bg-card"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground line-clamp-2 text-sm">
                        {item.product.name}
                      </h4>
                      <p className="text-secondary font-bold mt-1">
                        {item.product.price.toLocaleString()} جنيه
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => removeFromCart(item.product.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-card border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">الإجمالي:</span>
                <span className="text-2xl font-bold text-secondary">
                  {totalPrice.toLocaleString()} جنيه
                </span>
              </div>
              <div className="space-y-2">
                <Link to="/cart" className="block">
                  <Button className="w-full btn-dream-primary">
                    إتمام الشراء
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={clearCart}
                >
                  <Trash2 className="h-4 w-4 ml-2" />
                  إفراغ السلة
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
