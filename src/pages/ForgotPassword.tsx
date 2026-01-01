import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const { resetPassword } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const { error } = await resetPassword(email);

        if (error) {
            toast.error(error.message || "فشل إرسال رابط إعادة تعيين كلمة المرور");
        } else {
            setEmailSent(true);
        }

        setIsLoading(false);
    };

    if (emailSent) {
        return (
            <>
                <Helmet>
                    <title>تم إرسال الرابط | تارجت لأعمال التكييف</title>
                </Helmet>

                <Navbar />

                <div className="min-h-screen bg-gradient-to-b from-muted to-background py-20">
                    <div className="container max-w-md mx-auto px-4">
                        <Card className="shadow-xl border-0 text-center">
                            <CardHeader>
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="h-10 w-10 text-green-600" />
                                </div>
                                <CardTitle className="text-2xl">تم إرسال الرابط!</CardTitle>
                                <CardDescription className="text-base mt-2">
                                    تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-muted p-4 rounded-lg">
                                    <p className="text-sm font-medium">{email}</p>
                                </div>
                                <p className="text-muted-foreground text-sm">
                                    يرجى فتح بريدك الإلكتروني والضغط على الرابط لإعادة تعيين كلمة المرور
                                </p>
                            </CardContent>
                            <CardFooter className="justify-center">
                                <Link to="/login">
                                    <Button variant="outline" className="gap-2">
                                        <ArrowRight className="h-4 w-4" />
                                        العودة لتسجيل الدخول
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
                <title>نسيت كلمة المرور | تارجت لأعمال التكييف</title>
                <meta name="description" content="استعد كلمة المرور الخاصة بك" />
            </Helmet>

            <Navbar />

            <div className="min-h-screen bg-gradient-to-b from-muted to-background py-20">
                <div className="container max-w-md mx-auto px-4">
                    <Card className="shadow-xl border-0">
                        <CardHeader className="text-center pb-2">
                            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="h-8 w-8 text-secondary" />
                            </div>
                            <CardTitle className="text-2xl">نسيت كلمة المرور؟</CardTitle>
                            <CardDescription>
                                أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">البريد الإلكتروني</Label>
                                    <div className="relative">
                                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="example@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pr-10"
                                            required
                                            dir="ltr"
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
                                        <Mail className="h-4 w-4" />
                                    )}
                                    {isLoading ? "جاري الإرسال..." : "إرسال رابط إعادة التعيين"}
                                </Button>
                            </form>
                        </CardContent>
                        <CardFooter className="justify-center">
                            <Link to="/login" className="text-sm text-muted-foreground hover:text-secondary flex items-center gap-1">
                                <ArrowRight className="h-4 w-4" />
                                العودة لتسجيل الدخول
                            </Link>
                        </CardFooter>
                    </Card>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default ForgotPassword;

