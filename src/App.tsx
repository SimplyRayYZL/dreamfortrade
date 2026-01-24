import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { HelmetProvider } from "react-helmet-async";
import ScrollToTop from "@/components/ScrollToTop";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import TrackingScripts from "@/components/TrackingScripts";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { CompareProvider } from "@/contexts/CompareContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedAdminRoute from "@/components/admin/ProtectedAdminRoute";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Compare = lazy(() => import("./pages/Compare"));
const AdminImageEnhancer = lazy(() => import("./pages/AdminImageEnhancer"));
const ProductsAdmin = lazy(() => import("./pages/admin/ProductsAdmin"));
const OrdersAdmin = lazy(() => import("./pages/admin/OrdersAdmin"));
const BrandsAdmin = lazy(() => import("./pages/admin/BrandsAdmin"));
const BannersAdmin = lazy(() => import("./pages/admin/BannersAdmin"));
const HeroBannersAdmin = lazy(() => import("./pages/admin/HeroBannersAdmin"));
const PromoBannersAdmin = lazy(() => import("./pages/admin/PromoBannersAdmin"));
const DeliverySettingsAdmin = lazy(() => import("./pages/admin/DeliverySettingsAdmin"));
const SettingsAdmin = lazy(() => import("./pages/admin/SettingsAdmin"));
const PageBannersAdmin = lazy(() => import("./pages/admin/PageBannersAdmin"));
const StoreSettingsAdmin = lazy(() => import("./pages/admin/StoreSettingsAdmin"));
const SocialSettingsAdmin = lazy(() => import("./pages/admin/SocialSettingsAdmin"));
const AnalyticsSettingsAdmin = lazy(() => import("./pages/admin/AnalyticsSettingsAdmin"));
const SEOSettingsAdmin = lazy(() => import("./pages/admin/SEOSettingsAdmin"));
const SectionsAdmin = lazy(() => import("./pages/admin/SectionsAdmin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogArticle = lazy(() => import("./pages/BlogArticle"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
    },
  },
});

// Import AOS styles
import 'aos/dist/aos.css';
import AOS from 'aos';

// Initialize AOS - Simple fast settings for all devices
if (typeof window !== 'undefined') {
  AOS.init({
    duration: 400,
    easing: 'ease-out-quart',
    once: true,
    offset: 30,
    delay: 0,
    mirror: false,
  });
}

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-muted-foreground">جاري التحميل...</p>
    </div>
  </div>
);

const App = () => (
  <HelmetProvider>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AdminAuthProvider>
            <CartProvider>
              <WishlistProvider>
                <CompareProvider>
                  <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <BrowserRouter>
                      <ScrollToTop />
                      <TrackingScripts />
                      <Suspense fallback={<PageLoader />}>
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/products" element={<Products />} />
                          <Route path="/product/:id" element={<ProductDetails />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="/cart" element={<Cart />} />
                          <Route path="/checkout" element={<Checkout />} />
                          <Route path="/order-success/:orderId" element={<OrderSuccess />} />
                          <Route path="/wishlist" element={<Wishlist />} />
                          <Route path="/compare" element={<Compare />} />
                          {/* Auth Routes */}
                          <Route path="/login" element={<Login />} />
                          <Route path="/register" element={<Register />} />
                          <Route path="/forgot-password" element={<ForgotPassword />} />
                          <Route path="/reset-password" element={<ResetPassword />} />
                          <Route path="/my-orders" element={<MyOrders />} />
                          {/* Admin Routes */}
                          <Route path="/admin/login" element={<AdminLogin />} />
                          <Route path="/admin" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
                          <Route path="/admin/enhance-images" element={<ProtectedAdminRoute><AdminImageEnhancer /></ProtectedAdminRoute>} />
                          <Route path="/admin/products" element={<ProtectedAdminRoute><ProductsAdmin /></ProtectedAdminRoute>} />
                          <Route path="/admin/orders" element={<ProtectedAdminRoute><OrdersAdmin /></ProtectedAdminRoute>} />
                          <Route path="/admin/brands" element={<ProtectedAdminRoute><BrandsAdmin /></ProtectedAdminRoute>} />
                          <Route path="/admin/banners" element={<ProtectedAdminRoute><BannersAdmin /></ProtectedAdminRoute>} />
                          <Route path="/admin/hero-banners" element={<ProtectedAdminRoute><HeroBannersAdmin /></ProtectedAdminRoute>} />
                          <Route path="/admin/promo-banners" element={<ProtectedAdminRoute><PromoBannersAdmin /></ProtectedAdminRoute>} />
                          <Route path="/admin/delivery" element={<ProtectedAdminRoute><DeliverySettingsAdmin /></ProtectedAdminRoute>} />
                          <Route path="/admin/settings" element={<ProtectedAdminRoute><SettingsAdmin /></ProtectedAdminRoute>} />
                          <Route path="/admin/page-banners" element={<ProtectedAdminRoute><PageBannersAdmin /></ProtectedAdminRoute>} />
                          <Route path="/admin/settings/store" element={<ProtectedAdminRoute><StoreSettingsAdmin /></ProtectedAdminRoute>} />
                          <Route path="/admin/settings/social" element={<ProtectedAdminRoute><SocialSettingsAdmin /></ProtectedAdminRoute>} />
                          <Route path="/admin/settings/analytics" element={<ProtectedAdminRoute><AnalyticsSettingsAdmin /></ProtectedAdminRoute>} />
                          <Route path="/admin/settings/seo" element={<ProtectedAdminRoute><SEOSettingsAdmin /></ProtectedAdminRoute>} />
                          <Route path="/admin/sections" element={<ProtectedAdminRoute><SectionsAdmin /></ProtectedAdminRoute>} />
                          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                          {/* Blog Routes */}
                          <Route path="/blog" element={<Blog />} />
                          <Route path="/blog/:slug" element={<BlogArticle />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </Suspense>
                      <FloatingWhatsApp />
                    </BrowserRouter>
                  </TooltipProvider>
                </CompareProvider>
              </WishlistProvider>
            </CartProvider>
          </AdminAuthProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </HelmetProvider>
);

export default App;
