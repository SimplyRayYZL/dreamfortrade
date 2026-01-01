import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Scale, X, ShoppingCart, Check } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useCompare } from "@/contexts/CompareContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

import acProduct5 from "@/assets/products/ac-product-5.png";
import acProduct6 from "@/assets/products/ac-product-6.png";
import acProduct7 from "@/assets/products/ac-product-7.png";
import acProduct8 from "@/assets/products/ac-product-8.png";

const productImages = [acProduct5, acProduct6, acProduct7, acProduct8];

const getProductImage = (index: number) => {
  return productImages[index % productImages.length];
};

const Compare = () => {
  const { items, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();

  const handleAddToCart = (product: typeof items[0]) => {
    addToCart(product);
    toast.success("تمت الإضافة إلى السلة");
  };

  const specifications = [
    { label: "الماركة", key: "brand" },
    { label: "السعة", key: "capacity" },
    { label: "النوع", key: "type" },
    { label: "الموديل", key: "model" },
    { label: "التقييم", key: "rating" },
  ];

  return (
    <>
      <Helmet>
        <title>مقارنة المنتجات | تارجت لأعمال التكييف</title>
        <meta name="description" content="قارن بين المنتجات المختلفة - ????? ?????? ???????" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-8 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Scale className="h-8 w-8 text-secondary" />
                <h1 className="text-3xl font-bold text-foreground">مقارنة المنتجات</h1>
              </div>
              {items.length > 0 && (
                <Button variant="outline" onClick={clearCompare}>
                  مسح المقارنة
                </Button>
              )}
            </div>

            {items.length === 0 ? (
              <div className="text-center py-16 card-dream">
                <Scale className="h-24 w-24 text-muted-foreground/30 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-foreground mb-4">لا توجد منتجات للمقارنة</h2>
                <p className="text-muted-foreground mb-8">
                  أضف منتجات من صفحة المنتجات لبدء المقارنة
                </p>
                <Link to="/products">
                  <Button className="btn-dream-primary">
                    تصفح المنتجات
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr>
                      <th className="p-4 text-right bg-muted rounded-tr-xl">المواصفات</th>
                      {items.map((product, index) => (
                        <th key={product.id} className="p-4 bg-muted last:rounded-tl-xl">
                          <div className="relative">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute -top-2 -right-2 h-6 w-6 bg-destructive text-white rounded-full hover:bg-destructive/80"
                              onClick={() => removeFromCompare(product.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Link to={`/product/${product.id}`}>
                              <img
                                src={getProductImage(index)}
                                alt={product.name}
                                className="w-32 h-32 object-contain mx-auto mb-3"
                              />
                              <h3 className="font-bold text-foreground text-sm line-clamp-2 hover:text-secondary transition-colors">
                                {product.name}
                              </h3>
                            </Link>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-4 font-semibold text-foreground bg-muted/50">السعر</td>
                      {items.map((product) => (
                        <td key={product.id} className="p-4 text-center">
                          <div className="text-xl font-bold text-secondary">
                            {product.price.toLocaleString()} جنيه
                          </div>
                          {product.oldPrice && (
                            <div className="text-sm text-muted-foreground line-through">
                              {product.oldPrice.toLocaleString()} جنيه
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>

                    {specifications.map((spec) => (
                      <tr key={spec.key} className="border-b">
                        <td className="p-4 font-semibold text-foreground bg-muted/50">
                          {spec.label}
                        </td>
                        {items.map((product) => (
                          <td key={product.id} className="p-4 text-center">
                            {spec.key === "rating" ? (
                              <span className="text-dream-gold font-bold">
                                ★ {product[spec.key as keyof typeof product]}
                              </span>
                            ) : (
                              <span>
                                {product[spec.key as keyof typeof product] || "-"}
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}

                    <tr className="border-b">
                      <td className="p-4 font-semibold text-foreground bg-muted/50">المميزات</td>
                      {items.map((product) => (
                        <td key={product.id} className="p-4">
                          <ul className="space-y-2">
                            {product.features.map((feature, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm">
                                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-4 bg-muted/50 rounded-br-xl"></td>
                      {items.map((product, index) => (
                        <td key={product.id} className={`p-4 ${index === items.length - 1 ? 'rounded-bl-xl' : ''}`}>
                          <Button
                            className="w-full btn-dream-primary"
                            onClick={() => handleAddToCart(product)}
                          >
                            <ShoppingCart className="h-4 w-4" />
                            أضف للسلة
                          </Button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Compare;

