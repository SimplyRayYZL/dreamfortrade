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
    store_map_embed: string;
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
    hotjar_id: string;
    clarity_id: string;

    // Shipping
    shipping_areas: ShippingArea[];
    free_shipping_threshold: number;
    delivery_message: string;
    installation_fee: number;

    // Delivery Options (admin toggles)
    pickup_enabled: boolean;
    delivery_only_enabled: boolean;
    delivery_with_installation_enabled: boolean;
    free_delivery_installation_enabled: boolean;

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

const SETTINGS_KEY = "site_settings";

export interface HomepageSection {
    id: string;
    type: 'hero' | 'features' | 'about' | 'products' | 'brands' | 'testimonials' | 'blog' | 'contact' | 'stats' | 'custom' | string;
    title: string;
    subtitle?: string;
    isEnabled: boolean;
    order: number;
    content?: any; // Flexible content for specific section settings
}

// Update SiteSettings interface
export interface SiteSettings {
    id?: string;
    // ... (previous fields remain the same) ...
    // Store Info
    store_name: string;
    store_name_en: string;
    store_logo: string;
    store_description: string;
    store_slogan: string;
    store_address: string;
    store_map_embed: string;
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
    hotjar_id: string;
    clarity_id: string;

    // Shipping
    shipping_areas: ShippingArea[];
    free_shipping_threshold: number;
    delivery_message: string;
    installation_fee: number;

    // Delivery Options (admin toggles)
    pickup_enabled: boolean;
    delivery_only_enabled: boolean;
    delivery_with_installation_enabled: boolean;
    free_delivery_installation_enabled: boolean;

    // Banners
    banners: Banner[];

    // Homepage Layout
    homepage_sections: HomepageSection[];

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
    store_name: "دريم للتجارة والتوريدات",
    store_name_en: "Dream Trade & Supplies",
    store_logo: "/logo.png",
    store_description: "شركة دريم للتجارة والتوريدات",
    store_slogan: "جودة... ثقة... خدمة",
    store_address: "القاهرة، مصر",
    store_map_embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.0987738426833!2d31.235711!3d30.044419!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDAyJzM5LjkiTiAzMcKwMTQnMDguNiJF!5e0!3m2!1sar!2seg!4v1234567890",
    store_phone: "01289006310",
    store_phone_alt: "",
    store_email: "info@dreamfortrade.com",
    store_whatsapp: "201289006310",
    whatsapp_message: "مرحباً، أريد الاستفسار عن منتجاتكم",
    working_hours_from: "09:00",
    working_hours_to: "21:00",
    working_days: "السبت - الخميس",

    facebook_url: "https://www.facebook.com/DreamCommercialAgencies",
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
    hotjar_id: "",
    clarity_id: "",

    // Dynamic shipping areas
    shipping_areas: [
        { id: "cairo", name: "القاهرة", fee: 50, isActive: true },
        { id: "giza", name: "الجيزة", fee: 50, isActive: true },
    ],
    free_shipping_threshold: 10000,
    delivery_message: "التوصيل خلال 2-5 أيام عمل",
    installation_fee: 1000,

    // Delivery options (admin toggles)
    pickup_enabled: true,
    delivery_only_enabled: true,
    delivery_with_installation_enabled: true,
    free_delivery_installation_enabled: false,

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

    // Default Homepage Sections
    homepage_sections: [
        { id: 'hero', type: 'hero', title: 'الرئيسية (Hero)', isEnabled: true, order: 1 },
        { id: 'features', type: 'features', title: 'مميزاتنا', isEnabled: true, order: 2 },
        { id: 'promo1', type: 'custom', title: 'بانر عريض 1', isEnabled: true, order: 3, content: { image: '/promo1.jpg' } },
        { id: 'brands', type: 'brands', title: 'ماركاتنا', isEnabled: true, order: 4 },
        { id: 'products', type: 'products', title: 'منتجاتنا', isEnabled: true, order: 5 },
        { id: 'promo2', type: 'custom', title: 'بانر عريض 2', isEnabled: true, order: 6, content: { image: '/promo2.jpg' } },
        { id: 'testimonials', type: 'testimonials', title: 'آراء العملاء', isEnabled: true, order: 7 },
        { id: 'stats', type: 'stats', title: 'الإحصائيات', isEnabled: true, order: 8 },
        { id: 'contact', type: 'contact', title: 'تواصل معنا (CTA)', isEnabled: true, order: 10 },
    ],

    seo_title: "دريم للتجارة والتوريدات - تكييفات بأفضل الأسعار",
    seo_description: "شركة دريم للتجارة والتوريدات في مصر. كاريير، ميديا، شارب، فريش وأكثر.",
    seo_keywords: "تكييف، تكييفات، كاريير، ميديا، شارب، فريش، مصر، دريم",
    og_image: "/og-image.jpg",
    seo_robots: "index, follow",
    seo_canonical_url: "",
    seo_language: "ar",
    seo_author: "Dream Trade & Supplies",
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
    about_title: "عن دريم للتجارة والتوريدات",
    about_content: "",
    about_mission: "توفير أفضل أنظمة التكييف بأسعار تنافسية مع خدمة عملاء متميزة",
    about_vision: "أن نكون الخيار الأول للعملاء في مجال التكييفات في مصر",
    contact_title: "تواصل معنا",
    contact_subtitle: "نحن هنا لمساعدتك! تواصل معنا في أي وقت",
    footer_text: "شركة دريم للتجارة والتوريدات",
    footer_copyright: "جميع الحقوق محفوظة © دريم للتجارة والتوريدات",

    // Database config
    database_config: {
        supabase_url: "",
        supabase_anon_key: "",
    },
};

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
                const { data, error } = await (supabase as any)
                    .from("site_settings")
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
                    console.log("[Settings] Banners from DB:", data.settings.banners);
                    // Merge logic:
                    // 1. Shallow merge top-level fields
                    // 2. Intelligent merge for arrays that need to retain defaults (like homepage_sections)
                    const mergedSettings = { ...DEFAULT_SETTINGS, ...data.settings };

                    // Smart merge for homepage_sections
                    if (data.settings.homepage_sections && Array.isArray(data.settings.homepage_sections)) {
                        const savedSections = data.settings.homepage_sections;
                        const savedIds = new Set(savedSections.map((s: any) => s.id));

                        // Find sections in DEFAULT that are missing in Saved
                        const missingSections = DEFAULT_SETTINGS.homepage_sections.filter(def => !savedIds.has(def.id));

                        // Combine and sort
                        if (missingSections.length > 0) {
                            console.log("[Settings] Found missing sections, merging:", missingSections);
                            mergedSettings.homepage_sections = [...savedSections, ...missingSections];
                        }
                    }

                    const dbSettings = mergedSettings;
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
        staleTime: 0, // Always fetch fresh data
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    });
};

// Update site settings in Supabase
export const useUpdateSettings = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (settings: SiteSettings): Promise<SiteSettings> => {
            // Save to localStorage as cache
            cacheSettings(settings);

            console.log("[Settings] Saving to Supabase (update)...");
            console.log("[Settings] Banners being saved:", settings.banners);

            // Save to Supabase using UPDATE (row must exist)
            const { error } = await (supabase as any)
                .from("site_settings")
                .update({
                    settings: settings,
                    updated_at: new Date().toISOString()
                })
                .eq("id", "main");

            if (error) {
                console.error("[Settings] DB Save Error:", error);

                // If update fails, try upsert as fallback
                console.log("[Settings] Update failed, trying upsert...");
                const { error: upsertError } = await (supabase as any)
                    .from("site_settings")
                    .upsert({
                        id: "main",
                        settings: settings,
                        updated_at: new Date().toISOString()
                    });

                if (upsertError) {
                    console.error("[Settings] DB Upsert Error:", upsertError);
                    toast.error("فشل حفظ الإعدادات في قاعدة البيانات");
                    throw upsertError;
                }
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

