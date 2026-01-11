import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Mail, Phone, Lock, LogIn, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Login = () => {
    const [emailOrPhone, setEmailOrPhone] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { signIn, signInWithGoogle } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = (location.state as any)?.from?.pathname || "/";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const { error } = await signIn(emailOrPhone, password);

        if (error) {
            toast.error(error.message || "فشل تسجيل الدخول");
        } else {
            toast.success("تم تسجيل الدخول بنجاح!");
            navigate(from, { replace: true });
        }

        setIsLoading(false);
    };

    return (
        <>
            <Helmet>
                <title>تسجيل الدخول | دريم للتجارة والتوريدات</title>
                <meta name="description" content="سجّل دخولك لمتابعة طلباتك وإدارة حسابك في ????? ?????? ???????" />
            </Helmet>

            <Navbar />

            <div className="min-h-screen bg-gradient-to-b from-muted to-background py-20">
                <div className="container max-w-md mx-auto px-4">
                    <Card className="shadow-xl border-0">
                        <CardHeader className="text-center pb-2">
                            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <User className="h-8 w-8 text-secondary" />
                            </div>
                            <CardTitle className="text-2xl">تسجيل الدخول</CardTitle>
                            <CardDescription>
                                أدخل بياناتك للوصول إلى حسابك
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Tabs defaultValue="email" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 mb-4">
                                        <TabsTrigger value="email" className="gap-2">
                                            <Mail className="h-4 w-4" />
                                            البريد الإلكتروني
                                        </TabsTrigger>
                                        <TabsTrigger value="phone" className="gap-2">
                                            <Phone className="h-4 w-4" />
                                            رقم الهاتف
                                        </TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="email">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">البريد الإلكتروني</Label>
                                            <div className="relative">
                                                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="example@email.com"
                                                    value={emailOrPhone}
                                                    onChange={(e) => setEmailOrPhone(e.target.value)}
                                                    className="pr-10"
                                                    required
                                                    dir="ltr"
                                                />
                                            </div>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="phone">
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">رقم الهاتف</Label>
                                            <div className="relative">
                                                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    placeholder="01xxxxxxxxx"
                                                    value={emailOrPhone}
                                                    onChange={(e) => setEmailOrPhone(e.target.value)}
                                                    className="pr-10"
                                                    required
                                                    dir="ltr"
                                                />
                                            </div>
                                        </div>
                                    </TabsContent>
                                </Tabs>

                                <div className="space-y-2">
                                    <Label htmlFor="password">كلمة المرور</Label>
                                    <div className="relative">
                                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pr-10"
                                            required
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <Link
                                            to="/forgot-password"
                                            className="text-xs text-muted-foreground hover:text-secondary transition-colors"
                                        >
                                            نسيت كلمة المرور؟
                                        </Link>
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
                                        <LogIn className="h-4 w-4" />
                                    )}
                                    {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
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
                                        toast.error(error.message || "فشل تسجيل الدخول بـ Google");
                                    }
                                }}
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                تسجيل الدخول بـ Google
                            </Button>
                        </CardContent>
                        <CardFooter className="justify-center">
                            <p className="text-sm text-muted-foreground">
                                ليس لديك حساب؟{" "}
                                <Link to="/register" className="text-secondary hover:underline font-medium">
                                    سجّل الآن
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

export default Login;

