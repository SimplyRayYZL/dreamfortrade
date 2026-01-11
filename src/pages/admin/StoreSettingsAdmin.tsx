import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
    Store, Save, Loader2, ArrowRight, Phone, Clock, MapPin,
    Mail, MessageCircle, Globe, Upload, Building2, Image as ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useSiteSettings, useUpdateSettings } from "@/hooks/useSettings";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const StoreSettingsAdmin = () => {
    const { data: settings, isLoading } = useSiteSettings();
    const updateSettings = useUpdateSettings();
    const [formData, setFormData] = useState({
        store_name: "",
        store_name_en: "",
        store_logo: "",
        store_description: "",
        store_slogan: "",
        store_address: "",
        store_map_embed: "",
        store_phone: "",
        store_phone_alt: "",
        store_email: "",
        store_whatsapp: "",
        whatsapp_message: "",
        working_hours_from: "09:00",
        working_hours_to: "21:00",
        working_days: "",
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (settings) {
            setFormData({
                store_name: settings.store_name || "",
                store_name_en: settings.store_name_en || "",
                store_logo: settings.store_logo || "",
                store_description: settings.store_description || "",
                store_slogan: settings.store_slogan || "",
                store_address: settings.store_address || "",
                store_map_embed: settings.store_map_embed || "",
                store_phone: settings.store_phone || "",
                store_phone_alt: settings.store_phone_alt || "",
                store_email: settings.store_email || "",
                store_whatsapp: settings.store_whatsapp || "",
                whatsapp_message: settings.whatsapp_message || "",
                working_hours_from: settings.working_hours_from || "09:00",
                working_hours_to: settings.working_hours_to || "21:00",
                working_days: settings.working_days || "",
            });
        }
    }, [settings]);

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleLogoUpload = async (file: File) => {
        try {
            setUploading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `logo-${Date.now()}.${fileExt}`;

            const { error } = await supabase.storage
                .from('banner-images')
                .upload(fileName, file, { upsert: true });

            if (error) throw error;

            const { data: urlData } = supabase.storage
                .from('banner-images')
                .getPublicUrl(fileName);

            handleChange("store_logo", urlData.publicUrl);
            toast.success("تم رفع اللوجو بنجاح");
        } catch (error) {
            toast.error("حدث خطأ أثناء رفع اللوجو");
        } finally {
            setUploading(false);
        }
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
                <title>إعدادات المتجر - لوحة التحكم</title>
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
                                        <Store className="h-6 w-6 text-blue-500" />
                                        إعدادات المتجر
                                    </h1>
                                    <p className="text-sm text-muted-foreground">معلومات الشركة والتواصل</p>
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
                    {/* Store Identity */}
                    <Card className="border-blue-500/20">
                        <CardHeader className="bg-gradient-to-r from-blue-500/10 to-blue-600/5 border-b">
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-blue-500" />
                                هوية المتجر
                            </CardTitle>
                            <CardDescription>اسم الشركة والشعار والوصف</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>اسم المتجر (عربي)</Label>
                                    <Input
                                        value={formData.store_name}
                                        onChange={(e) => handleChange("store_name", e.target.value)}
                                        placeholder="دريم للتجارة والتوريدات"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>اسم المتجر (إنجليزي)</Label>
                                    <Input
                                        value={formData.store_name_en}
                                        onChange={(e) => handleChange("store_name_en", e.target.value)}
                                        placeholder="Dream Trade & Supplies"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>الشعار (Slogan)</Label>
                                <Input
                                    value={formData.store_slogan}
                                    onChange={(e) => handleChange("store_slogan", e.target.value)}
                                    placeholder="جودة... ثقة... خدمة"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>وصف المتجر</Label>
                                <Textarea
                                    value={formData.store_description}
                                    onChange={(e) => handleChange("store_description", e.target.value)}
                                    placeholder="وصف مختصر عن الشركة..."
                                    rows={3}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>لوجو المتجر</Label>
                                <div className="flex items-center gap-4">
                                    {formData.store_logo && (
                                        <img src={formData.store_logo} alt="Logo" className="h-16 w-16 object-contain border rounded-lg" />
                                    )}
                                    <div className="flex-1">
                                        <Input
                                            value={formData.store_logo}
                                            onChange={(e) => handleChange("store_logo", e.target.value)}
                                            placeholder="/logo.png"
                                        />
                                    </div>
                                    <div>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            id="logo-upload"
                                            onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])}
                                        />
                                        <Button type="button" variant="outline" asChild disabled={uploading}>
                                            <label htmlFor="logo-upload" className="cursor-pointer">
                                                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                            </label>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Info */}
                    <Card className="border-green-500/20">
                        <CardHeader className="bg-gradient-to-r from-green-500/10 to-green-600/5 border-b">
                            <CardTitle className="flex items-center gap-2">
                                <Phone className="h-5 w-5 text-green-500" />
                                بيانات التواصل
                            </CardTitle>
                            <CardDescription>الهواتف والبريد والعنوان</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-green-500" />
                                        الهاتف الأساسي
                                    </Label>
                                    <Input
                                        value={formData.store_phone}
                                        onChange={(e) => handleChange("store_phone", e.target.value)}
                                        placeholder="01289006310"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-gray-500" />
                                        الهاتف الاحتياطي
                                    </Label>
                                    <Input
                                        value={formData.store_phone_alt}
                                        onChange={(e) => handleChange("store_phone_alt", e.target.value)}
                                        placeholder="01xxxxxxxxx"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <MessageCircle className="h-4 w-4 text-green-600" />
                                        واتساب (بدون +)
                                    </Label>
                                    <Input
                                        value={formData.store_whatsapp}
                                        onChange={(e) => handleChange("store_whatsapp", e.target.value)}
                                        placeholder="201289006310"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>رسالة الواتساب التلقائية</Label>
                                <Input
                                    value={formData.whatsapp_message}
                                    onChange={(e) => handleChange("whatsapp_message", e.target.value)}
                                    placeholder="مرحباً، أريد الاستفسار..."
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-blue-500" />
                                        البريد الإلكتروني
                                    </Label>
                                    <Input
                                        type="email"
                                        value={formData.store_email}
                                        onChange={(e) => handleChange("store_email", e.target.value)}
                                        placeholder="info@example.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-red-500" />
                                        العنوان
                                    </Label>
                                    <Input
                                        value={formData.store_address}
                                        onChange={(e) => handleChange("store_address", e.target.value)}
                                        placeholder="القاهرة، مصر"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <Globe className="h-4 w-4 text-blue-500" />
                                    رابط خريطة Google Maps (Embed URL)
                                </Label>
                                <Textarea
                                    value={formData.store_map_embed}
                                    onChange={(e) => handleChange("store_map_embed", e.target.value)}
                                    placeholder="https://www.google.com/maps/embed?pb=..."
                                    rows={2}
                                />
                                <p className="text-xs text-muted-foreground">انسخ رابط التضمين من Google Maps → Share → Embed a map</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Working Hours */}
                    <Card className="border-orange-500/20">
                        <CardHeader className="bg-gradient-to-r from-orange-500/10 to-orange-600/5 border-b">
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-orange-500" />
                                مواعيد العمل
                            </CardTitle>
                            <CardDescription>أوقات العمل الرسمية</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>من الساعة</Label>
                                    <Input
                                        type="time"
                                        value={formData.working_hours_from}
                                        onChange={(e) => handleChange("working_hours_from", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>إلى الساعة</Label>
                                    <Input
                                        type="time"
                                        value={formData.working_hours_to}
                                        onChange={(e) => handleChange("working_hours_to", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>أيام العمل</Label>
                                    <Input
                                        value={formData.working_days}
                                        onChange={(e) => handleChange("working_days", e.target.value)}
                                        placeholder="السبت - الخميس"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </>
    );
};

export default StoreSettingsAdmin;
