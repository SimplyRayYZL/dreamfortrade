import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowLeft, BookOpen } from "lucide-react";

const featuredArticles = [
    {
        id: "best-ac-2025",
        title: "أفضل تكييفات في مصر 2025 - دليل شامل للاختيار الصحيح",
        excerpt: "دليلك الشامل لاختيار أفضل تكييف في مصر 2025. مقارنة بين الماركات مع نصائح الخبراء.",
        image: "/banner-quality.png",
        category: "دليل الشراء",
        date: "2025-01-01",
    },
    {
        id: "inverter-vs-normal",
        title: "الفرق بين تكييف الانفرتر والعادي - أيهما أفضل لك؟",
        excerpt: "تعرف على الفرق الحقيقي بين تكييف الانفرتر والتكييف العادي من حيث استهلاك الكهرباء.",
        image: "/banner-offers.png",
        category: "معلومات تقنية",
        date: "2024-12-28",
    },
    {
        id: "electricity-saving",
        title: "كيف توفر في فاتورة الكهرباء مع التكييف؟",
        excerpt: "نصائح عملية ومجربة لتوفير استهلاك الكهرباء أثناء استخدام التكييف في الصيف.",
        image: "/bg-quality.png",
        category: "نصائح",
        date: "2024-12-10",
    }
];

const BlogSection = () => {
    return (
        <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-foreground">
                            آخر مقالات <span className="text-secondary">المدونة</span>
                        </h2>
                        <p className="text-muted-foreground max-w-2xl">
                            تعرف على أحدث النصائح والمراجعات من خبراء التكييف في مصر لمساعدتك في اتخاذ القرار الصحيح
                        </p>
                    </div>
                    <Link
                        to="/blog"
                        className="flex items-center gap-2 text-secondary font-bold hover:gap-3 transition-all group"
                    >
                        <span>عرض كل المقالات</span>
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {featuredArticles.map((article) => (
                        <Link key={article.id} to={`/blog/${article.id}`} className="group">
                            <Card className="border-none shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                                <div className="aspect-video relative overflow-hidden">
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <Badge className="absolute top-4 right-4 bg-secondary">
                                        {article.category}
                                    </Badge>
                                </div>
                                <CardContent className="p-6 flex-grow flex flex-col">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                                        <Calendar className="h-3.5 w-3.5" />
                                        <span>{new Date(article.date).toLocaleDateString('ar-EG')}</span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 group-hover:text-secondary transition-colors line-clamp-2">
                                        {article.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-grow">
                                        {article.excerpt}
                                    </p>
                                    <div className="pt-4 border-t flex items-center gap-2 text-secondary text-sm font-bold">
                                        <BookOpen className="h-4 w-4" />
                                        <span>اقرأ المزيد</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BlogSection;
