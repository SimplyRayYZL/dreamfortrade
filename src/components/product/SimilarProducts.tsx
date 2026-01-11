import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

interface Product {
    id: string;
    name: string;
    price: number;
    original_price: number | null;
    image_url: string | null;
    slug: string;
}

interface SimilarProductsProps {
    currentProductId: string;
    brandId?: string;
    categoryId?: string;
}

const SimilarProducts = ({ currentProductId, brandId, categoryId }: SimilarProductsProps) => {
    const { addItem } = useCart();

    const { data: products, isLoading } = useQuery({
        queryKey: ["similar-products", currentProductId, brandId, categoryId],
        queryFn: async () => {
            let query = (supabase as any)
                .from("products")
                .select("id, name, price, original_price, image_url, slug")
                .neq("id", currentProductId)
                .eq("is_active", true)
                .limit(4);

            // Prioritize same brand
            if (brandId) {
                query = query.eq("brand_id", brandId);
            }

            const { data, error } = await query;

            if (error) {
                console.error("Error fetching similar products:", error);
                return [];
            }

            // If not enough products from same brand, fetch more
            if (data.length < 4 && brandId) {
                const { data: moreProducts } = await (supabase as any)
                    .from("products")
                    .select("id, name, price, original_price, image_url, slug")
                    .neq("id", currentProductId)
                    .neq("brand_id", brandId)
                    .eq("is_active", true)
                    .limit(4 - data.length);

                return [...data, ...(moreProducts || [])] as Product[];
            }

            return data as Product[];
        },
        enabled: !!currentProductId,
    });

    if (isLoading || !products || products.length === 0) {
        return null;
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ar-EG', {
            style: 'currency',
            currency: 'EGP',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleAddToCart = (product: Product, e: React.MouseEvent) => {
        e.preventDefault();
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image_url: product.image_url || "",
            quantity: 1,
        });
    };

    return (
        <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                        منتجات مشابهة
                    </h2>
                    <p className="text-muted-foreground">قد تعجبك هذه المنتجات أيضاً</p>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {products.map((product, index) => (
                        <Link
                            key={product.id}
                            to={`/product/${product.slug}`}
                            className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 opacity-0 animate-[scale-in_0.5s_ease-out_forwards]"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {/* Image */}
                            <div className="relative aspect-square overflow-hidden bg-muted">
                                <img
                                    src={product.image_url || "/placeholder.svg"}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />

                                {/* Discount Badge */}
                                {product.original_price && product.original_price > product.price && (
                                    <div className="absolute top-2 right-2 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                        خصم {Math.round((1 - product.price / product.original_price) * 100)}%
                                    </div>
                                )}

                                {/* Quick Actions Overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Button
                                        size="icon"
                                        className="bg-white text-foreground hover:bg-secondary hover:text-white rounded-full h-10 w-10"
                                        onClick={(e) => handleAddToCart(product, e)}
                                    >
                                        <ShoppingCart className="h-5 w-5" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        className="bg-white text-foreground hover:bg-secondary hover:text-white rounded-full h-10 w-10"
                                    >
                                        <Eye className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="font-semibold text-sm md:text-base text-foreground line-clamp-2 mb-2 group-hover:text-secondary transition-colors">
                                    {product.name}
                                </h3>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-secondary font-bold text-lg">
                                        {formatPrice(product.price)}
                                    </span>
                                    {product.original_price && product.original_price > product.price && (
                                        <span className="text-muted-foreground text-sm line-through">
                                            {formatPrice(product.original_price)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-8">
                    <Link to="/products">
                        <Button variant="outline" size="lg" className="rounded-full px-8">
                            عرض جميع المنتجات
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default SimilarProducts;
