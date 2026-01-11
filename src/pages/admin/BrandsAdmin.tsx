import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
    Plus, Trash2, Edit, Package,
    ArrowRight, Image as ImageIcon, ToggleLeft, ToggleRight, Loader2, Search, Grid, List
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

interface Brand {
    id: string;
    name: string;
    name_ar: string;
    logo_url: string | null;
    is_active: boolean;
    created_at: string;
    product_count?: number;
}

const BrandsAdmin = () => {
    const queryClient = useQueryClient();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [formData, setFormData] = useState({
        name: "",
        name_ar: "",
        logo_url: "",
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    // Upload logo to Supabase Storage
    const uploadLogo = async (file: File, brandName: string): Promise<string | null> => {
        try {
            setUploading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `${brandName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.${fileExt}`;

            const { data, error } = await supabase.storage
                .from('brand-logos')
                .upload(fileName, file, { upsert: true });

            if (error) throw error;

            const { data: urlData } = supabase.storage
                .from('brand-logos')
                .getPublicUrl(fileName);

            return urlData.publicUrl;
        } catch (error) {
            console.error('Error uploading logo:', error);
            toast.error('فشل رفع الصورة');
            return null;
        } finally {
            setUploading(false);
        }
    };

    // Fetch brands with product count
    const { data: brands, isLoading } = useQuery({
        queryKey: ["admin-brands"],
        queryFn: async () => {
            const { data: brandsData, error } = await supabase
                .from("brands")
                .select("*")
                .order("name");

            if (error) throw error;

            // Get product count for each brand
            const brandsWithCount = await Promise.all(
                (brandsData || []).map(async (brand) => {
                    const { count } = await supabase
                        .from("products")
                        .select("*", { count: "exact", head: true })
                        .eq("brand_id", brand.id);
                    return { ...brand, product_count: count || 0 };
                })
            );

            return brandsWithCount as Brand[];
        },
    });

    // Filter brands
    const filteredBrands = brands?.filter(brand =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brand.name_ar.includes(searchTerm)
    );

    // Stats
    const stats = {
        total: brands?.length || 0,
        active: brands?.filter(b => b.is_active).length || 0,
        inactive: brands?.filter(b => !b.is_active).length || 0,
        totalProducts: brands?.reduce((acc, b) => acc + (b.product_count || 0), 0) || 0
    };

    // Add brand mutation
    const addBrandMutation = useMutation({
        mutationFn: async (data: { name: string; name_ar: string; logo_url: string }) => {
            const { error } = await supabase.from("brands").insert({
                name: data.name,
                name_ar: data.name_ar,
                logo_url: data.logo_url || null,
                is_active: true,
            });
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-brands"] });
            toast.success("تم إضافة الماركة بنجاح");
            setIsAddDialogOpen(false);
            resetForm();
        },
        onError: (error) => {
            toast.error("فشل إضافة الماركة: " + error.message);
        },
    });

    // Update brand mutation
    const updateBrandMutation = useMutation({
        mutationFn: async (data: { id: string; name: string; name_ar: string; logo_url: string }) => {
            const { error } = await supabase
                .from("brands")
                .update({
                    name: data.name,
                    name_ar: data.name_ar,
                    logo_url: data.logo_url || null,
                })
                .eq("id", data.id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-brands"] });
            toast.success("تم تحديث الماركة بنجاح");
            setEditingBrand(null);
            resetForm();
        },
        onError: (error) => {
            toast.error("فشل تحديث الماركة: " + error.message);
        },
    });

    // Toggle brand active status
    const toggleActiveMutation = useMutation({
        mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
            const { error } = await supabase
                .from("brands")
                .update({ is_active })
                .eq("id", id);
            if (error) throw error;

            // Also update products of this brand
            await supabase
                .from("products")
                .update({ is_active })
                .eq("brand_id", id);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["admin-brands"] });
            toast.success(variables.is_active ? "تم تفعيل الماركة" : "تم إيقاف الماركة ومنتجاتها");
        },
        onError: (error) => {
            toast.error("فشل تحديث الحالة: " + error.message);
        },
    });

    // Delete brand mutation
    const deleteBrandMutation = useMutation({
        mutationFn: async (id: string) => {
            // First delete related products
            await supabase.from("products").delete().eq("brand_id", id);
            // Then delete brand
            const { error } = await supabase.from("brands").delete().eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-brands"] });
            toast.success("تم حذف الماركة ومنتجاتها");
        },
        onError: (error) => {
            toast.error("فشل حذف الماركة: " + error.message);
        },
    });

    const resetForm = () => {
        setFormData({ name: "", name_ar: "", logo_url: "" });
        setSelectedFile(null);
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.name_ar) {
            toast.error("يرجى ملء جميع الحقول المطلوبة");
            return;
        }

        let logoUrl = formData.logo_url;

        // Upload file if selected
        if (selectedFile) {
            const uploadedUrl = await uploadLogo(selectedFile, formData.name);
            if (uploadedUrl) {
                logoUrl = uploadedUrl;
            }
        }

        if (editingBrand) {
            updateBrandMutation.mutate({ id: editingBrand.id, ...formData, logo_url: logoUrl });
        } else {
            addBrandMutation.mutate({ ...formData, logo_url: logoUrl });
        }
    };

    const startEditing = (brand: Brand) => {
        setEditingBrand(brand);
        setFormData({
            name: brand.name,
            name_ar: brand.name_ar,
            logo_url: brand.logo_url || "",
        });
    };

    const BrandForm = () => (
        <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>اسم الماركة (إنجليزي) *</Label>
                    <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Sharp"
                        dir="ltr"
                    />
                </div>
                <div className="space-y-2">
                    <Label>اسم الماركة (عربي) *</Label>
                    <Input
                        value={formData.name_ar}
                        onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                        placeholder="شارب"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label>شعار الماركة</Label>
                <div className="flex items-center gap-3">
                    {(formData.logo_url || selectedFile) && (
                        <div className="w-16 h-16 rounded-lg border bg-muted flex items-center justify-center overflow-hidden">
                            <img
                                src={selectedFile ? URL.createObjectURL(selectedFile) : formData.logo_url}
                                alt="Preview"
                                className="w-full h-full object-contain"
                            />
                        </div>
                    )}
                    <div className="flex-1">
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        />
                        <p className="text-xs text-muted-foreground mt-1">أو أدخل رابط الصورة مباشرة</p>
                    </div>
                </div>
                <Input
                    value={formData.logo_url}
                    onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                    placeholder="https://example.com/logo.png"
                    dir="ltr"
                    className="mt-2"
                />
            </div>
        </div>
    );

    return (
        <>
            <Helmet>
                <title>إدارة الماركات | دريم للتجارة والتوريدات</title>
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
                                    <h1 className="text-xl font-bold">إدارة الماركات</h1>
                                    <p className="text-sm text-muted-foreground">إضافة وتعديل وحذف الماركات</p>
                                </div>
                            </div>
                            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-secondary hover:bg-secondary/90 gap-2">
                                        <Plus className="h-4 w-4" />
                                        إضافة ماركة
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-lg">
                                    <DialogHeader>
                                        <DialogTitle>إضافة ماركة جديدة</DialogTitle>
                                    </DialogHeader>
                                    <BrandForm />
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline">إلغاء</Button>
                                        </DialogClose>
                                        <Button
                                            onClick={handleSubmit}
                                            disabled={addBrandMutation.isPending || uploading}
                                            className="bg-secondary hover:bg-secondary/90"
                                        >
                                            {uploading ? (
                                                <><Loader2 className="h-4 w-4 animate-spin ml-2" />جاري الرفع...</>
                                            ) : addBrandMutation.isPending ? "جاري الإضافة..." : "إضافة"}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="container mx-auto px-4 py-6">
                    {/* Enhanced Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
                            <CardContent className="pt-4 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-blue-500 rounded-xl">
                                        <Package className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                                        <p className="text-xs text-muted-foreground">إجمالي الماركات</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
                            <CardContent className="pt-4 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-green-500 rounded-xl">
                                        <ToggleRight className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                                        <p className="text-xs text-muted-foreground">ماركات مفعّلة</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-gray-500/10 to-gray-600/5 border-gray-500/20">
                            <CardContent className="pt-4 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-gray-500 rounded-xl">
                                        <ToggleLeft className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
                                        <p className="text-xs text-muted-foreground">ماركات موقفة</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
                            <CardContent className="pt-4 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-purple-500 rounded-xl">
                                        <Package className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-purple-600">{stats.totalProducts}</p>
                                        <p className="text-xs text-muted-foreground">إجمالي المنتجات</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters */}
                    <Card className="mb-6">
                        <CardContent className="pt-4">
                            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                                <div className="relative flex-1 w-full">
                                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="بحث عن ماركة..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pr-10"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                                        size="icon"
                                        onClick={() => setViewMode('grid')}
                                    >
                                        <Grid className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === 'table' ? 'default' : 'outline'}
                                        size="icon"
                                        onClick={() => setViewMode('table')}
                                    >
                                        <List className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Brands Display */}
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-secondary" />
                        </div>
                    ) : filteredBrands?.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>لا توجد ماركات</p>
                        </div>
                    ) : viewMode === 'grid' ? (
                        // Grid View
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {filteredBrands?.map((brand) => (
                                <Card key={brand.id} className={`group hover:shadow-lg transition-all ${!brand.is_active ? 'opacity-60' : ''}`}>
                                    <CardContent className="p-4">
                                        <div className="relative">
                                            {/* Logo */}
                                            <div className="aspect-square rounded-xl bg-muted flex items-center justify-center mb-3 overflow-hidden">
                                                {brand.logo_url ? (
                                                    <img
                                                        src={brand.logo_url}
                                                        alt={brand.name}
                                                        className="w-full h-full object-contain p-4"
                                                    />
                                                ) : (
                                                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                                                )}
                                            </div>
                                            {/* Status Badge */}
                                            <Badge
                                                className={`absolute top-2 right-2 text-[10px] ${brand.is_active ? 'bg-green-500' : 'bg-red-500'}`}
                                            >
                                                {brand.is_active ? 'مفعّل' : 'موقف'}
                                            </Badge>
                                        </div>

                                        {/* Info */}
                                        <h3 className="font-bold text-center">{brand.name_ar}</h3>
                                        <p className="text-sm text-muted-foreground text-center">{brand.name}</p>
                                        <p className="text-xs text-center mt-1">
                                            <Badge variant="outline">{brand.product_count} منتج</Badge>
                                        </p>

                                        {/* Actions */}
                                        <div className="flex gap-2 mt-4">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1"
                                                onClick={() => toggleActiveMutation.mutate({
                                                    id: brand.id,
                                                    is_active: !brand.is_active
                                                })}
                                            >
                                                {brand.is_active ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                                            </Button>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex-1"
                                                        onClick={() => startEditing(brand)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-lg">
                                                    <DialogHeader>
                                                        <DialogTitle>تعديل الماركة</DialogTitle>
                                                    </DialogHeader>
                                                    <BrandForm />
                                                    <DialogFooter>
                                                        <DialogClose asChild>
                                                            <Button variant="outline">إلغاء</Button>
                                                        </DialogClose>
                                                        <Button
                                                            onClick={handleSubmit}
                                                            disabled={updateBrandMutation.isPending || uploading}
                                                            className="bg-secondary hover:bg-secondary/90"
                                                        >
                                                            {uploading ? (
                                                                <><Loader2 className="h-4 w-4 animate-spin ml-2" />جاري الرفع...</>
                                                            ) : updateBrandMutation.isPending ? "جاري الحفظ..." : "حفظ"}
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="destructive" size="sm" className="flex-1">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>حذف الماركة</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            هل أنت متأكد من حذف ماركة "{brand.name_ar}"؟
                                                            <br />
                                                            <strong className="text-destructive">
                                                                سيتم حذف جميع المنتجات ({brand.product_count}) المرتبطة بها!
                                                            </strong>
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => deleteBrandMutation.mutate(brand.id)}
                                                            className="bg-destructive hover:bg-destructive/90"
                                                        >
                                                            حذف
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        // Table View
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    الماركات ({filteredBrands?.length || 0})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>الشعار</TableHead>
                                            <TableHead>الاسم (إنجليزي)</TableHead>
                                            <TableHead>الاسم (عربي)</TableHead>
                                            <TableHead>المنتجات</TableHead>
                                            <TableHead>الحالة</TableHead>
                                            <TableHead>الإجراءات</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredBrands?.map((brand) => (
                                            <TableRow key={brand.id} className={!brand.is_active ? 'opacity-60' : ''}>
                                                <TableCell>
                                                    {brand.logo_url ? (
                                                        <img
                                                            src={brand.logo_url}
                                                            alt={brand.name}
                                                            className="w-12 h-12 object-contain rounded"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                                                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="font-medium">{brand.name}</TableCell>
                                                <TableCell>{brand.name_ar}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{brand.product_count} منتج</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => toggleActiveMutation.mutate({
                                                            id: brand.id,
                                                            is_active: !brand.is_active
                                                        })}
                                                        className={brand.is_active ? "text-green-600" : "text-red-600"}
                                                    >
                                                        {brand.is_active ? (
                                                            <><ToggleRight className="h-5 w-5 ml-1" />مفعّل</>
                                                        ) : (
                                                            <><ToggleLeft className="h-5 w-5 ml-1" />موقف</>
                                                        )}
                                                    </Button>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    onClick={() => startEditing(brand)}
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="max-w-lg">
                                                                <DialogHeader>
                                                                    <DialogTitle>تعديل الماركة</DialogTitle>
                                                                </DialogHeader>
                                                                <BrandForm />
                                                                <DialogFooter>
                                                                    <DialogClose asChild>
                                                                        <Button variant="outline">إلغاء</Button>
                                                                    </DialogClose>
                                                                    <Button
                                                                        onClick={handleSubmit}
                                                                        disabled={updateBrandMutation.isPending || uploading}
                                                                        className="bg-secondary hover:bg-secondary/90"
                                                                    >
                                                                        {uploading ? "جاري الرفع..." : "حفظ"}
                                                                    </Button>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>

                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="destructive" size="icon">
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>حذف الماركة</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        هل أنت متأكد من حذف "{brand.name_ar}"؟
                                                                        <strong className="text-destructive block mt-2">
                                                                            سيتم حذف {brand.product_count} منتج!
                                                                        </strong>
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() => deleteBrandMutation.mutate(brand.id)}
                                                                        className="bg-destructive"
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
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
};

export default BrandsAdmin;
