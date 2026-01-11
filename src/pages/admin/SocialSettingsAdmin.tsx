import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
    Share2, Save, Loader2, ArrowRight, Facebook, Instagram,
    Youtube, Twitter, MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useSiteSettings, useUpdateSettings } from "@/hooks/useSettings";
import { toast } from "sonner";

const SocialSettingsAdmin = () => {
    const { data: settings, isLoading } = useSiteSettings();
    const updateSettings = useUpdateSettings();
    const [formData, setFormData] = useState({
        facebook_url: "",
        instagram_url: "",
        tiktok_url: "",
        twitter_url: "",
        youtube_url: "",
        linkedin_url: "",
        snapchat_url: "",
        telegram_url: "",
    });

    useEffect(() => {
        if (settings) {
            setFormData({
                facebook_url: settings.facebook_url || "",
                instagram_url: settings.instagram_url || "",
                tiktok_url: settings.tiktok_url || "",
                twitter_url: settings.twitter_url || "",
                youtube_url: settings.youtube_url || "",
                linkedin_url: settings.linkedin_url || "",
                snapchat_url: settings.snapchat_url || "",
                telegram_url: settings.telegram_url || "",
            });
        }
    }, [settings]);

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateSettings.mutate(formData as any, {
            onSuccess: () => toast.success("تم حفظ الإعدادات بنجاح"),
            onError: () => toast.error("حدث خطأ أثناء الحفظ"),
        });
    };

    const platforms = [
        {
            key: "facebook_url",
            name: "Facebook",
            icon: <Facebook className="h-5 w-5" />,
            color: "from-blue-500/10 to-blue-600/20",
            iconColor: "text-blue-600",
            placeholder: "https://facebook.com/yourpage"
        },
        {
            key: "instagram_url",
            name: "Instagram",
            icon: <Instagram className="h-5 w-5" />,
            color: "from-pink-500/10 to-purple-600/20",
            iconColor: "text-pink-600",
            placeholder: "https://instagram.com/yourprofile"
        },
        {
            key: "tiktok_url",
            name: "TikTok",
            icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" /></svg>,
            color: "from-gray-900/10 to-gray-800/20",
            iconColor: "text-gray-800",
            placeholder: "https://tiktok.com/@yourprofile"
        },
        {
            key: "twitter_url",
            name: "Twitter / X",
            icon: <Twitter className="h-5 w-5" />,
            color: "from-sky-500/10 to-sky-600/20",
            iconColor: "text-sky-500",
            placeholder: "https://twitter.com/yourprofile"
        },
        {
            key: "youtube_url",
            name: "YouTube",
            icon: <Youtube className="h-5 w-5" />,
            color: "from-red-500/10 to-red-600/20",
            iconColor: "text-red-600",
            placeholder: "https://youtube.com/@yourchannel"
        },
        {
            key: "linkedin_url",
            name: "LinkedIn",
            icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>,
            color: "from-blue-700/10 to-blue-800/20",
            iconColor: "text-blue-700",
            placeholder: "https://linkedin.com/company/yourcompany"
        },
        {
            key: "snapchat_url",
            name: "Snapchat",
            icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" /></svg>,
            color: "from-yellow-500/10 to-yellow-600/20",
            iconColor: "text-yellow-500",
            placeholder: "https://snapchat.com/add/yourprofile"
        },
        {
            key: "telegram_url",
            name: "Telegram",
            icon: <MessageCircle className="h-5 w-5" />,
            color: "from-blue-500/10 to-cyan-600/20",
            iconColor: "text-blue-500",
            placeholder: "https://t.me/yourchannel"
        },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-secondary" />
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>روابط السوشيال - لوحة التحكم</title>
            </Helmet>

            <div className="min-h-screen bg-muted/30">
                {/* Header */}
                <div className="bg-card border-b sticky top-0 z-40">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Link to="/admin/settings" className="p-2 rounded-lg hover:bg-muted transition-colors">
                                    <ArrowRight className="h-5 w-5" />
                                </Link>
                                <div>
                                    <h1 className="text-xl font-bold flex items-center gap-2">
                                        <Share2 className="h-6 w-6 text-purple-500" />
                                        روابط السوشيال ميديا
                                    </h1>
                                    <p className="text-sm text-muted-foreground">روابط التواصل الاجتماعي</p>
                                </div>
                            </div>
                            <Button onClick={handleSubmit} disabled={updateSettings.isPending} className="gap-2">
                                {updateSettings.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                حفظ التغييرات
                            </Button>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="container mx-auto px-4 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {platforms.map((platform) => (
                            <Card key={platform.key} className={`bg-gradient-to-br ${platform.color} border-0`}>
                                <CardContent className="pt-4 pb-4">
                                    <div className="space-y-3">
                                        <Label className={`flex items-center gap-2 text-base font-semibold ${platform.iconColor}`}>
                                            {platform.icon}
                                            {platform.name}
                                        </Label>
                                        <Input
                                            value={formData[platform.key as keyof typeof formData]}
                                            onChange={(e) => handleChange(platform.key, e.target.value)}
                                            placeholder={platform.placeholder}
                                            className="bg-white/50"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </form>
            </div>
        </>
    );
};

export default SocialSettingsAdmin;
