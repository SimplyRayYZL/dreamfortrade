import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageBanner from "@/components/common/PageBanner";
import { Building2, Users, Award, Target, CheckCircle, Phone, MapPin, Clock, Sparkles, Trophy, Heart, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { usePageBanner, defaultPageBanners } from "@/hooks/usePageBanner";
import aboutBanner from "@/assets/banners/about-banner.jpg";
import { Button } from "@/components/ui/button";

const stats = [
  { icon: Building2, value: "15+", label: "سنة خبرة", color: "from-blue-500 to-cyan-500" },
  { icon: Users, value: "50,000+", label: "عميل سعيد", color: "from-green-500 to-emerald-500" },
  { icon: Award, value: "9", label: "ماركة معتمدة", color: "from-orange-500 to-amber-500" },
  { icon: Target, value: "100%", label: "ضمان الجودة", color: "from-purple-500 to-violet-500" },
];

const values = [
  { icon: Trophy, title: "الجودة", description: "نلتزم بتقديم منتجات أصلية ومعتمدة من أفضل الماركات العالمية", color: "text-yellow-500" },
  { icon: Heart, title: "الثقة", description: "بنينا سمعتنا على الصدق والشفافية في التعامل مع عملائنا", color: "text-rose-500" },
  { icon: Zap, title: "الخدمة", description: "نوفر خدمة ما بعد البيع المتميزة والدعم الفني المستمر", color: "text-blue-500" },
  { icon: Sparkles, title: "الأسعار", description: "نقدم أفضل الأسعار التنافسية مع الحفاظ على الجودة العالية", color: "text-green-500" },
];

const timeline = [
  { year: "2009", title: "البداية", description: "تأسست الشركة برؤية واضحة لتقديم أفضل حلول التكييف" },
  { year: "2014", title: "التوسع", description: "افتتاح فروع جديدة وتوسيع نطاق الخدمات" },
  { year: "2019", title: "الريادة", description: "أصبحنا الوكيل المعتمد لأكبر الماركات العالمية" },
  { year: "2024", title: "الابتكار", description: "إطلاق خدمات جديدة وتحديث أنظمة التوصيل والتركيب" },
];

const About = () => {
  const { data: pageBanner } = usePageBanner("about");

  return (
    <>
      <Helmet>
        <title>من نحن | دريم للتجارة والتوريدات - خبرة 15 عاماً في حلول التبريد</title>
        <meta name="description" content="تعرف على شركة دريم للتجارة والتوريدات في مصر. خبرة أكثر من 15 عاماً في توريد وتركيب تكييفات كاريير، هاير، وميديا بأفضل جودة وأنسب سعر." />
        <link rel="canonical" href="https://dreamfortrade.com/about" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {/* Page Banner */}
          <PageBanner
            title={pageBanner?.title || defaultPageBanners.about.title}
            subtitle={pageBanner?.subtitle || defaultPageBanners.about.subtitle}
            backgroundImage={pageBanner?.image_url || aboutBanner}
            breadcrumbs={[{ label: "من نحن" }]}
          />

          {/* Stats Section - Premium Cards */}
          <section className="py-12 -mt-16 relative z-10">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {stats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 text-center opacity-0 animate-[scale-in_0.5s_ease-out_forwards]"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                      <stat.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-foreground mb-1">{stat.value}</h3>
                    <p className="text-muted-foreground text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* About Content - Modern Layout */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Text Content */}
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-medium">
                    <Sparkles className="h-4 w-4" />
                    <span>قصتنا</span>
                  </div>

                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                    <span className="text-secondary">دريم</span> للتجارة
                    <br />والتوريدات
                  </h2>

                  <p className="text-lg text-muted-foreground leading-relaxed">
                    شركة دريم للتجارة والتوريدات - نعمل على توفير أفضل حلول التكييف والتبريد لعملائنا في جميع أنحاء مصر منذ أكثر من 15 عاماً.
                  </p>

                  <p className="text-muted-foreground leading-relaxed">
                    نحرص على تقديم منتجات أصلية 100% مع ضمان شامل وخدمة ما بعد البيع المتميزة. فريقنا المتخصص جاهز دائماً لمساعدتك في اختيار التكييف المناسب لاحتياجاتك.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    {["منتجات أصلية ومعتمدة", "ضمان شامل حتى 5 سنوات", "توصيل وتركيب مجاني", "خدمة ما بعد البيع 24/7"].map((item, index) => (
                      <div
                        key={item}
                        className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-secondary/10 transition-colors opacity-0 animate-[slide-up_0.5s_ease-out_forwards]"
                        style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                      >
                        <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                        <span className="text-foreground text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div className="relative">
                  <div className="absolute right-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-secondary via-secondary/50 to-transparent" />

                  <div className="space-y-8">
                    {timeline.map((item, index) => (
                      <div
                        key={item.year}
                        className="relative pr-14 opacity-0 animate-[slide-up_0.5s_ease-out_forwards]"
                        style={{ animationDelay: `${0.2 + index * 0.15}s` }}
                      >
                        <div className="absolute right-0 w-12 h-12 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-sm shadow-lg">
                          {item.year}
                        </div>
                        <div className="bg-card rounded-2xl p-5 shadow-sm hover:shadow-lg transition-shadow">
                          <h4 className="font-bold text-foreground text-lg mb-2">{item.title}</h4>
                          <p className="text-muted-foreground text-sm">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Values Section - New Design */}
          <section className="py-20 bg-muted/30 overflow-hidden">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <Target className="h-4 w-4" />
                  <span>قيمنا</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  قيمنا <span className="text-secondary">ورسالتنا</span>
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  نؤمن بأن النجاح يأتي من خلال الالتزام بقيم ثابتة ورسالة واضحة
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {values.map((value, index) => (
                  <div
                    key={value.title}
                    className="group bg-card rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 opacity-0 animate-[scale-in_0.5s_ease-out_forwards]"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`w-14 h-14 rounded-xl bg-muted flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${value.color}`}>
                      <value.icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-secondary transition-colors">{value.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Info Section */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='20' cy='20' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
                  }} />
                </div>

                <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center md:text-right">
                    <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center mx-auto md:mx-0 mb-4">
                      <Phone className="h-7 w-7" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">اتصل بنا</h3>
                    <p className="text-white/80">01289006310</p>
                  </div>

                  <div className="text-center md:text-right">
                    <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center mx-auto md:mx-0 mb-4">
                      <MapPin className="h-7 w-7" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">موقعنا</h3>
                    <p className="text-white/80">مصر - القاهرة</p>
                  </div>

                  <div className="text-center md:text-right">
                    <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center mx-auto md:mx-0 mb-4">
                      <Clock className="h-7 w-7" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">ساعات العمل</h3>
                    <p className="text-white/80">24/7 طوال الأسبوع</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA - Modern Design */}
          <section className="py-20 bg-muted/50">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                هل لديك أي <span className="text-secondary">استفسار</span>؟
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                فريقنا جاهز لمساعدتك في اختيار التكييف المناسب لاحتياجاتك
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white rounded-full px-8 gap-2">
                    <Phone className="h-5 w-5" />
                    تواصل معنا
                  </Button>
                </Link>
                <Link to="/products">
                  <Button size="lg" variant="outline" className="rounded-full px-8 border-secondary text-secondary hover:bg-secondary hover:text-white">
                    تصفح المنتجات
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

export default About;
