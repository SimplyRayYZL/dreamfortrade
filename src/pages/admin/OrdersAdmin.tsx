import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Loader2,
    Search,
    RefreshCw,
    Package,
    ShoppingCart,
    Eye,
    Phone,
    MapPin,
    Clock,
    ArrowRight,
    DollarSign,
    XCircle,
    CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

interface OrderItem {
    id: string;
    product_id: string | null;
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

const statusOptions = [
    { value: "pending", label: "مؤكد", color: "bg-green-500" },
    { value: "processing", label: "مؤكد", color: "bg-green-500" },
    { value: "shipped", label: "مؤكد", color: "bg-green-500" },
    { value: "delivered", label: "مؤكد", color: "bg-green-500" },
    { value: "cancelled", label: "ملغي/مسترجع", color: "bg-red-500" },
];

const OrdersAdmin = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
    const [lastOrderCount, setLastOrderCount] = useState<number>(0);
    const { canEdit, role } = useAdminAuth();

    const { data: orders, isLoading, refetch } = useQuery({
        queryKey: ["admin-orders"],
        queryFn: async (): Promise<Order[]> => {
            const { data, error } = await supabase
                .from("orders")
                .select(`
          *,
          order_items (*)
        `)
                .order("created_at", { ascending: false });

            if (error) throw error;
            return data as Order[];
        },
        refetchInterval: 10000, // Auto-refresh every 10 seconds
    });

    // Real-time notification for new orders
    useEffect(() => {
        if (orders && orders.length > lastOrderCount && lastOrderCount > 0) {
            // New order detected!
            toast.success("🔔 طلب جديد!", {
                description: `تم استلام طلب جديد من ${orders[0].customer_name}`,
                duration: 10000,
            });

            // Play notification sound
            const audio = new Audio("https://cdn.pixabay.com/download/audio/2022/03/24/audio_805cb26d63.mp3?filename=notification-sound-7062.mp3");
            audio.volume = 0.5;
            audio.play().catch(() => { });
        }
        if (orders) {
            setLastOrderCount(orders.length);
        }
    }, [orders, lastOrderCount]);

    const filteredOrders = orders?.filter((order) => {
        const matchesSearch =
            order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.phone.includes(searchTerm) ||
            order.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
            statusFilter === "all" || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        setUpdatingStatus(orderId);
        try {
            // Get current order data
            const order = orders?.find(o => o.id === orderId);
            const oldStatus = order?.status;

            const { error } = await supabase
                .from("orders")
                .update({ status: newStatus as "pending" | "processing" | "shipped" | "delivered" | "cancelled", updated_at: new Date().toISOString() })
                .eq("id", orderId);

            if (error) throw error;

            // If status changed to "cancelled", restore stock for each item
            if (newStatus === "cancelled" && oldStatus !== "cancelled" && order?.order_items) {
                for (const item of order.order_items) {
                    if (item.product_id) {
                        // Get current stock
                        const { data: product } = await supabase
                            .from("products")
                            .select("*")
                            .eq("id", item.product_id)
                            .single();

                        if (product) {
                            const currentStock = (product as any).stock || 0;
                            const newStock = currentStock + item.quantity;
                            await supabase
                                .from("products")
                                .update({ stock: newStock } as any)
                                .eq("id", item.product_id);
                        }
                    }
                }
                toast.success("تم إلغاء الطلب وإعادة المخزون");
            } else {
                toast.success("تم تحديث حالة الطلب");
            }
            refetch();
        } catch (error) {
            console.error("Error updating order status:", error);
            toast.error("فشل في تحديث حالة الطلب");
        } finally {
            setUpdatingStatus(null);
        }
    };

    const openOrderDetails = (order: Order) => {
        setSelectedOrder(order);
        setIsDialogOpen(true);
    };

    const getStatusBadge = (status: string) => {
        const statusInfo = statusOptions.find((s) => s.value === status);
        return (
            <Badge className={`${statusInfo?.color || "bg-gray-500"} text-white`}>
                {statusInfo?.label || status}
            </Badge>
        );
    };

    const getOrderStats = () => {
        if (!orders) return { total: 0, cancelled: 0 };
        return {
            total: orders.length,
            cancelled: orders.filter((o) => o.status === "cancelled").length,
        };
    };

    const stats = getOrderStats();

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
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                            <div>
                                <h1 className="text-xl font-bold text-foreground">إدارة الطلبات</h1>
                                <p className="text-sm text-muted-foreground">عرض ومتابعة طلبات العملاء</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={() => refetch()} variant="outline" size="sm" className="gap-2">
                                <RefreshCw className="w-4 h-4" />
                                تحديث
                            </Button>
                            {role === 'viewer' && (
                                <Badge variant="secondary" className="h-9 px-3 flex items-center gap-1">
                                    <Eye className="w-4 h-4" />
                                    عرض فقط
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
                        <CardContent className="pt-4 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-blue-500 rounded-xl">
                                    <ShoppingCart className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                                    <p className="text-xs text-muted-foreground">إجمالي الطلبات</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
                        <CardContent className="pt-4 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-red-500 rounded-xl">
                                    <XCircle className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
                                    <p className="text-xs text-muted-foreground">الملغي/المرتجع</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="البحث عن طلب (اسم، هاتف، رقم الطلب)..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                                    className="pr-10"
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full md:w-48">
                                    <SelectValue placeholder="حالة الطلب" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">جميع الحالات</SelectItem>
                                    {statusOptions.map((status) => (
                                        <SelectItem key={status.value} value={status.value}>
                                            {status.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Orders Table */}
                <Card className="border-0 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-secondary/10 to-secondary/5 border-b">
                        <CardTitle className="flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5 text-secondary" />
                            قائمة الطلبات
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>رقم الطلب</TableHead>
                                        <TableHead>العميل</TableHead>
                                        <TableHead>المنتجات</TableHead>
                                        <TableHead>الهاتف</TableHead>
                                        <TableHead>الإجمالي</TableHead>
                                        <TableHead>الحالة</TableHead>
                                        <TableHead>التاريخ</TableHead>
                                        <TableHead>إجراءات</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredOrders?.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-mono">
                                                {order.id.slice(0, 8).toUpperCase()}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {order.customer_name}
                                            </TableCell>
                                            <TableCell>
                                                <div className="max-w-[200px]">
                                                    {order.order_items?.slice(0, 2).map((item, idx) => (
                                                        <div key={idx} className="text-sm">
                                                            <span className="line-clamp-1">{item.product_name}</span>
                                                            <span className="text-muted-foreground text-xs"> (×{item.quantity})</span>
                                                        </div>
                                                    ))}
                                                    {order.order_items?.length > 2 && (
                                                        <span className="text-xs text-muted-foreground">
                                                            +{order.order_items.length - 2} أخرى
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell dir="ltr">{order.phone}</TableCell>
                                            <TableCell className="font-semibold">
                                                {order.total_amount.toLocaleString()} ج.م
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {getStatusBadge(order.status)}
                                                </div>
                                            </TableCell>
                                            <TableCell dir="ltr">{order.phone}</TableCell>
                                            <TableCell className="font-semibold">
                                                {order.total_amount.toLocaleString()} ج.م
                                            </TableCell>
                                            <TableCell>
                                                {canEdit() && order.status !== "cancelled" ? (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => updateOrderStatus(order.id, "cancelled")}
                                                        disabled={updatingStatus === order.id}
                                                        className="text-xs border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 gap-1"
                                                    >
                                                        {updatingStatus === order.id ? (
                                                            <Loader2 className="w-3 h-3 animate-spin" />
                                                        ) : (
                                                            <>
                                                                <XCircle className="w-3 h-3" />
                                                                إلغاء
                                                            </>
                                                        )}
                                                    </Button>
                                                ) : order.status === "cancelled" ? (
                                                    <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                                                        <XCircle className="w-3 h-3 ml-1" />
                                                        ملغي
                                                    </Badge>
                                                ) : null}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {new Date(order.created_at).toLocaleDateString("ar-EG")}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => openOrderDetails(order)}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {filteredOrders?.length === 0 && (
                            <div className="text-center py-12">
                                <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">لا توجد طلبات</h3>
                                <p className="text-muted-foreground">
                                    لم يتم العثور على طلبات تطابق معايير البحث
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Order Details Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            تفاصيل الطلب #{selectedOrder?.id.slice(0, 8).toUpperCase()}
                        </DialogTitle>
                    </DialogHeader>
                    {selectedOrder && (
                        <div className="space-y-6 py-4">
                            {/* Customer Info */}
                            <div className="space-y-2">
                                <h4 className="font-semibold">معلومات العميل</h4>
                                <div className="bg-muted p-4 rounded-lg space-y-2">
                                    <p>
                                        <span className="text-muted-foreground">الاسم:</span>{" "}
                                        {selectedOrder.customer_name}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-muted-foreground" />
                                        <span dir="ltr">{selectedOrder.phone}</span>
                                    </p>
                                    <p className="flex items-start gap-2">
                                        <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                                        {selectedOrder.shipping_address}
                                    </p>
                                    {selectedOrder.notes && (
                                        <p>
                                            <span className="text-muted-foreground">ملاحظات:</span>{" "}
                                            {selectedOrder.notes}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="space-y-2">
                                <h4 className="font-semibold">المنتجات</h4>
                                <div className="bg-muted p-4 rounded-lg space-y-3">
                                    {selectedOrder.order_items?.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex justify-between items-center"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium">{item.product_name}</p>
                                                    {item.product_id && (
                                                        <Link
                                                            to={`/product/${item.product_id}`}
                                                            target="_blank"
                                                            className="text-primary hover:text-primary/80"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Link>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    الكمية: {item.quantity} × {item.price_at_time.toLocaleString()} ج.م
                                                </p>
                                            </div>
                                            <p className="font-semibold">
                                                {(item.quantity * item.price_at_time).toLocaleString()} ج.م
                                            </p>
                                        </div>
                                    ))}
                                    <div className="border-t pt-3 flex justify-between font-bold text-lg">
                                        <span>الإجمالي:</span>
                                        <span className="text-secondary">
                                            {selectedOrder.total_amount.toLocaleString()} ج.م
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Meta */}
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <p>
                                    تاريخ الطلب:{" "}
                                    {new Date(selectedOrder.created_at).toLocaleDateString("ar-EG", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                                <p>الحالة: {getStatusBadge(selectedOrder.status)}</p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default OrdersAdmin;

