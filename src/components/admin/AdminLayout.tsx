import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    Package,
    ShoppingCart,
    Tags,
    Settings,
    BarChart3,
    LogOut,
    Megaphone,
    Truck,
    FileText,
    ImageIcon,
    ExternalLink,
    ChevronRight,
    Home,
    Menu,
    X,
    LayoutTemplate,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { toast } from "sonner";
import { useState } from "react";

interface AdminLayoutProps {
    children: React.ReactNode;
    title: string;
    description?: string;
}

const AdminLayout = ({ children, title, description }: AdminLayoutProps) => {
    const { logout, username, role, canAccessSettings } = useAdminAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleSignOut = () => {
        logout();
        toast.success("تم تسجيل الخروج");
        navigate("/admin/login");
    };

    const getRoleBadge = () => {
        if (role === 'admin') return { text: 'مدير', color: 'bg-green-500' };
        if (role === 'editor') return { text: 'محرر', color: 'bg-blue-500' };
        return { text: 'عارض', color: 'bg-gray-500' };
    };

    const roleBadge = getRoleBadge();

    const navItems = [
        { title: "الرئيسية", icon: Home, href: "/admin", allowed: true },
        { title: "تنسيق الرئيسية", icon: LayoutTemplate, href: "/admin/sections", allowed: canAccessSettings() },
        { title: "المنتجات", icon: Package, href: "/admin/products", allowed: true },
        { title: "الطلبات", icon: ShoppingCart, href: "/admin/orders", allowed: true },
        { title: "الماركات", icon: Tags, href: "/admin/brands", allowed: true },
        { title: "البنرات الرئيسية", icon: ImageIcon, href: "/admin/hero-banners", allowed: true },
        { title: "البنرات الترويجية", icon: Megaphone, href: "/admin/promo-banners", allowed: true },
        { title: "بانرات الصفحات", icon: FileText, href: "/admin/page-banners", allowed: true },
        { title: "التوصيل", icon: Truck, href: "/admin/delivery", allowed: canAccessSettings() },
        { title: "الإعدادات", icon: Settings, href: "/admin/settings", allowed: canAccessSettings() },
    ].filter(item => item.allowed);

    const isActive = (href: string) => {
        if (href === "/admin") return location.pathname === "/admin";
        return location.pathname.startsWith(href);
    };

    return (
        <div className="min-h-screen bg-muted/30 flex">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:sticky top-0 right-0 h-screen w-64 bg-card border-l z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
                {/* Sidebar Header */}
                <div className="p-4 border-b flex items-center justify-between">
                    <Link to="/admin" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-secondary to-accent rounded-xl flex items-center justify-center">
                            <BarChart3 className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <span className="font-bold text-sm">لوحة التحكم</span>
                            <p className="text-[10px] text-muted-foreground">دريم</p>
                        </div>
                    </Link>
                    <button
                        className="lg:hidden p-2 hover:bg-muted rounded-lg"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Nav Items */}
                <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-140px)]">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive(item.href)
                                ? 'bg-secondary text-white'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.title}
                        </Link>
                    ))}
                </nav>

                {/* Sidebar Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-3 border-t bg-card">
                    <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-xl mb-2">
                        <div className={`w-2 h-2 rounded-full ${roleBadge.color}`} />
                        <span className="text-sm font-medium flex-1 truncate">{username}</span>
                        <Badge variant="outline" className="text-[10px]">{roleBadge.text}</Badge>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSignOut}
                        className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                        <LogOut className="h-4 w-4" />
                        تسجيل الخروج
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Top Header */}
                <header className="bg-card border-b sticky top-0 z-30">
                    <div className="px-4 lg:px-6 py-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {/* Mobile menu button */}
                                <button
                                    className="lg:hidden p-2 hover:bg-muted rounded-lg"
                                    onClick={() => setSidebarOpen(true)}
                                >
                                    <Menu className="h-5 w-5" />
                                </button>

                                {/* Breadcrumb */}
                                <div className="flex items-center gap-2 text-sm">
                                    <Link to="/admin" className="text-muted-foreground hover:text-foreground">
                                        لوحة التحكم
                                    </Link>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">{title}</span>
                                </div>
                            </div>

                            <Link to="/" target="_blank">
                                <Button variant="outline" size="sm" className="gap-1.5 rounded-lg">
                                    <ExternalLink className="h-4 w-4" />
                                    <span className="hidden sm:inline">زيارة الموقع</span>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Page Header */}
                <div className="bg-card border-b px-4 lg:px-6 py-4">
                    <h1 className="text-xl lg:text-2xl font-bold">{title}</h1>
                    {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
                </div>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-6">
                    {children}
                </main>

                {/* Footer */}
                <footer className="border-t bg-card px-4 lg:px-6 py-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Dream Admin Panel v2.0</span>
                        <span>© 2024 دريم للتجارة والتوريدات</span>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default AdminLayout;
