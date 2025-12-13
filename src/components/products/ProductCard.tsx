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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success("تمت الإضافة إلى السلة");
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success("تمت الإزالة من المفضلة");
    } else {
      addToWishlist(product);
      toast.success("تمت الإضافة للمفضلة");
    }
  };

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCompare(product.id)) {
      removeFromCompare(product.id);
      toast.success("تمت الإزالة من المقارنة");
    } else {
      addToCompare(product);
    }
  };

  return (
    <div
      className="group card-dream overflow-hidden opacity-0 animate-[slide-up_0.6s_ease-out_forwards] flex flex-col h-full"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-[1/1] bg-gradient-to-br from-muted to-background rounded-xl mb-3 overflow-hidden">
          {product.oldPrice && (
            <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-2.5 py-1 rounded-full text-xs font-bold z-10">
              خصم {Math.round((1 - product.price / product.oldPrice) * 100)}%
            </div>
          )}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
            <button
              onClick={handleWishlistToggle}
              className={`w-8 h-8 rounded-full shadow-md flex items-center justify-center transition-all ${isInWishlist(product.id)
                ? "bg-destructive text-white"
                : "bg-card hover:bg-destructive hover:text-white"
                }`}
            >
              <Heart className={`h-3.5 w-3.5 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
            </button>
            {showCompare && (
              <button
                onClick={handleCompareToggle}
                className={`w-8 h-8 rounded-full shadow-md flex items-center justify-center transition-all ${isInCompare(product.id)
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-card hover:bg-secondary hover:text-secondary-foreground"
                  }`}
              >
                <Scale className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <img
            src={getProductImage()}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-contain p-3 transition-all duration-500 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.src = fallbackImages[index % fallbackImages.length];
            }}
          />
          <div className="absolute bottom-2 right-2 bg-card/90 backdrop-blur-sm px-2 py-0.5 rounded-md text-xs font-medium z-10">
            {product.brand}
          </div>
        </div>
      </Link>
      <div className="flex flex-col flex-grow space-y-1.5">
        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating) ? "fill-dream-gold text-dream-gold" : "text-muted"}`} />
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground">({product.reviews})</span>
        </div>

        {/* Product Name */}
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-xs md:text-sm text-foreground group-hover:text-secondary transition-colors line-clamp-2 min-h-[2rem] md:min-h-[2.25rem]">
            {product.name}
          </h3>
        </Link>

        {/* Features - Hidden on very small screens */}
        <div className="hidden sm:flex flex-wrap gap-1">
          {product.features.slice(0, 2).map((feature) => (
            <span key={feature} className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-md truncate max-w-[120px]">
              {feature}
            </span>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-center gap-1 md:gap-1.5 pt-1">
          {product.price > 0 ? (
            <>
              <span className="text-sm md:text-lg font-bold text-secondary">{product.price.toLocaleString()}</span>
              <span className="text-[10px] md:text-xs text-muted-foreground">ج.م</span>
              {product.oldPrice && (
                <span className="text-[10px] md:text-xs text-muted-foreground line-through">{product.oldPrice.toLocaleString()}</span>
              )}
            </>
          ) : (
            <span className="text-xs md:text-sm font-bold text-secondary">اتصل للسعر</span>
          )}
        </div>

        {/* Buttons - Push to bottom */}
        <div className="flex flex-col gap-1.5 md:gap-2 mt-auto pt-2 md:pt-3">
          <a
            href={`https://wa.me/201289006310?text=${encodeURIComponent(
              `🛒 *استفسار عن منتج*\n\n` +
              `📦 *المنتج:* ${product.name}\n` +
              `🏷️ *الماركة:* ${product.brand}\n` +
              `💰 *السعر:* ${product.price > 0 ? `${product.price.toLocaleString()} ج.م` : 'اتصل للسعر'}\n` +
              (product.oldPrice ? `🔥 *السعر قبل الخصم:* ${product.oldPrice.toLocaleString()} ج.م\n` : '') +
              `\nأريد الاستفسار عن هذا المنتج`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-full"
          >
            <Button
              className="w-full bg-green-500 hover:bg-green-600 text-white border-green-500 hover:border-green-600 h-8 md:h-10 gap-1.5 text-xs md:text-sm font-semibold"
            >
              <svg className="h-4 w-4 md:h-5 md:w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span className="hidden sm:inline">تواصل واتساب</span>
              <span className="sm:hidden">واتساب</span>
            </Button>
          </a>
          <Button
            onClick={handleAddToCart}
            className="w-full bg-secondary hover:bg-accent text-secondary-foreground gap-1.5 transition-all duration-300 hover:scale-[1.02] h-8 md:h-10 text-xs md:text-sm font-semibold"
          >
            <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
            <span className="hidden sm:inline">أضف للسلة</span>
            <span className="sm:hidden">سلة</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
