import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
    store_name: "دريم للتجارة",
    store_name_en: "Dream For Trade",
    store_logo: "/logo.png",
    store_description: "الوكيل المعتمد لأكبر الماركات العالمية للتكييفات",
    store_slogan: "راحتك... حلمنا",
    store_address: "القاهرة، مصر",
    store_phone: "01289006310",
    store_phone_alt: "",
    store_email: "info@dreamfortrade.com",
    store_whatsapp: "201289006310",
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

    seo_title: "دريم للتجارة - تكييفات بأفضل الأسعار",
    seo_description: "الوكيل المعتمد لأكبر الماركات العالمية للتكييفات في مصر. كاريير، ميديا، شارب، فريش وأكثر.",
    seo_keywords: "تكييف، تكييفات، كاريير، ميديا، شارب، فريش، مصر",
    og_image: "/og-image.jpg",
    seo_robots: "index, follow",
    seo_canonical_url: "",
    seo_language: "ar",
    seo_author: "Dream For Trade",
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
    about_title: "عن دريم للتجارة",
    about_content: "",
    about_mission: "توفير أفضل أنظمة التكييف بأسعار تنافسية مع خدمة عملاء متميزة",
    about_vision: "أن نكون الخيار الأول للعملاء في مجال التكييفات في مصر",
    contact_title: "تواصل معنا",
    contact_subtitle: "نحن هنا لمساعدتك! تواصل معنا في أي وقت",
    footer_text: "الوكيل المعتمد لأكبر الماركات العالمية للتكييفات",
    footer_copyright: "جميع الحقوق محفوظة © دريم للتجارة",

    // Database config
    database_config: {
        supabase_url: "",
        supabase_anon_key: "",
    },
};

const SETTINGS_KEY = "site_settings";

// Get settings from localStorage
const getStoredSettings = (): SiteSettings => {
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

// Save settings to localStorage
const saveSettings = (settings: SiteSettings) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

// Fetch site settings
export const useSiteSettings = () => {
    return useQuery({
        queryKey: ["site-settings"],
        queryFn: async (): Promise<SiteSettings> => {
            return getStoredSettings();
        },
    });
};

// Update site settings
export const useUpdateSettings = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (settings: SiteSettings): Promise<SiteSettings> => {
            saveSettings(settings);
            return settings;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["site-settings"] });
        },
    });
};

// Get only active shipping areas
export const getActiveShippingAreas = (): ShippingArea[] => {
    const settings = getStoredSettings();
    return settings.shipping_areas.filter((area) => area.isActive);
};

// Get only active banners
export const getActiveBanners = (): Banner[] => {
    const settings = getStoredSettings();
    return settings.banners.filter((banner) => banner.isActive).sort((a, b) => a.order - b.order);
};

// Export default settings for initial use
export { DEFAULT_SETTINGS };
