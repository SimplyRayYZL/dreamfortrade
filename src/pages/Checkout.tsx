import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, CreditCard, Truck, MapPin, Phone, User, Mail, CheckCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<CheckoutFormData>({
        customerName: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        notes: "",
        paymentMethod: "cod", // Cash on Delivery
    });

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

        if (!formData.customerName || !formData.phone || !formData.address) {
            toast.error("يرجى ملء جميع الحقول المطلوبة");
            return;
        }

        setIsSubmitting(true);

        try {
            // Create order
            const { data: order, error: orderError } = await supabase
                .from("orders")
                .insert({
                    customer_name: formData.customerName,
                    phone: formData.phone,
                    shipping_address: `${formData.address}, ${formData.city}`,
                    total_amount: totalPrice,
                    notes: formData.notes || null,
                    status: "pending",
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

            // Build WhatsApp notification message for admin
            const adminWhatsAppMessage = encodeURIComponent(
                `🛒 *طلب جديد!*\n\n` +
                `📋 رقم الطلب: ${order.id.slice(0, 8).toUpperCase()}\n` +
                `👤 العميل: ${formData.customerName}\n` +
                `📞 الهاتف: ${formData.phone}\n` +
                `📍 العنوان: ${formData.address}, ${formData.city}\n` +
                `${formData.notes ? `📝 ملاحظات: ${formData.notes}\n` : ''}` +
                `\n📦 *المنتجات:*\n` +
                items.map((item) => `  • ${item.product.name} (×${item.quantity}) - ${((item.product.price || 0) * item.quantity).toLocaleString()} ج.م`).join('\n') +
                `\n\n💰 *الإجمالي: ${totalPrice.toLocaleString()} ج.م*\n` +
                `\n⏰ ${new Date().toLocaleString('ar-EG')}`
            );

            // Open WhatsApp to send notification to admin (in new window)
            window.open(`https://wa.me/201289006310?text=${adminWhatsAppMessage}`, '_blank');

            // Clear cart and navigate to success page
            clearCart();
            toast.success("تم تأكيد طلبك بنجاح!");
            navigate(`/order-success/${order.id}`);
        } catch (error) {
            console.error("Error creating order:", error);
            toast.error("حدث خطأ أثناء إنشاء الطلب. يرجى المحاولة مرة أخرى.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (items.length === 0) {
        return (
            <>
                <Helmet>
                    <title>إتمام الشراء | Dream For Trade</title>
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
                <title>إتمام الشراء | Dream For Trade</title>
                <meta name="description" content="إتمام عملية الشراء - Dream For Trade" />
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

                                    {/* Shipping Address */}
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
                                                    <Label htmlFor="city">المدينة *</Label>
                                                    <Input
                                                        id="city"
                                                        name="city"
                                                        value={formData.city}
                                                        onChange={handleInputChange}
                                                        placeholder="القاهرة"
                                                        required
                                                    />
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
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">التوصيل:</span>
                                                    <span className="text-green-600">مجاني</span>
                                                </div>
                                                <div className="flex justify-between text-lg font-bold border-t pt-2">
                                                    <span>الإجمالي:</span>
                                                    <span className="text-secondary">{totalPrice.toLocaleString()} ج.م</span>
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
