import { useState } from "react";
import { useAllProducts, useBrands, Product } from "@/hooks/useProducts";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Search,
  Upload,
  Package,
  RefreshCw,
  CheckSquare,
  Square,
  ToggleLeft,
  ToggleRight,
  Eye,
  ArrowLeft,
  LayoutList,
  LayoutGrid,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

interface ProductFormData {
  name: string;
  brand_id: string;
  price: string;
  old_price: string;
  capacity: string;
  type: string;
  model: string;
  description: string;
  features: string;
  is_active: boolean;
  stock: string;
}

const initialFormData: ProductFormData = {
  name: "",
  brand_id: "",
  price: "",
  old_price: "",
  capacity: "",
  type: "",
  model: "",
  description: "",
  features: "",
  is_active: true,
  stock: "10",
};

const ProductsAdmin = () => {
  const { data: products, isLoading, refetch } = useAllProducts();
  const { data: brands } = useBrands();
  const { canEdit, canDelete, role } = useAdminAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  const filteredProducts = products?.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesBrand =
      selectedBrand === "all" || product.brand_id === selectedBrand;
    return matchesSearch && matchesBrand;
  });

  const openAddDialog = () => {
    setEditingProduct(null);
    setFormData(initialFormData);
    setPreviewUrl("");
    setSelectedImage(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      brand_id: product.brand_id,
      price: product.price?.toString() || "",
      old_price: product.oldPrice?.toString() || "",
      capacity: product.capacity || "",
      type: product.type || "",
      model: product.model || "",
      description: product.description || "",
      features: product.features?.join("\n") || "",
      is_active: product.is_active,
      stock: product.stock?.toString() || "0",
    });
    setPreviewUrl(product.image_url || "");
    setSelectedImage(null);
    setIsDialogOpen(true);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (productId: string): Promise<string | null> => {
    if (!selectedImage) return null;

    setUploadingImage(true);
    try {
      const fileExt = selectedImage.name.split(".").pop();
      const fileName = `${productId}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, selectedImage, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("فشل في رفع الصورة");
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const featuresArray = formData.features
        .split("\n")
        .map((f) => f.trim())
        .filter((f) => f);

      const productData = {
        name: formData.name.trim(),
        brand_id: formData.brand_id || null,
        price: parseFloat(formData.price) || 0,
        old_price: formData.old_price ? parseFloat(formData.old_price) : null,
        capacity: formData.capacity.trim() || null,
        type: formData.type.trim() || null,
        model: formData.model.trim() || null,
        description: formData.description.trim() || null,
        features: featuresArray.length > 0 ? featuresArray : null,
        is_active: formData.is_active,
        stock: parseInt(formData.stock) || 0,
      };

      if (editingProduct) {
        // Update existing product
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id);

        if (error) throw error;

        // Upload image if selected
        if (selectedImage) {
          const imageUrl = await uploadImage(editingProduct.id);
          if (imageUrl) {
            await supabase
              .from("products")
              .update({ image_url: imageUrl })
              .eq("id", editingProduct.id);
          }
        }

        toast.success("تم تحديث المنتج بنجاح");
      } else {
        // Create new product
        const { data: newProduct, error } = await supabase
          .from("products")
          .insert(productData)
          .select()
          .single();

        if (error) throw error;

        // Upload image if selected
        if (selectedImage && newProduct) {
          const imageUrl = await uploadImage(newProduct.id);
          if (imageUrl) {
            await supabase
              .from("products")
              .update({ image_url: imageUrl })
              .eq("id", newProduct.id);
          }
        }

        toast.success("تم إضافة المنتج بنجاح");
      }

      setIsDialogOpen(false);
      refetch();
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("حدث خطأ أثناء حفظ المنتج");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;

    try {
      // First, delete any order_items referencing this product
      await supabase
        .from("order_items")
        .delete()
        .eq("product_id", productId);

      // Then delete the product
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (error) throw error;

      toast.success("تم حذف المنتج بنجاح");
      refetch();
    } catch (error: any) {
      console.error("Error deleting product:", error);
      if (error?.message?.includes("foreign key")) {
        toast.error("لا يمكن حذف المنتج - موجود في طلبات سابقة");
      } else {
        toast.error("فشل في حذف المنتج");
      }
    }
  };

  const toggleProductStatus = async (product: Product) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ is_active: !product.is_active })
        .eq("id", product.id);

      if (error) throw error;

      toast.success(
        product.is_active ? "تم إخفاء المنتج" : "تم تفعيل المنتج"
      );
      refetch();
    } catch (error) {
      console.error("Error toggling product status:", error);
      toast.error("حدث خطأ");
    }
  };

  // Bulk selection functions
  const toggleSelectProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleSelectAll = () => {
    if (!filteredProducts) return;
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((p) => p.id));
    }
  };

  const clearSelection = () => {
    setSelectedProducts([]);
  };

  const bulkDelete = async () => {
    if (selectedProducts.length === 0) return;
    if (!confirm(`هل أنت متأكد من حذف ${selectedProducts.length} منتج؟ (سيتم حذف بيانات الطلبات المرتبطة أيضاً)`)) return;

    setBulkActionLoading(true);
    try {
      // First, delete any order_items referencing these products
      await supabase
        .from("order_items")
        .delete()
        .in("product_id", selectedProducts);

      // Then delete the products
      const { error } = await supabase
        .from("products")
        .delete()
        .in("id", selectedProducts);

      if (error) throw error;

      toast.success(`تم حذف ${selectedProducts.length} منتج بنجاح`);
      setSelectedProducts([]);
      refetch();
    } catch (error: any) {
      console.error("Error bulk deleting:", error);
      if (error?.message?.includes("foreign key")) {
        toast.error("بعض المنتجات مرتبطة بطلبات - جرب حذفها واحدة واحدة");
      } else {
        toast.error("حدث خطأ أثناء الحذف");
      }
    } finally {
      setBulkActionLoading(false);
    }
  };

  const bulkActivate = async () => {
    if (selectedProducts.length === 0) return;
    setBulkActionLoading(true);
    try {
      const { error } = await supabase
        .from("products")
        .update({ is_active: true })
        .in("id", selectedProducts);

      if (error) throw error;

      toast.success(`تم تفعيل ${selectedProducts.length} منتج`);
      setSelectedProducts([]);
      refetch();
    } catch (error) {
      console.error("Error bulk activating:", error);
      toast.error("حدث خطأ");
    } finally {
      setBulkActionLoading(false);
    }
  };

  const bulkDeactivate = async () => {
    if (selectedProducts.length === 0) return;
    setBulkActionLoading(true);
    try {
      const { error } = await supabase
        .from("products")
        .update({ is_active: false })
        .in("id", selectedProducts);

      if (error) throw error;

      toast.success(`تم إخفاء ${selectedProducts.length} منتج`);
      setSelectedProducts([]);
      refetch();
    } catch (error) {
      console.error("Error bulk deactivating:", error);
      toast.error("حدث خطأ");
    } finally {
      setBulkActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30" dir="rtl">
      {/* Header */}
      <div className="bg-card border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link to="/admin" className="p-2 rounded-lg hover:bg-muted transition-colors">
                <ArrowLeft className="h-5 w-5" style={{ transform: 'scaleX(-1)' }} />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-foreground">إدارة المنتجات</h1>
                <p className="text-sm text-muted-foreground">
                  {products?.length || 0} منتج • {products?.filter((p) => p.is_active).length || 0} نشط
                </p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button onClick={() => refetch()} variant="outline" size="sm" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                تحديث
              </Button>
              {/* Show role badge */}
              {role === 'viewer' && (
                <Badge variant="secondary" className="h-9 px-3 flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  عرض فقط
                </Badge>
              )}
              {/* Only show Add Product button for admin */}
              {canEdit() && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={openAddDialog} className="gap-2">
                      <Plus className="w-4 h-4" />
                      إضافة منتج
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                      {/* Image Upload */}
                      <div className="space-y-2">
                        <Label>صورة المنتج</Label>
                        <div className="flex items-center gap-4">
                          {previewUrl && (
                            <img
                              src={previewUrl}
                              alt="Preview"
                              className="w-24 h-24 object-contain rounded-lg border bg-muted"
                            />
                          )}
                          <div className="flex-1">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleImageSelect}
                              className="cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Name */}
                      <div className="space-y-2">
                        <Label htmlFor="name">اسم المنتج *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          required
                        />
                      </div>

                      {/* Brand */}
                      <div className="space-y-2">
                        <Label htmlFor="brand">العلامة التجارية</Label>
                        <Select
                          value={formData.brand_id}
                          onValueChange={(value) =>
                            setFormData({ ...formData, brand_id: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="اختر العلامة التجارية" />
                          </SelectTrigger>
                          <SelectContent>
                            {brands?.map((brand) => (
                              <SelectItem key={brand.id} value={brand.id}>
                                {brand.name_ar || brand.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Price */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="price">السعر (جنيه) *</Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) =>
                              setFormData({ ...formData, price: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="old_price">السعر القديم</Label>
                          <Input
                            id="old_price"
                            type="number"
                            step="0.01"
                            value={formData.old_price}
                            onChange={(e) =>
                              setFormData({ ...formData, old_price: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      {/* Capacity & Type */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="capacity">السعة (حصان)</Label>
                          <Input
                            id="capacity"
                            value={formData.capacity}
                            onChange={(e) =>
                              setFormData({ ...formData, capacity: e.target.value })
                            }
                            placeholder="مثال: 1.5 حصان"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="type">النوع</Label>
                          <Select
                            value={formData.type}
                            onValueChange={(value) =>
                              setFormData({ ...formData, type: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="اختر النوع" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="split">سبليت</SelectItem>
                              <SelectItem value="window">شباك</SelectItem>
                              <SelectItem value="portable">متنقل</SelectItem>
                              <SelectItem value="central">مركزي</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Model */}
                      <div className="space-y-2">
                        <Label htmlFor="model">الموديل</Label>
                        <Input
                          id="model"
                          value={formData.model}
                          onChange={(e) =>
                            setFormData({ ...formData, model: e.target.value })
                          }
                        />
                      </div>

                      {/* Stock */}
                      <div className="space-y-2">
                        <Label htmlFor="stock">المخزون المتاح</Label>
                        <Input
                          id="stock"
                          type="number"
                          min="0"
                          value={formData.stock}
                          onChange={(e) =>
                            setFormData({ ...formData, stock: e.target.value })
                          }
                          placeholder="0"
                        />
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <Label htmlFor="description">الوصف</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                          }
                          rows={3}
                        />
                      </div>

                      {/* Features */}
                      <div className="space-y-2">
                        <Label htmlFor="features">المميزات (سطر لكل ميزة)</Label>
                        <Textarea
                          id="features"
                          value={formData.features}
                          onChange={(e) =>
                            setFormData({ ...formData, features: e.target.value })
                          }
                          rows={4}
                          placeholder="تبريد سريع&#10;توفير الطاقة&#10;ضمان 5 سنوات"
                        />
                      </div>

                      {/* Active Status */}
                      <div className="flex items-center gap-3">
                        <Button
                          type="button"
                          variant={formData.is_active ? "default" : "outline"}
                          size="sm"
                          className={`min-w-[80px] ${formData.is_active ? 'bg-green-600 hover:bg-green-700' : ''}`}
                          onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                        >
                          {formData.is_active ? "نشط" : "مخفي"}
                        </Button>
                        <Label>المنتج نشط ومرئي</Label>
                      </div>

                      {/* Submit */}
                      <div className="flex gap-2 pt-4">
                        <Button
                          type="submit"
                          disabled={saving || uploadingImage}
                          className="flex-1"
                        >
                          {saving || uploadingImage ? (
                            <Loader2 className="w-4 h-4 animate-spin ml-2" />
                          ) : null}
                          {editingProduct ? "حفظ التغييرات" : "إضافة المنتج"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsDialogOpen(false)}
                        >
                          إلغاء
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-6">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="البحث عن منتج..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                  className="pr-10"
                />
              </div>
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="جميع العلامات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع العلامات</SelectItem>
                  {brands?.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.name_ar || brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-500 rounded-xl">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{products?.length || 0}</p>
                  <p className="text-xs text-muted-foreground">إجمالي المنتجات</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-green-500 rounded-xl">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {products?.filter((p) => p.is_active).length || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">منتجات نشطة</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-gray-500/10 to-gray-600/5 border-gray-500/20">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gray-500 rounded-xl">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-600">
                    {products?.filter((p) => !p.is_active).length || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">منتجات مخفية</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-500 rounded-xl">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">
                    {products?.filter((p) => p.stock === 0).length || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">نفد المخزون</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-500 rounded-xl">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">
                    {products?.filter((p) => p.oldPrice && p.oldPrice > p.price).length || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">عليها عروض</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-orange-500 rounded-xl">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">
                    {products?.filter((p) => !p.price || p.price === 0).length || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">بدون سعر</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Table/Cards */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <CardTitle>قائمة المنتجات</CardTitle>
              <div className="flex gap-1 bg-muted p-1 rounded-lg">
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className="gap-1 h-8"
                >
                  <LayoutList className="w-4 h-4" />
                  جدول
                </Button>
                <Button
                  variant={viewMode === "cards" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("cards")}
                  className="gap-1 h-8"
                >
                  <LayoutGrid className="w-4 h-4" />
                  كروت
                </Button>
              </div>
            </div>
            {/* Bulk Action Toolbar */}
            {selectedProducts.length > 0 && (
              <div className="flex items-center gap-2 bg-muted p-2 rounded-lg">
                <span className="text-sm font-medium px-2">
                  محدد: {selectedProducts.length} منتج
                </span>
                {/* Only show action buttons for admin */}
                {canEdit() && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={bulkActivate}
                      disabled={bulkActionLoading}
                      className="gap-1"
                    >
                      <ToggleRight className="w-4 h-4" />
                      تفعيل
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={bulkDeactivate}
                      disabled={bulkActionLoading}
                      className="gap-1"
                    >
                      <ToggleLeft className="w-4 h-4" />
                      إخفاء
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={bulkDelete}
                      disabled={bulkActionLoading}
                      className="gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      حذف
                    </Button>
                  </>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSelection}
                  disabled={bulkActionLoading}
                >
                  إلغاء
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {/* Table View */}
            {viewMode === "table" && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">
                        <Checkbox
                          checked={
                            filteredProducts &&
                            filteredProducts.length > 0 &&
                            selectedProducts.length === filteredProducts.length
                          }
                          onCheckedChange={toggleSelectAll}
                        />
                      </TableHead>
                      <TableHead className="w-20">الصورة</TableHead>
                      <TableHead>المنتج</TableHead>
                      <TableHead>العلامة</TableHead>
                      <TableHead>السعر</TableHead>
                      <TableHead>المخزون</TableHead>
                      <TableHead>السعة</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead className="w-32">إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts?.map((product) => (
                      <TableRow key={product.id} className={selectedProducts.includes(product.id) ? "bg-muted/50" : ""}>
                        <TableCell>
                          <Checkbox
                            checked={selectedProducts.includes(product.id)}
                            onCheckedChange={() => toggleSelectProduct(product.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[200px]">
                            <p className="font-medium line-clamp-2">{product.name}</p>
                            {product.model && (
                              <p className="text-xs text-muted-foreground">
                                {product.model}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{product.brand}</Badge>
                        </TableCell>
                        <TableCell>
                          {product.price && product.price > 0 ? (
                            <span className="font-semibold">
                              {product.price.toLocaleString("ar-EG")} ج.م
                            </span>
                          ) : (
                            <Badge variant="outline" className="text-orange-500">
                              بدون سعر
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={product.stock > 0 ? "secondary" : "destructive"}>
                            {product.stock > 0 ? product.stock : "نفد"}
                          </Badge>
                        </TableCell>
                        <TableCell>{product.capacity || "-"}</TableCell>
                        <TableCell>
                          {canEdit() ? (
                            <Button
                              variant={product.is_active ? "default" : "outline"}
                              size="sm"
                              className={`min-w-[65px] ${product.is_active ? 'bg-green-600 hover:bg-green-700' : ''}`}
                              onClick={() => toggleProductStatus(product)}
                            >
                              {product.is_active ? "نشط" : "مخفي"}
                            </Button>
                          ) : (
                            <Badge variant={product.is_active ? "secondary" : "outline"}>
                              {product.is_active ? "نشط" : "مخفي"}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {canEdit() ? (
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditDialog(product)}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDelete(product.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground">
                              <Eye className="w-3 h-3 mr-1" />
                              عرض
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Cards View */}
            {viewMode === "cards" && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredProducts?.map((product) => (
                  <div
                    key={product.id}
                    className={`relative border rounded-xl overflow-hidden bg-card hover:shadow-lg transition-shadow ${!product.is_active ? "opacity-60" : ""
                      }`}
                  >
                    {/* Product Image */}
                    <div className="aspect-square bg-muted relative">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                      {/* Status Badge */}
                      <div className="absolute top-2 right-2">
                        <Badge variant={product.is_active ? "default" : "secondary"} className={product.is_active ? "bg-green-600" : ""}>
                          {product.is_active ? "نشط" : "مخفي"}
                        </Badge>
                      </div>
                      {/* Stock Badge */}
                      {product.stock === 0 && (
                        <div className="absolute top-2 left-2">
                          <Badge variant="destructive">نفد</Badge>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-3 space-y-2">
                      <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
                      <p className="text-xs text-muted-foreground">{brands?.find(b => b.id === product.brand_id)?.name_ar || "-"}</p>

                      {/* Price */}
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary">{product.price?.toLocaleString() || 0} ج.م</span>
                        {product.oldPrice && product.oldPrice > product.price && (
                          <span className="text-xs text-muted-foreground line-through">
                            {product.oldPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      {canEdit() && (
                        <div className="flex gap-1 pt-2 border-t">
                          <Button variant="ghost" size="sm" className="flex-1" onClick={() => openEditDialog(product)}>
                            <Pencil className="w-3 h-3 mr-1" />
                            تعديل
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDelete(product.id)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredProducts?.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">لا توجد منتجات</h3>
                <p className="text-muted-foreground">
                  لم يتم العثور على منتجات تطابق معايير البحث
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductsAdmin;

