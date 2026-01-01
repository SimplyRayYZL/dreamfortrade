import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Lock, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<"loading" | "valid" | "invalid" | "success">("loading");
    const navigate = useNavigate();

    useEffect(() => {
        // Check if we have access_token in URL hash (from email link)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get("access_token");
        const type = hashParams.get("type");

        if (accessToken && type === "recovery") {
            setStatus("valid");
        } else {
            // Check if we have a session
            supabase.auth.getSession().then(({ data: { session } }) => {
                if (session) {
                    setStatus("valid");
                } else {
                    setStatus("invalid");
                }
            });
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("كلمة المرور غير متطابقة");
            return;
        }

        if (password.length < 6) {
            toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
            return;
        }

        setIsLoading(true);

        const { error } = await supabase.auth.updateUser({
            password: password,
        });

        if (error) {
            toast.error(error.message || "فشل تحديث كلمة المرور");
        } else {
            setStatus("success");
        }

        setIsLoading(false);
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (status === "invalid") {
        return (
            <>
                <Helmet>
                    <title>رابط غير صالح | تارجت لأعمال التكييف</title>
                </Helmet>

                <Navbar />

                <div className="min-h-screen bg-gradient-to-b from-muted to-background py-20">
                    <div className="container max-w-md mx-auto px-4">
                        <Card className="shadow-xl border-0 text-center">
                            <CardHeader>
                                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <XCircle className="h-10 w-10 text-red-600" />
                                </div>
                                <CardTitle className="text-2xl">رابط غير صالح</CardTitle>
                                <CardDescription className="text-base mt-2">
                                    الرابط منتهي الصلاحية أو غير صالح
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    يرجى طلب رابط جديد لإعادة تعيين كلمة المرور
                                </p>
                            </CardContent>
                            <CardFooter className="justify-center">
                                <Link to="/forgot-password">
                                    <Button className="bg-secondary hover:bg-secondary/90">
                                        طلب رابط جديد
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    </div>
                </div>

                <Footer />
            </>
        );
    }

    if (status === "success") {
        return (
            <>
                <Helmet>
                    <title>تم تغيير كلمة المرور | تارجت لأعمال التكييف</title>
                </Helmet>

                <Navbar />

                <div className="min-h-screen bg-gradient-to-b from-muted to-background py-20">
                    <div className="container max-w-md mx-auto px-4">
                        <Card className="shadow-xl border-0 text-center">
                            <CardHeader>
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="h-10 w-10 text-green-600" />
                                </div>
                                <CardTitle className="text-2xl">تم تغيير كلمة المرور!</CardTitle>
                                <CardDescription className="text-base mt-2">
                                    تم تحديث كلمة المرور بنجاح
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة
                                </p>
                            </CardContent>
                            <CardFooter className="justify-center">
                                <Link to="/login">
                                    <Button className="bg-secondary hover:bg-secondary/90 gap-2">
                                        <ArrowRight className="h-4 w-4" />
                                        تسجيل الدخول
                                    </Button>
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
                <title>إعادة تعيين كلمة المرور | تارجت لأعمال التكييف</title>
            </Helmet>

            <Navbar />

            <div className="min-h-screen bg-gradient-to-b from-muted to-background py-20">
                <div className="container max-w-md mx-auto px-4">
                    <Card className="shadow-xl border-0">
                        <CardHeader className="text-center pb-2">
                            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Lock className="h-8 w-8 text-secondary" />
                            </div>
                            <CardTitle className="text-2xl">إعادة تعيين كلمة المرور</CardTitle>
                            <CardDescription>
                                أدخل كلمة المرور الجديدة
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password">كلمة المرور الجديدة</Label>
                                    <div className="relative">
                                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="6 أحرف على الأقل"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
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
                                            type="password"
                                            placeholder="أعد كتابة كلمة المرور"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                                        <Lock className="h-4 w-4" />
                                    )}
                                    {isLoading ? "جاري التحديث..." : "تحديث كلمة المرور"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default ResetPassword;

