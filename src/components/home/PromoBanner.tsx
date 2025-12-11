import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, MessageCircle, Phone, Shield, Award } from "lucide-react";

interface PromoBannerProps {
    variant?: "quality" | "support";
}

const PromoBanner = ({ variant = "quality" }: PromoBannerProps) => {
    if (variant === "quality") {
        // Banner between Products and Features - about quality
        return (
            <section className="relative py-0 overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/bg-quality.png')" }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/50" />

                {/* Animated decorations */}
                <div className="absolute top-4 right-10 w-16 h-16 bg-secondary/20 rounded-full blur-xl animate-pulse" />
                <div className="absolute bottom-4 left-20 w-12 h-12 bg-white/10 rounded-full blur-lg animate-bounce" style={{ animationDuration: '3s' }} />

                {/* Content */}
                <div className="relative z-10 container mx-auto px-4 py-12 md:py-16">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        {/* Text Content */}
                        <div className="text-center md:text-right space-y-4 max-w-xl animate-fade-in">
                            <div className="flex items-center gap-3 justify-center md:justify-start">
                                <Shield className="h-8 w-8 text-secondary" />
                                <Award className="h-8 w-8 text-secondary" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                                جودة <span className="text-secondary">عالمية</span> - ضمان شامل
                            </h2>
                            <p className="text-white/80 text-sm md:text-base">
                                نقدم لك أفضل ماركات التكييفات العالمية مع ضمان حقيقي وخدمة ما بعد البيع
                            </p>
                            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
                                    ✓ ضمان 5 سنوات
                                </span>
                                <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
                                    ✓ قطع غيار أصلية
                                </span>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <Link to="/products">
                            <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold gap-2 h-12 px-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                تصفح المنتجات
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    // Support variant - Banner between Testimonials and CTA
    return (
        <section className="relative py-0 overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/bg-support.png')" }}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-l from-primary/90 via-primary/70 to-primary/50" />

            {/* Animated decorations */}
            <div className="absolute top-6 left-10 w-20 h-20 bg-secondary/20 rounded-full blur-xl animate-pulse" style={{ animationDuration: '2s' }} />
            <div className="absolute bottom-6 right-16 w-14 h-14 bg-white/10 rounded-full blur-lg animate-bounce" style={{ animationDuration: '4s' }} />

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 py-12 md:py-16">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* CTA Button - on left for variety */}
                    <div className="order-2 md:order-1 flex gap-3">
                        <Link to="/contact">
                            <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold gap-2 h-12 px-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                <Phone className="h-5 w-5" />
                                اتصل بنا
                            </Button>
                        </Link>
                        <a href="https://wa.me/201289006310" target="_blank" rel="noopener noreferrer">
                            <Button className="bg-green-500 hover:bg-green-600 text-white font-bold gap-2 h-12 px-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                <MessageCircle className="h-5 w-5" />
                                واتساب
                            </Button>
                        </a>
                    </div>

                    {/* Text Content */}
                    <div className="order-1 md:order-2 text-center md:text-left space-y-4 max-w-xl animate-fade-in">
                        <div className="flex items-center gap-3 justify-center md:justify-end">
                            <Star className="h-6 w-6 text-secondary fill-secondary" />
                            <Star className="h-6 w-6 text-secondary fill-secondary" />
                            <Star className="h-6 w-6 text-secondary fill-secondary" />
                            <Star className="h-6 w-6 text-secondary fill-secondary" />
                            <Star className="h-6 w-6 text-secondary fill-secondary" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                            عملاؤنا <span className="text-secondary">يثقون</span> بنا
                        </h2>
                        <p className="text-white/80 text-sm md:text-base">
                            انضم لآلاف العملاء الراضين - فريقنا جاهز للإجابة على كل استفساراتك
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center md:justify-end">
                            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
                                📞 دعم على مدار الساعة
                            </span>
                            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
                                ⚡ رد سريع
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PromoBanner;
