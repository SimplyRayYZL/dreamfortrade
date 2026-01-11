import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
    Search, Save, Loader2, ArrowRight, Globe, Image as ImageIcon,
    FileText, Code, Map, FileCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useSiteSettings, useUpdateSettings } from "@/hooks/useSettings";
import { toast } from "sonner";

const SEOSettingsAdmin = () => {
    const { data: settings, isLoading } = useSiteSettings();
    const updateSettings = useUpdateSettings();
    const [formData, setFormData] = useState({
        seo_title: "",
        seo_description: "",
        seo_keywords: "",
        og_image: "",
        seo_robots: "index, follow",
        seo_canonical_url: "",
        seo_language: "ar",
        seo_author: "",
        structured_data_enabled: true,
        sitemap_enabled: true,
    });

    useEffect(() => {
        if (settings) {
            setFormData({
                seo_title: settings.seo_title || "",
                seo_description: settings.seo_description || "",
                seo_keywords: settings.seo_keywords || "",
                og_image: settings.og_image || "",
                seo_robots: settings.seo_robots || "index, follow",
                seo_canonical_url: settings.seo_canonical_url || "",
                seo_language: settings.seo_language || "ar",
                seo_author: settings.seo_author || "",
                structured_data_enabled: settings.structured_data_enabled ?? true,
                sitemap_enabled: settings.sitemap_enabled ?? true,
            });
        }
    }, [settings]);

    const handleChange = (field: string, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateSettings.mutate(formData as any, {
            onSuccess: () => toast.success("تم حفظ الإعدادات بنجاح"),
            onError: () => toast.error("حدث خطأ أثناء الحفظ"),
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-secondary" />
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>إعدادات SEO - لوحة التحكم</title>
            </Helmet>

            <div className="min-h-screen bg-muted/30">
                {/* Header */}
                <div className="bg-card border-b sticky top-0 z-40">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Link to="/admin/settings" className="p-2 rounded-lg hover:bg-muted transition-colors">
                                    <ArrowRight className="h-5 w-5" />
                                </Link>
                                <div>
                                    <h1 className="text-xl font-bold flex items-center gap-2">
                                        <Search className="h-6 w-6 text-green-500" />
                                        إعدادات SEO
                                    </h1>
                                    <p className="text-sm text-muted-foreground">تحسين محركات البحث</p>
                                </div>
                            </div>
                            <Button onClick={handleSubmit} disabled={updateSettings.isPending} className="gap-2">
                                {updateSettings.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                حفظ التغييرات
                            </Button>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="container mx-auto px-4 py-6 space-y-6">
                    {/* Basic Meta Tags */}
                    <Card className="border-green-500/20">
                        <CardHeader className="bg-gradient-to-r from-green-500/10 to-green-600/5 border-b">
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-green-500" />
                                Meta Tags الأساسية
                            </CardTitle>
                            <CardDescription>العنوان والوصف والكلمات المفتاحية</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="space-y-2">
                                <Label>عنوان الموقع (Title)</Label>
                                <Input
                                    value={formData.seo_title}
                                    onChange={(e) => handleChange("seo_title", e.target.value)}
                                    placeholder="دريم للتجارة - تكييفات بأفضل الأسعار"
                                />
                                <p className="text-xs text-muted-foreground">
                                    {formData.seo_title.length}/60 حرف (الأفضل أقل من 60)
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label>وصف الموقع (Meta Description)</Label>
                                <Textarea
                                    value={formData.seo_description}
                                    onChange={(e) => handleChange("seo_description", e.target.value)}
                                    placeholder="وصف قصير يظهر في نتائج البحث..."
                                    rows={3}
                                />
                                <p className="text-xs text-muted-foreground">
                                    {formData.seo_description.length}/160 حرف (الأفضل أقل من 160)
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label>الكلمات المفتاحية (Keywords)</Label>
                                <Textarea
                                    value={formData.seo_keywords}
                                    onChange={(e) => handleChange("seo_keywords", e.target.value)}
                                    placeholder="تكييف، تكييفات، كاريير، ميديا، شارب..."
                                    rows={2}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Open Graph & Social */}
                    <Card className="border-blue-500/20">
                        <CardHeader className="bg-gradient-to-r from-blue-500/10 to-blue-600/5 border-b">
                            <CardTitle className="flex items-center gap-2">
                                <ImageIcon className="h-5 w-5 text-blue-500" />
                                Open Graph
                            </CardTitle>
                            <CardDescription>للمشاركة على السوشيال ميديا</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>صورة المشاركة (OG Image URL)</Label>
                                    <Input
                                        value={formData.og_image}
                                        onChange={(e) => handleChange("og_image", e.target.value)}
                                        placeholder="/og-image.jpg"
                                    />
                                    <p className="text-xs text-muted-foreground">الحجم المثالي: 1200x630 px</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Canonical URL</Label>
                                    <Input
                                        value={formData.seo_canonical_url}
                                        onChange={(e) => handleChange("seo_canonical_url", e.target.value)}
                                        placeholder="https://dreamfortrade.com"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Technical SEO */}
                    <Card className="border-purple-500/20">
                        <CardHeader className="bg-gradient-to-r from-purple-500/10 to-purple-600/5 border-b">
                            <CardTitle className="flex items-center gap-2">
                                <Code className="h-5 w-5 text-purple-500" />
                                إعدادات متقدمة
                            </CardTitle>
                            <CardDescription>Robots, Language, Author</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Robots Meta Tag</Label>
                                    <Input
                                        value={formData.seo_robots}
                                        onChange={(e) => handleChange("seo_robots", e.target.value)}
                                        placeholder="index, follow"
                                    />
                                    <p className="text-xs text-muted-foreground">index, follow أو noindex, nofollow</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>لغة الموقع</Label>
                                    <Input
                                        value={formData.seo_language}
                                        onChange={(e) => handleChange("seo_language", e.target.value)}
                                        placeholder="ar"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>اسم المؤلف</Label>
                                    <Input
                                        value={formData.seo_author}
                                        onChange={(e) => handleChange("seo_author", e.target.value)}
                                        placeholder="دريم للتجارة والتوريدات"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Schema & Sitemap */}
                    <Card className="border-orange-500/20">
                        <CardHeader className="bg-gradient-to-r from-orange-500/10 to-orange-600/5 border-b">
                            <CardTitle className="flex items-center gap-2">
                                <Map className="h-5 w-5 text-orange-500" />
                                Schema & Sitemap
                            </CardTitle>
                            <CardDescription>البيانات المنظمة وخريطة الموقع</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center justify-between p-4 border rounded-xl">
                                    <div>
                                        <Label>Structured Data (JSON-LD)</Label>
                                        <p className="text-xs text-muted-foreground">بيانات منظمة لمحركات البحث</p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant={formData.structured_data_enabled ? "default" : "outline"}
                                        size="sm"
                                        className={formData.structured_data_enabled ? 'bg-green-600 hover:bg-green-700' : ''}
                                        onClick={() => handleChange("structured_data_enabled", !formData.structured_data_enabled)}
                                    >
                                        {formData.structured_data_enabled ? "مفعّل" : "موقف"}
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between p-4 border rounded-xl">
                                    <div>
                                        <Label>خريطة الموقع (Sitemap)</Label>
                                        <p className="text-xs text-muted-foreground">تفعيل sitemap.xml</p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant={formData.sitemap_enabled ? "default" : "outline"}
                                        size="sm"
                                        className={formData.sitemap_enabled ? 'bg-green-600 hover:bg-green-700' : ''}
                                        onClick={() => handleChange("sitemap_enabled", !formData.sitemap_enabled)}
                                    >
                                        {formData.sitemap_enabled ? "مفعّل" : "موقف"}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </>
    );
};

export default SEOSettingsAdmin;
