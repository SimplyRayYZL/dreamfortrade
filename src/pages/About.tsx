import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageBanner from "@/components/common/PageBanner";
import { Building2, Users, Award, Target, CheckCircle, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import aboutBanner from "@/assets/banners/about-banner.jpg";

const stats = [
  { icon: Building2, value: "15+", label: "سنة خبرة" },
  { icon: Users, value: "50,000+", label: "عميل سعيد" },
  { icon: Award, value: "9", label: "ماركة معتمدة" },
  { icon: Target, value: "100%", label: "ضمان الجودة" },
];

const values = [
  { title: "الجودة", description: "نلتزم بتقديم منتجات أصلية ومعتمدة من أفضل الماركات العالمية" },
  { title: "الثقة", description: "بنينا سمعتنا على الصدق والشفافية في التعامل مع عملائنا" },
  { title: "الخدمة", description: "نوفر خدمة ما بعد البيع المتميزة والدعم الفني المستمر" },
  { title: "الأسعار", description: "نقدم أفضل الأسعار التنافسية مع الحفاظ على الجودة العالية" },
];

const About = () => {
  return (
    <>
      <Helmet>
        <title>عن الشركة | Dream For Trade - الوكيل المعتمد للتكييفات</title>
        <meta name="description" content="تعرف على شركة Dream For Trade - الوكيل المعتمد لأكبر الماركات العالمية للتكييفات في مصر منذ أكثر من 15 عام" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {/* Page Banner */}
          <PageBanner
            title="عن الشركة"
            subtitle="تعرف علينا أكثر واكتشف قصتنا ورحلتنا نحو التميز"
            backgroundImage={aboutBanner}
          />

          {/* About Content */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Text Content */}
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                    <span className="text-secondary">Dream For Trade</span>
                    <br />
                    وكيلك المعتمد للتكييفات
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    منذ أكثر من 15 عاماً، نعمل في Dream For Trade على توفير أفضل حلول التكييف والتبريد لعملائنا في جميع أنحاء مصر. نفتخر بكوننا الوكيل المعتمد لأشهر الماركات العالمية.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    نحرص على تقديم منتجات أصلية 100% مع ضمان شامل وخدمة ما بعد البيع المتميزة. فريقنا المتخصص جاهز دائماً لمساعدتك في اختيار التكييف المناسب لاحتياجاتك.
                  </p>
                  <div className="space-y-3 pt-4">
                    {["منتجات أصلية ومعتمدة", "ضمان شامل حتى 5 سنوات", "توصيل وتركيب مجاني", "خدمة ما بعد البيع 24/7"].map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                        <span className="text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <div
                      key={stat.label}
                      className="card-dream text-center animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-secondary/20 to-accent/10 flex items-center justify-center">
                        <stat.icon className="h-8 w-8 text-secondary" />
                      </div>
                      <h3 className="text-3xl font-bold text-secondary mb-2">{stat.value}</h3>
                      <p className="text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="py-16 bg-muted/50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="section-title">قيمنا <span className="text-secondary">ورسالتنا</span></h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  نؤمن بأن النجاح يأتي من خلال الالتزام بقيم ثابتة ورسالة واضحة
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {values.map((value, index) => (
                  <div
                    key={value.title}
                    className="card-dream text-center animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <h3 className="text-xl font-bold text-foreground mb-3">{value.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-20 gradient-hero text-primary-foreground">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">هل لديك أي استفسار؟</h2>
              <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                فريقنا جاهز لمساعدتك في اختيار التكييف المناسب لاحتياجاتك
              </p>
              <Link to="/contact" className="btn-dream-primary inline-flex">
                <Phone className="h-5 w-5" />
                تواصل معنا
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default About;
