import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Image, Layers, FileImage, Layout, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const BannersAdmin = () => {
    const bannerPages = [
        {
            title: "البانرات الرئيسية",
            description: "بانرات الصفحة الرئيسية (Hero Slider)",
            icon: <Layers className="h-8 w-8" />,
            color: "from-blue-500 to-blue-600",
            link: "/admin/hero-banners",
            count: "الهيدر والسلايدر"
        },
        {
            title: "البانرات الترويجية",
            description: "بانرات العروض والإعلانات",
            icon: <Image className="h-8 w-8" />,
            color: "from-pink-500 to-rose-600",
            link: "/admin/promo-banners",
            count: "العروض والخصومات"
        },
        {
            title: "بانرات الصفحات",
            description: "بانرات صفحات الموقع المختلفة",
            icon: <FileImage className="h-8 w-8" />,
            color: "from-green-500 to-emerald-600",
            link: "/admin/page-banners",
            count: "المنتجات، الماركات، السلة..."
        },
    ];

    return (
        <>
            <Helmet>
                <title>إدارة البانرات - لوحة التحكم</title>
            </Helmet>

            <div className="min-h-screen bg-muted/30">
                {/* Header */}
                <div className="bg-card border-b sticky top-0 z-40">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center gap-4">
                            <Link to="/admin" className="p-2 rounded-lg hover:bg-muted transition-colors">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                            <div>
                                <h1 className="text-xl font-bold flex items-center gap-2">
                                    <Layout className="h-6 w-6 text-secondary" />
                                    إدارة البانرات
                                </h1>
                                <p className="text-sm text-muted-foreground">جميع بانرات الموقع</p>
                            </div>
                        </div>
                    </div>
                </div>

                <main className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {bannerPages.map((page) => (
                            <Link key={page.link} to={page.link}>
                                <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 group cursor-pointer border-2 hover:border-secondary/50">
                                    <CardHeader className={`bg-gradient-to-br ${page.color} text-white rounded-t-lg`}>
                                        <div className="flex items-center justify-between">
                                            <div className="p-3 bg-white/20 rounded-xl">
                                                {page.icon}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <CardTitle className="text-lg mb-2 group-hover:text-secondary transition-colors">
                                            {page.title}
                                        </CardTitle>
                                        <CardDescription>{page.description}</CardDescription>
                                        <p className="text-xs text-muted-foreground mt-2">{page.count}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </main>
            </div>
        </>
    );
};

export default BannersAdmin;
