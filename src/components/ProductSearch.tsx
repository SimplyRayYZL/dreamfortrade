import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { Input } from "@/components/ui/input";

// Fallback images
import acProduct1 from "@/assets/products/ac-white-1.png";
const fallbackImage = acProduct1;

const ProductSearch = () => {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const { data: products = [], isLoading } = useProducts();

    // Filter products based on query
    const filteredProducts = query.length >= 2
        ? products.filter((product) =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.brand.toLowerCase().includes(query.toLowerCase()) ||
            (product.model && product.model.toLowerCase().includes(query.toLowerCase())) ||
            (product.capacity && product.capacity.toLowerCase().includes(query.toLowerCase()))
        ).slice(0, 6)
        : [];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (resultsRef.current && !resultsRef.current.contains(event.target as Node) &&
                inputRef.current && !inputRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen || filteredProducts.length === 0) return;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setSelectedIndex((prev) => (prev < filteredProducts.length - 1 ? prev + 1 : 0));
                break;
            case "ArrowUp":
                e.preventDefault();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredProducts.length - 1));
                break;
            case "Enter":
                e.preventDefault();
                if (selectedIndex >= 0 && filteredProducts[selectedIndex]) {
                    navigate(`/product/${filteredProducts[selectedIndex].id}`);
                    setIsOpen(false);
                    setQuery("");
                } else if (query.length >= 2) {
                    navigate(`/products?search=${encodeURIComponent(query)}`);
                    setIsOpen(false);
                }
                break;
            case "Escape":
                setIsOpen(false);
                inputRef.current?.blur();
                break;
        }
    };

    return (
        <div className="relative w-full max-w-md">
            {/* Search Input */}
            <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                <Input
                    ref={inputRef}
                    type="text"
                    placeholder="ابحث عن تكييف، ماركة، أو موديل..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                        setSelectedIndex(-1);
                    }}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    className="pr-10 pl-8 h-11 bg-muted/50 border-0 focus:bg-background focus:ring-2 focus:ring-secondary/50 rounded-xl text-right"
                />
                {query && (
                    <button
                        onClick={() => {
                            setQuery("");
                            setIsOpen(false);
                            inputRef.current?.focus();
                        }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Results Dropdown */}
            {isOpen && query.length >= 2 && (
                <div
                    ref={resultsRef}
                    className="absolute top-full left-0 right-0 mt-2 bg-card border rounded-xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-secondary" />
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        <>
                            {filteredProducts.map((product, index) => (
                                <Link
                                    key={product.id}
                                    to={`/product/${product.id}`}
                                    onClick={() => {
                                        setIsOpen(false);
                                        setQuery("");
                                    }}
                                    className={`flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors ${index === selectedIndex ? "bg-muted/50" : ""
                                        }`}
                                >
                                    <img
                                        src={product.image_url || fallbackImage}
                                        alt={product.name}
                                        className="w-14 h-14 object-contain rounded-lg bg-muted"
                                    />
                                    <div className="flex-1 text-right min-w-0">
                                        <h4 className="font-semibold text-foreground truncate">{product.name}</h4>
                                        <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
                                            <span className="text-secondary font-bold">{product.price.toLocaleString()} ج.م</span>
                                            <span>•</span>
                                            <span>{product.brand}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            <Link
                                to={`/products?search=${encodeURIComponent(query)}`}
                                onClick={() => setIsOpen(false)}
                                className="block p-3 text-center text-secondary hover:bg-muted/50 transition-colors border-t font-medium"
                            >
                                عرض كل النتائج ({products.filter((p) =>
                                    p.name.toLowerCase().includes(query.toLowerCase()) ||
                                    p.brand.toLowerCase().includes(query.toLowerCase())
                                ).length} منتج)
                            </Link>
                        </>
                    ) : (
                        <div className="py-8 text-center text-muted-foreground">
                            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>لا توجد نتائج لـ "{query}"</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductSearch;
