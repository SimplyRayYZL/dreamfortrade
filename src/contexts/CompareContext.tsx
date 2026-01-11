import { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "@/hooks/useProducts";
import { toast } from "sonner";

interface CompareContextType {
  items: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
};

export const CompareProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<Product[]>([]);

  const addToCompare = (product: Product) => {
    if (items.length >= 4) {
      toast.error("لا يمكنك مقارنة أكثر من 4 منتجات");
      return;
    }
    if (items.find((item) => item.id === product.id)) {
      toast.info("المنتج موجود بالفعل في المقارنة");
      return;
    }
    setItems((prev) => [...prev, product]);
    toast.success("تمت الإضافة للمقارنة");
  };

  const removeFromCompare = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const isInCompare = (productId: string) => {
    return items.some((item) => item.id === productId);
  };

  const clearCompare = () => {
    setItems([]);
  };

  return (
    <CompareContext.Provider
      value={{
        items,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};
