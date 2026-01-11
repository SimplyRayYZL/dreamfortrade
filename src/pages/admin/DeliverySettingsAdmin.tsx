import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
    ArrowRight, Loader2, Truck, Package, Wrench, Save, Info, Gift, Plus, Trash2, MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ShippingArea {
    id: string;
    name: string;
    fee: number;
    isActive: boolean;
}

interface DeliverySettings {
    delivery_only_enabled: boolean;
    delivery_installation_enabled: boolean;
    pickup_enabled: boolean;
    free_delivery_enabled: boolean;
    delivery_fee: number;
    installation_fee: number;
    free_shipping_threshold: number;
    delivery_message: string;
}

const DeliverySettingsAdmin = () => {
    const queryClient = useQueryClient();
    const [settings, setSettings] = useState<DeliverySettings>({
        delivery_only_enabled: true,
        delivery_installation_enabled: true,
        pickup_enabled: true,
        free_delivery_enabled: true,
        delivery_fee: 0,
        installation_fee: 0,
        free_shipping_threshold: 0,
        delivery_message: "التوصيل خلال 2-5 أيام عمل",
    });
    const [shippingAreas, setShippingAreas] = useState<ShippingArea[]>([
        { id: "1", name: "القاهرة", fee: 50, isActive: true },
        { id: "2", name: "الجيزة", fee: 50, isActive: true },
        { id: "3", name: "الإسكندرية", fee: 100, isActive: true },
    ]);
    const [hasChanges, setHasChanges] = useState(false);

    // Fetch all delivery settings
    const { data: dbSettings, isLoading } = useQuery({
        queryKey: ["delivery-settings"],
        queryFn: async () => {
            const keys = [
                'delivery_only_enabled', 'delivery_installation_enabled', 'pickup_enabled', 'free_delivery_enabled',
                'delivery_fee', 'installation_fee', 'free_shipping_threshold', 'delivery_message', 'shipping_areas'
            ];

            const { data } = await (supabase as any)
                .from("settings")
                .select("key, value")
                .in("key", keys);

            return data || [];
        },
    });

    // Update settings state when data loads
    useEffect(() => {
        if (dbSettings) {
            const newSettings = { ...settings };
            dbSettings.forEach((s: { key: string; value: string }) => {
                if (s.key.includes('enabled')) {
                    (newSettings as any)[s.key] = s.value === 'true';
                } else if (s.key.includes('fee')) {
                    (newSettings as any)[s.key] = parseInt(s.value) || 0;
                }
            });
            setSettings(newSettings);
        }
    }, [dbSettings]);

    // Save mutation
    const saveMutation = useMutation({
        mutationFn: async () => {
            const updates = Object.entries(settings).map(([key, value]) => ({
                key,
                value: String(value),
            }));

            for (const update of updates) {
                await (supabase as any)
                    .from("settings")
                    .upsert(update, { onConflict: 'key' });
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["delivery-settings"] });
            toast.success("تم حفظ الإعدادات");
            setHasChanges(false);
        },
        onError: () => {
            toast.error("فشل حفظ الإعدادات");
        },
    });

    const updateSetting = (key: keyof DeliverySettings, value: boolean | number) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        setHasChanges(true);
    };

    // Count enabled options
    const enabledCount = [
        settings.delivery_only_enabled,
        settings.delivery_installation_enabled,
        settings.pickup_enabled,
        settings.free_delivery_enabled
    ].filter(Boolean).length;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-secondary" />
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>إعدادات التوصيل - لوحة التحكم</title>
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
                                    <h1 className="text-xl font-bold">إعدادات التوصيل</h1>
                                    <p className="text-sm text-muted-foreground">تحكم في خيارات التوصيل والاستلام</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge variant="outline" className="hidden md:flex gap-1">
                                    {enabledCount} خيارات مفعّلة
                                </Badge>
                                <Button
                                    onClick={() => saveMutation.mutate()}
                                    disabled={!hasChanges || saveMutation.isPending}
                                    className="gap-2 bg-secondary hover:bg-secondary/90"
                                >
                                    {saveMutation.isPending ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Save className="h-4 w-4" />
                                    )}
                                    حفظ التغييرات
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="container mx-auto px-4 py-6">
                    {/* Info Banner */}
                    <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl p-4 mb-6 flex gap-3">
                        <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                هذه الخيارات تظهر للعميل في صفحة الـ Checkout. يمكنك تفعيل أو إيقاف أي خيار حسب الحاجة.
                            </p>
                        </div>
                    </div>

                    {/* Delivery Options Grid */}
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Delivery Only */}
                        <Card className={`transition-all ${settings.delivery_only_enabled ? 'border-blue-500/50 bg-blue-50/50 dark:bg-blue-950/20' : ''}`}>
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${settings.delivery_only_enabled ? 'bg-blue-500' : 'bg-muted'}`}>
                                            <Truck className={`h-6 w-6 ${settings.delivery_only_enabled ? 'text-white' : 'text-muted-foreground'}`} />
                                        </div>
                                        <div>
                                            <CardTitle className="text-base">توصيل فقط</CardTitle>
                                            <CardDescription>توصيل بدون تركيب</CardDescription>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={settings.delivery_only_enabled}
                                        onCheckedChange={(v) => updateSetting('delivery_only_enabled', v)}
                                    />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <Label className="text-sm">رسوم التوصيل (جنيه)</Label>
                                    <Input
                                        type="number"
                                        value={settings.delivery_fee}
                                        onChange={(e) => updateSetting('delivery_fee', parseInt(e.target.value) || 0)}
                                        className="h-10"
                                        disabled={!settings.delivery_only_enabled}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Delivery + Installation */}
                        <Card className={`transition-all ${settings.delivery_installation_enabled ? 'border-purple-500/50 bg-purple-50/50 dark:bg-purple-950/20' : ''}`}>
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${settings.delivery_installation_enabled ? 'bg-purple-500' : 'bg-muted'}`}>
                                            <Wrench className={`h-6 w-6 ${settings.delivery_installation_enabled ? 'text-white' : 'text-muted-foreground'}`} />
                                        </div>
                                        <div>
                                            <CardTitle className="text-base">توصيل + تركيب</CardTitle>
                                            <CardDescription>توصيل مع خدمة التركيب</CardDescription>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={settings.delivery_installation_enabled}
                                        onCheckedChange={(v) => updateSetting('delivery_installation_enabled', v)}
                                    />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <Label className="text-sm">رسوم التركيب (جنيه)</Label>
                                    <Input
                                        type="number"
                                        value={settings.installation_fee}
                                        onChange={(e) => updateSetting('installation_fee', parseInt(e.target.value) || 0)}
                                        className="h-10"
                                        disabled={!settings.delivery_installation_enabled}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        الإجمالي = رسوم التوصيل ({settings.delivery_fee}) + رسوم التركيب = {settings.delivery_fee + settings.installation_fee} جنيه
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pickup */}
                        <Card className={`transition-all ${settings.pickup_enabled ? 'border-orange-500/50 bg-orange-50/50 dark:bg-orange-950/20' : ''}`}>
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${settings.pickup_enabled ? 'bg-orange-500' : 'bg-muted'}`}>
                                            <Package className={`h-6 w-6 ${settings.pickup_enabled ? 'text-white' : 'text-muted-foreground'}`} />
                                        </div>
                                        <div>
                                            <CardTitle className="text-base">استلام من الفرع</CardTitle>
                                            <CardDescription>العميل يستلم من المكان</CardDescription>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={settings.pickup_enabled}
                                        onCheckedChange={(v) => updateSetting('pickup_enabled', v)}
                                    />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    بدون رسوم إضافية - العميل يستلم المنتج من مقر الشركة
                                </p>
                            </CardContent>
                        </Card>

                        {/* Free Delivery + Installation */}
                        <Card className={`transition-all ${settings.free_delivery_enabled ? 'border-green-500/50 bg-green-50/50 dark:bg-green-950/20' : ''}`}>
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${settings.free_delivery_enabled ? 'bg-green-500' : 'bg-muted'}`}>
                                            <Gift className={`h-6 w-6 ${settings.free_delivery_enabled ? 'text-white' : 'text-muted-foreground'}`} />
                                        </div>
                                        <div>
                                            <CardTitle className="text-base flex items-center gap-2">
                                                توصيل وتركيب مجاني
                                                <Badge className="bg-green-500 text-white text-[10px]">عرض</Badge>
                                            </CardTitle>
                                            <CardDescription>للعروض الخاصة</CardDescription>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={settings.free_delivery_enabled}
                                        onCheckedChange={(v) => updateSetting('free_delivery_enabled', v)}
                                    />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    توصيل وتركيب بدون أي رسوم إضافية - يظهر كـ "مجاني" للعميل
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Shipping Areas Section */}
                    <Card className="mt-6">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                                    <MapPin className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-base">مناطق التوصيل</CardTitle>
                                    <CardDescription>المحافظات ورسوم التوصيل لكل منطقة</CardDescription>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={() => {
                                    setShippingAreas([...shippingAreas, {
                                        id: Date.now().toString(),
                                        name: "",
                                        fee: 0,
                                        isActive: true
                                    }]);
                                    setHasChanges(true);
                                }}
                            >
                                <Plus className="h-4 w-4" />
                                إضافة منطقة
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {shippingAreas.map((area, index) => (
                                <div
                                    key={area.id}
                                    className={`flex items-center gap-3 p-3 border rounded-lg transition-all ${area.isActive ? 'bg-muted/30' : 'bg-muted/10 opacity-60'
                                        }`}
                                >
                                    <Button
                                        variant={area.isActive ? "default" : "outline"}
                                        size="sm"
                                        className={`min-w-[70px] ${area.isActive ? 'bg-green-600 hover:bg-green-700' : ''}`}
                                        onClick={() => {
                                            const updated = [...shippingAreas];
                                            updated[index].isActive = !updated[index].isActive;
                                            setShippingAreas(updated);
                                            setHasChanges(true);
                                        }}
                                    >
                                        {area.isActive ? 'مفعّل' : 'موقف'}
                                    </Button>
                                    <Input
                                        value={area.name}
                                        onChange={(e) => {
                                            const updated = [...shippingAreas];
                                            updated[index].name = e.target.value;
                                            setShippingAreas(updated);
                                            setHasChanges(true);
                                        }}
                                        placeholder="اسم المحافظة"
                                        className="flex-1"
                                    />
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            value={area.fee}
                                            onChange={(e) => {
                                                const updated = [...shippingAreas];
                                                updated[index].fee = parseInt(e.target.value) || 0;
                                                setShippingAreas(updated);
                                                setHasChanges(true);
                                            }}
                                            className="w-24"
                                        />
                                        <span className="text-muted-foreground text-sm">ج.م</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive"
                                        onClick={() => {
                                            setShippingAreas(shippingAreas.filter(a => a.id !== area.id));
                                            setHasChanges(true);
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            {shippingAreas.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>لا توجد مناطق توصيل. اضغط "إضافة منطقة" لإضافة محافظة.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Additional Settings */}
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle className="text-base">إعدادات إضافية</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>حد الشحن المجاني (ج.م)</Label>
                                <Input
                                    type="number"
                                    value={settings.free_shipping_threshold}
                                    onChange={(e) => updateSetting('free_shipping_threshold', parseInt(e.target.value) || 0)}
                                    placeholder="10000"
                                />
                                <p className="text-xs text-muted-foreground">
                                    الطلبات فوق هذا المبلغ يكون الشحن مجاني (0 = لا يوجد)
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label>رسالة التوصيل</Label>
                                <Input
                                    value={settings.delivery_message}
                                    onChange={(e) => updateSetting('delivery_message', e.target.value as any)}
                                    placeholder="التوصيل خلال 2-5 أيام عمل"
                                />
                                <p className="text-xs text-muted-foreground">
                                    تظهر للعميل في صفحة الدفع
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Summary */}
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle className="text-base">ملخص الإعدادات</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                <div className="text-center p-3 bg-muted rounded-lg">
                                    <p className="text-2xl font-bold text-blue-500">{settings.delivery_fee}</p>
                                    <p className="text-xs text-muted-foreground">رسوم التوصيل</p>
                                </div>
                                <div className="text-center p-3 bg-muted rounded-lg">
                                    <p className="text-2xl font-bold text-purple-500">{settings.installation_fee}</p>
                                    <p className="text-xs text-muted-foreground">رسوم التركيب</p>
                                </div>
                                <div className="text-center p-3 bg-muted rounded-lg">
                                    <p className="text-2xl font-bold text-orange-500">{settings.delivery_fee + settings.installation_fee}</p>
                                    <p className="text-xs text-muted-foreground">الإجمالي</p>
                                </div>
                                <div className="text-center p-3 bg-muted rounded-lg">
                                    <p className="text-2xl font-bold text-green-500">{enabledCount}</p>
                                    <p className="text-xs text-muted-foreground">خيارات مفعّلة</p>
                                </div>
                                <div className="text-center p-3 bg-muted rounded-lg">
                                    <p className="text-2xl font-bold text-indigo-500">{shippingAreas.filter(a => a.isActive).length}</p>
                                    <p className="text-xs text-muted-foreground">مناطق التوصيل</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default DeliverySettingsAdmin;
