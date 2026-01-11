import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";

// Fallback images
import acProduct1 from "@/assets/products/ac-white-1.png";
import acProduct2 from "@/assets/products/ac-white-2.png";
import acProduct3 from "@/assets/products/ac-white-3.png";
import acProduct4 from "@/assets/products/ac-white-4.png";

const fallbackImages = [acProduct1, acProduct2, acProduct3, acProduct4];

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();
  const { data: products = [], isLoading } = useProducts();

  // Filter products based on query
  const results = query.trim() === ""
    ? products.slice(0, 5)
    : products.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.brand.toLowerCase().includes(query.toLowerCase()) ||
        (product.capacity && product.capacity.includes(query)) ||
        (product.model && product.model.toLowerCase().includes(query.toLowerCase()))
    ).slice(0, 8);

  const getProductImage = (product: typeof products[0], index: number) => {
    return product.image_url || fallbackImages[index % fallbackImages.length];
  };

  const handleProductClick = (productId: string) => {
    onOpenChange(false);
    setQuery("");
    setSelectedIndex(-1);
    navigate(`/product/${productId}`);
  };

  const handleViewAll = () => {
    onOpenChange(false);
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query)}`);
    } else {
      navigate("/products");
    }
    setQuery("");
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleProductClick(results[selectedIndex].id);
        } else if (query.trim()) {
          handleViewAll();
        }
        break;
    }
  };

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">البحث في المنتجات</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="ابحث عن تكييف، ماركة، أو موديل..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
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
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-secondary" />
            </div>
          ) : results.length > 0 ? (
            <>
              {results.map((product, index) => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product.id)}
                  className={`w-full flex items-center gap-4 p-3 rounded-xl hover:bg-muted transition-colors text-right ${index === selectedIndex ? "bg-muted" : ""
                    }`}
                >
                  <img
                    src={getProductImage(product, index)}
                    alt={product.name}
                    className="w-16 h-16 object-contain rounded-lg bg-muted"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground line-clamp-1">{product.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{product.brand}</span>
                      {product.capacity && (
                        <>
                          <span>•</span>
                          <span>{product.capacity}</span>
                        </>
                      )}
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
                عرض جميع المنتجات {query && `(${products.filter(p =>
                  p.name.toLowerCase().includes(query.toLowerCase()) ||
                  p.brand.toLowerCase().includes(query.toLowerCase())
                ).length} نتيجة)`}
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
