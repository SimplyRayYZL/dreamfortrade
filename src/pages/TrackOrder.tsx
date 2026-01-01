import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Package, Truck, MapPin, Phone, Clock, CheckCircle, Search } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    updated_at: string;
    order_items: OrderItem[];
}

const statusSteps = [
    { key: "pending", label: "قيد الانتظار", icon: Clock },
    { key: "processing", label: "جاري التجهيز", icon: Package },
    { key: "shipped", label: "تم الشحن", icon: Truck },
    { key: "delivered", label: "تم التوصيل", icon: CheckCircle },
];

const statusColors: Record<string, string> = {
    pending: "bg-yellow-500",
    processing: "bg-blue-500",
    shipped: "bg-purple-500",
    delivered: "bg-green-500",
    cancelled: "bg-red-500",
};

const TrackOrder = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);
    const [searchId, setSearchId] = useState(orderId || "");

    const fetchOrder = async (id: string) => {
        if (!id) return;
        setLoading(true);

        try {
            const { data, error } = await supabase
                .from("orders")
                .select(`
          *,
          order_items (*)
        `)
                .eq("id", id)
                .single();

            if (error) throw error;
            setOrder(data as Order);
        } catch (error) {
            console.error("Error fetching order:", error);
            toast.error("لم يتم العثور على الطلب. تأكد من رقم الطلب.");
            setOrder(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (orderId) {
            fetchOrder(orderId);
        }
    }, [orderId]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchId.trim()) {
            navigate(`/track-order/${searchId.trim()}`);
            fetchOrder(searchId.trim());
        }
    };

    const getCurrentStepIndex = () => {
        if (!order) return -1;
        if (order.status === "cancelled") return -1;
        return statusSteps.findIndex((s) => s.key === order.status);
    };

    const currentStepIndex = getCurrentStepIndex();

    return (
        <>
            <Helmet>
                <title>تتبع الطلب | تارجت لأعمال التكييف</title>
                <meta name="description" content="تتبع حالة طلبك - ????? ?????? ???????" />
            </Helmet>

            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow py-8 bg-background">
                    <div className="container mx-auto px-4 max-w-3xl">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Truck className="h-8 w-8 text-primary" />
                            </div>
                            <h1 className="text-3xl font-bold text-foreground mb-2">تتبع طلبك</h1>
                            <p className="text-muted-foreground">
                                أدخل رقم الطلب لمتابعة حالته
                            </p>
                        </div>

                        {/* Search Form */}
                        <Card className="mb-8">
                            <CardContent className="pt-6">
                                <form onSubmit={handleSearch} className="flex gap-3">
                                    <Input
                                        placeholder="أدخل رقم الطلب..."
                                        value={searchId}
                                        onChange={(e) => setSearchId(e.target.value)}
                                        className="flex-1"
                                    />
                                    <Button type="submit" disabled={loading}>
                                        {loading ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <>
                                                <Search className="h-4 w-4 ml-2" />
                                                بحث
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Order Details */}
                        {order && (
                            <>
                                {/* Status Timeline */}
                                <Card className="mb-6">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle>حالة الطلب</CardTitle>
                                            {order.status === "cancelled" && (
                                                <Badge className="bg-red-500 text-white">ملغي</Badge>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {order.status === "cancelled" ? (
                                            <div className="text-center py-4 text-red-500">
                                                <p>تم إلغاء هذا الطلب</p>
                                            </div>
                                        ) : (
                                            <div className="relative">
                                                {/* Progress Line */}
                                                <div className="absolute top-6 left-0 right-0 h-1 bg-muted">
                                                    <div
                                                        className="h-full bg-primary transition-all duration-500"
                                                        style={{
                                                            width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%`,
                                                        }}
                                                    />
                                                </div>

                                                {/* Steps */}
                                                <div className="relative flex justify-between">
                                                    {statusSteps.map((step, index) => {
                                                        const Icon = step.icon;
                                                        const isCompleted = index <= currentStepIndex;
                                                        const isCurrent = index === currentStepIndex;

                                                        return (
                                                            <div
                                                                key={step.key}
                                                                className="flex flex-col items-center"
                                                            >
                                                                <div
                                                                    className={`
                                    w-12 h-12 rounded-full flex items-center justify-center z-10
                                    transition-all duration-300
                                    ${isCompleted ? "bg-primary text-white" : "bg-muted text-muted-foreground"}
                                    ${isCurrent ? "ring-4 ring-primary/30" : ""}
                                  `}
                                                                >
                                                                    <Icon className="h-5 w-5" />
                                                                </div>
                                                                <p
                                                                    className={`
                                    mt-2 text-xs sm:text-sm text-center
                                    ${isCompleted ? "text-foreground font-medium" : "text-muted-foreground"}
                                  `}
                                                                >
                                                                    {step.label}
                                                                </p>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Order Info */}
                                <div className="grid gap-6 md:grid-cols-2">
                                    {/* Delivery Info */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">معلومات التوصيل</CardTitle>
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
                                            <div className="pt-2 border-t text-sm text-muted-foreground">
                                                <p>
                                                    تاريخ الطلب:{" "}
                                                    {new Date(order.created_at).toLocaleDateString("ar-EG", {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Order Items */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">محتويات الطلب</CardTitle>
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
                                                <span className="text-secondary">
                                                    {order.total_amount.toLocaleString()} ج.م
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </>
                        )}

                        {/* No Order Found */}
                        {!loading && !order && orderId && (
                            <div className="text-center py-12">
                                <Package className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                                <h2 className="text-xl font-bold mb-2">لم يتم العثور على الطلب</h2>
                                <p className="text-muted-foreground mb-6">
                                    تأكد من رقم الطلب وحاول مرة أخرى
                                </p>
                                <Link to="/products">
                                    <Button variant="outline">تصفح المنتجات</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
};

export default TrackOrder;

