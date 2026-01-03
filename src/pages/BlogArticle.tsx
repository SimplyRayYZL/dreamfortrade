import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight, Share2, Facebook, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getArticleById } from "@/data/blogArticles";

const BlogArticle = () => {
    const { slug } = useParams();
    const article = slug ? getArticleById(slug) : undefined;

    if (!article) {
        return (
            <>
                <Helmet>
                    <title>المقال غير موجود | مدونة تارجت</title>
                </Helmet>
                <div className="min-h-screen flex flex-col">
                    <Navbar />
                    <main className="flex-grow flex items-center justify-center">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold mb-4">المقال غير موجود</h1>
                            <Link to="/blog" className="text-secondary hover:underline">
                                العودة للمدونة
                            </Link>
                        </div>
                    </main>
                    <Footer />
                </div>
            </>
        );
    }

    const shareUrl = `https://targetaircool.com/blog/${slug}`;

    return (
        <>
            <Helmet>
                <title>{article.title} | مدونة تارجت</title>
                <meta name="description" content={article.excerpt} />
                <meta name="keywords" content={article.tags.join(", ")} />
                <link rel="canonical" href={shareUrl} />

                <meta property="og:title" content={article.title} />
                <meta property="og:description" content={article.excerpt} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={shareUrl} />
                <meta property="og:image" content={`https://targetaircool.com${article.image}`} />
                <meta property="article:published_time" content={article.date} />
                <meta property="article:tag" content={article.tags.join(", ")} />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={article.title} />
                <meta name="twitter:description" content={article.excerpt} />

                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BlogPosting",
                        "headline": article.title,
                        "description": article.excerpt,
                        "image": `https://targetaircool.com${article.image}`,
                        "datePublished": article.date,
                        "author": {
                            "@type": "Organization",
                            "name": "تارجت لأعمال التكييف"
                        },
                        "publisher": {
                            "@type": "Organization",
                            "name": "تارجت لأعمال التكييف",
                            "logo": {
                                "@type": "ImageObject",
                                "url": "https://targetaircool.com/logo.png"
                            }
                        },
                        "mainEntityOfPage": {
                            "@type": "WebPage",
                            "@id": shareUrl
                        }
                    })}
                </script>
            </Helmet>

            <div className="min-h-screen flex flex-col">
                <Navbar />

                <main className="flex-grow bg-background">
                    {/* Hero Image */}
                    <div className="w-full h-64 md:h-96 overflow-hidden">
                        <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <article className="container mx-auto px-4 py-8 max-w-4xl">
                        {/* Breadcrumb */}
                        <nav className="mb-6">
                            <Link to="/blog" className="text-secondary hover:underline flex items-center gap-1">
                                <ArrowRight className="h-4 w-4" />
                                العودة للمدونة
                            </Link>
                        </nav>

                        {/* Article Header */}
                        <header className="mb-8">
                            <Badge variant="secondary" className="mb-4">
                                {article.category}
                            </Badge>
                            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                {article.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{new Date(article.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{article.readTime}</span>
                                </div>
                            </div>
                        </header>

                        {/* Share Buttons */}
                        <div className="flex items-center gap-2 mb-8 pb-8 border-b">
                            <span className="text-sm text-muted-foreground">شارك المقال:</span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')}
                            >
                                <Facebook className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`, '_blank')}
                            >
                                <Twitter className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigator.share?.({ title: article.title, url: shareUrl })}
                            >
                                <Share2 className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Article Content */}
                        <div
                            className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-secondary"
                            dangerouslySetInnerHTML={{
                                __html: article.content
                                    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>')
                                    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-6 mb-3">$1</h3>')
                                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                    .replace(/^- (.*$)/gim, '<li class="mr-4">$1</li>')
                                    .replace(/^✅ (.*$)/gim, '<li class="mr-4 text-green-600">✅ $1</li>')
                                    .replace(/^❌ (.*$)/gim, '<li class="mr-4 text-red-600">❌ $1</li>')
                                    .replace(/\n\n/g, '</p><p class="mb-4">')
                                    .replace(/\|(.+)\|/g, (match) => {
                                        const rows = match.split('\n').filter(r => r.trim());
                                        if (rows.length < 2) return match;
                                        const headers = rows[0].split('|').filter(c => c.trim());
                                        const data = rows.slice(2).map(r => r.split('|').filter(c => c.trim()));
                                        return `<table class="min-w-full border my-4"><thead><tr>${headers.map(h => `<th class="border p-2">${h.trim()}</th>`).join('')}</tr></thead><tbody>${data.map(row => `<tr>${row.map(c => `<td class="border p-2">${c.trim()}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
                                    })
                            }}
                        />

                        {/* Tags */}
                        <div className="mt-8 pt-8 border-t">
                            <div className="flex flex-wrap gap-2">
                                {article.tags.map(tag => (
                                    <Badge key={tag} variant="outline">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Product Link */}
                        {article.filterLink && (
                            <div className="mt-8 p-6 bg-muted rounded-xl">
                                <h3 className="text-lg font-bold mb-2">تصفح المنتجات المتعلقة</h3>
                                <Link
                                    to={article.filterLink}
                                    className="inline-flex items-center gap-2 text-secondary hover:underline"
                                >
                                    عرض المنتجات
                                    <ArrowRight className="h-4 w-4 rotate-180" />
                                </Link>
                            </div>
                        )}

                        {/* CTA */}
                        <div className="mt-12 p-8 bg-gradient-to-r from-secondary to-secondary/80 rounded-xl text-center text-white">
                            <h3 className="text-2xl font-bold mb-4">هل تبحث عن تكييف جديد؟</h3>
                            <p className="mb-6 opacity-90">تصفح مجموعتنا من أفضل التكييفات بأفضل الأسعار</p>
                            <Link
                                to="/products"
                                className="inline-block bg-white text-secondary px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                            >
                                تصفح المنتجات
                            </Link>
                        </div>
                    </article>
                </main>

                <Footer />
            </div>
        </>
    );
};

export default BlogArticle;
