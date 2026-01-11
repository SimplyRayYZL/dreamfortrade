import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
    Plus, Trash2, Image as ImageIcon, ArrowRight, Loader2, LinkIcon,
    ArrowUp, ArrowDown, Eye, EyeOff, Monitor, Smartphone, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface HeroBanner {
    id: string;
    image_url: string;
    mobile_image_url: string | null;
    link_url: string | null;
    display_order: number;
    is_active: boolean;
}

const HeroBannersAdmin = () => {
    const queryClient = useQueryClient();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        link_url: "/products",
    });
    const [desktopFile, setDesktopFile] = useState<File | null>(null);
    const [mobileFile, setMobileFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    // Fetch hero banners
    const { data: banners, isLoading } = useQuery({
        queryKey: ["admin-hero-banners"],
        queryFn: async () => {
            const { data } = await (supabase as any)
                .from("hero_banners")
                .select("*")
                .order("display_order");
            return (data || []) as HeroBanner[];
        },
    });

    // Stats
    const stats = {
        total: banners?.length || 0,
        active: banners?.filter(b => b.is_active).length || 0,
        withMobile: banners?.filter(b => b.mobile_image_url).length || 0
    };

    // Upload file
    const uploadFile = async (file: File, folder: string): Promise<string | null> => {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

            const { error } = await supabase.storage
                .from('banner-images')
                .upload(fileName, file, { upsert: true });

            if (error) throw error;

            const { data: urlData } = supabase.storage
                .from('banner-images')
                .getPublicUrl(fileName);

            return urlData.publicUrl;
        } catch (error) {
            console.error('Error uploading file:', error);
            return null;
        }
    };

    // Add banner mutation
    const addBannerMutation = useMutation({
        mutationFn: async (data: { image_url: string; mobile_image_url: string | null; link_url: string }) => {
            const maxOrder = banners?.reduce((max, b) => Math.max(max, b.display_order), 0) || 0;
            const { error } = await (supabase as any)
                .from("hero_banners")
                .insert({
                    image_url: data.image_url,
                    mobile_image_url: data.mobile_image_url,
                    link_url: data.link_url,
                    display_order: maxOrder + 1,
                    is_active: true,
                });
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-hero-banners"] });
            toast.success("تم إضافة البانر");
            resetForm();
            setIsAddDialogOpen(false);
        },
        onError: (error) => {
            toast.error("فشل إضافة البانر: " + error.message);
        },
    });

    // Toggle active mutation
    const toggleActiveMutation = useMutation({
        mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
            const { error } = await (supabase as any)
                .from("hero_banners")
                .update({ is_active })
                .eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-hero-banners"] });
        },
    });

    // Delete banner mutation
    const deleteBannerMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await (supabase as any).from("hero_banners").delete().eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-hero-banners"] });
            toast.success("تم حذف البانر");
        },
    });

    // Move banner
    const moveBanner = async (banner: HeroBanner, direction: 'up' | 'down') => {
        if (!banners) return;
        const currentIndex = banners.findIndex(b => b.id === banner.id);
        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

        if (targetIndex < 0 || targetIndex >= banners.length) return;

        const targetBanner = banners[targetIndex];
        await (supabase as any).from("hero_banners").update({ display_order: targetBanner.display_order }).eq("id", banner.id);
        await (supabase as any).from("hero_banners").update({ display_order: banner.display_order }).eq("id", targetBanner.id);
        queryClient.invalidateQueries({ queryKey: ["admin-hero-banners"] });
    };

    const resetForm = () => {
        setFormData({ link_url: "/products" });
        setDesktopFile(null);
        setMobileFile(null);
    };

    const handleSubmit = async () => {
        if (!desktopFile) {
            toast.error("يجب رفع صورة للديسكتوب");
            return;
        }

        setUploading(true);
        try {
            const desktopUrl = await uploadFile(desktopFile, "hero");
            if (!desktopUrl) {
                toast.error("فشل رفع صورة الديسكتوب");
                return;
            }

            let mobileUrl = null;
            if (mobileFile) {
                mobileUrl = await uploadFile(mobileFile, "hero-mobile");
            }

            addBannerMutation.mutate({
                image_url: desktopUrl,
                mobile_image_url: mobileUrl,
                link_url: formData.link_url || "/products",
            });
        } finally {
            setUploading(false);
        }
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
                <title>البانر الرئيسي - لوحة التحكم</title>
            </Helmet>

            <div className="min-h-screen bg-muted/30">
                {/* Header */}
                <div className="bg-card border-b sticky top-0 z-40">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Link to="/admin" className="p-2 rounded-lg hover:bg-muted transition-colors">
                                    <ArrowRight className="h-5 w-5" />
                                </Link>
                                <div>
                                    <h1 className="text-xl font-bold">البانر الرئيسي</h1>
                                    <p className="text-sm text-muted-foreground">بانرات الـ Hero Section في الصفحة الرئيسية</p>
                                </div>
                            </div>

                            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="gap-2 bg-secondary hover:bg-secondary/90">
                                        <Plus className="h-4 w-4" />
                                        إضافة بانر
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-lg">
                                    <DialogHeader>
                                        <DialogTitle>إضافة بانر جديد</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                        {/* Desktop Image */}
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2">
                                                <Monitor className="h-4 w-4" />
                                                صورة الديسكتوب (مطلوبة) *
                                            </Label>
                                            <p className="text-xs text-muted-foreground">المقاس المثالي: 1920×600 بكسل</p>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setDesktopFile(e.target.files?.[0] || null)}
                                            />
                                            {desktopFile && (
                                                <img
                                                    src={URL.createObjectURL(desktopFile)}
                                                    alt="Preview"
                                                    className="h-24 w-full object-cover rounded-lg border"
                                                />
                                            )}
                                        </div>

                                        {/* Mobile Image */}
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2">
                                                <Smartphone className="h-4 w-4" />
                                                صورة الموبايل (اختياري)
                                            </Label>
                                            <p className="text-xs text-muted-foreground">المقاس المثالي: 768×400 بكسل</p>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setMobileFile(e.target.files?.[0] || null)}
                                            />
                                            {mobileFile && (
                                                <img
                                                    src={URL.createObjectURL(mobileFile)}
                                                    alt="Preview"
                                                    className="h-24 w-full object-cover rounded-lg border"
                                                />
                                            )}
                                        </div>

                                        {/* Link URL */}
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2">
                                                <LinkIcon className="h-4 w-4" />
                                                الرابط عند الضغط
                                            </Label>
                                            <Input
                                                value={formData.link_url}
                                                onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                                                placeholder="/products"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline">إلغاء</Button>
                                        </DialogClose>
                                        <Button onClick={handleSubmit} disabled={uploading || addBannerMutation.isPending} className="bg-secondary hover:bg-secondary/90">
                                            {(uploading || addBannerMutation.isPending) && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                            إضافة
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-6">
                    {/* Enhanced Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
                            <CardContent className="pt-4 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-blue-500 rounded-xl">
                                        <ImageIcon className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                                        <p className="text-xs text-muted-foreground">إجمالي البانرات</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
                            <CardContent className="pt-4 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-green-500 rounded-xl">
                                        <Eye className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                                        <p className="text-xs text-muted-foreground">مفعّلة</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
                            <CardContent className="pt-4 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-purple-500 rounded-xl">
                                        <Smartphone className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-purple-600">{stats.withMobile}</p>
                                        <p className="text-xs text-muted-foreground">بصورة موبايل</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Info */}
                    <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl p-4 mb-6 flex gap-3">
                        <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                البانرات تظهر كـ Carousel في الصفحة الرئيسية. يمكنك إضافة أكثر من بانر وسيتم التبديل بينهم تلقائياً كل 5 ثواني.
                            </p>
                        </div>
                    </div>

                    {/* Banners List */}
                    <div className="space-y-4">
                        {banners?.map((banner, index) => (
                            <Card key={banner.id} className={`overflow-hidden transition-all ${!banner.is_active ? 'opacity-50' : ''}`}>
                                <div className="flex flex-col md:flex-row">
                                    {/* Image Preview */}
                                    <div className="w-full md:w-72 aspect-video md:aspect-auto md:h-36 flex-shrink-0 relative">
                                        <img
                                            src={banner.image_url}
                                            alt="Banner"
                                            className="w-full h-full object-cover"
                                        />
                                        <Badge className={`absolute top-2 right-2 ${banner.is_active ? 'bg-green-500' : 'bg-gray-500'}`}>
                                            {banner.is_active ? 'مفعّل' : 'موقف'}
                                        </Badge>
                                    </div>

                                    {/* Info & Actions */}
                                    <CardContent className="flex-1 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="text-center min-w-[50px]">
                                                <p className="text-3xl font-bold text-secondary">{index + 1}</p>
                                                <p className="text-xs text-muted-foreground">الترتيب</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm flex items-center gap-2">
                                                    <LinkIcon className="h-3 w-3" />
                                                    {banner.link_url || "/products"}
                                                </p>
                                                <div className="flex gap-2">
                                                    <Badge variant="outline" className="text-xs">
                                                        <Monitor className="h-3 w-3 mr-1" />
                                                        Desktop
                                                    </Badge>
                                                    {banner.mobile_image_url ? (
                                                        <Badge className="bg-green-500 text-xs">
                                                            <Smartphone className="h-3 w-3 mr-1" />
                                                            Mobile ✓
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="text-xs opacity-50">
                                                            <Smartphone className="h-3 w-3 mr-1" />
                                                            No Mobile
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {/* Move buttons */}
                                            <div className="flex flex-col gap-1">
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    className="h-8 w-8"
                                                    onClick={() => moveBanner(banner, 'up')}
                                                    disabled={index === 0}
                                                >
                                                    <ArrowUp className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    className="h-8 w-8"
                                                    onClick={() => moveBanner(banner, 'down')}
                                                    disabled={index === (banners?.length || 0) - 1}
                                                >
                                                    <ArrowDown className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            {/* Active toggle */}
                                            <Button
                                                variant={banner.is_active ? "default" : "outline"}
                                                size="sm"
                                                className={`gap-2 min-w-[90px] ${banner.is_active ? 'bg-green-600 hover:bg-green-700' : ''}`}
                                                onClick={() => toggleActiveMutation.mutate({ id: banner.id, is_active: !banner.is_active })}
                                            >
                                                {banner.is_active ? (
                                                    <>
                                                        <Eye className="h-4 w-4" />
                                                        مفعّل
                                                    </>
                                                ) : (
                                                    <>
                                                        <EyeOff className="h-4 w-4" />
                                                        موقف
                                                    </>
                                                )}
                                            </Button>

                                            {/* Delete */}
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button size="icon" variant="destructive">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>حذف البانر</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            هل أنت متأكد من حذف هذا البانر؟ لا يمكن التراجع عن هذا الإجراء.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => deleteBannerMutation.mutate(banner.id)}
                                                            className="bg-destructive hover:bg-destructive/90"
                                                        >
                                                            حذف
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </CardContent>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {banners?.length === 0 && (
                        <Card className="text-center py-12">
                            <CardContent>
                                <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <p className="text-muted-foreground mb-4">لا توجد بانرات. أضف بانر جديد للصفحة الرئيسية.</p>
                                <Button onClick={() => setIsAddDialogOpen(true)} className="bg-secondary hover:bg-secondary/90">
                                    <Plus className="h-4 w-4 mr-2" />
                                    إضافة بانر
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div >
        </>
    );
};

export default HeroBannersAdmin;
