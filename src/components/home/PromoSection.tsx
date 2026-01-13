import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";
import { getBannerImage } from "@/lib/imageUtils";

interface PromoBannerData {
    id: string;
    section_type: 'half' | 'quarter';
    position: number;
    title: string | null;
    image_url: string | null;
    link_url: string | null;
    is_active: boolean;
    banner_group: string;
}

interface PromoSectionProps {
    group: string;  // "group1", "group2", etc.
}

const PromoSection = ({ group }: PromoSectionProps) => {
    // Fetch banners for this group
    const { data: banners, isLoading } = useQuery({
        queryKey: ["promo-section", group],
        queryFn: async () => {
            const { data, error } = await (supabase as any)
                .from("promo_banners")
                .select("*")
                .eq("banner_group", group)
                .eq("is_active", true)
                .order("position");

            if (error) {
                console.error("Error fetching promo banners:", error);
                return [];
            }

            return data as PromoBannerData[];
        },
        staleTime: 1000 * 60 * 5,
    });

    if (isLoading || !banners || banners.length === 0) {
        return null;
    }

    // Smart grid layout based on number of banners
    const getGridCols = () => {
        const count = banners.length;
        if (count === 1) return "grid-cols-1";
        if (count === 2) return "grid-cols-1 md:grid-cols-2"; // 2 large banners
        if (count === 3) return "grid-cols-1 md:grid-cols-3";
        return "grid-cols-2 md:grid-cols-4"; // 4 small banners
    };

    const isFourBanners = banners.length >= 4;

    // Check if we're on mobile (simple check)
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    return (
        <section className={isFourBanners ? "py-6 md:py-10 bg-gradient-to-b from-muted/20 to-background" : "py-10 md:py-16 bg-gradient-to-b from-muted/20 to-background"}>
            <div className={isFourBanners ? "w-full px-2 md:px-4" : "container mx-auto px-4"}>
                <div className={`grid ${getGridCols()} ${isFourBanners ? "gap-2 md:gap-3" : "gap-4 md:gap-6 lg:gap-8"}`}>
                    {banners.map((banner, index) => (
                        <Link
                            key={banner.id}
                            to={banner.link_url || "/products"}
                            data-aos="zoom-in"
                            data-aos-delay={index * 100}
                            className={isFourBanners
                                ? "group block relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
                                : "group block relative overflow-hidden rounded-2xl lg:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                            }
                        >
                            {banner.image_url ? (
                                <>
                                    <div className="aspect-square overflow-hidden bg-muted relative">
                                        <img
                                            src={getBannerImage(banner.image_url, isMobile)}
                                            alt={banner.title || "بانر ترويجي"}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            loading="lazy"
                                            width="800"
                                            height="800"
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                                            <span className="text-white font-bold text-sm md:text-base">
                                                {banner.title || "اكتشف العرض"}
                                            </span>
                                            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-secondary transition-colors">
                                                <ArrowLeft className="h-5 w-5 text-white" />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="aspect-video bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center relative overflow-hidden">
                                    {/* Pattern */}
                                    <div
                                        className="absolute inset-0 opacity-10"
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                                        }}
                                    />
                                    <div className="text-center relative z-10">
                                        <span className="text-2xl font-bold text-white mb-2 block">
                                            {banner.title || "عرض خاص"}
                                        </span>
                                        <span className="text-white/80 text-sm">اضغط للتفاصيل</span>
                                    </div>
                                </div>
                            )}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PromoSection;
