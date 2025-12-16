import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ShippingArea {
    id: string;
    name: string;
    fee: number;
    isActive: boolean;
}

export interface Banner {
    id: string;
    image: string;
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
    isActive: boolean;
    order: number;
}

export interface DatabaseConfig {
    supabase_url: string;
    supabase_anon_key: string;
}

export interface SiteSettings {
    id?: string;
    // Store Info
    store_name: string;
    store_name_en: string;
    store_logo: string;
    store_description: string;
    store_slogan: string;
    store_address: string;
    store_phone: string;
    store_phone_alt: string;
    store_email: string;
    store_whatsapp: string;
    whatsapp_message: string;
    working_hours_from: string;
    working_hours_to: string;
    working_days: string;

    // Social Media
    facebook_url: string;
    instagram_url: string;
    tiktok_url: string;
    twitter_url: string;
    youtube_url: string;
    linkedin_url: string;
    snapchat_url: string;
    telegram_url: string;

    // Google & Analytics
    google_analytics_id: string;
    google_tag_manager_id: string;
    google_search_console: string;
    google_merchant_id: string;
    facebook_pixel_id: string;
    tiktok_pixel_id: string;
    snapchat_pixel_id: string;

    // Shipping
    shipping_areas: ShippingArea[];
    free_shipping_threshold: number;
    delivery_message: string;

    // Banners
    banners: Banner[];

    // SEO
    seo_title: string;
    seo_description: string;
    seo_keywords: string;
    og_image: string;
    seo_robots: string;
    seo_canonical_url: string;
    seo_language: string;
    seo_author: string;
    structured_data_enabled: boolean;
    sitemap_enabled: boolean;
    google_verification_file_name: string;
    google_verification_file_content: string;

    // Content
    homepage_hero_title: string;
    homepage_hero_subtitle: string;
    homepage_features_title: string;
    homepage_products_title: string;
    homepage_brands_title: string;
    about_title: string;
    about_content: string;
    about_mission: string;
    about_vision: string;
    contact_title: string;
    contact_subtitle: string;
    footer_text: string;
    footer_copyright: string;

    // Database
    database_config: DatabaseConfig;
}

const DEFAULT_SETTINGS: SiteSettings = {
    store_name: "تارجت لأعمال التكييف",
    store_name_en: "Target Air Conditioning",
    store_logo: "/logo.png",
    store_description: "شركة تارجت لأعمال التكييف",
    store_slogan: "جودة... ثقة... خدمة",
    store_address: "القاهرة، مصر",
    store_phone: "01208000550",
    store_phone_alt: "",
    store_email: "info@target-ac.com",
    store_whatsapp: "201208000550",
    whatsapp_message: "مرحباً، أريد الاستفسار عن منتجاتكم",
    working_hours_from: "09:00",
    working_hours_to: "21:00",
    working_days: "السبت - الخميس",

    facebook_url: "",
    instagram_url: "",
    tiktok_url: "",
    twitter_url: "",
    youtube_url: "",
    linkedin_url: "",
    snapchat_url: "",
    telegram_url: "",

    google_analytics_id: "",
    google_tag_manager_id: "",
    google_search_console: "",
    google_merchant_id: "",
    facebook_pixel_id: "",
    tiktok_pixel_id: "",
    snapchat_pixel_id: "",

    // Dynamic shipping areas
    shipping_areas: [
        { id: "cairo", name: "القاهرة", fee: 50, isActive: true },
        { id: "giza", name: "الجيزة", fee: 50, isActive: true },
    ],
    free_shipping_threshold: 10000,
    delivery_message: "التوصيل خلال 2-5 أيام عمل",

    // Default banners
    banners: [
        {
            id: "1",
            image: "/banner-carrier.png",
            title: "تكييفات كاريير",
            subtitle: "أفضل تكييفات في مصر بأسعار منافسة",
            buttonText: "تسوق الآن",
            buttonLink: "/products",
            isActive: true,
            order: 1,
        },
    ],

    seo_title: "تارجت لأعمال التكييف - تكييفات بأفضل الأسعار",
    seo_description: "شركة تارجت لأعمال التكييف في مصر. كاريير، ميديا، شارب، فريش وأكثر.",
    seo_keywords: "تكييف، تكييفات، كاريير، ميديا، شارب، فريش، مصر، تارجت",
    og_image: "/og-image.jpg",
    seo_robots: "index, follow",
    seo_canonical_url: "",
    seo_language: "ar",
    seo_author: "Target Air Conditioning",
    structured_data_enabled: true,
    sitemap_enabled: true,
    google_verification_file_name: "",
    google_verification_file_content: "",

    // Enhanced content
    homepage_hero_title: "تكييفات بأفضل الأسعار",
    homepage_hero_subtitle: "اكتشف مجموعتنا الواسعة من التكييفات العالمية",
    homepage_features_title: "لماذا تختارنا؟",
    homepage_products_title: "أحدث المنتجات",
    homepage_brands_title: "الماركات المتوفرة",
    about_title: "عن تارجت لأعمال التكييف",
    about_content: "",
    about_mission: "توفير أفضل أنظمة التكييف بأسعار تنافسية مع خدمة عملاء متميزة",
    about_vision: "أن نكون الخيار الأول للعملاء في مجال التكييفات في مصر",
    contact_title: "تواصل معنا",
    contact_subtitle: "نحن هنا لمساعدتك! تواصل معنا في أي وقت",
    footer_text: "شركة تارجت لأعمال التكييف",
    footer_copyright: "جميع الحقوق محفوظة © تارجت لأعمال التكييف",

    // Database config
    database_config: {
        supabase_url: "",
        supabase_anon_key: "",
    },
};

const SETTINGS_KEY = "site_settings";

// Get settings from localStorage as fallback
const getLocalSettings = (): SiteSettings => {
    try {
        const stored = localStorage.getItem(SETTINGS_KEY);
        if (stored) {
            return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
        }
        return DEFAULT_SETTINGS;
    } catch {
        return DEFAULT_SETTINGS;
    }
};

// Save settings to localStorage as cache
const cacheSettings = (settings: SiteSettings) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

// Fetch site settings from Supabase
export const useSiteSettings = () => {
    return useQuery({
        queryKey: ["site-settings"],
        queryFn: async (): Promise<SiteSettings> => {
            try {
                console.log("[Settings] Fetching settings from Supabase...");
                const { data, error } = await (supabase
                    .from("site_settings") as any)
                    .select("settings")
                    .eq("id", "main")
                    .single();

                console.log("[Settings] Supabase response:", { data, error });

                if (error) {
                    console.error("[Settings] Supabase error:", error);
                    return getLocalSettings();
                }

                // Check if data.settings exists and has content
                if (data && data.settings && Object.keys(data.settings).length > 0) {
                    console.log("[Settings] Using DB settings:", data.settings);
                    const dbSettings = { ...DEFAULT_SETTINGS, ...data.settings };
                    cacheSettings(dbSettings);
                    return dbSettings;
                } else {
                    console.log("[Settings] DB settings empty, using localStorage/defaults");
                    return getLocalSettings();
                }
            } catch (e) {
                console.error("[Settings] Exception:", e);
                return getLocalSettings();
            }
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: true,
    });
};

// Update site settings in Supabase
export const useUpdateSettings = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (settings: SiteSettings): Promise<SiteSettings> => {
            // Save to localStorage as cache
            cacheSettings(settings);

            // Save to Supabase
            const { error } = await (supabase
                .from("site_settings") as any)
                .upsert({
                    id: "main",
                    settings: settings,
                    updated_at: new Date().toISOString()
                });

            if (error) {
                console.error("Error saving settings:", error);
                toast.error("فشل حفظ الإعدادات في قاعدة البيانات");
                throw error;
            }

            toast.success("تم حفظ الإعدادات بنجاح");
            return settings;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["site-settings"] });
        },
        onError: () => {
            toast.error("حدث خطأ أثناء حفظ الإعدادات");
        }
    });
};

// Get only active shipping areas
export const getActiveShippingAreas = (): ShippingArea[] => {
    const settings = getLocalSettings();
    return settings.shipping_areas.filter((area) => area.isActive);
};

// Get only active banners
export const getActiveBanners = (): Banner[] => {
    const settings = getLocalSettings();
    return settings.banners.filter((banner) => banner.isActive).sort((a, b) => a.order - b.order);
};

// Export default settings for initial use
export { DEFAULT_SETTINGS };

