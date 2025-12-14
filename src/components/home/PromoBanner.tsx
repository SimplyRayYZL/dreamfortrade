import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, MessageCircle, Phone, Truck, Shield, Wrench, Headphones, CreditCard, Package, Snowflake, Facebook, Instagram, Mail } from "lucide-react";
import "@/styles/snow.css";

interface PromoBannerProps {
    variant?: "features" | "contact";
}

const PromoBanner = ({ variant = "features" }: PromoBannerProps) => {
    if (variant === "features") {
        // Features section with cyan/blue snowflakes
        const features = [
            { icon: Truck, title: "توصيل سريع", desc: "توصيل مجاني لجميع أنحاء الجمهورية" },
            { icon: Shield, title: "ضمان شامل", desc: "ضمان حتى 5 سنوات على جميع المنتجات" },
            { icon: Wrench, title: "تركيب مجاني", desc: "فريق متخصص للتركيب والصيانة" },
            { icon: Headphones, title: "دعم فني 24/7", desc: "فريق دعم متواجد على مدار الساعة" },
            { icon: CreditCard, title: "تقسيط مريح", desc: "خطط تقسيط بدون فوائد" },
            { icon: Package, title: "منتجات أصلية", desc: "وكيل معتمد لأشهر الماركات" },
        ];

        return (
            <section className="relative py-16 md:py-20 bg-[hsl(210,20%,98%)] overflow-hidden">
                {/* Falling snow effect - cyan color */}
                <div className="snow-container absolute inset-0 pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="snowflake text-cyan-400/40"
                            style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${5 + Math.random() * 5}s`,
                            }}
                        >
                            <Snowflake className="h-4 w-4 md:h-6 md:w-6" />
                        </div>
                    ))}
                </div>

                {/* Floating snowflakes - cyan */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(8)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute animate-float"
                            style={{
                                left: `${10 + i * 12}%`,
                                top: `${5 + (i % 3) * 30}%`,
                                animationDelay: `${i * 0.5}s`,
                                animationDuration: `${3 + i * 0.4}s`,
                            }}
                        >
                            <Snowflake className="h-8 w-8 md:h-12 md:w-12 text-cyan-500/25" />
                        </div>
                    ))}
                    {/* Glowing orbs */}
                    <div className="absolute top-10 right-20 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-20 left-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    {/* Title */}
                    <div className="text-center mb-12 md:mb-16">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
                            ليه تختار <span className="text-secondary">دريم</span>؟
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            نقدم لك تجربة شراء مميزة مع أفضل الخدمات والضمانات
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center text-center p-4 md:p-6 rounded-2xl bg-white hover:bg-primary/5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group border border-border/50"
                            >
                                <div className="w-14 h-14 md:w-16 md:h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-secondary/20 group-hover:scale-110 transition-all duration-300">
                                    <feature.icon className="h-7 w-7 md:h-8 md:w-8 text-primary group-hover:text-secondary transition-colors" />
                                </div>
                                <h3 className="font-bold text-foreground text-sm md:text-base mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* CTA Button */}
                    <div className="text-center mt-12">
                        <Link to="/products">
                            <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-lg px-10 h-14 gap-3 font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                تصفح المنتجات
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    // Contact variant - Improved design with gradient and animations
    const floatingIcons = [
        { Icon: MessageCircle, color: "text-green-500", delay: 0 },
        { Icon: Facebook, color: "text-blue-600", delay: 1 },
        { Icon: Instagram, color: "text-pink-500", delay: 2 },
        { Icon: Phone, color: "text-primary", delay: 3 },
        { Icon: Mail, color: "text-red-500", delay: 4 },
    ];

    return (
        <section className="py-16 md:py-24 bg-gradient-to-b from-[hsl(210,20%,98%)] via-white to-[hsl(210,20%,98%)] relative overflow-hidden">
            {/* Animated background circles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-48 h-48 bg-secondary/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>

            {/* Floating social icons animation */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {floatingIcons.map((item, i) => (
                    <div
                        key={i}
                        className={`absolute animate-float ${item.color} opacity-15`}
                        style={{
                            left: `${5 + i * 18}%`,
                            top: `${20 + (i % 3) * 25}%`,
                            animationDelay: `${item.delay * 0.5}s`,
                            animationDuration: `${4 + i * 0.5}s`,
                        }}
                    >
                        <item.Icon className="h-8 w-8 md:h-12 md:w-12" />
                    </div>
                ))}
                {floatingIcons.map((item, i) => (
                    <div
                        key={`right-${i}`}
                        className={`absolute animate-float ${item.color} opacity-10`}
                        style={{
                            right: `${5 + i * 15}%`,
                            bottom: `${15 + (i % 2) * 20}%`,
                            animationDelay: `${(item.delay + 2) * 0.5}s`,
                            animationDuration: `${5 + i * 0.3}s`,
                        }}
                    >
                        <item.Icon className="h-6 w-6 md:h-10 md:w-10" />
                    </div>
                ))}
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex justify-center">
                    {/* Card container with overlapping image */}
                    <div className="relative max-w-sm w-full">
                        {/* Image - overlapping on top */}
                        <div className="relative z-10 mx-auto w-64 md:w-72 -mb-16">
                            <div className="bg-white rounded-3xl p-3 shadow-xl border border-gray-100">
                                <img
                                    src="/contact-box.png"
                                    alt="تواصل معنا"
                                    className="w-full h-48 md:h-56 object-cover rounded-2xl"
                                />
                            </div>
                        </div>

                        {/* Gradient Box - main content */}
                        <div className="bg-gradient-to-br from-primary via-primary to-secondary rounded-[2rem] pt-20 pb-8 px-6 md:px-8 shadow-2xl">
                            {/* Stars */}
                            <div className="flex items-center justify-center gap-1 mb-3">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 md:h-5 md:w-5 text-yellow-400 fill-yellow-400" />
                                ))}
                                <span className="text-white font-medium mr-2 text-xs md:text-sm">+1000 عميل راضي</span>
                            </div>

                            {/* Text - white */}
                            <h2 className="text-xl md:text-2xl font-bold text-white mb-2 text-center">
                                محتاج مساعدة؟
                            </h2>
                            <p className="text-white/90 text-xs md:text-sm mb-6 leading-relaxed text-center">
                                فريقنا المتخصص جاهز للإجابة على كل استفساراتك ومساعدتك في اختيار التكييف المناسب
                            </p>

                            {/* Buttons */}
                            <div className="flex flex-col gap-3">
                                <a href="tel:+201289006310" className="block">
                                    <Button className="w-full bg-white hover:bg-white/90 text-primary font-bold gap-2 h-12 rounded-xl shadow-lg transition-all duration-300 hover:scale-105">
                                        <Phone className="h-5 w-5" />
                                        اتصل الآن
                                    </Button>
                                </a>
                                <a href="https://wa.me/201289006310" target="_blank" rel="noopener noreferrer" className="block">
                                    <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold gap-2 h-12 rounded-xl shadow-lg transition-all duration-300 hover:scale-105">
                                        <MessageCircle className="h-5 w-5" />
                                        واتساب
                                    </Button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PromoBanner;
