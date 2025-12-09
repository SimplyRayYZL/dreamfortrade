import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";

import acProduct5 from "@/assets/products/ac-product-5.png";
import acProduct6 from "@/assets/products/ac-product-6.png";
import acProduct7 from "@/assets/products/ac-product-7.png";
import acProduct8 from "@/assets/products/ac-product-8.png";
import acProduct9 from "@/assets/products/ac-product-9.png";
import acProduct10 from "@/assets/products/ac-product-10.png";

const productImages = [acProduct5, acProduct6, acProduct7, acProduct8, acProduct9, acProduct10];

const getProductImage = (index: number) => {
  return productImages[index % productImages.length];
};

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(products.slice(0, 5));
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim() === "") {
      setResults(products.slice(0, 5));
      return;
    }

    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.brand.toLowerCase().includes(query.toLowerCase()) ||
        product.capacity.includes(query)
    );
    setResults(filtered.slice(0, 8));
  }, [query]);

  const handleProductClick = (productId: number) => {
    onOpenChange(false);
    setQuery("");
    navigate(`/product/${productId}`);
  };

  const handleViewAll = () => {
    onOpenChange(false);
    setQuery("");
    navigate("/products");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">البحث في المنتجات</DialogTitle>
        </DialogHeader>
        
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="ابحث عن تكييف..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pr-10 text-lg py-6"
            autoFocus
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2"
              onClick={() => setQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="mt-4 max-h-[50vh] overflow-y-auto space-y-2">
          {results.length > 0 ? (
            <>
              {results.map((product, index) => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product.id)}
                  className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-muted transition-colors text-right"
                >
                  <img
                    src={getProductImage(index)}
                    alt={product.name}
                    className="w-16 h-16 object-contain rounded-lg bg-muted"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground line-clamp-1">{product.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{product.brand}</span>
                      <span>•</span>
                      <span>{product.capacity}</span>
                    </div>
                    <p className="text-secondary font-bold mt-1">
                      {product.price.toLocaleString()} جنيه
                    </p>
                  </div>
                </button>
              ))}
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={handleViewAll}
              >
                عرض جميع المنتجات
              </Button>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>لم يتم العثور على نتائج لـ "{query}"</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
