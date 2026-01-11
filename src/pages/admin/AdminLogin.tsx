import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Lock, LogIn, Shield, User, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { toast } from "sonner";

const AdminLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAdminAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const success = login(username, password);

        if (success) {
            toast.success("تم تسجيل الدخول بنجاح!");
            navigate("/admin");
        } else {
            toast.error("اسم المستخدم أو كلمة المرور غير صحيحة");
        }

        setIsLoading(false);
    };

    return (
        <>
            <Helmet>
                <title>دخول لوحة التحكم | دريم للتجارة والتوريدات</title>
            </Helmet>

            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-primary/30 flex items-center justify-center p-4 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full" />
                </div>

                <Card className="w-full max-w-md shadow-2xl border-0 relative z-10 bg-card/95 backdrop-blur-sm">
                    <CardHeader className="text-center pb-2">
                        {/* Logo */}
                        <div className="w-24 h-24 bg-gradient-to-br from-secondary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <Shield className="h-12 w-12 text-white" />
                        </div>
                        <CardTitle className="text-2xl font-bold">لوحة التحكم</CardTitle>
                        <CardDescription className="text-base">
                            دريم للتجارة والتوريدات
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-sm font-medium">اسم المستخدم</Label>
                                <div className="relative">
                                    <User className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="username"
                                        type="text"
                                        placeholder="أدخل اسم المستخدم"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="pr-11 h-12 text-base rounded-xl bg-muted/50 border-border focus:border-secondary"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium">كلمة المرور</Label>
                                <div className="relative">
                                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="أدخل كلمة المرور"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pr-11 pl-11 h-12 text-base rounded-xl bg-muted/50 border-border focus:border-secondary"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-secondary to-accent hover:opacity-90 text-white gap-2 h-12 text-base font-bold rounded-xl shadow-lg"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <LogIn className="h-5 w-5" />
                                )}
                                {isLoading ? "جاري الدخول..." : "تسجيل الدخول"}
                            </Button>
                        </form>

                        {/* Back to site link */}
                        <div className="text-center pt-2">
                            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-secondary transition-colors">
                                <ArrowRight className="h-4 w-4" />
                                العودة للموقع
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Version */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/30 text-xs">
                    Dream Admin Panel v2.0
                </div>
            </div>
        </>
    );
};

export default AdminLogin;
