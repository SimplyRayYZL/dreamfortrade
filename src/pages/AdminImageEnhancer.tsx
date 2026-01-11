import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle, Wand2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface EnhanceResult {
  id: string;
  name?: string;
  status: string;
  error?: string;
  newUrl?: string;
}

const AdminImageEnhancer = () => {
  const { data: products, isLoading, refetch } = useProducts();
  const [enhancing, setEnhancing] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<Record<string, EnhanceResult>>({});
  const [processingAll, setProcessingAll] = useState(false);

  const externalProducts = products?.filter(
    (p) => p.image_url && !p.image_url.includes("supabase")
  ) || [];

  const enhanceProduct = async (productId: string) => {
    setEnhancing((prev) => ({ ...prev, [productId]: true }));
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/enhance-product-images`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ productId }),
        }
      );

      const data = await response.json();
      
      if (data.results?.[0]) {
        setResults((prev) => ({ ...prev, [productId]: data.results[0] }));
        
        if (data.results[0].status === "success") {
          toast.success(`تم تحسين صورة المنتج بنجاح`);
        } else {
          toast.error(`فشل تحسين الصورة: ${data.results[0].error || data.results[0].status}`);
        }
      }
    } catch (error) {
      console.error("Error enhancing product:", error);
      setResults((prev) => ({
        ...prev,
        [productId]: { id: productId, status: "error", error: "Network error" },
      }));
      toast.error("حدث خطأ في الاتصال");
    } finally {
      setEnhancing((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const enhanceAllSequentially = async () => {
    setProcessingAll(true);
    
    for (const product of externalProducts) {
      if (!product.image_url) continue;
      await enhanceProduct(product.id);
      // Wait 3 seconds between requests to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
    
    setProcessingAll(false);
    refetch();
    toast.success("تم الانتهاء من تحسين جميع الصور");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4" dir="rtl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">تحسين صور المنتجات</h1>
        <p className="text-muted-foreground">
          استخدم AI لإزالة الخلفيات وتحسين جودة الصور
        </p>
      </div>

      <div className="flex gap-4 mb-8">
        <Button
          onClick={enhanceAllSequentially}
          disabled={processingAll || externalProducts.length === 0}
          className="gap-2"
        >
          {processingAll ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Wand2 className="w-4 h-4" />
          )}
          تحسين جميع الصور ({externalProducts.length})
        </Button>
        
        <Button variant="outline" onClick={() => refetch()} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          تحديث
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {externalProducts.map((product) => (
          <Card key={product.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm line-clamp-2">{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square mb-4 bg-muted rounded-lg overflow-hidden">
                <img
                  src={product.image_url || ""}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>
              
              <div className="flex items-center justify-between">
                {results[product.id] ? (
                  <Badge
                    variant={
                      results[product.id].status === "success"
                        ? "default"
                        : "destructive"
                    }
                    className="gap-1"
                  >
                    {results[product.id].status === "success" ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        تم التحسين
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" />
                        فشل
                      </>
                    )}
                  </Badge>
                ) : (
                  <Badge variant="secondary">غير محسّن</Badge>
                )}
                
                <Button
                  size="sm"
                  onClick={() => enhanceProduct(product.id)}
                  disabled={enhancing[product.id] || processingAll}
                >
                  {enhancing[product.id] ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Wand2 className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {externalProducts.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">جميع الصور محسّنة</h2>
          <p className="text-muted-foreground">
            لا توجد صور خارجية تحتاج للتحسين
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminImageEnhancer;

