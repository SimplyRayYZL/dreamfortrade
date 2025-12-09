import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Heart,
  Star,
  Minus,
  Plus,
  Check,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  Share2,
  Scale,
  Loader2
} from "lucide-react";
import { useProduct, useRelatedProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCompare } from "@/contexts/CompareContext";
import { toast } from "sonner";

// Fallback product images
import acProduct1 from "@/assets/products/ac-white-1.png";
import acProduct2 from "@/assets/products/ac-white-2.png";
import acProduct3 from "@/assets/products/ac-white-3.png";
import acProduct4 from "@/assets/products/ac-white-4.png";

const fallbackImages = [acProduct1, acProduct2, acProduct3, acProduct4];

const ProductDetails = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();

  const { data: product, isLoading, error } = useProduct(id || "");
  const { data: relatedProducts = [] } = useRelatedProducts(
    product?.brand_id || "",
    product?.id || ""
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-secondary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!product || error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">المنتج غير موجود</h1>
            <Link to="/products" className="text-secondary hover:underline">
              العودة للمنتجات
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const productIdNum = parseInt(product.id) || 1;
  const isWishlisted = isInWishlist(productIdNum);
  const isCompared = isInCompare(productIdNum);

  // Generate images for the product
  const getProductImage = () => {
    if (product.image_url) {
      return product.image_url;
    }
    return fallbackImages[0];
  };

  const images = [
    getProductImage(),
    fallbackImages[1],
    fallbackImages[2],
    fallbackImages[3],
  ];

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
    image: product.image_url || fallbackImages[0],
  });

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast.error("عذراً، هذا المنتج غير متوفر حالياً");
      return;
    }
    if (quantity > product.stock) {
      toast.error(`عذراً، الكمية المتاحة ${product.stock} قطعة فقط`);
      return;
    }
    addToCart(product, quantity);
    toast.success(`تمت إضافة ${quantity} ${product.name} إلى السلة`);
  };

  const handleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(productIdNum);
      toast.success("تمت الإزالة من المفضلة");
    } else {
      addToWishlist(createCompatibleProduct());
      toast.success("تمت الإضافة للمفضلة");
    }
  };

  const handleCompare = () => {
    if (isCompared) {
      removeFromCompare(productIdNum);
      toast.success("تمت الإزالة من المقارنة");
    } else {
      addToCompare(createCompatibleProduct());
    }
  };

  return (
    <>
      <Helmet>
        <title>{product.name} | Dream For Trade</title>
        <meta name="description" content={`${product.name} - ${product.brand} - ${product.capacity} - السعر ${product.price} جنيه`} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-background">
          {/* Breadcrumb */}
          <div className="bg-muted/50 py-4">
            <div className="container mx-auto px-4">
              <nav className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link to="/" className="hover:text-secondary">الرئيسية</Link>
                <ChevronLeft className="h-4 w-4" />
                <Link to="/products" className="hover:text-secondary">المنتجات</Link>
                <ChevronLeft className="h-4 w-4" />
                <span className="text-foreground">{product.name}</span>
              </nav>
            </div>
          </div>

          {/* Product Section */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Product Images */}
                <div className="space-y-4">
                  {/* Main Image */}
                  <div className="relative aspect-square bg-gradient-to-br from-muted to-background rounded-2xl overflow-hidden">
                    {product.oldPrice && (
                      <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-4 py-2 rounded-full text-sm font-bold z-10">
                        خصم {Math.round((1 - product.price / product.oldPrice) * 100)}%
                      </div>
                    )}
                    <img
                      src={images[selectedImage]}
                      alt={product.name}
                      className="w-full h-full object-contain p-8"
                      onError={(e) => {
                        e.currentTarget.src = fallbackImages[0];
                      }}
                    />
                  </div>

                  {/* Thumbnail Images */}
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
                          ? "border-secondary"
                          : "border-border hover:border-secondary/50"
                          }`}
                      >
                        <img
                          src={img}
                          alt={`${product.name} - صورة ${index + 1}`}
                          className="w-full h-full object-contain p-2 bg-muted"
                          onError={(e) => {
                            e.currentTarget.src = fallbackImages[index % fallbackImages.length];
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                  {/* Brand & Share */}
                  <div className="flex items-center justify-between">
                    <span className="bg-secondary/10 text-secondary px-4 py-1 rounded-full text-sm font-medium">
                      {product.brand}
                    </span>
                    <button
                      className="text-muted-foreground hover:text-secondary transition-colors"
                      onClick={() => {
                        navigator.share?.({ title: product.name, url: window.location.href });
                      }}
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    {product.name}
                  </h1>

                  {/* Rating */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < Math.floor(product.rating)
                            ? "fill-dream-gold text-dream-gold"
                            : "text-muted"
                            }`}
                        />
                      ))}
                    </div>
                    <span className="text-muted-foreground">
                      ({product.reviews} تقييم)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-3">
                    {product.price > 0 ? (
                      <>
                        <span className="text-4xl font-bold text-secondary">
                          {product.price.toLocaleString()}
                        </span>
                        <span className="text-lg text-muted-foreground">جنيه</span>
                        {product.oldPrice && (
                          <span className="text-xl text-muted-foreground line-through">
                            {product.oldPrice.toLocaleString()} جنيه
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-3xl font-bold text-secondary">اتصل للسعر</span>
                    )}
                  </div>

                  {/* Stock Availability */}
                  <div className="flex items-center gap-2">
                    {product.stock > 0 ? (
                      <div className="flex items-center gap-2 bg-green-500/10 text-green-600 px-4 py-2 rounded-full">
                        <Check className="h-4 w-4" />
                        <span className="font-medium">متوفر ({product.stock} قطعة)</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 bg-destructive/10 text-destructive px-4 py-2 rounded-full">
                        <span className="font-medium">غير متوفر حالياً</span>
                      </div>
                    )}
                  </div>

                  {/* Specifications */}
                  <div className="bg-muted/50 rounded-xl p-6 space-y-4">
                    <h3 className="font-bold text-foreground">المواصفات</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">الماركة:</span>
                        <span className="font-medium text-foreground">{product.brand}</span>
                      </div>
                      {product.capacity && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">القدرة:</span>
                          <span className="font-medium text-foreground">{product.capacity}</span>
                        </div>
                      )}
                      {product.type && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">النوع:</span>
                          <span className="font-medium text-foreground">{product.type}</span>
                        </div>
                      )}
                      {product.model && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">الموديل:</span>
                          <span className="font-medium text-foreground">{product.model}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  {product.features.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-bold text-foreground">المميزات</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.features.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 bg-secondary/10 text-secondary px-3 py-2 rounded-lg text-sm"
                          >
                            <Check className="h-4 w-4" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {product.description && (
                    <div className="space-y-3">
                      <h3 className="font-bold text-foreground">الوصف</h3>
                      <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                    </div>
                  )}

                  {/* Quantity */}
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-foreground">الكمية:</span>
                    <div className="flex items-center border border-border rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-3 hover:bg-muted transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-16 text-center font-medium">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-3 hover:bg-muted transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-3">
                      <Button
                        onClick={handleAddToCart}
                        className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground gap-2 h-14 text-lg"
                        disabled={product.stock <= 0}
                      >
                        <ShoppingCart className="h-5 w-5" />
                        أضف للسلة
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleWishlist}
                        className={`h-14 w-14 ${isWishlisted ? "bg-destructive/10 border-destructive text-destructive" : ""}`}
                      >
                        <Heart className={`h-6 w-6 ${isWishlisted ? "fill-destructive" : ""}`} />
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCompare}
                        className={`h-14 w-14 ${isCompared ? "bg-secondary/10 border-secondary text-secondary" : ""}`}
                      >
                        <Scale className="h-6 w-6" />
                      </Button>
                    </div>
                    {/* WhatsApp Order Button */}
                    <a
                      href={`https://wa.me/201289006310?text=${encodeURIComponent(
                        `مرحباً، أود طلب المنتج التالي:\n\n` +
                        `📦 المنتج: ${product.name}\n` +
                        `💰 السعر: ${product.price > 0 ? product.price.toLocaleString() + ' جنيه' : 'اتصل للسعر'}\n` +
                        `🔢 الكمية: ${quantity}\n` +
                        `🏷️ الماركة: ${product.brand}\n\n` +
                        `رابط المنتج: ${window.location.href}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="outline"
                        className="w-full h-12 gap-2 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                      >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        اطلب عبر واتساب
                      </Button>
                    </a>
                  </div>

                  {/* Guarantees */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                        <Truck className="h-6 w-6 text-secondary" />
                      </div>
                      <span className="text-xs text-muted-foreground">توصيل مجاني</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                        <Shield className="h-6 w-6 text-secondary" />
                      </div>
                      <span className="text-xs text-muted-foreground">ضمان 5 سنوات</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                        <RotateCcw className="h-6 w-6 text-secondary" />
                      </div>
                      <span className="text-xs text-muted-foreground">استبدال سهل</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="py-12 bg-muted/30">
              <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold text-foreground mb-8">منتجات مشابهة</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {relatedProducts.map((relProduct, index) => (
                    <Link
                      key={relProduct.id}
                      to={`/product/${relProduct.id}`}
                      className="group card-dream overflow-hidden"
                    >
                      <div className="aspect-square bg-gradient-to-br from-muted to-background rounded-xl mb-4 overflow-hidden">
                        <img
                          src={relProduct.image_url || fallbackImages[index % fallbackImages.length]}
                          alt={relProduct.name}
                          className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = fallbackImages[index % fallbackImages.length];
                          }}
                        />
                      </div>
                      <h3 className="font-medium text-foreground group-hover:text-secondary transition-colors line-clamp-2 text-sm">
                        {relProduct.name}
                      </h3>
                      <p className="text-secondary font-bold mt-2">
                        {relProduct.price > 0 ? `${relProduct.price.toLocaleString()} جنيه` : "اتصل للسعر"}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ProductDetails;
