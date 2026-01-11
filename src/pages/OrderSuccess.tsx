import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { CheckCircle, Package, Truck, MapPin, Phone, ArrowLeft, Copy, Home } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface OrderItem {
    id: string;
    product_name: string;
    quantity: number;
    price_at_time: number;
}

interface Order {
    id: string;
    customer_name: string;
    phone: string;
    shipping_address: string;
    total_amount: number;
    status: string;
    notes: string | null;
    created_at: string;
    order_items: OrderItem[];
}

const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: "قيد الانتظار", color: "bg-yellow-500" },
    processing: { label: "جاري التجهيز", color: "bg-blue-500" },
    shipped: { label: "تم الشحن", color: "bg-purple-500" },
    delivered: { label: "تم التوصيل", color: "bg-green-500" },
    cancelled: { label: "ملغي", color: "bg-red-500" },
};

const OrderSuccess = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) return;

            try {
                const { data, error } = await supabase
                    .from("orders")
                    .select(`
            *,
            order_items (*)
          `)
                    .eq("id", orderId)
                    .single();

                if (error) throw error;
                setOrder(data as Order);
            } catch (error) {
                console.error("Error fetching order:", error);
                toast.error("لم يتم العثور على الطلب");
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    const copyOrderId = () => {
        if (orderId) {
            navigator.clipboard.writeText(orderId);
            toast.success("تم نسخ رقم الطلب");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!order) {
        return (
            <>
                <Helmet>
                    <title>الطلب غير موجود | دريم للتجارة والتوريدات</title>
                </Helmet>
                <div className="min-h-screen flex flex-col">
                    <Navbar />
                    <main className="flex-grow py-8 bg-background flex items-center justify-center">
                        <div className="text-center">
                            <Package className="h-24 w-24 text-muted-foreground/30 mx-auto mb-6" />
                            <h2 className="text-2xl font-bold mb-4">الطلب غير موجود</h2>
                            <Link to="/">
                                <Button>العودة للرئيسية</Button>
                            </Link>
                        </div>
                    </main>
                    <Footer />
                </div>
            </>
        );
    }

    const status = statusMap[order.status] || statusMap.pending;

    return (
        <>
            <Helmet>
                <title>تم تأكيد الطلب | دريم للتجارة والتوريدات</title>
            </Helmet>

            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow py-8 bg-background">
                    <div className="container mx-auto px-4 max-w-3xl">
                        {/* Success Header */}
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="h-12 w-12 text-green-600" />
                            </div>
                            <h1 className="text-3xl font-bold text-foreground mb-2">تم تأكيد طلبك بنجاح!</h1>
                            <p className="text-muted-foreground">
                                شكراً لك {order.customer_name}، سيتم التواصل معك قريباً
                            </p>
                        </div>



                        {/* Order Details */}
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Delivery Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Truck className="h-5 w-5" />
                                        معلومات التوصيل
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-start gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                                        <p>{order.shipping_address}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <p dir="ltr">{order.phone}</p>
                                    </div>
                                    {order.notes && (
                                        <div className="pt-2 border-t">
                                            <p className="text-sm text-muted-foreground">ملاحظات:</p>
                                            <p>{order.notes}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Order Summary */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Package className="h-5 w-5" />
                                        ملخص الطلب
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {order.order_items?.map((item) => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span className="flex-1 line-clamp-1">{item.product_name}</span>
                                            <span className="text-muted-foreground mx-2">×{item.quantity}</span>
                                            <span className="font-semibold whitespace-nowrap">
                                                {(item.price_at_time * item.quantity).toLocaleString()} ج.م
                                            </span>
                                        </div>
                                    ))}
                                    <div className="border-t pt-3 flex justify-between font-bold">
                                        <span>الإجمالي:</span>
                                        <span className="text-secondary">{order.total_amount.toLocaleString()} ج.م</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
                            <Link to="/my-orders">
                                <Button className="w-full sm:w-auto">
                                    <Package className="h-4 w-4 ml-2" />
                                    طلباتي
                                </Button>
                            </Link>
                            <Link to="/products">
                                <Button variant="outline" className="w-full sm:w-auto">
                                    <ArrowLeft className="h-4 w-4 ml-2" />
                                    متابعة التسوق
                                </Button>
                            </Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
};

export default OrderSuccess;

