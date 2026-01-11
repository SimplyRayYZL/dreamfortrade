import { Link } from "react-router-dom";
import { X, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompare } from "@/contexts/CompareContext";

import acProduct5 from "@/assets/products/ac-product-5.png";
import acProduct6 from "@/assets/products/ac-product-6.png";
import acProduct7 from "@/assets/products/ac-product-7.png";
import acProduct8 from "@/assets/products/ac-product-8.png";

const productImages = [acProduct5, acProduct6, acProduct7, acProduct8];

const getProductImage = (index: number) => {
  return productImages[index % productImages.length];
};

const CompareBar = () => {
  const { items, removeFromCompare, clearCompare } = useCompare();

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t shadow-lg animate-fade-in">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-secondary" />
            <span className="font-semibold text-foreground">
              المقارنة ({items.length}/4)
            </span>
          </div>

          <div className="flex items-center gap-2 flex-1 justify-center">
            {items.map((product, index) => (
              <div
                key={product.id}
                className="relative w-14 h-14 rounded-lg bg-muted overflow-hidden"
              >
                <img
                  src={getProductImage(index)}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
                <button
                  onClick={() => removeFromCompare(product.id)}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center hover:bg-destructive/80"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={clearCompare}>
              مسح الكل
            </Button>
            <Link to="/compare">
              <Button size="sm" className="btn-dream-primary">
                قارن الآن
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareBar;
