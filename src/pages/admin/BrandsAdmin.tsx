import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
    Plus, Trash2, Edit, Save, X, Package,
    ArrowRight, Image as ImageIcon, ToggleLeft, ToggleRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    const [formData, setFormData] = useState({
        name: "",
        name_ar: "",
        logo_url: "",
    });

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
    };

    const handleSubmit = () => {
        if (!formData.name || !formData.name_ar) {
            toast.error("يرجى ملء جميع الحقول المطلوبة");
            return;
        }

        if (editingBrand) {
            updateBrandMutation.mutate({ id: editingBrand.id, ...formData });
        } else {
            addBrandMutation.mutate(formData);
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

    return (
        <>
            <Helmet>
                <title>إدارة الماركات | Dream For Trade</title>
            </Helmet>

            <div className="min-h-screen bg-background">
                {/* Header */}
                <div className="bg-primary text-primary-foreground py-6">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Link to="/admin/orders">
                                    <Button variant="ghost" size="icon" className="text-primary-foreground">
                                        <ArrowRight className="h-5 w-5" />
                                    </Button>
                                </Link>
                                <div>
                                    <h1 className="text-2xl font-bold">إدارة الماركات</h1>
                                    <p className="text-primary-foreground/70 text-sm">
                                        إضافة وتعديل وحذف الماركات
                                    </p>
                                </div>
                            </div>
                            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-secondary hover:bg-secondary/90 gap-2">
                                        <Plus className="h-4 w-4" />
                                        إضافة ماركة
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>إضافة ماركة جديدة</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
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
                                        <div className="space-y-2">
                                            <Label>رابط الشعار (اختياري)</Label>
                                            <Input
                                                value={formData.logo_url}
                                                onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                                                placeholder="https://example.com/logo.png"
                                                dir="ltr"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline">إلغاء</Button>
                                        </DialogClose>
                                        <Button
                                            onClick={handleSubmit}
                                            disabled={addBrandMutation.isPending}
                                            className="bg-secondary hover:bg-secondary/90"
                                        >
                                            {addBrandMutation.isPending ? "جاري الإضافة..." : "إضافة"}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="container mx-auto px-4 py-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                الماركات ({brands?.length || 0})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="flex justify-center py-8">
                                    <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : brands?.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    لا توجد ماركات بعد
                                </div>
                            ) : (
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
                                        {brands?.map((brand) => (
                                            <TableRow key={brand.id}>
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
                                                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
                                                        {brand.product_count} منتج
                                                    </span>
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
                                                            <>
                                                                <ToggleRight className="h-5 w-5 ml-1" />
                                                                مفعّل
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ToggleLeft className="h-5 w-5 ml-1" />
                                                                موقف
                                                            </>
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
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle>تعديل الماركة</DialogTitle>
                                                                </DialogHeader>
                                                                <div className="space-y-4 py-4">
                                                                    <div className="space-y-2">
                                                                        <Label>اسم الماركة (إنجليزي) *</Label>
                                                                        <Input
                                                                            value={formData.name}
                                                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                                            dir="ltr"
                                                                        />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <Label>اسم الماركة (عربي) *</Label>
                                                                        <Input
                                                                            value={formData.name_ar}
                                                                            onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                                                                        />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <Label>رابط الشعار</Label>
                                                                        <Input
                                                                            value={formData.logo_url}
                                                                            onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                                                                            dir="ltr"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <DialogFooter>
                                                                    <DialogClose asChild>
                                                                        <Button variant="outline">إلغاء</Button>
                                                                    </DialogClose>
                                                                    <Button
                                                                        onClick={handleSubmit}
                                                                        disabled={updateBrandMutation.isPending}
                                                                        className="bg-secondary hover:bg-secondary/90"
                                                                    >
                                                                        {updateBrandMutation.isPending ? "جاري الحفظ..." : "حفظ"}
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
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Links */}
                    <div className="mt-6 flex gap-4">
                        <Link to="/admin/orders">
                            <Button variant="outline">إدارة الطلبات</Button>
                        </Link>
                        <Link to="/admin/products">
                            <Button variant="outline">إدارة المنتجات</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BrandsAdmin;
