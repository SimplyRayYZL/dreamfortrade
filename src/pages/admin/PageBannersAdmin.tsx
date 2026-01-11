import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
    ArrowRight, Loader2, Save, Image as ImageIcon,
    FileText, ShoppingBag, Info, Phone, Edit, X, Check,
    Percent, ShoppingCart, HelpCircle, Shield, FileCheck, Tag, Building2, Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PageBanner {
    id: string;
    page_name: string;
    title: string | null;
    subtitle: string | null;
    image_url: string | null;
    is_active: boolean;
}

const pageConfig: Record<string, { icon: React.ReactNode; color: string; description: string; pageName: string }> = {
    products: {
        icon: <ShoppingBag className="h-5 w-5" />,
        color: "from-blue-500 to-cyan-500",
        description: "صفحة عرض جميع المنتجات",
        pageName: "المنتجات"
    },
    about: {
        icon: <Info className="h-5 w-5" />,
        color: "from-green-500 to-emerald-500",
        description: "صفحة من نحن",
        pageName: "من نحن"
    },
    contact: {
        icon: <Phone className="h-5 w-5" />,
        color: "from-orange-500 to-amber-500",
        description: "صفحة تواصل معنا",
        pageName: "تواصل معنا"
    },
    blog: {
        icon: <FileText className="h-5 w-5" />,
        color: "from-purple-500 to-pink-500",
        description: "صفحة المدونة والمقالات",
        pageName: "المدونة"
    },
    cart: {
        icon: <ShoppingCart className="h-5 w-5" />,
        color: "from-yellow-500 to-orange-500",
        description: "صفحة سلة التسوق",
        pageName: "السلة"
    },
    checkout: {
        icon: <ShoppingCart className="h-5 w-5" />,
        color: "from-emerald-500 to-green-500",
        description: "صفحة إتمام الطلب",
        pageName: "إتمام الطلب"
    },
    wishlist: {
        icon: <Tag className="h-5 w-5" />,
        color: "from-pink-500 to-rose-500",
        description: "صفحة المفضلة",
        pageName: "المفضلة"
    },
    compare: {
        icon: <Tag className="h-5 w-5" />,
        color: "from-cyan-500 to-teal-500",
        description: "صفحة المقارنة",
        pageName: "مقارنة المنتجات"
    },
    login: {
        icon: <Info className="h-5 w-5" />,
        color: "from-blue-500 to-indigo-500",
        description: "صفحة تسجيل الدخول",
        pageName: "تسجيل الدخول"
    },
    register: {
        icon: <Info className="h-5 w-5" />,
        color: "from-violet-500 to-purple-500",
        description: "صفحة التسجيل",
        pageName: "إنشاء حساب"
    },
    my_orders: {
        icon: <ShoppingBag className="h-5 w-5" />,
        color: "from-indigo-500 to-violet-500",
        description: "صفحة طلباتي",
        pageName: "طلباتي"
    },
    track_order: {
        icon: <Search className="h-5 w-5" />,
        color: "from-amber-500 to-yellow-500",
        description: "صفحة تتبع الطلب",
        pageName: "تتبع الطلب"
    },
    cta_section: {
        icon: <Phone className="h-5 w-5" />,
        color: "from-primary to-secondary",
        description: "خلفية قسم 'جاهز تشتري تكييفك' في الصفحة الرئيسية",
        pageName: "قسم CTA"
    },
};

const PageBannersAdmin = () => {
    const queryClient = useQueryClient();
    const [editingPage, setEditingPage] = useState<string | null>(null);
    const [formData, setFormData] = useState<{
        title: string;
        subtitle: string;
        image_url: string;
    }>({ title: "", subtitle: "", image_url: "" });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    // Fetch all page banners
    const { data: banners, isLoading } = useQuery({
        queryKey: ["page-banners"],
        queryFn: async () => {
            const { data, error } = await (supabase as any)
                .from("page_banners")
                .select("*")
                .order("id");
            if (error) throw error;
            return data as PageBanner[];
        },
    });

    // Upload image
    const uploadImage = async (file: File): Promise<string | null> => {
        try {
            setUploading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `page-banners/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

            const { error } = await supabase.storage
                .from('banner-images')
                .upload(fileName, file, { upsert: true });

            if (error) throw error;

            const { data: urlData } = supabase.storage
                .from('banner-images')
                .getPublicUrl(fileName);

            return urlData.publicUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('فشل رفع الصورة');
            return null;
        } finally {
            setUploading(false);
        }
    };

    // Save mutation
    const saveMutation = useMutation({
        mutationFn: async ({ pageId, data }: { pageId: string; data: Partial<PageBanner> }) => {
            const { error } = await (supabase as any)
                .from("page_banners")
                .update({
                    title: data.title,
                    subtitle: data.subtitle,
                    image_url: data.image_url,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", pageId);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["page-banners"] });
            toast.success("تم حفظ التغييرات");
            setEditingPage(null);
            setSelectedFile(null);
        },
        onError: (error) => {
            toast.error("فشل الحفظ: " + error.message);
        },
    });

    const startEditing = (banner: PageBanner) => {
        setEditingPage(banner.id);
        setFormData({
            title: banner.title || "",
            subtitle: banner.subtitle || "",
            image_url: banner.image_url || "",
        });
        setSelectedFile(null);
    };

    const cancelEditing = () => {
        setEditingPage(null);
        setSelectedFile(null);
    };

    const handleSave = async (pageId: string) => {
        let imageUrl = formData.image_url;

        if (selectedFile) {
            const uploadedUrl = await uploadImage(selectedFile);
            if (uploadedUrl) {
                imageUrl = uploadedUrl;
            }
        }

        saveMutation.mutate({
            pageId,
            data: {
                title: formData.title,
                subtitle: formData.subtitle,
                image_url: imageUrl,
            },
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-secondary" />
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>بانرات الصفحات - لوحة التحكم</title>
            </Helmet>

            <div className="min-h-screen bg-muted/30">
                {/* Header */}
                <div className="bg-card border-b sticky top-0 z-40">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center gap-4">
                            <Link to="/admin" className="p-2 rounded-lg hover:bg-muted transition-colors">
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                            <div>
                                <h1 className="text-xl font-bold">بانرات الصفحات</h1>
                                <p className="text-sm text-muted-foreground">تعديل العنوان والصورة لكل صفحة داخلية</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-6">
                    {/* Info Banner */}
                    <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl p-4 mb-6 flex gap-3">
                        <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                هذه الصور والعناوين تظهر في أعلى كل صفحة داخلية. صورة البانر اختيارية - إذا لم تضف صورة، سيظهر تدرج لوني بدلاً منها.
                                <br />
                                المقاس المثالي للصور: <strong>1920×400 بكسل</strong>
                            </p>
                        </div>
                    </div>

                    {/* Page Banners Grid */}
                    <div className="grid gap-6 md:grid-cols-2">
                        {Object.entries(pageConfig).map(([pageKey, config]) => {
                            // Find matching DB banner or create empty one
                            const dbBanner = banners?.find(b => b.page_name === pageKey || b.id === pageKey);
                            const banner: PageBanner = dbBanner || {
                                id: pageKey,
                                page_name: pageKey,
                                title: null,
                                subtitle: null,
                                image_url: null,
                                is_active: true
                            };
                            const isEditing = editingPage === banner.id;

                            return (
                                <Card key={banner.id} className="overflow-hidden group hover:shadow-lg transition-all">
                                    {/* Banner Preview */}
                                    <div className="relative h-32 overflow-hidden">
                                        {banner.image_url && !isEditing ? (
                                            <img
                                                src={banner.image_url}
                                                alt={banner.title || ""}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className={`w-full h-full bg-gradient-to-r ${config.color}`} />
                                        )}
                                        <div className="absolute inset-0 bg-black/30" />
                                        <div className="absolute top-3 right-3">
                                            <Badge className={`bg-gradient-to-r ${config.color} text-white border-0`}>
                                                /{banner.id}
                                            </Badge>
                                        </div>
                                        {!isEditing && (
                                            <div className="absolute bottom-3 right-3 left-3 text-white">
                                                <h3 className="font-bold text-lg">{banner.title || "بدون عنوان"}</h3>
                                                <p className="text-sm text-white/80">{banner.subtitle || "بدون وصف"}</p>
                                            </div>
                                        )}
                                    </div>

                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 bg-gradient-to-r ${config.color} rounded-lg text-white`}>
                                                    {config.icon}
                                                </div>
                                                <div>
                                                    <CardTitle className="text-base">{banner.page_name}</CardTitle>
                                                    <CardDescription className="text-xs">{config.description}</CardDescription>
                                                </div>
                                            </div>
                                            {!isEditing && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => startEditing(banner)}
                                                    className="gap-1"
                                                >
                                                    <Edit className="h-3 w-3" />
                                                    تعديل
                                                </Button>
                                            )}
                                        </div>
                                    </CardHeader>

                                    <CardContent className="pt-2">
                                        {isEditing ? (
                                            // Edit Mode
                                            <div className="space-y-3">
                                                <div className="space-y-1">
                                                    <Label className="text-xs">عنوان الصفحة</Label>
                                                    <Input
                                                        value={formData.title}
                                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                        placeholder="عنوان الصفحة"
                                                        className="h-9"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-xs">الوصف الفرعي</Label>
                                                    <Input
                                                        value={formData.subtitle}
                                                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                                        placeholder="وصف قصير"
                                                        className="h-9"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-xs">صورة البانر</Label>
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                                        className="h-9"
                                                    />
                                                    {selectedFile && (
                                                        <div className="flex items-center gap-2 text-xs text-green-600">
                                                            <Check className="h-3 w-3" />
                                                            {selectedFile.name}
                                                        </div>
                                                    )}
                                                    <Input
                                                        value={formData.image_url}
                                                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                                        placeholder="أو أدخل رابط الصورة"
                                                        className="h-9 mt-1"
                                                    />
                                                </div>
                                                <div className="flex gap-2 pt-2">
                                                    <Button
                                                        onClick={() => handleSave(banner.id)}
                                                        disabled={uploading || saveMutation.isPending}
                                                        className="flex-1 gap-1 bg-secondary hover:bg-secondary/90"
                                                        size="sm"
                                                    >
                                                        {(uploading || saveMutation.isPending) ? (
                                                            <Loader2 className="h-3 w-3 animate-spin" />
                                                        ) : (
                                                            <Save className="h-3 w-3" />
                                                        )}
                                                        حفظ
                                                    </Button>
                                                    <Button variant="outline" onClick={cancelEditing} size="sm" className="gap-1">
                                                        <X className="h-3 w-3" />
                                                        إلغاء
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            // View Mode
                                            <div className="text-sm text-muted-foreground">
                                                {banner.image_url ? (
                                                    <span className="text-green-600">✓ صورة مخصصة</span>
                                                ) : (
                                                    <span>تدرج لوني افتراضي</span>
                                                )}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default PageBannersAdmin;
