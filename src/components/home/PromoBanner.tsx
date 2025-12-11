import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface PromoBannerProps {
    variant?: "deals" | "installation";
}

const PromoBanner = ({ variant = "deals" }: PromoBannerProps) => {
    if (variant === "deals") {
        return (
            <section className="py-6 md:py-10">
                <div className="container mx-auto px-4">
                    <Link to="/products" className="block">
                        <div className="relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow duration-300 group">
                            {/* Image Banner */}
                            <img
                                src="/banner-offers.png"
                                alt="عروض حصرية - وفّر حتى 30% على تكييفات الموسم"
                                className="w-full h-auto object-cover min-h-[200px] md:min-h-[300px] lg:min-h-[400px]"
                            />
                            {/* Overlay with CTA */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent flex items-center">
                                <div className="p-6 md:p-10">
                                    <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold gap-2 h-12 px-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        تسوق الآن
                                        <ArrowLeft className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </section>
        );
    }

    // Installation variant
    return (
        <section className="py-6 md:py-10">
            <div className="container mx-auto px-4">
                <Link to="/contact" className="block">
                    <div className="relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 group">
                        {/* Image Banner */}
                        <img
                            src="/banner-installation.png"
                            alt="تركيب مجاني لجميع المحافظات"
                            className="w-full h-auto object-cover min-h-[200px] md:min-h-[300px] lg:min-h-[400px]"
                        />
                        {/* Overlay with CTA */}
                        <div className="absolute inset-0 bg-gradient-to-l from-black/30 via-transparent to-transparent flex items-center justify-end">
                            <div className="p-6 md:p-10">
                                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-2 h-12 px-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    تواصل معنا
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        </section>
    );
};

export default PromoBanner;
