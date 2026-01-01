import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Mail, Phone, Lock, UserPlus, User, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const { signUp, signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("كلمة المرور غير متطابقة");
            return;
        }

        if (formData.password.length < 6) {
            toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
            return;
        }

        setIsLoading(true);

        const { error, data } = await signUp(formData.email, formData.password, {
            full_name: formData.fullName,
            phone: formData.phone,
        });

        if (error) {
            // Check for existing account error
            const errorMessage = error.message?.toLowerCase() || '';
            if (errorMessage.includes("مسجل بالفعل") ||
                errorMessage.includes("already registered") ||
                errorMessage.includes("already exists") ||
                errorMessage.includes("user already") ||
                errorMessage.includes("email already")) {
                toast.error("هذا البريد الإلكتروني مسجل بالفعل! سجّل دخولك من صفحة تسجيل الدخول", { duration: 5000 });
            } else {
                toast.error(error.message || "فشل إنشاء الحساب");
            }
            setIsLoading(false);
            return;
        }

        // Show confirmation screen only on success
        setShowConfirmation(true);
        setIsLoading(false);
    };

    if (showConfirmation) {
        return (
            <>
                <Helmet>
                    <title>تأكيد البريد الإلكتروني | تارجت لأعمال التكييف</title>
                </Helmet>

                <Navbar />

                <div className="min-h-screen bg-gradient-to-b from-muted to-background py-20">
                    <div className="container max-w-md mx-auto px-4">
                        <Card className="shadow-xl border-0 text-center">
                            <CardHeader>
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="h-10 w-10 text-green-600" />
                                </div>
                                <CardTitle className="text-2xl">تم إنشاء الحساب!</CardTitle>
                                <CardDescription className="text-base mt-2">
                                    تم إرسال رابط تأكيد إلى بريدك الإلكتروني
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-muted-foreground">
                                    يرجى فتح بريدك الإلكتروني والضغط على رابط التأكيد لتفعيل حسابك
                                </p>
                                <div className="bg-muted p-4 rounded-lg">
                                    <p className="text-sm font-medium">{formData.email}</p>
                                </div>
                            </CardContent>
                            <CardFooter className="justify-center">
                                <Link to="/login">
                                    <Button variant="outline">العودة لتسجيل الدخول</Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    </div>
                </div>

                <Footer />
            </>
        );
    }

    return (
        <>
            <Helmet>
                <title>إنشاء حساب | تارجت لأعمال التكييف</title>
                <meta name="description" content="أنشئ حسابك في ????? ?????? ??????? للاستمتاع بتجربة تسوق مميزة" />
            </Helmet>

            <Navbar />

            <div className="min-h-screen bg-gradient-to-b from-muted to-background py-20">
                <div className="container max-w-md mx-auto px-4">
                    <Card className="shadow-xl border-0">
                        <CardHeader className="text-center pb-2">
                            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <UserPlus className="h-8 w-8 text-secondary" />
                            </div>
                            <CardTitle className="text-2xl">إنشاء حساب جديد</CardTitle>
                            <CardDescription>
                                أنشئ حسابك للاستمتاع بتجربة تسوق مميزة
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">الاسم الكامل</Label>
                                    <div className="relative">
                                        <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="fullName"
                                            name="fullName"
                                            type="text"
                                            placeholder="أحمد محمد"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className="pr-10"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">البريد الإلكتروني</Label>
                                    <div className="relative">
                                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="example@email.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="pr-10"
                                            required
                                            dir="ltr"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">رقم الهاتف <span className="text-muted-foreground text-xs">(اختياري)</span></Label>
                                    <div className="relative">
                                        <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            placeholder="01xxxxxxxxx"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="pr-10"
                                            dir="ltr"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">كلمة المرور</Label>
                                    <div className="relative">
                                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="6 أحرف على الأقل"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="pr-10"
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                                    <div className="relative">
                                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            placeholder="أعد كتابة كلمة المرور"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="pr-10"
                                            required
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground gap-2"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <UserPlus className="h-4 w-4" />
                                    )}
                                    {isLoading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
                                </Button>
                            </form>

                            {/* Google Sign In */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-card px-2 text-muted-foreground">
                                        أو
                                    </span>
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full gap-3"
                                onClick={async () => {
                                    const { error } = await signInWithGoogle();
                                    if (error) {
                                        toast.error(error.message || "فشل التسجيل بـ Google");
                                    }
                                }}
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                التسجيل بـ Google
                            </Button>
                        </CardContent>
                        <CardFooter className="justify-center">
                            <p className="text-sm text-muted-foreground">
                                لديك حساب بالفعل؟{" "}
                                <Link to="/login" className="text-secondary hover:underline font-medium">
                                    سجّل الدخول
                                </Link>
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default Register;

