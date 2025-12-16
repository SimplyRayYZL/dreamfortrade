import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
    Plus, Trash2, Edit, Save, X, Image as ImageIcon,
    ArrowRight, ToggleLeft, ToggleRight, Upload, Loader2, ArrowUp, ArrowDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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

interface Banner {
    id: string;
    brand: string;
    logo_url: string | null;
    image_url: string | null;
    title: string;
    subtitle: string | null;
    tagline: string | null;
    gradient: string;
    sort_order: number;
    is_active: boolean;
    created_at: string;
}

const gradientOptions = [
    { value: "from-blue-600 via-blue-700 to-blue-800", label: "أزرق" },
    { value: "from-cyan-500 via-cyan-600 to-teal-600", label: "سماوي" },
    { value: "from-red-600 via-red-700 to-rose-700", label: "أحمر" },
    { value: "from-green-600 via-green-700 to-emerald-700", label: "أخضر" },
    { value: "from-purple-600 via-purple-700 to-violet-700", label: "بنفسجي" },
    { value: "from-orange-500 via-orange-600 to-amber-600", label: "برتقالي" },
];

const BannersAdmin = () => {
    const queryClient = useQueryClient();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
    const [formData, setFormData] = useState({
        brand: "",
        title: "",
        subtitle: "",
        tagline: "",
        gradient: "from-blue-600 via-blue-700 to-blue-800",
        logo_url: "",
        image_url: "",
    });
    const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    // Upload file to Supabase Storage
    const uploadFile = async (file: File, folder: string): Promise<string | null> => {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

            const { data, error } = await supabase.storage
                .from('banner-images')
                .upload(fileName, file, { upsert: true });

            if (error) throw error;

            const { data: urlData } = supabase.storage
                .from('banner-images')
                .getPublicUrl(fileName);

            return urlData.publicUrl;
        } catch (error) {
            console.error('Error uploading file:', error);
            toast.error('فشل رفع الصورة');
            return null;
        }
    };

    // Fetch banners
    const { data: banners, isLoading } = useQuery({
        queryKey: ["admin-banners"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("banners")
                .select("*")
                .order("sort_order");

            if (error) throw error;
            return data as Banner[];
        },
    });

    // Add banner mutation
    const addBannerMutation = useMutation({
        mutationFn: async (data: Omit<Banner, 'id' | 'created_at' | 'is_active' | 'sort_order'>) => {
            const maxOrder = banners?.reduce((max, b) => Math.max(max, b.sort_order), 0) || 0;
            const { error } = await supabase.from("banners").insert({
                ...data,
                is_active: true,
                sort_order: maxOrder + 1,
            });
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
            toast.success("تم إضافة البانر بنجاح");
            setIsAddDialogOpen(false);
            resetForm();
        },
        onError: (error) => {
            toast.error("فشل إضافة البانر: " + error.message);
        },
    });

    // Update banner mutation
    const updateBannerMutation = useMutation({
        mutationFn: async (data: { id: string } & Partial<Banner>) => {
            const { id, ...updateData } = data;
            const { error } = await supabase
                .from("banners")
                .update(updateData)
                .eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
            toast.success("تم تحديث البانر بنجاح");
            setEditingBanner(null);
            resetForm();
        },
        onError: (error) => {
            toast.error("فشل تحديث البانر: " + error.message);
        },
    });

    // Toggle active mutation
    const toggleActiveMutation = useMutation({
        mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
            const { error } = await supabase
                .from("banners")
                .update({ is_active })
                .eq("id", id);
            if (error) throw error;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
            toast.success(variables.is_active ? "تم تفعيل البانر" : "تم إيقاف البانر");
        },
        onError: (error) => {
            toast.error("فشل تحديث الحالة: " + error.message);
        },
    });

    // Delete banner mutation
    const deleteBannerMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from("banners").delete().eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
            toast.success("تم حذف البانر");
        },
        onError: (error) => {
            toast.error("فشل حذف البانر: " + error.message);
        },
    });

    // Move banner up/down
    const moveBanner = async (banner: Banner, direction: 'up' | 'down') => {
        if (!banners) return;
        const sortedBanners = [...banners].sort((a, b) => a.sort_order - b.sort_order);
        const currentIndex = sortedBanners.findIndex(b => b.id === banner.id);
        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

        if (targetIndex < 0 || targetIndex >= sortedBanners.length) return;

        const targetBanner = sortedBanners[targetIndex];

        await supabase.from("banners").update({ sort_order: targetBanner.sort_order }).eq("id", banner.id);
        await supabase.from("banners").update({ sort_order: banner.sort_order }).eq("id", targetBanner.id);

        queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
    };

    const resetForm = () => {
        setFormData({ brand: "", title: "", subtitle: "", tagline: "", gradient: "from-blue-600 via-blue-700 to-blue-800", logo_url: "", image_url: "" });
        setSelectedLogoFile(null);
        setSelectedImageFile(null);
    };

    const handleSubmit = async () => {
        if (!formData.brand || !formData.title) {
            toast.error("يجب إدخال اسم الماركة والعنوان");
            return;
        }

        setUploading(true);
        let logoUrl = formData.logo_url;
        let imageUrl = formData.image_url;

        // Upload logo if selected
        if (selectedLogoFile) {
            const url = await uploadFile(selectedLogoFile, 'logos');
            if (url) logoUrl = url;
        }

        // Upload image if selected
        if (selectedImageFile) {
            const url = await uploadFile(selectedImageFile, 'backgrounds');
            if (url) imageUrl = url;
        }

        setUploading(false);

        const bannerData = {
            brand: formData.brand,
            title: formData.title,
            subtitle: formData.subtitle || null,
            tagline: formData.tagline || null,
            gradient: formData.gradient,
            logo_url: logoUrl || null,
            image_url: imageUrl || null,
        };

        if (editingBanner) {
            updateBannerMutation.mutate({ id: editingBanner.id, ...bannerData });
        } else {
            addBannerMutation.mutate(bannerData as any);
        }
    };

    const startEditing = (banner: Banner) => {
        setEditingBanner(banner);
        setFormData({
            brand: banner.brand,
            title: banner.title,
            subtitle: banner.subtitle || "",
            tagline: banner.tagline || "",
            gradient: banner.gradient,
            logo_url: banner.logo_url || "",
            image_url: banner.image_url || "",
        });
    };

    const BannerForm = () => (
        <div className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>اسم الماركة *</Label>
                    <Input
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        placeholder="مثال: Carrier"
                    />
                </div>
                <div className="space-y-2">
                    <Label>الشعار (Tagline)</Label>
                    <Input
                        value={formData.tagline}
                        onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                        placeholder="مثال: وكيل معتمد"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label>العنوان الرئيسي *</Label>
                <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="مثال: راحة لا مثيل لها"
                />
            </div>

            <div className="space-y-2">
                <Label>العنوان الفرعي</Label>
                <Textarea
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="مثال: تكييفات كاريير الأمريكية - الاختيار الأمثل"
                    rows={2}
                />
            </div>

            <div className="space-y-2">
                <Label>لون الخلفية</Label>
                <select
                    value={formData.gradient}
                    onChange={(e) => setFormData({ ...formData, gradient: e.target.value })}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                >
                    {gradientOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>لوجو الماركة</Label>
                    <div className="flex gap-2">
                        <Input
                            value={formData.logo_url}
                            onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                            placeholder="رابط الصورة أو ارفع ملف"
                            className="flex-1"
                        />
                    </div>
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSelectedLogoFile(e.target.files?.[0] || null)}
                        className="text-sm"
                    />
                    {(formData.logo_url || selectedLogoFile) && (
                        <div className="mt-2 bg-gray-100 p-2 rounded flex items-center justify-center">
                            <img
                                src={selectedLogoFile ? URL.createObjectURL(selectedLogoFile) : formData.logo_url}
                                alt="Logo preview"
                                className="max-h-12 object-contain"
                            />
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>صورة الخلفية</Label>
                    <div className="flex gap-2">
                        <Input
                            value={formData.image_url}
                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                            placeholder="رابط الصورة أو ارفع ملف"
                            className="flex-1"
                        />
                    </div>
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSelectedImageFile(e.target.files?.[0] || null)}
                        className="text-sm"
                    />
                    {(formData.image_url || selectedImageFile) && (
                        <div className="mt-2 bg-gray-100 p-2 rounded">
                            <img
                                src={selectedImageFile ? URL.createObjectURL(selectedImageFile) : formData.image_url}
                                alt="Background preview"
                                className="max-h-20 w-full object-cover rounded"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Helmet>
                <title>إدارة البنرات - لوحة التحكم</title>
            </Helmet>

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/admin" className="text-muted-foreground hover:text-foreground">
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">إدارة البنرات</h1>
                            <p className="text-muted-foreground">إدارة بنرات الماركات على الصفحة الرئيسية</p>
                        </div>
                    </div>

                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2" onClick={resetForm}>
                                <Plus className="h-4 w-4" />
                                إضافة بانر
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>إضافة بانر جديد</DialogTitle>
                            </DialogHeader>
                            <BannerForm />
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">إلغاء</Button>
                                </DialogClose>
                                <Button onClick={handleSubmit} disabled={uploading || addBannerMutation.isPending}>
                                    {(uploading || addBannerMutation.isPending) && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
                                    إضافة
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Banners List */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ImageIcon className="h-5 w-5" />
                            البنرات ({banners?.length || 0})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : !banners?.length ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>لا توجد بنرات. قم بإضافة بانر جديد.</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-16">الترتيب</TableHead>
                                        <TableHead>الماركة</TableHead>
                                        <TableHead>العنوان</TableHead>
                                        <TableHead>اللوجو</TableHead>
                                        <TableHead>الحالة</TableHead>
                                        <TableHead className="text-left">إجراءات</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {banners.sort((a, b) => a.sort_order - b.sort_order).map((banner, index) => (
                                        <TableRow key={banner.id}>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6"
                                                        onClick={() => moveBanner(banner, 'up')}
                                                        disabled={index === 0}
                                                    >
                                                        <ArrowUp className="h-3 w-3" />
                                                    </Button>
                                                    <span className="text-center text-sm">{banner.sort_order}</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6"
                                                        onClick={() => moveBanner(banner, 'down')}
                                                        disabled={index === banners.length - 1}
                                                    >
                                                        <ArrowDown className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium">{banner.brand}</TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{banner.title}</p>
                                                    <p className="text-sm text-muted-foreground truncate max-w-[200px]">{banner.subtitle}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {banner.logo_url ? (
                                                    <img src={banner.logo_url} alt={banner.brand} className="h-8 object-contain" />
                                                ) : (
                                                    <span className="text-muted-foreground text-sm">لا يوجد</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => toggleActiveMutation.mutate({ id: banner.id, is_active: !banner.is_active })}
                                                >
                                                    {banner.is_active ? (
                                                        <ToggleRight className="h-6 w-6 text-green-500" />
                                                    ) : (
                                                        <ToggleLeft className="h-6 w-6 text-gray-400" />
                                                    )}
                                                </Button>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Dialog open={editingBanner?.id === banner.id} onOpenChange={(open) => !open && setEditingBanner(null)}>
                                                        <DialogTrigger asChild>
                                                            <Button variant="ghost" size="icon" onClick={() => startEditing(banner)}>
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="max-w-2xl">
                                                            <DialogHeader>
                                                                <DialogTitle>تعديل بانر: {banner.brand}</DialogTitle>
                                                            </DialogHeader>
                                                            <BannerForm />
                                                            <DialogFooter>
                                                                <DialogClose asChild>
                                                                    <Button variant="outline">إلغاء</Button>
                                                                </DialogClose>
                                                                <Button onClick={handleSubmit} disabled={uploading || updateBannerMutation.isPending}>
                                                                    {(uploading || updateBannerMutation.isPending) && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
                                                                    حفظ التغييرات
                                                                </Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>

                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>حذف البانر</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    هل أنت متأكد من حذف بانر "{banner.brand}"؟ لا يمكن التراجع عن هذا الإجراء.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => deleteBannerMutation.mutate(banner.id)}
                                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                >
                                                                    حذف
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default BannersAdmin;
