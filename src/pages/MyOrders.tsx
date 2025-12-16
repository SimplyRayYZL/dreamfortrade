import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Package, Clock, CheckCircle, XCircle, MapPin, Phone, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface Order {
    id: string;
    customer_name: string;
    phone: string;
    shipping_address: string;
    status: string;
    total_amount: number;
    created_at: string;
    order_items: {
        id: string;
        product_id: string | null;
        product_name: string;
        quantity: number;
        price_at_time: number;
    }[];
}

const MyOrders = () => {
    const { user, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
    const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

    useEffect(() => {
        if (!authLoading) {
            setHasCheckedAuth(true);
        }
    }, [authLoading]);

    useEffect(() => {
        if (hasCheckedAuth && !user) {
            toast.error("يجب تسجيل الدخول لعرض طلباتك");
            navigate("/login", { replace: true });
        }
    }, [user, hasCheckedAuth, navigate]);

    const { data: orders, isLoading, refetch, error: queryError } = useQuery({
        queryKey: ["my-orders", user?.id],
        queryFn: async (): Promise<Order[]> => {
            if (!user) return [];

            const { data, error } = await (supabase
                .from("orders") as any)
                .select(`
                  *,
                  order_items (*)
                `)
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching orders:", error);
                throw error;
            }

            return (data || []) as Order[];
        },
        enabled: !!user && hasCheckedAuth,
        refetchInterval: 10000, // Refresh every 10 seconds
        refetchOnWindowFocus: true,
    });

    // Can cancel any order that isn't already cancelled
    const canCancelOrder = (status: string) => {
        return status !== "cancelled";
    };

    const handleCancelOrder = async (orderId: string, orderItems: Order["order_items"]) => {
        setCancellingOrderId(orderId);
        try {
            // Update order status to cancelled
            const { error } = await (supabase
                .from("orders") as any)
                .update({ status: "cancelled" })
                .eq("id", orderId)
                .eq("user_id", user?.id);

            if (error) throw error;

            // Restore stock for each item
            for (const item of orderItems) {
                if (item.product_id) {
                    const { data: product } = await (supabase
                        .from("products") as any)
                        .select("stock")
                        .eq("id", item.product_id)
                        .single();

                    if (product && product.stock !== undefined) {
                        const newStock = (product.stock || 0) + item.quantity;
                        await (supabase
                            .from("products") as any)
                            .update({ stock: newStock })
                            .eq("id", item.product_id);
                    }
                }
            }

            toast.success("تم إلغاء الطلب وإعادة المخزون");
            refetch();
        } catch (error) {
            console.error("Error cancelling order:", error);
            toast.error(`فشل في إلغاء الطلب: ${(error as any).message || "خطأ غير معروف"}`);
        } finally {
            setCancellingOrderId(null);
        }
    };

    const getStatusBadge = (status: string) => {
        // Only show badge for cancelled orders
        if (status === "cancelled") {
            return (
                <Badge className="bg-red-500 text-white gap-1">
                    <XCircle className="h-4 w-4" />
                    ملغي/مسترجع
                </Badge>
            );
        }

        // Don't show any badge for active orders
        return null;
    };

    if (authLoading || !hasCheckedAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    if (queryError) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-background py-8">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-2xl font-bold mb-4">حدث خطأ</h1>
                        <p className="text-muted-foreground mb-4">
                            {(queryError as any)?.message || "فشل في تحميل الطلبات"}
                        </p>
                        <Button onClick={() => refetch()}>إعادة المحاولة</Button>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Helmet>
                <title>طلباتي | ????? ?????? ???????</title>
                <meta name="description" content="عرض وإدارة طلباتك" />
            </Helmet>

            <Navbar />

            <main className="min-h-screen bg-background py-8">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                            <Package className="h-6 w-6 text-secondary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">طلباتي</h1>
                            <p className="text-muted-foreground">تابع جميع طلباتك وحالتها</p>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : orders && orders.length > 0 ? (
                        <div className="grid gap-6">
                            {orders.map((order) => (
                                <Card key={order.id} className="overflow-hidden">
                                    <CardHeader className="bg-muted/50 pb-3">
                                        <div className="flex items-center justify-between flex-wrap gap-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                                                    <Package className="h-5 w-5 text-secondary" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-lg">
                                                        طلب #{order.id.slice(0, 8).toUpperCase()}
                                                    </CardTitle>
                                                    <p className="text-sm text-muted-foreground">
                                                        {order.created_at
                                                            ? new Date(order.created_at).toLocaleDateString("ar-EG", {
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "numeric",
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })
                                                            : "تاريخ غير متاح"
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            {getStatusBadge(order.status)}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <div className="space-y-3">
                                            {/* Order Items */}
                                            <div className="space-y-2">
                                                {order.order_items?.slice(0, 3).map((item) => (
                                                    <div key={item.id} className="flex items-center justify-between text-sm">
                                                        <span className="text-foreground">{item.product_name}</span>
                                                        <span className="text-muted-foreground">
                                                            {item.quantity} × {(item.price_at_time || 0).toLocaleString()} ج.م
                                                        </span>
                                                    </div>
                                                ))}
                                                {order.order_items?.length > 3 && (
                                                    <p className="text-sm text-muted-foreground">
                                                        و {order.order_items.length - 3} منتجات أخرى...
                                                    </p>
                                                )}
                                            </div>

                                            {/* Delivery Info */}
                                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground border-t pt-3">
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-4 w-4" />
                                                    <span>{order.shipping_address}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Phone className="h-4 w-4" />
                                                    <span dir="ltr">{order.phone}</span>
                                                </div>
                                            </div>

                                            {/* Total */}
                                            <div className="flex justify-between items-center border-t pt-3">
                                                <span className="font-semibold">الإجمالي:</span>
                                                <span className="text-lg font-bold text-secondary">
                                                    {(order.total_amount || 0).toLocaleString()} ج.م
                                                </span>
                                            </div>

                                            {/* Cancel Button */}
                                            {canCancelOrder(order.status) && (
                                                <div className="pt-3 border-t">
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        className="w-full gap-2"
                                                        onClick={() => handleCancelOrder(order.id, order.order_items)}
                                                        disabled={cancellingOrderId === order.id}
                                                    >
                                                        {cancellingOrderId === order.id ? (
                                                            <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                        ) : (
                                                            <Ban className="h-4 w-4" />
                                                        )}
                                                        {cancellingOrderId === order.id ? "جاري الإلغاء..." : "إلغاء الطلب"}
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                <Package className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <h2 className="text-xl font-semibold mb-2">لا توجد طلبات</h2>
                            <p className="text-muted-foreground mb-6">
                                لم تقم بأي طلبات بعد
                            </p>
                            <Button onClick={() => navigate("/products")}>
                                تصفح المنتجات
                            </Button>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
};

export default MyOrders;

