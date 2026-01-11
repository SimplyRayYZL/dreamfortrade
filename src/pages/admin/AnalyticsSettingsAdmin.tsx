import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
    BarChart3, Save, Loader2, ArrowRight, Globe, Facebook,
    Store, Search, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useSiteSettings, useUpdateSettings } from "@/hooks/useSettings";
import { toast } from "sonner";

const AnalyticsSettingsAdmin = () => {
    const { data: settings, isLoading } = useSiteSettings();
    const updateSettings = useUpdateSettings();
    const [formData, setFormData] = useState({
        google_analytics_id: "",
        google_tag_manager_id: "",
        google_search_console: "",
        google_merchant_id: "",
        facebook_pixel_id: "",
        tiktok_pixel_id: "",
        snapchat_pixel_id: "",
        hotjar_id: "",
        clarity_id: "",
    });

    useEffect(() => {
        if (settings) {
            setFormData({
                google_analytics_id: settings.google_analytics_id || "",
                google_tag_manager_id: settings.google_tag_manager_id || "",
                google_search_console: settings.google_search_console || "",
                google_merchant_id: settings.google_merchant_id || "",
                facebook_pixel_id: settings.facebook_pixel_id || "",
                tiktok_pixel_id: settings.tiktok_pixel_id || "",
                snapchat_pixel_id: settings.snapchat_pixel_id || "",
                hotjar_id: settings.hotjar_id || "",
                clarity_id: settings.clarity_id || "",
            });
        }
    }, [settings]);

    const handleChange = (field: string, value: string) => {
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
                <title>التتبع والتحليلات - لوحة التحكم</title>
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
                                        <BarChart3 className="h-6 w-6 text-orange-500" />
                                        التتبع والتحليلات
                                    </h1>
                                    <p className="text-sm text-muted-foreground">Google & Pixels & Behavior</p>
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
                    {/* Google Services */}
                    <Card className="border-blue-500/20">
                        <CardHeader className="bg-gradient-to-r from-blue-500/10 to-blue-600/5 border-b">
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="h-5 w-5 text-blue-500" />
                                خدمات Google
                            </CardTitle>
                            <CardDescription>Analytics, Tag Manager, Search Console, Merchant</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 border rounded-xl bg-gradient-to-br from-orange-500/5 to-orange-600/10 space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <BarChart3 className="h-4 w-4 text-orange-500" />
                                        Google Analytics 4 (GA4)
                                    </Label>
                                    <Input
                                        value={formData.google_analytics_id}
                                        onChange={(e) => handleChange("google_analytics_id", e.target.value)}
                                        placeholder="G-XXXXXXXXXX"
                                    />
                                    <p className="text-xs text-muted-foreground">Measurement ID من Google Analytics</p>
                                </div>
                                <div className="p-4 border rounded-xl bg-gradient-to-br from-blue-500/5 to-blue-600/10 space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Globe className="h-4 w-4 text-blue-500" />
                                        Google Tag Manager
                                    </Label>
                                    <Input
                                        value={formData.google_tag_manager_id}
                                        onChange={(e) => handleChange("google_tag_manager_id", e.target.value)}
                                        placeholder="GTM-XXXXXXX"
                                    />
                                    <p className="text-xs text-muted-foreground">Container ID من Tag Manager</p>
                                </div>
                                <div className="p-4 border rounded-xl bg-gradient-to-br from-green-500/5 to-green-600/10 space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Search className="h-4 w-4 text-green-500" />
                                        Google Search Console
                                    </Label>
                                    <Input
                                        value={formData.google_search_console}
                                        onChange={(e) => handleChange("google_search_console", e.target.value)}
                                        placeholder="verification code"
                                    />
                                    <p className="text-xs text-muted-foreground">كود التحقق من ملكية الموقع</p>
                                </div>
                                <div className="p-4 border rounded-xl bg-gradient-to-br from-purple-500/5 to-purple-600/10 space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Store className="h-4 w-4 text-purple-500" />
                                        Google Merchant Center
                                    </Label>
                                    <Input
                                        value={formData.google_merchant_id}
                                        onChange={(e) => handleChange("google_merchant_id", e.target.value)}
                                        placeholder="Merchant ID"
                                    />
                                    <p className="text-xs text-muted-foreground">لعرض المنتجات في Google Shopping</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Advertising Pixels */}
                    <Card className="border-pink-500/20">
                        <CardHeader className="bg-gradient-to-r from-pink-500/10 to-pink-600/5 border-b">
                            <CardTitle className="flex items-center gap-2">
                                <Facebook className="h-5 w-5 text-pink-500" />
                                Pixels للإعلانات
                            </CardTitle>
                            <CardDescription>Facebook, TikTok, Snapchat</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 border rounded-xl bg-gradient-to-br from-blue-500/5 to-blue-600/10 space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Facebook className="h-4 w-4 text-blue-600" />
                                        Facebook Pixel
                                    </Label>
                                    <Input
                                        value={formData.facebook_pixel_id}
                                        onChange={(e) => handleChange("facebook_pixel_id", e.target.value)}
                                        placeholder="Pixel ID"
                                    />
                                    <p className="text-xs text-muted-foreground">لتتبع التحويلات من إعلانات فيسبوك</p>
                                </div>
                                <div className="p-4 border rounded-xl bg-gradient-to-br from-pink-500/5 to-pink-600/10 space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                                        </svg>
                                        TikTok Pixel
                                    </Label>
                                    <Input
                                        value={formData.tiktok_pixel_id}
                                        onChange={(e) => handleChange("tiktok_pixel_id", e.target.value)}
                                        placeholder="Pixel ID"
                                    />
                                    <p className="text-xs text-muted-foreground">لتتبع إعلانات TikTok</p>
                                </div>
                                <div className="p-4 border rounded-xl bg-gradient-to-br from-yellow-500/5 to-yellow-600/10 space-y-2">
                                    <Label>Snapchat Pixel</Label>
                                    <Input
                                        value={formData.snapchat_pixel_id}
                                        onChange={(e) => handleChange("snapchat_pixel_id", e.target.value)}
                                        placeholder="Pixel ID"
                                    />
                                    <p className="text-xs text-muted-foreground">لتتبع إعلانات Snapchat</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Behavior Analytics */}
                    <Card className="border-orange-500/20">
                        <CardHeader className="bg-gradient-to-r from-orange-500/10 to-orange-600/5 border-b">
                            <CardTitle className="flex items-center gap-2">
                                <Eye className="h-5 w-5 text-orange-500" />
                                تحليل السلوك
                            </CardTitle>
                            <CardDescription>Hotjar, Microsoft Clarity</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 border rounded-xl bg-gradient-to-br from-orange-500/5 to-orange-600/10 space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <BarChart3 className="h-4 w-4 text-orange-500" />
                                        Hotjar Site ID
                                    </Label>
                                    <Input
                                        value={formData.hotjar_id}
                                        onChange={(e) => handleChange("hotjar_id", e.target.value)}
                                        placeholder="1234567"
                                    />
                                    <p className="text-xs text-muted-foreground">لتسجيل جلسات المستخدمين وخرائط الحرارة</p>
                                </div>
                                <div className="p-4 border rounded-xl bg-gradient-to-br from-blue-500/5 to-blue-600/10 space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Eye className="h-4 w-4 text-blue-500" />
                                        Microsoft Clarity
                                    </Label>
                                    <Input
                                        value={formData.clarity_id}
                                        onChange={(e) => handleChange("clarity_id", e.target.value)}
                                        placeholder="abcdefghij"
                                    />
                                    <p className="text-xs text-muted-foreground">بديل مجاني لـ Hotjar من Microsoft</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </>
    );
};

export default AnalyticsSettingsAdmin;
