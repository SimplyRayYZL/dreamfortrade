import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/hooks/useProducts";
import { trackAddToCart } from "@/lib/analytics";
import { toast } from "sonner";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => 'added' | 'exists' | false;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity: number = 1): 'added' | 'exists' | false => {
    // Only block if stock is EXPLICITLY set to 0 or negative (null = unlimited)
    if (product.stock !== null && product.stock <= 0) {
      toast.error("المنتج غير متوفر حالياً");
      return false;
    }

    // Check if adding this quantity would exceed available stock
    const existingItem = items.find((item) => item.product.id === product.id);
    const currentQty = existingItem ? existingItem.quantity : 0;
    const newTotalQty = currentQty + quantity;

    // If adding qty 1 and product already in cart, show "already added" message
    if (existingItem && quantity === 1) {
      toast.info("هذا المنتج مضاف بالفعل في السلة");
      return 'exists';
    }

    // Only check stock limit if stock is set (not null = unlimited)
    if (product.stock !== null && newTotalQty > product.stock) {
      const available = product.stock - currentQty;
      if (available <= 0) {
        toast.error(`وصلت للحد الأقصى المتاح من هذا المنتج`);
        return false;
      }
      toast.error(`متوفر فقط ${product.stock} من هذا المنتج`);
      return false;
    }

    // Track add to cart event
    trackAddToCart(product.id, product.name);

    setItems((prev) => {
      const existingItem = prev.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    return 'added';
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    // Check stock limit
    const item = items.find(i => i.product.id === productId);
    if (item && typeof item.product.stock === 'number' && quantity > item.product.stock) {
      toast.error(`متوفر فقط ${item.product.stock} من هذا المنتج`);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + (item.product.price || 0) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
