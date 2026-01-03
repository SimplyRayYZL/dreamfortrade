import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { blogArticles } from "@/data/blogArticles";

const categories = ["الكل", "دليل القدرات", "الماركات", "معلومات تقنية", "نصائح"];

const Blog = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("الكل");

    const filteredArticles = blogArticles.filter(article => {
        const matchesSearch = article.title.includes(searchTerm) ||
            article.excerpt.includes(searchTerm) ||
            article.tags.some(tag => tag.includes(searchTerm));
        const matchesCategory = selectedCategory === "الكل" || article.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <>
            <Helmet>
                <title>مدونة تارجت | مقالات عن التكييفات والصيانة - نصائح الخبراء</title>
                <meta name="description" content="مدونة تارجت لأعمال التكييف - مقالات متخصصة عن التكييفات، نصائح الصيانة، دليل الشراء، ومقارنات بين الماركات. تعلم من خبراء التكييف." />
                <meta name="keywords" content="مدونة تكييفات, نصائح تكييف, صيانة تكييف, دليل شراء تكييف, مقارنة تكييفات, هاير, كاريير, ميديا" />
                <link rel="canonical" href="https://targetaircool.com/blog" />

                <meta property="og:title" content="مدونة تارجت | مقالات عن التكييفات" />
                <meta property="og:description" content="مقالات متخصصة عن التكييفات، نصائح الصيانة، ودليل الشراء" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://targetaircool.com/blog" />

                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Blog",
                        "name": "مدونة تارجت لأعمال التكييف",
                        "description": "مقالات متخصصة عن التكييفات والصيانة",
                        "url": "https://targetaircool.com/blog",
                        "publisher": {
                            "@type": "Organization",
                            "name": "تارجت لأعمال التكييف",
                            "logo": "https://targetaircool.com/logo.png"
                        }
                    })}
                </script>
            </Helmet>

            <div className="min-h-screen flex flex-col">
                <Navbar />

                <main className="flex-grow bg-background">
                    {/* Hero Section */}
                    <section className="bg-gradient-to-br from-primary via-primary/90 to-secondary py-16">
                        <div className="container mx-auto px-4 text-center">
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                مدونة تارجت
                            </h1>
                            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
                                مقالات متخصصة عن التكييفات، نصائح الخبراء، ودليل شامل للشراء والصيانة
                            </p>

                            {/* Search */}
                            <div className="max-w-md mx-auto relative">
                                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="ابحث في المقالات..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pr-10 bg-white/95 border-0"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Categories */}
                    <section className="py-6 border-b bg-muted/30">
                        <div className="container mx-auto px-4">
                            <div className="flex flex-wrap gap-2 justify-center">
                                {categories.map((category) => (
                                    <Badge
                                        key={category}
                                        variant={selectedCategory === category ? "default" : "outline"}
                                        className="cursor-pointer px-4 py-2 text-sm hover:bg-secondary hover:text-white transition-colors"
                                        onClick={() => setSelectedCategory(category)}
                                    >
                                        {category}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Articles Grid */}
                    <section className="py-12">
                        <div className="container mx-auto px-4">
                            {filteredArticles.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-muted-foreground text-lg">لم يتم العثور على مقالات</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredArticles.map((article) => (
                                        <Link key={article.id} to={`/blog/${article.id}`}>
                                            <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 group">
                                                <div className="aspect-video overflow-hidden">
                                                    <img
                                                        src={article.image}
                                                        alt={article.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                </div>
                                                <CardContent className="p-5">
                                                    <Badge variant="secondary" className="mb-3">
                                                        {article.category}
                                                    </Badge>
                                                    <h2 className="text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-secondary transition-colors">
                                                        {article.title}
                                                    </h2>
                                                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                                                        {article.excerpt}
                                                    </p>
                                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            <span>{new Date(article.date).toLocaleDateString('ar-EG')}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            <span>{article.readTime}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 mt-4 text-secondary text-sm font-medium group-hover:gap-2 transition-all">
                                                        <span>اقرأ المزيد</span>
                                                        <ArrowLeft className="h-4 w-4" />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="py-12 bg-gradient-to-r from-secondary to-secondary/80">
                        <div className="container mx-auto px-4 text-center">
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                هل تبحث عن تكييف جديد؟
                            </h2>
                            <p className="text-white/80 mb-6">
                                تصفح مجموعتنا من أفضل التكييفات بأفضل الأسعار
                            </p>
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-2 bg-white text-secondary px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                            >
                                تصفح المنتجات
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </>
    );
};

export default Blog;
