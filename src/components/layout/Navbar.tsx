import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, Heart, Search, User, Package, LogOut, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSiteSettings } from "@/hooks/useSettings";
import { useProducts } from "@/hooks/useProducts";
import SearchDialog from "@/components/SearchDialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { items } = useCart();
    const { items: wishlistItems } = useWishlist();
    const { user, signOut } = useAuth();
    const { data: settings } = useSiteSettings();
    const { data: products } = useProducts();

    const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

    // Filter products for suggestions
    const suggestions = searchQuery.length >= 2 && products
        ? products.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand?.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 5)
        : [];

    // Close suggestions on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navLinks = [
        { href: "/", label: "الرئيسية" },
        { href: "/products", label: "منتجاتنا" },
        { href: "/blog", label: "المدونة" },
        { href: "/about", label: "من نحن" },
        { href: "/contact", label: "تواصل معنا" },
    ];

    const handleSignOut = async () => {
        await signOut();
        toast.success("تم تسجيل الخروج بنجاح");
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setShowSuggestions(false);
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleSuggestionClick = (productId: string) => {
        setShowSuggestions(false);
        setSearchQuery("");
        navigate(`/product/${productId}`);
    };

    return (
        <>
            <header className="sticky top-0 z-50">
                {/* Top Bar - Premium gradient */}
                <div className="bg-gradient-to-r from-primary via-primary to-secondary text-white py-2 text-sm hidden md:block">
                    <div className="container mx-auto px-4 flex justify-between items-center">
                        <div className="flex items-center gap-6">
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                متاح الآن
                            </span>
                            <span>{settings?.store_slogan || "وكيلك المعتمد لأكبر الماركات العالمية"}</span>
                        </div>
                        <a href={`tel:${settings?.store_phone || "01289006310"}`} className="hover:text-secondary-foreground transition-colors flex items-center gap-2 font-medium">
                            <span className="bg-white/20 rounded-full p-1">📞</span>
                            {settings?.store_phone || "01289006310"}
                        </a>
                    </div>
                </div>

                {/* Main Navbar - Glassmorphism effect */}
                <nav className="bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between h-16 lg:h-20">
                            {/* Logo */}
                            <Link to="/" className="flex items-center flex-shrink-0">
                                <img src="/logo.png" alt="دريم للتجارة والتوريدات" className="h-12 lg:h-14 w-auto" />
                            </Link>

                            {/* Desktop Navigation - Center */}
                            <div className="hidden lg:flex items-center gap-1">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        to={link.href}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${location.pathname === link.href
                                            ? "bg-secondary text-white shadow-md"
                                            : "hover:bg-secondary/10 text-foreground"
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>

                            {/* Search Bar - Desktop */}
                            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-6">
                                <div ref={searchRef} className="relative w-full group">
                                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-secondary transition-colors z-10" />
                                    <Input
                                        type="text"
                                        placeholder="ابحث عن منتج..."
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setShowSuggestions(true);
                                        }}
                                        onFocus={() => setShowSuggestions(true)}
                                        className="pr-10 pl-4 h-11 rounded-full border-2 border-muted bg-muted/50 focus:border-secondary focus:bg-background transition-all"
                                    />

                                    {/* Search Suggestions Dropdown */}
                                    {showSuggestions && suggestions.length > 0 && (
                                        <div className="absolute top-full mt-2 w-full bg-background rounded-xl shadow-lg border border-border overflow-hidden z-50">
                                            {suggestions.map((product) => (
                                                <button
                                                    key={product.id}
                                                    type="button"
                                                    onClick={() => handleSuggestionClick(product.id)}
                                                    className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors text-right"
                                                >
                                                    <img
                                                        src={product.image_url || '/placeholder.svg'}
                                                        alt={product.name}
                                                        className="w-10 h-10 object-contain rounded-lg bg-muted"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium truncate">{product.name}</p>
                                                        <p className="text-xs text-muted-foreground">{product.brand} • {product.price.toLocaleString()} ج.م</p>
                                                    </div>
                                                </button>
                                            ))}
                                            <button
                                                type="submit"
                                                className="w-full p-3 text-sm text-secondary font-medium hover:bg-secondary/10 border-t border-border"
                                            >
                                                عرض كل النتائج لـ "{searchQuery}"
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </form>

                            {/* Actions */}
                            <div className="flex items-center gap-1">
                                {/* Mobile Search */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSearchOpen(true)}
                                    className="md:hidden hover:bg-secondary/10"
                                >
                                    <Search className="h-5 w-5" />
                                </Button>

                                {/* My Orders - only for logged in users */}
                                {user && (
                                    <Link to="/my-orders" className="hidden sm:block">
                                        <Button variant="ghost" size="icon" className="hover:bg-secondary/10">
                                            <Package className="h-5 w-5" />
                                        </Button>
                                    </Link>
                                )}

                                {/* Wishlist */}
                                <Link to="/wishlist">
                                    <Button variant="ghost" size="icon" className="relative hover:bg-secondary/10">
                                        <Heart className="h-5 w-5" />
                                        {wishlistItems.length > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                                                {wishlistItems.length}
                                            </span>
                                        )}
                                    </Button>
                                </Link>

                                {/* Cart */}
                                <Link to="/cart">
                                    <Button variant="ghost" size="icon" className="relative hover:bg-secondary/10">
                                        <ShoppingCart className="h-5 w-5" />
                                        {cartItemsCount > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
                                                {cartItemsCount}
                                            </span>
                                        )}
                                    </Button>
                                </Link>

                                {/* User Menu */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="hover:bg-secondary/10">
                                            <User className="h-5 w-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        {user ? (
                                            <>
                                                <DropdownMenuItem asChild>
                                                    <Link to="/my-orders" className="flex items-center gap-2 cursor-pointer">
                                                        <ClipboardList className="h-4 w-4" />
                                                        طلباتي
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 cursor-pointer text-destructive">
                                                    <LogOut className="h-4 w-4" />
                                                    تسجيل الخروج
                                                </DropdownMenuItem>
                                            </>
                                        ) : (
                                            <>
                                                <DropdownMenuItem asChild>
                                                    <Link to="/login" className="flex items-center gap-2 cursor-pointer">
                                                        <User className="h-4 w-4" />
                                                        تسجيل الدخول
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link to="/register" className="flex items-center gap-2 cursor-pointer">
                                                        إنشاء حساب
                                                    </Link>
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {/* Mobile menu button */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="lg:hidden hover:bg-secondary/10"
                                    onClick={() => setIsOpen(!isOpen)}
                                >
                                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                                </Button>
                            </div>
                        </div>

                        {/* Mobile Navigation */}
                        {isOpen && (
                            <div className="lg:hidden py-4 border-t animate-[slide-up_0.3s_ease-out]">
                                {/* Mobile Search */}
                                <form onSubmit={handleSearch} className="mb-4">
                                    <div className="relative">
                                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="text"
                                            placeholder="ابحث عن منتج..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pr-10 h-12 rounded-xl"
                                        />
                                    </div>
                                </form>

                                <div className="flex flex-col gap-1">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            to={link.href}
                                            className={`px-4 py-3 rounded-xl transition-all ${location.pathname === link.href
                                                ? "bg-secondary text-white"
                                                : "hover:bg-muted"
                                                }`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </nav>
            </header>

            <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
        </>
    );
};

export default Navbar;
