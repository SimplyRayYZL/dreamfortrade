import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, Menu, X, Phone, Heart, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import SearchDialog from "@/components/SearchDialog";
import CartDrawer from "@/components/cart/CartDrawer";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { totalItems } = useCart();
  const { items: wishlistItems } = useWishlist();

  const navLinks = [
    { name: "الرئيسية", href: "/" },
    { name: "منتجاتنا", href: "/products" },
    { name: "عن الشركة", href: "/about" },
    { name: "اتصل بنا", href: "/contact" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full">
        {/* Top Bar */}
        <div className="bg-primary text-primary-foreground py-2">
          <div className="container mx-auto px-4 flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <a href="tel:01289006310" className="flex items-center gap-2 hover:text-secondary transition-colors">
                <Phone className="h-4 w-4" />
                <span>01289006310</span>
              </a>
            </div>
            <p className="hidden md:block">الوكيل المعتمد لأكبر الماركات العالمية للتكييفات</p>
          </div>
        </div>

        {/* Main Navbar */}
        <nav className="bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-20">
              {/* Logo */}
              <Link to="/" className="flex items-center">
                <img
                  src={logo}
                  alt="Dream For Trade"
                  className="h-14 md:h-16 w-auto object-contain"
                />
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-foreground/80 hover:text-secondary font-medium transition-colors relative group"
                  >
                    {link.name}
                    <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full" />
                  </Link>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <ThemeToggle />

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground hover:text-secondary hover:bg-secondary/10"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search className="h-5 w-5" />
                </Button>

                <Link to="/wishlist">
                  <Button variant="ghost" size="icon" className="text-foreground hover:text-secondary hover:bg-secondary/10 relative">
                    <Heart className="h-5 w-5" />
                    {wishlistItems.length > 0 && (
                      <span className="absolute -top-1 -left-1 w-5 h-5 bg-destructive text-white text-xs rounded-full flex items-center justify-center">
                        {wishlistItems.length}
                      </span>
                    )}
                  </Button>
                </Link>

                <Link to="/track-order" title="تتبع الطلب">
                  <Button variant="ghost" size="icon" className="text-foreground hover:text-secondary hover:bg-secondary/10">
                    <Package className="h-5 w-5" />
                  </Button>
                </Link>

                <CartDrawer>
                  <Button variant="ghost" size="icon" className="text-foreground hover:text-secondary hover:bg-secondary/10 relative">
                    <ShoppingCart className="h-5 w-5" />
                    <span className="absolute -top-1 -left-1 w-5 h-5 bg-secondary text-secondary-foreground text-xs rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  </Button>
                </CartDrawer>

                {/* Mobile Menu Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
              <div className="lg:hidden py-4 border-t border-border animate-fade-in">
                <div className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      className="text-foreground/80 hover:text-secondary font-medium py-2 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>
      </header>

      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  );
};

export default Navbar;
