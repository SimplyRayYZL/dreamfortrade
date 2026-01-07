import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, CreditCard, Truck, MapPin, Phone, User, Mail, CheckCircle, LogIn } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { getActiveShippingAreas, useSiteSettings } from "@/hooks/useSettings";
import { trackStartCheckout, trackCompletePurchase } from "@/lib/analytics";

interface CheckoutFormData {
    customerName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    notes: string;
    paymentMethod: string;
}

const Checkout = () => {
    const { items, totalPrice, clearCart } = useCart();
    const { user, isLoading: authLoading, profile } = useAuth();
    const { data: siteSettings } = useSiteSettings();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deliveryType, setDeliveryType] = useState<"pickup_from_branch" | "delivery_only" | "delivery_with_installation" | "free_delivery">("delivery_only");
    const shippingAreas = getActiveShippingAreas();
    const isPickup = deliveryType === "pickup_from_branch";
    const isFreeDelivery = deliveryType === "free_delivery";
    const [formData, setFormData] = useState<CheckoutFormData>({
        customerName: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        notes: "",
        paymentMethod: "cod", // Cash on Delivery
    });

    // Calculate shipping fee based on selected city (only for delivery options)
    const selectedArea = shippingAreas.find(area => area.name === formData.city);
    const shippingFee = selectedArea?.fee || 0;
    const installationFee = siteSettings?.installation_fee || 1000;
    const includeInstallation = deliveryType === "delivery_with_installation";
    // For pickup and free_delivery: no fees. For delivery: add shipping + optional installation
    const finalShippingFee = (isPickup || isFreeDelivery) ? 0 : shippingFee;
    const grandTotal = totalPrice + finalShippingFee + (includeInstallation ? installationFee : 0);

    // Pre-fill form with user data if logged in
    useEffect(() => {
        if (user && profile) {
            setFormData(prev => ({
                ...prev,
                customerName: profile.full_name || prev.customerName,
                phone: profile.phone || prev.phone,
                email: user.email || prev.email,
                address: profile.address || prev.address,
                city: profile.city || prev.city,
            }));
        }
    }, [user, profile]);

    // Track checkout start
    useEffect(() => {
        if (items.length > 0) {
            trackStartCheckout();
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (items.length === 0) {
            toast.error("السلة فارغة!");
            return;
        }

        // For pickup orders, only name and phone are required. For delivery, address is also required.
        if (!formData.customerName || !formData.phone) {
            toast.error("يرجى ملء جميع الحقول المطلوبة");
            return;
        }

        if (!isPickup && !formData.address) {
            toast.error("يرجى إدخال عنوان التوصيل");
            return;
        }

        setIsSubmitting(true);

        try {
            // Create order with user_id
            const { data: order, error: orderError } = await supabase
                .from("orders")
                .insert({
                    customer_name: formData.customerName,
                    phone: formData.phone,
                    shipping_address: `${formData.address}, ${formData.city}`,
                    total_amount: totalPrice,
                    notes: formData.notes || null,
                    status: "pending",
                    user_id: user?.id || null, // Link order to user
                })
                .select()
                .single();

            if (orderError) throw orderError;

            // Create order items
            const orderItems = items.map((item) => ({
                order_id: order.id,
                product_id: item.product.id,
                product_name: item.product.name,
                quantity: item.quantity,
                price_at_time: item.product.price || 0,
            }));

            const { error: itemsError } = await supabase
                .from("order_items")
                .insert(orderItems);

            if (itemsError) throw itemsError;

            // Decrease stock for each product
            for (const item of items) {
                const productId = item.product.id;
                const quantity = item.quantity;

                // Get current stock
                const { data: product } = await (supabase
                    .from("products") as any)
                    .select("stock")
                    .eq("id", productId)
                    .single();

                if (product && product.stock !== undefined) {
                    const newStock = Math.max(0, (product.stock || 0) - quantity);
                    await (supabase
                        .from("products") as any)
                        .update({ stock: newStock })
                        .eq("id", productId);
                }
            }

            // Send email notification to admin
            try {
                await supabase.functions.invoke('send-order-notification', {
                    body: {
                        orderId: order.id,
                        customerName: formData.customerName,
                        customerEmail: formData.email,
                        phone: formData.phone,
                        address: formData.address,
                        city: formData.city,
                        notes: formData.notes,
                        items: items.map(item => ({
                            name: item.product.name,
                            quantity: item.quantity,
                            price: (item.product.price || 0) * item.quantity
                        })),
                        total: totalPrice
                    }
                });
            } catch (emailError) {
                console.error("Error sending email notification:", emailError);
                // Don't block order completion if email fails
            }

            // Track purchase completion
            trackCompletePurchase(order.id, totalPrice);

            // Clear cart and navigate to success page
            clearCart();
            toast.success("تم تأكيد طلبك بنجاح!");
            navigate(`/order-success/${order.id}`);
        } catch (error) {
            console.error("Error creating order:", error);
            toast.error(`حدث خطأ أثناء إنشاء الطلب: ${(error as any).message || "خطأ غير معروف"}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Guest checkout is now allowed - no login required

    // Show empty cart message
    if (items.length === 0) {
        return (
            <>
                <Helmet>
                    <title>إتمام الشراء | تارجت لأعمال التكييف</title>
                </Helmet>
                <div className="min-h-screen flex flex-col">
                    <Navbar />
                    <main className="flex-grow py-8 bg-background">
                        <div className="container mx-auto px-4">
                            <div className="text-center py-16 card-dream">
                                <ShoppingBag className="h-24 w-24 text-muted-foreground/30 mx-auto mb-6" />
                                <h2 className="text-2xl font-bold text-foreground mb-4">السلة فارغة</h2>
                                <p className="text-muted-foreground mb-8">
                                    يرجى إضافة منتجات إلى السلة قبل إتمام الشراء
                                </p>
                                <Link to="/products">
                                    <Button className="btn-dream-primary">
                                        <ShoppingBag className="h-5 w-5" />
                                        تصفح المنتجات
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </main>
                    <Footer />
                </div>
            </>
        );
    }

    return (
        <>
            <Helmet>
                <title>إتمام الشراء | تارجت لأعمال التكييف</title>
                <meta name="description" content="إتمام عملية الشراء - ????? ?????? ???????" />
            </Helmet>

            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow py-8 bg-background">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center gap-4 mb-8">
                            <CreditCard className="h-8 w-8 text-secondary" />
                            <h1 className="text-3xl font-bold text-foreground">إتمام الشراء</h1>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Customer Information */}
                                <div className="lg:col-span-2 space-y-6">
                                    {/* Personal Info */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <User className="h-5 w-5" />
                                                معلومات العميل
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="customerName">الاسم الكامل *</Label>
                                                    <Input
                                                        id="customerName"
                                                        name="customerName"
                                                        value={formData.customerName}
                                                        onChange={handleInputChange}
                                                        placeholder="أدخل اسمك الكامل"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="phone">رقم الهاتف *</Label>
                                                    <Input
                                                        id="phone"
                                                        name="phone"
                                                        type="tel"
                                                        value={formData.phone}
                                                        onChange={handleInputChange}
                                                        placeholder="01xxxxxxxxx"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">البريد الإلكتروني (اختياري)</Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    placeholder="example@email.com"
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Delivery Type - FIRST */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Truck className="h-5 w-5" />
                                                نوع الخدمة
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <RadioGroup
                                                value={deliveryType}
                                                onValueChange={(value: "pickup_from_branch" | "delivery_only" | "delivery_with_installation" | "free_delivery") => setDeliveryType(value)}
                                                className="space-y-3"
                                            >
                                                {siteSettings?.pickup_enabled !== false && (
                                                    <div className="flex items-center space-x-3 space-x-reverse p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                                                        <RadioGroupItem value="pickup_from_branch" id="pickup_from_branch" />
                                                        <Label htmlFor="pickup_from_branch" className="flex items-center gap-3 cursor-pointer flex-1">
                                                            <MapPin className="h-5 w-5 text-secondary" />
                                                            <div>
                                                                <p className="font-semibold">استلام من الفرع</p>
                                                                <p className="text-sm text-muted-foreground">
                                                                    استلم طلبك من فرعنا بدون رسوم توصيل
                                                                </p>
                                                            </div>
                                                        </Label>
                                                    </div>
                                                )}
                                                {siteSettings?.delivery_only_enabled !== false && (
                                                    <div className="flex items-center space-x-3 space-x-reverse p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                                                        <RadioGroupItem value="delivery_only" id="delivery_only" />
                                                        <Label htmlFor="delivery_only" className="flex items-center gap-3 cursor-pointer flex-1">
                                                            <Truck className="h-5 w-5 text-secondary" />
                                                            <div>
                                                                <p className="font-semibold">توصيل فقط</p>
                                                                <p className="text-sm text-muted-foreground">
                                                                    استلم المنتج واركبه بنفسك
                                                                </p>
                                                            </div>
                                                        </Label>
                                                    </div>
                                                )}
                                                {siteSettings?.delivery_with_installation_enabled !== false && (
                                                    <div className="flex items-center space-x-3 space-x-reverse p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                                                        <RadioGroupItem value="delivery_with_installation" id="delivery_with_installation" />
                                                        <Label htmlFor="delivery_with_installation" className="flex items-center gap-3 cursor-pointer flex-1">
                                                            <div className="flex items-center gap-1">
                                                                <Truck className="h-5 w-5 text-secondary" />
                                                                <span className="text-secondary">+</span>
                                                                <CheckCircle className="h-5 w-5 text-secondary" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="font-semibold">توصيل + تركيب</p>
                                                                <p className="text-sm text-muted-foreground">
                                                                    توصيل وتركيب احترافي (+{installationFee.toLocaleString()} ج.م)
                                                                </p>
                                                            </div>
                                                        </Label>
                                                    </div>
                                                )}
                                                {siteSettings?.free_delivery_installation_enabled === true && (
                                                    <div className="flex items-center space-x-3 space-x-reverse p-4 border-2 border-purple-300 bg-purple-50 rounded-lg hover:bg-purple-100 cursor-pointer">
                                                        <RadioGroupItem value="free_delivery" id="free_delivery" />
                                                        <Label htmlFor="free_delivery" className="flex items-center gap-3 cursor-pointer flex-1">
                                                            <div className="flex items-center gap-1">
                                                                <Truck className="h-5 w-5 text-purple-600" />
                                                                <span className="text-purple-600">+</span>
                                                                <CheckCircle className="h-5 w-5 text-purple-600" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="font-semibold text-purple-700">🎁 توصيل + تركيب مجاني</p>
                                                                <p className="text-sm text-purple-600">
                                                                    عرض خاص - توصيل وتركيب بدون رسوم!
                                                                </p>
                                                            </div>
                                                        </Label>
                                                    </div>
                                                )}
                                            </RadioGroup>
                                        </CardContent>
                                    </Card>

                                    {/* Shipping Address - Only show for delivery options */}
                                    {!isPickup && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <MapPin className="h-5 w-5" />
                                                    عنوان التوصيل
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="city">المحافظة *</Label>
                                                        <Select
                                                            value={formData.city}
                                                            onValueChange={(value) => setFormData((prev) => ({ ...prev, city: value }))}
                                                        >
                                                            <SelectTrigger id="city">
                                                                <SelectValue placeholder="اختر المحافظة" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {shippingAreas.map((area) => (
                                                                    <SelectItem key={area.id} value={area.name}>
                                                                        {area.name} ({area.fee} ج.م)
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        {shippingAreas.length === 0 && (
                                                            <p className="text-sm text-destructive">لا توجد مناطق توصيل متاحة</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="address">العنوان التفصيلي *</Label>
                                                    <Textarea
                                                        id="address"
                                                        name="address"
                                                        value={formData.address}
                                                        onChange={handleInputChange}
                                                        placeholder="الشارع، رقم المبنى، الدور، الشقة..."
                                                        rows={3}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="notes">ملاحظات إضافية (اختياري)</Label>
                                                    <Textarea
                                                        id="notes"
                                                        name="notes"
                                                        value={formData.notes}
                                                        onChange={handleInputChange}
                                                        placeholder="أي تعليمات خاصة للتوصيل..."
                                                        rows={2}
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Payment Method */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <CreditCard className="h-5 w-5" />
                                                طريقة الدفع
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <RadioGroup
                                                value={formData.paymentMethod}
                                                onValueChange={(value) =>
                                                    setFormData((prev) => ({ ...prev, paymentMethod: value }))
                                                }
                                                className="space-y-3"
                                            >
                                                <div className="flex items-center space-x-3 space-x-reverse p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                                                    <RadioGroupItem value="cod" id="cod" />
                                                    <Label htmlFor="cod" className="flex items-center gap-3 cursor-pointer flex-1">
                                                        <Truck className="h-5 w-5 text-secondary" />
                                                        <div>
                                                            <p className="font-semibold">الدفع عند الاستلام</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                ادفع نقداً عند استلام طلبك
                                                            </p>
                                                        </div>
                                                    </Label>
                                                </div>
                                            </RadioGroup>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Order Summary */}
                                <div className="lg:col-span-1">
                                    <Card className="sticky top-24">
                                        <CardHeader>
                                            <CardTitle>ملخص الطلب</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {/* Products List */}
                                            <div className="space-y-3 max-h-60 overflow-y-auto">
                                                {items.map((item) => (
                                                    <div key={item.product.id} className="flex justify-between items-start text-sm">
                                                        <div className="flex-1">
                                                            <p className="font-medium line-clamp-2">{item.product.name}</p>
                                                            <p className="text-muted-foreground">
                                                                الكمية: {item.quantity}
                                                            </p>
                                                        </div>
                                                        <p className="font-semibold whitespace-nowrap mr-2">
                                                            {((item.product.price || 0) * item.quantity).toLocaleString()} ج.م
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="border-t pt-4 space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">المجموع الفرعي:</span>
                                                    <span>{totalPrice.toLocaleString()} ج.م</span>
                                                </div>
                                                {!isPickup && (
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">التوصيل ({formData.city || "اختر المحافظة"}):</span>
                                                        {formData.city ? (
                                                            <span>{finalShippingFee.toLocaleString()} ج.م</span>
                                                        ) : (
                                                            <span className="text-muted-foreground">--</span>
                                                        )}
                                                    </div>
                                                )}
                                                {isPickup && (
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">الاستلام:</span>
                                                        <span className="text-green-600">من الفرع</span>
                                                    </div>
                                                )}
                                                {includeInstallation && (
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">التركيب:</span>
                                                        <span className="text-green-600">{installationFee.toLocaleString()} ج.م</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between text-lg font-bold border-t pt-2">
                                                    <span>الإجمالي:</span>
                                                    <span className="text-secondary">{grandTotal.toLocaleString()} ج.م</span>
                                                </div>
                                            </div>

                                            <Button
                                                type="submit"
                                                className="w-full btn-dream-primary"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 animate-spin ml-2" />
                                                        جاري تأكيد الطلب...
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle className="h-4 w-4 ml-2" />
                                                        تأكيد الطلب
                                                    </>
                                                )}
                                            </Button>

                                            <p className="text-xs text-muted-foreground text-center">
                                                بالضغط على "تأكيد الطلب" فإنك توافق على شروط الخدمة
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </form>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
};

export default Checkout;

