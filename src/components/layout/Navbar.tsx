import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart, Heart, GitCompare, Search, User, Package, LogOut, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCompare } from "@/contexts/CompareContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSiteSettings } from "@/hooks/useSettings";
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
    const location = useLocation();
    const { items } = useCart();
    const { items: wishlistItems } = useWishlist();
    const { items: compareItems } = useCompare();
    const { user, signOut } = useAuth();
    const { data: settings } = useSiteSettings();

    const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const navLinks = [
        { href: "/", label: "الرئيسية" },
        { href: "/products", label: "منتجاتنا" },
        { href: "/about", label: "عن الشركة" },
        { href: "/contact", label: "اتصل بنا" },
    ];

    const handleSignOut = async () => {
        await signOut();
        toast.success("تم تسجيل الخروج بنجاح");
    };

    return (
        <>
            <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
                {/* Top Bar */}
                <div className="bg-secondary text-secondary-foreground py-1.5 text-sm hidden md:block">
                    <div className="container mx-auto px-4 flex justify-between items-center">
                        <span>{settings?.store_description || "شركة تارجت لأعمال التكييف"}</span>
                        <a href={`tel:${settings?.store_phone || "01208000550"}`} className="hover:underline flex items-center gap-1">
                            📞 {settings?.store_phone || "01208000550"}
                        </a>
                    </div>
                </div>


                {/* Main Navbar */}
                <nav className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center">
                            <img src="/logo.png" alt="Target Air Conditioning" className="h-10 w-auto" />
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-1 space-x-reverse">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    to={link.href}
                                    className={`px-4 py-2 rounded-lg transition-colors ${location.pathname === link.href
                                        ? "bg-secondary text-secondary-foreground"
                                        : "hover:bg-muted"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            {/* Search */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSearchOpen(true)}
                            >
                                <Search className="h-5 w-5" />
                            </Button>

                            {/* My Orders - only for logged in users */}
                            {user && (
                                <Link to="/my-orders">
                                    <Button variant="ghost" size="icon" className="relative">
                                        <Package className="h-5 w-5" />
                                    </Button>
                                </Link>
                            )}

                            {/* Wishlist */}
                            <Link to="/wishlist">
                                <Button variant="ghost" size="icon" className="relative">
                                    <Heart className="h-5 w-5" />
                                    {wishlistItems.length > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                            {wishlistItems.length}
                                        </span>
                                    )}
                                </Button>
                            </Link>

                            {/* Cart */}
                            <Link to="/cart">
                                <Button variant="ghost" size="icon" className="relative">
                                    <ShoppingCart className="h-5 w-5" />
                                    {cartItemsCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                            {cartItemsCount}
                                        </span>
                                    )}
                                </Button>
                            </Link>

                            {/* User Menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
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
                                className="md:hidden"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    {isOpen && (
                        <div className="md:hidden py-4 border-t">
                            <div className="flex flex-col space-y-2">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        to={link.href}
                                        className={`px-4 py-2 rounded-lg transition-colors ${location.pathname === link.href
                                            ? "bg-secondary text-secondary-foreground"
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
                </nav>
            </header>

            <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
        </>
    );
};

export default Navbar;

