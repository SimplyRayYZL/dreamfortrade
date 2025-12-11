import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, MessageCircle, Phone, Shield, Award, Snowflake } from "lucide-react";

interface PromoBannerProps {
    variant?: "quality" | "contact";
}

const PromoBanner = ({ variant = "quality" }: PromoBannerProps) => {
    if (variant === "quality") {
        // Banner between Products and Features - smaller, cleaner
        return (
            <section className="relative overflow-hidden bg-gradient-to-r from-primary via-primary/95 to-primary/90">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl animate-pulse" />
                    <div className="absolute bottom-0 left-1/4 w-24 h-24 bg-white/5 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
                    <Snowflake className="absolute top-4 left-10 h-6 w-6 text-white/20 animate-spin" style={{ animationDuration: '8s' }} />
                    <Snowflake className="absolute bottom-4 right-20 h-4 w-4 text-white/15 animate-spin" style={{ animationDuration: '6s' }} />
                </div>

                {/* Content */}
                <div className="relative z-10 container mx-auto px-4 py-8 md:py-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Icons */}
                        <div className="flex items-center gap-3">
                            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">
                                <Shield className="h-6 w-6 text-secondary" />
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">
                                <Award className="h-6 w-6 text-secondary" />
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="text-center flex-1">
                            <h2 className="text-xl md:text-2xl font-bold text-white">
                                جودة <span className="text-secondary">عالمية</span> • ضمان <span className="text-secondary">5 سنوات</span> • قطع غيار أصلية
                            </h2>
                        </div>

                        {/* CTA Button */}
                        <Link to="/products">
                            <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold gap-2 h-10 px-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                تصفح المنتجات
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    // Contact variant - replaces CTA section
    return (
        <section className="relative overflow-hidden bg-gradient-to-l from-primary via-primary/95 to-primary/90">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-40 h-40 bg-secondary/10 rounded-full blur-2xl animate-pulse" />
                <div className="absolute bottom-0 right-1/3 w-28 h-28 bg-white/5 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1.5s' }} />
                <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-green-500/10 rounded-full blur-lg animate-bounce" style={{ animationDuration: '3s' }} />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 py-10 md:py-14">
                <div className="flex flex-col items-center text-center gap-6">
                    {/* Stars */}
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 text-secondary fill-secondary" />
                        ))}
                        <span className="text-white/80 text-sm mr-2">+1000 عميل راضي</span>
                    </div>

                    {/* Main Text */}
                    <div className="space-y-2">
                        <h2 className="text-2xl md:text-3xl font-bold text-white">
                            فريقنا <span className="text-secondary">جاهز</span> لمساعدتك
                        </h2>
                        <p className="text-white/70 text-sm md:text-base max-w-lg mx-auto">
                            تواصل معنا الآن للحصول على أفضل العروض والاستشارة المجانية
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-wrap gap-3 justify-center">
                        <a href="tel:+201289006310">
                            <Button className="bg-white hover:bg-white/90 text-primary font-bold gap-2 h-11 px-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                <Phone className="h-4 w-4" />
                                اتصل بنا الآن
                            </Button>
                        </a>
                        <a href="https://wa.me/201289006310" target="_blank" rel="noopener noreferrer">
                            <Button className="bg-green-500 hover:bg-green-600 text-white font-bold gap-2 h-11 px-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                <MessageCircle className="h-4 w-4" />
                                واتساب
                            </Button>
                        </a>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-4 justify-center text-white/80 text-xs md:text-sm">
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            رد سريع
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                            دعم 24/7
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            استشارة مجانية
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PromoBanner;
