import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Zap, Thermometer, Wind, Wifi, Leaf, Shield, Snowflake, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import brand logos
import carrierLogo from "@/assets/brands/carrier.png";
import mideaLogo from "@/assets/brands/midea.png";
import freshLogo from "@/assets/brands/fresh.png";
import sharpLogo from "@/assets/brands/sharp.png";

// Brand banner data with compelling copy
const brandBanners = [
    {
        id: 1,
        brand: "Carrier",
        logo: carrierLogo,
        image: "/banner-carrier.png",
        title: "تبريد فائق السرعة",
        subtitle: "وفر حتى 60% من استهلاك الكهرباء",
        tagline: "الخيار الأول للمنازل العصرية",
        features: [
            { icon: Zap, label: "توفير 60%" },
            { icon: Thermometer, label: "تبريد سريع" },
            { icon: Wind, label: "هواء نقي" },
            { icon: Shield, label: "ضمان 5 سنوات" },
        ],
        gradient: "from-blue-600 via-blue-700 to-cyan-600",
    },
    {
        id: 2,
        brand: "Midea",
        logo: mideaLogo,
        image: "/banner-midea.png",
        title: "تقنية الإنفرتر الذكية",
        subtitle: "أداء ممتاز بأسعار منافسة",
        tagline: "الجودة العالمية في متناول الجميع",
        features: [
            { icon: Settings, label: "إنفرتر" },
            { icon: Snowflake, label: "تبريد -18°" },
            { icon: Wifi, label: "تحكم ذكي" },
            { icon: Leaf, label: "صديق للبيئة" },
        ],
        gradient: "from-cyan-600 via-teal-600 to-emerald-600",
    },
    {
        id: 3,
        brand: "Fresh",
        logo: freshLogo,
        image: "/banner-fresh.png",
        title: "صناعة مصرية عالمية",
        subtitle: "قوة تحمل الأجواء الحارة",
        tagline: "مصمم خصيصاً للمناخ المصري",
        features: [
            { icon: Thermometer, label: "يعمل حتى 55°" },
            { icon: Shield, label: "ضمان شامل" },
            { icon: Wind, label: "توزيع متساوي" },
            { icon: Zap, label: "كفاءة عالية" },
        ],
        gradient: "from-red-600 via-orange-600 to-amber-500",
    },
    {
        id: 4,
        brand: "Sharp",
        logo: sharpLogo,
        image: "/banner-sharp.png",
        title: "تقنية البلازما كلاستر",
        subtitle: "هواء نقي خالي من البكتيريا",
        tagline: "التكنولوجيا اليابانية الأصيلة",
        features: [
            { icon: Snowflake, label: "بلازما كلاستر" },
            { icon: Wind, label: "تنقية الهواء" },
            { icon: Wifi, label: "واي فاي" },
            { icon: Leaf, label: "مضاد للحساسية" },
        ],
        gradient: "from-red-700 via-rose-600 to-pink-600",
    },
];

const BrandBanners = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-slide every 7 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % brandBanners.length);
        }, 7000);
        return () => clearInterval(timer);
    }, []);

    const nextBanner = () => {
        setCurrentIndex((prev) => (prev + 1) % brandBanners.length);
    };

    const prevBanner = () => {
        setCurrentIndex((prev) => (prev - 1 + brandBanners.length) % brandBanners.length);
    };

    const currentBanner = brandBanners[currentIndex];

    return (
        <section className="py-6 md:py-10 bg-[hsl(210,20%,98%)]">
            <div className="container mx-auto px-4">
                {/* Banner Slider - No Title */}
                <div className="relative">
                    {/* Banner Card */}
                    <div
                        className={`relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 bg-gradient-to-r ${currentBanner.gradient}`}
                        style={{ minHeight: "320px" }}
                    >
                        {/* Background Image with overlay */}
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-40 transition-all duration-700"
                            style={{ backgroundImage: `url('${currentBanner.image}')` }}
                        />

                        {/* Animated particles */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            {[...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute animate-float opacity-20"
                                    style={{
                                        left: `${15 + i * 15}%`,
                                        top: `${20 + (i % 3) * 25}%`,
                                        animationDelay: `${i * 0.5}s`,
                                        animationDuration: `${3 + i * 0.5}s`,
                                    }}
                                >
                                    <Snowflake className="h-8 w-8 text-white" />
                                </div>
                            ))}
                        </div>

                        {/* Content */}
                        <div className="relative z-10 h-full min-h-[320px] flex items-center">
                            <div className="container mx-auto px-6 md:px-12">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                    <div className="text-white text-center md:text-right">
                                        {/* Brand Logo */}
                                        <div className="flex justify-center md:justify-end mb-4">
                                            <img
                                                src={currentBanner.logo}
                                                alt={currentBanner.brand}
                                                className="h-12 md:h-16 w-auto object-contain drop-shadow-[0_2px_8px_rgba(255,255,255,0.5)]"
                                            />
                                        </div>

                                        {/* Tagline */}
                                        <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-1 mb-4">
                                            <span className="text-sm font-medium">{currentBanner.tagline}</span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 drop-shadow-lg">
                                            {currentBanner.title}
                                        </h3>
                                        <p className="text-lg md:text-xl text-white/90 mb-6">
                                            {currentBanner.subtitle}
                                        </p>

                                        {/* CTA Button */}
                                        <Link to={`/products?brand=${currentBanner.brand}`}>
                                            <Button className="bg-white text-gray-900 hover:bg-white/90 font-bold px-8 h-12 text-lg shadow-xl hover:scale-105 transition-all duration-300">
                                                اكتشف العروض
                                                <ChevronLeft className="h-5 w-5 mr-2" />
                                            </Button>
                                        </Link>
                                    </div>

                                    {/* Features Grid */}
                                    <div className="hidden md:block">
                                        <div className="grid grid-cols-2 gap-4">
                                            {currentBanner.features.map((feature, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/25 transition-all duration-300"
                                                >
                                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                                        <feature.icon className="h-6 w-6 text-white" />
                                                    </div>
                                                    <span className="text-white font-semibold">{feature.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        onClick={prevBanner}
                        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-20"
                    >
                        <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-gray-800" />
                    </button>
                    <button
                        onClick={nextBanner}
                        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-20"
                    >
                        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-gray-800" />
                    </button>

                    {/* Dots Indicator */}
                    <div className="flex justify-center gap-2 mt-6">
                        {brandBanners.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex
                                    ? "bg-primary w-8"
                                    : "bg-primary/30 w-2 hover:bg-primary/50"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BrandBanners;
