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
import ProductReviews from "@/components/ProductReviews";
import { useSiteSettings } from "@/hooks/useSettings";

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
  const { data: siteSettings } = useSiteSettings();
  const whatsappNumber = siteSettings?.store_whatsapp || "201289006310";

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

  const isWishlisted = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  // Get the single product image (no fake thumbnails)
  const productImage = product.image_url || fallbackImages[0];
  const images = [productImage];

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
      removeFromWishlist(product.id);
      toast.success("تمت الإزالة من المفضلة");
    } else {
      addToWishlist(product);
      toast.success("تمت الإضافة للمفضلة");
    }
  };

  const handleCompare = () => {
    if (isCompared) {
      removeFromCompare(product.id);
      toast.success("تمت الإزالة من المقارنة");
    } else {
      addToCompare(product);
    }
  };

  return (
    <>
      <Helmet>
        <title>{product.name} | دريم للتجارة والتوريدات</title>
        <meta name="description" content={`${product.name} - ${product.brand} - ${product.capacity} - السعر ${product.price} جنيه - شحن مجاني وضمان 5 سنوات`} />
        <meta name="keywords" content={`${product.name}, ${product.brand}, تكييف ${product.capacity}, تكييف ${product.type}, شراء تكييف, أفضل سعر تكييف`} />
        <link rel="canonical" href={`https://dreamfortrade.com/products/${product.id}`} />

        <meta property="og:title" content={`${product.name} | دريم`} />
        <meta property="og:description" content={`${product.name} - ${product.brand} - ${product.capacity} - السعر ${product.price} جنيه`} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={`https://dreamfortrade.com/products/${product.id}`} />
        <meta property="og:image" content={product.image_url || 'https://dreamfortrade.com/logo.png'} />
        <meta property="product:price:amount" content={String(product.price)} />
        <meta property="product:price:currency" content="EGP" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "description": `${product.name} - ${product.brand} - ${product.capacity} - ${product.type}`,
            "image": product.image_url || 'https://dreamfortrade.com/logo.png',
            "brand": {
              "@type": "Brand",
              "name": product.brand
            },
            "sku": product.id,
            "offers": {
              "@type": "Offer",
              "url": `https://dreamfortrade.com/products/${product.id}`,
              "priceCurrency": "EGP",
              "price": product.price,
              "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              "seller": {
                "@type": "Organization",
                "name": "دريم للتجارة والتوريدات"
              }
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": product.rating || 4.5,
              "reviewCount": 50
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-muted/30">
          {/* Breadcrumb - Enhanced */}
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border">
            <div className="container mx-auto px-4 py-4">
              <nav className="flex items-center gap-2 text-sm">
                <Link to="/" className="text-muted-foreground hover:text-secondary transition-colors flex items-center gap-1">
                  <span>🏠</span>
                  <span className="hidden sm:inline">الرئيسية</span>
                </Link>
                <ChevronLeft className="h-4 w-4 text-muted-foreground/50" />
                <Link to="/products" className="text-muted-foreground hover:text-secondary transition-colors">المنتجات</Link>
                <ChevronLeft className="h-4 w-4 text-muted-foreground/50" />
                <span className="text-secondary font-medium truncate max-w-[200px]">{product.name}</span>
              </nav>
            </div>
          </div>

          {/* Product Section */}
          <section className="py-8 md:py-12">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Product Images */}
                <div className="space-y-4">
                  {/* Main Image */}
                  <div className="relative aspect-square bg-card rounded-3xl shadow-lg overflow-hidden">
                    {product.oldPrice && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-rose-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold z-10 shadow-lg">
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
                  <div className="bg-card rounded-2xl p-6 space-y-4 shadow-sm border border-border">
                    <h3 className="font-bold text-foreground text-lg">📋 المواصفات</h3>
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div className="flex justify-between p-3 rounded-xl bg-muted/50">
                        <span className="text-muted-foreground">الماركة</span>
                        <span className="font-bold text-secondary">{product.brand}</span>
                      </div>
                      {product.capacity && (
                        <div className="flex justify-between p-3 rounded-xl bg-muted/50">
                          <span className="text-muted-foreground">القدرة</span>
                          <span className="font-bold text-foreground">{product.capacity}</span>
                        </div>
                      )}
                      {product.type && (
                        <div className="flex justify-between p-3 rounded-xl bg-muted/50">
                          <span className="text-muted-foreground">النوع</span>
                          <span className="font-bold text-foreground">{product.type}</span>
                        </div>
                      )}
                      {product.model && (
                        <div className="flex justify-between p-3 rounded-xl bg-muted/50">
                          <span className="text-muted-foreground">الموديل</span>
                          <span className="font-bold text-foreground">{product.model}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  {product.features.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-bold text-foreground text-lg">✨ المميزات</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.features.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 bg-gradient-to-r from-secondary/10 to-accent/5 text-secondary px-4 py-2 rounded-full text-sm font-medium border border-secondary/20"
                          >
                            <Check className="h-4 w-4" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}


                  {/* Quantity */}
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-foreground">الكمية:</span>
                    <div className="flex items-center bg-muted rounded-xl overflow-hidden">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-3 hover:bg-secondary hover:text-white transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-14 text-center font-bold text-lg">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-3 hover:bg-secondary hover:text-white transition-colors"
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
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
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
                        className="w-full h-14 gap-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-lg font-bold"
                      >
                        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        اطلب عبر واتساب
                      </Button>
                    </a>
                  </div>

                  {/* Guarantees */}
                  <div className="grid grid-cols-3 gap-3 p-4 bg-card rounded-2xl shadow-sm border border-border">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                        <Truck className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-xs font-medium text-foreground">توصيل سريع</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                        <Shield className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-xs font-medium text-foreground">ضمان 5 سنوات</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
                        <RotateCcw className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-xs font-medium text-foreground">استبدال سهل</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Description Section - Enhanced */}
          {product.description && (
            <section className="py-10 bg-background">
              <div className="container mx-auto px-4">
                <div className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border border-border">
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <span className="text-2xl">📝</span>
                    وصف المنتج
                  </h3>
                  <div className="text-muted-foreground leading-loose space-y-3 text-sm md:text-base">
                    {product.description.split('\n').map((line, index) => {
                      if (line.trim().startsWith('##')) {
                        return (
                          <h4 key={index} className="font-bold text-foreground text-lg mt-4">
                            {line.replace('##', '').trim()}
                          </h4>
                        );
                      }
                      if (line.trim().startsWith('#')) {
                        return (
                          <h4 key={index} className="font-bold text-foreground text-xl mt-4">
                            {line.replace('#', '').trim()}
                          </h4>
                        );
                      }
                      if (line.trim().startsWith('-')) {
                        return (
                          <div key={index} className="flex gap-2 pr-4">
                            <span className="text-secondary">•</span>
                            <span>{line.replace('-', '').trim()}</span>
                          </div>
                        );
                      }
                      if (line.trim() === '') {
                        return <div key={index} className="h-2" />;
                      }
                      return <p key={index}>{line}</p>;
                    })}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Customer Reviews */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <ProductReviews productId={product.id} />
            </div>
          </section>

          {/* Related Products - Enhanced */}
          {relatedProducts.length > 0 && (
            <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
              <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    منتجات <span className="text-secondary">مشابهة</span>
                  </h2>
                  <p className="text-muted-foreground">قد يعجبك أيضاً من نفس الماركة</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {relatedProducts.map((relProduct, index) => (
                    <Link
                      key={relProduct.id}
                      to={`/product/${relProduct.id}`}
                      className="group bg-card rounded-2xl shadow-sm hover:shadow-xl overflow-hidden transition-all duration-500 hover:-translate-y-2 opacity-0 animate-[scale-in_0.5s_ease-out_forwards]"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="relative aspect-square bg-muted/30 overflow-hidden">
                        {relProduct.oldPrice && (
                          <div className="absolute top-2 right-2 bg-gradient-to-r from-rose-500 to-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold z-10">
                            خصم {Math.round((1 - relProduct.price / relProduct.oldPrice) * 100)}%
                          </div>
                        )}
                        <img
                          src={relProduct.image_url || fallbackImages[index % fallbackImages.length]}
                          alt={relProduct.name}
                          className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.src = fallbackImages[index % fallbackImages.length];
                          }}
                        />
                      </div>
                      <div className="p-4">
                        <div className="text-xs text-secondary font-medium mb-1">{relProduct.brand}</div>
                        <h3 className="font-bold text-foreground group-hover:text-secondary transition-colors line-clamp-2 text-sm min-h-[2.5rem]">
                          {relProduct.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-secondary font-bold text-lg">
                            {relProduct.price > 0 ? `${relProduct.price.toLocaleString()}` : "اتصل للسعر"}
                          </span>
                          {relProduct.price > 0 && <span className="text-xs text-muted-foreground">ج.م</span>}
                        </div>
                      </div>
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

