import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
    Package,
    ShoppingCart,
    Tags,
    Settings,
    BarChart3,
    Users,
    LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
    const { logout, username, role, canAccessSettings } = useAdminAuth();
    const navigate = useNavigate();

    // Filter pages based on role
    const adminPages = [
        {
            title: "إدارة المنتجات",
            description: "إضافة، تعديل، وحذف المنتجات",
            icon: Package,
            href: "/admin/products",
            color: "bg-blue-500",
            allowed: true,
        },
        {
            title: "إدارة الطلبات",
            description: "عرض ومتابعة طلبات العملاء",
            icon: ShoppingCart,
            href: "/admin/orders",
            color: "bg-green-500",
            allowed: true,
        },
        {
            title: "إدارة الماركات",
            description: "إضافة وتعديل ماركات التكييفات",
            icon: Tags,
            href: "/admin/brands",
            color: "bg-purple-500",
            allowed: true,
        },
        {
            title: "إدارة البنرات",
            description: "تعديل بنرات الماركات على الصفحة الرئيسية",
            icon: Package,
            href: "/admin/banners",
            color: "bg-cyan-500",
            allowed: true,
        },
        {
            title: "إعدادات الموقع",
            description: "إعدادات المتجر، السوشيال، الشحن، SEO",
            icon: Settings,
            href: "/admin/settings",
            color: "bg-orange-500",
            allowed: canAccessSettings(),
        },
    ].filter(page => page.allowed);

    const handleSignOut = () => {
        logout();
        toast.success("تم تسجيل الخروج");
        navigate("/admin/login");
    };

    const getRoleBadge = () => {
        if (role === 'admin') return { text: 'مدير كامل', variant: 'default' as const };
        if (role === 'editor') return { text: 'محرر', variant: 'secondary' as const };
        return { text: 'عارض', variant: 'outline' as const };
    };

    const roleBadge = getRoleBadge();

    return (
        <>
            <Helmet>
                <title>لوحة التحكم | تارجت لأعمال التكييف</title>
            </Helmet>

            <div className="min-h-screen bg-muted/30">
                {/* Header */}
                <header className="bg-card border-b sticky top-0 z-40">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                                    <BarChart3 className="h-5 w-5 text-secondary-foreground" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold">لوحة التحكم</h1>
                                    <p className="text-sm text-muted-foreground">????? ?????? ???????</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge variant={roleBadge.variant} className="hidden sm:flex">
                                    {username} - {roleBadge.text}
                                </Badge>
                                <Link to="/">
                                    <Button variant="outline" size="sm">
                                        زيارة الموقع
                                    </Button>
                                </Link>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleSignOut}
                                    className="gap-2"
                                >
                                    <LogOut className="h-4 w-4" />
                                    خروج
                                </Button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="container mx-auto px-4 py-8">
                    {/* Welcome */}
                    <div className="bg-gradient-to-r from-secondary to-primary rounded-2xl p-8 text-white mb-8">
                        <h2 className="text-2xl font-bold mb-2">مرحباً بك {username} في لوحة التحكم 👋</h2>
                        <p className="text-white/80">
                            {role === 'admin'
                                ? 'من هنا يمكنك إدارة جميع جوانب متجرك'
                                : 'يمكنك إدارة المنتجات والطلبات والماركات من هنا'}
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-card rounded-xl p-4 border">
                            <Package className="h-8 w-8 text-blue-500 mb-2" />
                            <p className="text-2xl font-bold">--</p>
                            <p className="text-sm text-muted-foreground">المنتجات</p>
                        </div>
                        <div className="bg-card rounded-xl p-4 border">
                            <ShoppingCart className="h-8 w-8 text-green-500 mb-2" />
                            <p className="text-2xl font-bold">--</p>
                            <p className="text-sm text-muted-foreground">الطلبات</p>
                        </div>
                        <div className="bg-card rounded-xl p-4 border">
                            <Tags className="h-8 w-8 text-purple-500 mb-2" />
                            <p className="text-2xl font-bold">--</p>
                            <p className="text-sm text-muted-foreground">الماركات</p>
                        </div>
                        <div className="bg-card rounded-xl p-4 border">
                            <Users className="h-8 w-8 text-orange-500 mb-2" />
                            <p className="text-2xl font-bold">--</p>
                            <p className="text-sm text-muted-foreground">العملاء</p>
                        </div>
                    </div>

                    {/* Admin Pages Grid */}
                    <h3 className="text-lg font-bold mb-4">الصفحات</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {adminPages.map((page) => (
                            <Link
                                key={page.href}
                                to={page.href}
                                className="group bg-card rounded-xl p-6 border hover:border-secondary hover:shadow-lg transition-all duration-300"
                            >
                                <div className={`w-12 h-12 ${page.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <page.icon className="h-6 w-6 text-white" />
                                </div>
                                <h4 className="font-bold text-foreground mb-1 group-hover:text-secondary transition-colors">
                                    {page.title}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    {page.description}
                                </p>
                            </Link>
                        ))}
                    </div>
                </main>
            </div>
        </>
    );
};

export default AdminDashboard;

