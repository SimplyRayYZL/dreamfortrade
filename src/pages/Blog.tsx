import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowLeft, Search, BookOpen, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { blogArticles } from "@/data/blogArticles";
import { Button } from "@/components/ui/button";

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

    // Featured article (first one)
    const featuredArticle = filteredArticles[0];
    const otherArticles = filteredArticles.slice(1);

    return (
        <>
            <Helmet>
                <title>مدونة دريم | مقالات عن التكييفات والصيانة - نصائح الخبراء</title>
                <meta name="description" content="مدونة دريم للتجارة والتوريدات - مقالات متخصصة عن التكييفات، نصائح الصيانة، دليل الشراء، ومقارنات بين الماركات. تعلم من خبراء التكييف." />
                <meta name="keywords" content="مدونة تكييفات, نصائح تكييف, صيانة تكييف, دليل شراء تكييف, مقارنة تكييفات, هاير, كاريير, ميديا" />
                <link rel="canonical" href="https://dreamfortrade.com/blog" />

                <meta property="og:title" content="مدونة دريم | مقالات عن التكييفات" />
                <meta property="og:description" content="مقالات متخصصة عن التكييفات، نصائح الصيانة، ودليل الشراء" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://dreamfortrade.com/blog" />

                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Blog",
                        "name": "مدونة دريم للتجارة والتوريدات",
                        "description": "مقالات متخصصة عن التكييفات والصيانة",
                        "url": "https://dreamfortrade.com/blog",
                        "publisher": {
                            "@type": "Organization",
                            "name": "دريم للتجارة والتوريدات",
                            "logo": "https://dreamfortrade.com/logo.png"
                        }
                    })}
                </script>
            </Helmet>

            <div className="min-h-screen flex flex-col">
                <Navbar />

                <main className="flex-grow bg-background">
                    {/* Hero Section - Redesigned */}
                    <section className="relative bg-gradient-to-br from-primary via-primary to-secondary py-20 overflow-hidden">
                        {/* Pattern overlay */}
                        <div
                            className="absolute inset-0 opacity-10"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                            }}
                        />

                        <div className="container mx-auto px-4 text-center relative">
                            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                                <BookOpen className="h-4 w-4" />
                                <span>مقالات ونصائح الخبراء</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                                مدونة <span className="text-secondary-foreground">دريم</span>
                            </h1>
                            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10">
                                مقالات متخصصة عن التكييفات، نصائح الخبراء، ودليل شامل للشراء والصيانة
                            </p>

                            {/* Search - Enhanced */}
                            <div className="max-w-lg mx-auto relative">
                                <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="ابحث في المقالات..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pr-12 h-14 rounded-full bg-white/95 border-0 text-lg shadow-xl"
                                />
                            </div>
                        </div>

                        {/* Floating elements */}
                        <div className="absolute top-1/4 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-secondary/30 rounded-full blur-3xl" />
                    </section>

                    {/* Categories - Pills Style */}
                    <section className="py-6 sticky top-[72px] md:top-[136px] z-40 bg-background/95 backdrop-blur-sm border-b">
                        <div className="container mx-auto px-4">
                            <div className="flex flex-wrap gap-2 justify-center">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === category
                                                ? "bg-secondary text-white shadow-lg"
                                                : "bg-muted text-muted-foreground hover:bg-secondary/10 hover:text-secondary"
                                            }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Featured Article */}
                    {featuredArticle && (
                        <section className="py-12 bg-muted/30">
                            <div className="container mx-auto px-4">
                                <Link to={`/blog/${featuredArticle.id}`}>
                                    <div className="group bg-card rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 grid grid-cols-1 lg:grid-cols-2">
                                        <div className="aspect-video lg:aspect-auto overflow-hidden">
                                            <img
                                                src={featuredArticle.image}
                                                alt={featuredArticle.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="p-8 lg:p-12 flex flex-col justify-center">
                                            <div className="flex items-center gap-3 mb-4">
                                                <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20">
                                                    {featuredArticle.category}
                                                </Badge>
                                                <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                                                    <Sparkles className="h-3 w-3 ml-1" />
                                                    مقال مميز
                                                </Badge>
                                            </div>
                                            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 group-hover:text-secondary transition-colors">
                                                {featuredArticle.title}
                                            </h2>
                                            <p className="text-muted-foreground mb-6 line-clamp-3">
                                                {featuredArticle.excerpt}
                                            </p>
                                            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>{new Date(featuredArticle.date).toLocaleDateString('ar-EG')}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4" />
                                                    <span>{featuredArticle.readTime}</span>
                                                </div>
                                            </div>
                                            <Button className="w-fit bg-secondary hover:bg-secondary/90 text-white rounded-full px-6 gap-2 group-hover:gap-3 transition-all">
                                                اقرأ المقال
                                                <ArrowLeft className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </section>
                    )}

                    {/* Articles Grid */}
                    <section className="py-12">
                        <div className="container mx-auto px-4">
                            {filteredArticles.length === 0 ? (
                                <div className="text-center py-20">
                                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                                        <BookOpen className="h-10 w-10 text-muted-foreground/50" />
                                    </div>
                                    <p className="text-muted-foreground text-lg">لم يتم العثور على مقالات</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {otherArticles.map((article, index) => (
                                        <Link
                                            key={article.id}
                                            to={`/blog/${article.id}`}
                                            className="opacity-0 animate-[scale-in_0.5s_ease-out_forwards]"
                                            style={{ animationDelay: `${index * 0.1}s` }}
                                        >
                                            <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-500 group rounded-2xl border-0 shadow-sm">
                                                <div className="aspect-video overflow-hidden">
                                                    <img
                                                        src={article.image}
                                                        alt={article.title}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>
                                                <CardContent className="p-6">
                                                    <Badge className="mb-3 bg-secondary/10 text-secondary hover:bg-secondary/20">
                                                        {article.category}
                                                    </Badge>
                                                    <h2 className="text-lg font-bold text-foreground mb-3 line-clamp-2 group-hover:text-secondary transition-colors">
                                                        {article.title}
                                                    </h2>
                                                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                                                        {article.excerpt}
                                                    </p>
                                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-3.5 w-3.5" />
                                                            <span>{new Date(article.date).toLocaleDateString('ar-EG')}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="h-3.5 w-3.5" />
                                                            <span>{article.readTime}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 mt-4 text-secondary text-sm font-medium group-hover:gap-3 transition-all">
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

                    {/* CTA Section - Redesigned */}
                    <section className="py-16 bg-gradient-to-br from-secondary via-secondary to-accent">
                        <div className="container mx-auto px-4 text-center">
                            <div className="max-w-2xl mx-auto">
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                    هل تبحث عن تكييف جديد؟
                                </h2>
                                <p className="text-white/80 mb-8 text-lg">
                                    تصفح مجموعتنا من أفضل التكييفات بأفضل الأسعار مع ضمان 5 سنوات
                                </p>
                                <Link to="/products">
                                    <Button size="lg" className="bg-white text-secondary hover:bg-white/90 rounded-full px-8 gap-2 font-bold">
                                        تصفح المنتجات
                                        <ArrowLeft className="h-5 w-5" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </>
    );
};

export default Blog;
