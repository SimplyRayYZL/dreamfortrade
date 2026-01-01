import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight, Share2, Facebook, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

// Article content - can be moved to database/CMS later
const articlesContent: Record<string, {
    title: string;
    excerpt: string;
    image: string;
    category: string;
    date: string;
    readTime: string;
    tags: string[];
    content: string;
}> = {
    "best-ac-2025": {
        title: "أفضل تكييفات في مصر 2025 - دليل شامل للاختيار الصحيح",
        excerpt: "دليلك الشامل لاختيار أفضل تكييف في مصر 2025. مقارنة بين كاريير وهاير وميديا وشارب مع نصائح الخبراء.",
        image: "/banner-quality.png",
        category: "دليل الشراء",
        date: "2025-01-01",
        readTime: "8 دقائق",
        tags: ["تكييفات", "دليل الشراء", "2025", "مقارنة"],
        content: `
## مقدمة

مع ارتفاع درجات الحرارة في مصر، أصبح التكييف ضرورة وليس رفاهية. لكن مع تعدد الماركات والموديلات، كيف تختار التكييف المناسب؟

## أفضل ماركات التكييفات في مصر 2025

### 1. تكييفات هاير (Haier)
تعتبر هاير من أفضل الماركات من حيث القيمة مقابل السعر. تتميز بـ:
- تقنية الانفرتر للتوفير في الكهرباء
- ضمان 5 سنوات
- خاصية البلازما للتعقيم
- أسعار تنافسية

### 2. تكييفات كاريير (Carrier)
كاريير هي الماركة الأشهر في مصر:
- جودة عالية ومتانة
- قطع غيار متوفرة
- خدمة ما بعد البيع ممتازة

### 3. تكييفات ميديا (Midea)
ميديا تقدم تكييفات عالية الجودة بأسعار معقولة:
- تقنية حديثة
- تصميم أنيق
- كفاءة في استهلاك الطاقة

## كيف تختار التكييف المناسب؟

### 1. حدد المساحة
- غرفة 12 متر: 1.5 حصان
- غرفة 18 متر: 2.25 حصان
- صالة 24 متر: 3 حصان

### 2. انفرتر أم عادي؟
- **الانفرتر**: توفير 60% كهرباء، هادئ، سعر أعلى
- **العادي**: سعر أقل، استهلاك أعلى

### 3. بارد فقط أم بارد/ساخن؟
إذا كنت تحتاج التدفئة في الشتاء، اختر بارد/ساخن.

## الخلاصة

اختيار التكييف المناسب يعتمد على احتياجاتك وميزانيتك. ننصح بتكييفات هاير للباحثين عن أفضل قيمة، وكاريير للباحثين عن الجودة العالية.

**للحصول على أفضل الأسعار، تواصل معنا الآن!**
    `
    },
    "inverter-vs-normal": {
        title: "الفرق بين تكييف الانفرتر والعادي - أيهما أفضل لك؟",
        excerpt: "تعرف على الفرق الحقيقي بين تكييف الانفرتر والتكييف العادي من حيث استهلاك الكهرباء والأداء والسعر.",
        image: "/banner-offers.png",
        category: "معلومات تقنية",
        date: "2024-12-28",
        readTime: "6 دقائق",
        tags: ["انفرتر", "توفير الكهرباء", "تقنية"],
        content: `
## ما هو تكييف الانفرتر؟

تكييف الانفرتر هو تكييف يستخدم تقنية متقدمة للتحكم في سرعة الكمبريسور، مما يوفر في استهلاك الكهرباء بشكل كبير.

## الفرق الرئيسي

### التكييف العادي
- الكمبريسور يعمل بسرعة واحدة (تشغيل/إيقاف)
- يستهلك كهرباء أكثر
- صوت أعلى عند التشغيل
- سعر أقل

### تكييف الانفرتر
- الكمبريسور يعمل بسرعات متغيرة
- يوفر حتى 60% من الكهرباء
- تشغيل هادئ جداً
- تبريد أسرع
- عمر افتراضي أطول

## مقارنة استهلاك الكهرباء

| النوع | استهلاك شهري تقريبي |
|-------|---------------------|
| عادي 1.5 حصان | 400-500 كيلووات |
| انفرتر 1.5 حصان | 150-200 كيلووات |

## متى تختار الانفرتر؟

اختر الانفرتر إذا:
- تستخدم التكييف لساعات طويلة يومياً
- تريد توفير في فاتورة الكهرباء
- تحتاج تشغيل هادئ

## متى تختار العادي؟

اختر العادي إذا:
- ميزانيتك محدودة
- تستخدم التكييف لساعات قليلة
- لا تهتم كثيراً بالصوت

## الخلاصة

الانفرتر هو الخيار الأفضل على المدى الطويل رغم سعره الأعلى، لأن التوفير في الكهرباء سيعوض فرق السعر خلال سنتين تقريباً.
    `
    },
    "ac-maintenance-tips": {
        title: "نصائح ذهبية للحفاظ على تكييفك - صيانة التكييف في المنزل",
        excerpt: "تعلم كيف تحافظ على تكييفك وتطيل عمره الافتراضي مع نصائح الخبراء للصيانة الدورية في المنزل.",
        image: "/banner-support.png",
        category: "صيانة",
        date: "2024-12-25",
        readTime: "5 دقائق",
        tags: ["صيانة", "نصائح", "تنظيف"],
        content: `
## أهمية صيانة التكييف

الصيانة الدورية للتكييف تضمن:
- كفاءة تبريد عالية
- توفير في استهلاك الكهرباء
- إطالة عمر الجهاز
- هواء نظيف وصحي

## نصائح الصيانة المنزلية

### 1. تنظيف الفلاتر
**كل أسبوعين إلى شهر:**
- افصل الكهرباء
- أخرج الفلتر
- اغسله بالماء والصابون
- جففه تماماً قبل التركيب

### 2. تنظيف الوحدة الخارجية
**كل 3 أشهر:**
- أزل الأتربة والأوراق
- استخدم خرطوم مياه بضغط خفيف
- تأكد من عدم انسداد فتحات التهوية

### 3. فحص التسريبات
- راقب وجود تسريب مياه
- تحقق من خرطوم الصرف
- نظف الخرطوم إذا كان مسدوداً

### 4. درجة الحرارة المثالية
- اضبط التكييف على 24-26 درجة
- لا تضبطه على درجة منخفضة جداً
- استخدم وضع الـ Eco إن وجد

## متى تستدعي فني صيانة؟

استدعِ فني متخصص عند:
- ضعف التبريد الملحوظ
- أصوات غريبة
- تسريب الفريون
- توقف الكمبريسور

## الصيانة الدورية السنوية

ننصح بصيانة احترافية مرة سنوياً تشمل:
- فحص الفريون وشحنه إن لزم
- تنظيف عميق للوحدتين
- فحص الكهرباء والتوصيلات
- تشحيم المحرك

**للحصول على خدمة صيانة احترافية، تواصل معنا!**
    `
    },
    "ac-size-guide": {
        title: "كيف تختار حجم التكييف المناسب لغرفتك؟",
        excerpt: "دليل عملي لاختيار قدرة التكييف المناسبة (1.5 حصان، 2.25 حصان، 3 حصان) حسب مساحة الغرفة.",
        image: "/banner-installation.png",
        category: "دليل الشراء",
        date: "2024-12-20",
        readTime: "4 دقائق",
        tags: ["حجم التكييف", "القدرة", "المساحة"],
        content: `
## لماذا الحجم مهم؟

اختيار حجم التكييف الصحيح يضمن:
- تبريد فعال ومريح
- استهلاك كهرباء مناسب
- عمر أطول للجهاز

## جدول اختيار حجم التكييف

| المساحة | القدرة المناسبة |
|---------|-----------------|
| 8-12 متر | 1.5 حصان |
| 13-18 متر | 2.25 حصان |
| 19-24 متر | 3 حصان |
| 25-30 متر | 4 حصان |
| 31-36 متر | 5 حصان |

## عوامل تؤثر على الاختيار

### 1. موقع الغرفة
- الدور الأخير: زد نصف حصان
- واجهة شمسية: زد نصف حصان

### 2. النوافذ
- نوافذ كبيرة: زد القدرة
- نوافذ معرضة للشمس: زد القدرة

### 3. عدد الأشخاص
- كل شخص إضافي = 400 BTU

### 4. الأجهزة الكهربائية
- المطبخ: زد القدرة
- أجهزة كثيرة: زد القدرة

## أمثلة عملية

### غرفة نوم 12 متر - دور متوسط
**الاختيار**: 1.5 حصان

### صالة 20 متر - دور أخير
**الاختيار**: 3 حصان (بدلاً من 2.25)

### مكتب 15 متر - 4 أشخاص
**الاختيار**: 2.25 حصان

## نصيحة مهمة

**لا تختار تكييف أصغر من اللازم** لتوفير المال، لأنه:
- لن يبرد جيداً
- سيستهلك كهرباء أكثر
- سيتلف أسرع

**استشرنا مجاناً لاختيار الحجم المناسب!**
    `
    },
    "haier-review": {
        title: "مراجعة شاملة لتكييفات هاير 2025 - المميزات والعيوب",
        excerpt: "مراجعة تفصيلية لتكييفات هاير في مصر: الأسعار، المميزات، العيوب، وآراء المستخدمين.",
        image: "/banner-quality-large.png",
        category: "مراجعات",
        date: "2024-12-15",
        readTime: "7 دقائق",
        tags: ["هاير", "مراجعة", "تقييم"],
        content: `
## نبذة عن هاير

هاير (Haier) شركة صينية عملاقة، تعد من أكبر مصنعي الأجهزة المنزلية في العالم. تتميز منتجاتها بالجودة العالية والأسعار التنافسية.

## موديلات هاير المتاحة

### 1. هاير سوبر كوول (Super Cool)
- بارد فقط
- اقتصادي
- مناسب للميزانيات المحدودة

### 2. هاير بارد/ساخن
- تبريد وتدفئة
- عملي طوال السنة
- سعر متوسط

### 3. هاير انفرتر
- توفير 60% كهرباء
- هادئ جداً
- تبريد سريع

### 4. هاير انفرتر أسود
- تصميم أنيق
- نفس مميزات الانفرتر
- للديكورات الحديثة

## المميزات

✅ **توفير الطاقة**: تقنيات توفير الكهرباء
✅ **ضمان 5 سنوات**: ضمان شامل على الكمبريسور
✅ **تقنية البلازما**: تعقيم الهواء وقتل البكتيريا
✅ **كمبريسور تروبيكال**: يعمل حتى 50 درجة
✅ **تحكم WIFI**: التحكم عبر الموبايل
✅ **أسعار تنافسية**: أرخص من الماركات المماثلة

## العيوب

❌ قطع الغيار أقل انتشاراً من كاريير
❌ بعض الموديلات صوتها أعلى قليلاً

## أسعار تكييفات هاير 2025

| الموديل | السعر التقريبي |
|---------|---------------|
| 1.5 حصان بارد | من 15,000 جنيه |
| 1.5 حصان بارد/ساخن | من 17,000 جنيه |
| 1.5 حصان انفرتر | من 22,000 جنيه |

## تقييمنا النهائي

⭐⭐⭐⭐ (4/5)

تكييفات هاير تقدم أفضل قيمة مقابل السعر في السوق المصري. ننصح بها لمن يبحث عن جودة عالية بسعر معقول.

**اطلب تكييف هاير الآن من تارجت بأفضل سعر!**
    `
    },
    "electricity-saving": {
        title: "كيف توفر في فاتورة الكهرباء مع التكييف؟",
        excerpt: "نصائح عملية ومجربة لتوفير استهلاك الكهرباء أثناء استخدام التكييف في الصيف.",
        image: "/bg-quality.png",
        category: "نصائح",
        date: "2024-12-10",
        readTime: "5 دقائق",
        tags: ["توفير", "كهرباء", "نصائح"],
        content: `
## مقدمة

فاتورة الكهرباء في الصيف مصدر قلق للجميع. إليك نصائح مجربة لتوفير الكهرباء مع الاستمتاع بالتبريد.

## نصائح لتوفير الكهرباء

### 1. اختر درجة حرارة مناسبة
- **24-26 درجة** هي الدرجة المثالية
- كل درجة أقل = 5-8% كهرباء أكثر
- لا تضبط على 16 درجة!

### 2. استخدم وضع Eco
- معظم التكييفات الحديثة بها وضع Eco
- يوفر حتى 30% من الكهرباء

### 3. أغلق النوافذ والأبواب
- الهواء الساخن يضاعف الاستهلاك
- استخدم ستائر عازلة
- أغلق النوافذ المواجهة للشمس

### 4. نظف الفلاتر بانتظام
- فلتر متسخ = استهلاك أعلى 15%
- نظفه كل أسبوعين

### 5. استخدم المروحة مع التكييف
- المروحة توزع الهواء البارد
- يمكنك رفع درجة التكييف درجتين

### 6. أطفئ التكييف عند الخروج
- لا تترك التكييف يعمل في غرفة فارغة
- استخدم التايمر

### 7. اختر تكييف انفرتر
- يوفر حتى 60% من الكهرباء
- استثمار يستحق

## مقارنة الاستهلاك

| الطريقة | التوفير |
|---------|---------|
| درجة 24 بدل 20 | 20% |
| وضع Eco | 30% |
| فلاتر نظيفة | 15% |
| انفرتر | 60% |

## حساب تقريبي

**تكييف 1.5 حصان عادي (8 ساعات/يوم)**:
- بدون توفير: ~600 جنيه/شهر
- مع النصائح: ~400 جنيه/شهر
- انفرتر + نصائح: ~200 جنيه/شهر

## الخلاصة

التوفير في فاتورة الكهرباء ممكن بخطوات بسيطة. أهم نصيحة: اختر تكييف انفرتر واستخدمه بذكاء.

**تصفح تكييفات الانفرتر الموفرة لدينا!**
    `
    }
};

const BlogArticle = () => {
    const { slug } = useParams();
    const article = slug ? articlesContent[slug] : null;

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
                                    .replace(/^\*\*(.*)\*\*/gim, '<strong>$1</strong>')
                                    .replace(/^- (.*$)/gim, '<li class="mr-4">$1</li>')
                                    .replace(/^✅ (.*$)/gim, '<li class="mr-4 text-green-600">✅ $1</li>')
                                    .replace(/^❌ (.*$)/gim, '<li class="mr-4 text-red-600">❌ $1</li>')
                                    .replace(/\n\n/g, '</p><p class="mb-4">')
                                    .replace(/\|.*\|/g, (match) => `<div class="overflow-x-auto my-4"><table class="min-w-full border">${match}</table></div>`)
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
