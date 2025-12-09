import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Scale, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCompare } from "@/contexts/CompareContext";
import { toast } from "sonner";
import type { Product } from "@/hooks/useProducts";

// Fallback images
import acProduct1 from "@/assets/products/ac-white-1.png";
import acProduct2 from "@/assets/products/ac-white-2.png";
import acProduct3 from "@/assets/products/ac-white-3.png";
import acProduct4 from "@/assets/products/ac-white-4.png";

const fallbackImages = [acProduct1, acProduct2, acProduct3, acProduct4];

interface ProductCardProps {
  product: Product;
  index?: number;
  showCompare?: boolean;
}

const ProductCard = ({ product, index = 0, showCompare = true }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();

  const getProductImage = () => {
    if (product.image_url) {
      return product.image_url;
    }
    return fallbackImages[index % fallbackImages.length];
  };

  const productIdNum = parseInt(product.id) || index + 1;
  
  const createCompatibleProduct = () => ({
    id: productIdNum,
    name: product.name,
    brand: product.brand,
    price: product.price,
    oldPrice: product.oldPrice || undefined,
    rating: product.rating,
    reviews: product.reviews,
    capacity: product.capacity || "",
    type: product.type || "",
    features: product.features,
    model: product.model || undefined,
    image: product.image_url || fallbackImages[index % fallbackImages.length],
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(createCompatibleProduct());
    toast.success("تمت الإضافة إلى السلة");
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(productIdNum)) {
      removeFromWishlist(productIdNum);
      toast.success("تمت الإزالة من المفضلة");
    } else {
      addToWishlist(createCompatibleProduct());
      toast.success("تمت الإضافة للمفضلة");
    }
  };

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCompare(productIdNum)) {
      removeFromCompare(productIdNum);
      toast.success("تمت الإزالة من المقارنة");
    } else {
      addToCompare(createCompatibleProduct());
    }
  };

  return (
    <div
      className="group card-dream overflow-hidden opacity-0 animate-[slide-up_0.6s_ease-out_forwards]"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-[4/3] bg-gradient-to-br from-muted to-background rounded-xl mb-4 overflow-hidden">
          {product.oldPrice && (
            <div className="absolute top-3 right-3 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-bold z-10">
              خصم {Math.round((1 - product.price / product.oldPrice) * 100)}%
            </div>
          )}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            <button 
              onClick={handleWishlistToggle}
              className={`w-9 h-9 rounded-full shadow-md flex items-center justify-center transition-all ${
                isInWishlist(productIdNum) 
                  ? "bg-destructive text-white" 
                  : "bg-card hover:bg-destructive hover:text-white"
              }`}
            >
              <Heart className={`h-4 w-4 ${isInWishlist(productIdNum) ? "fill-current" : ""}`} />
            </button>
            {showCompare && (
              <button 
                onClick={handleCompareToggle}
                className={`w-9 h-9 rounded-full shadow-md flex items-center justify-center transition-all ${
                  isInCompare(productIdNum) 
                    ? "bg-secondary text-secondary-foreground" 
                    : "bg-card hover:bg-secondary hover:text-secondary-foreground"
                }`}
              >
                <Scale className="h-4 w-4" />
              </button>
            )}
          </div>
          <img 
            src={getProductImage()} 
            alt={product.name} 
            className="absolute inset-0 w-full h-full object-contain p-4 transition-all duration-500 group-hover:scale-110" 
            onError={(e) => {
              e.currentTarget.src = fallbackImages[index % fallbackImages.length];
            }}
          />
          <div className="absolute bottom-3 right-3 bg-card/90 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-medium z-10">
            {product.brand}
          </div>
        </div>
      </Link>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-dream-gold text-dream-gold" : "text-muted"}`} />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">({product.reviews})</span>
        </div>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-bold text-lg text-foreground group-hover:text-secondary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <div className="flex flex-wrap gap-2">
          {product.features.slice(0, 3).map((feature) => (
            <span key={feature} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md">
              {feature}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 pt-2">
          {product.price > 0 ? (
            <>
              <span className="text-2xl font-bold text-secondary">{product.price.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground">ج.م</span>
              {product.oldPrice && (
                <span className="text-sm text-muted-foreground line-through">{product.oldPrice.toLocaleString()}</span>
              )}
            </>
          ) : (
            <span className="text-lg font-bold text-secondary">اتصل للسعر</span>
          )}
        </div>
        <Button 
          onClick={handleAddToCart}
          className="w-full bg-secondary hover:bg-accent text-secondary-foreground gap-2 transition-all duration-300 hover:scale-[1.02]"
        >
          <ShoppingCart className="h-4 w-4" />
          أضف للسلة
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
