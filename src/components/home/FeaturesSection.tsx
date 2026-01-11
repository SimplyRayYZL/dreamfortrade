import { Truck, Shield, Headphones, Wrench, Award, Sparkles } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "توصيل سريع",
    description: "توصيل سريع لجميع الطلبات",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Shield,
    title: "ضمان شامل",
    description: "ضمان حتى 5 سنوات على جميع المنتجات",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Headphones,
    title: "دعم فني 24/7",
    description: "فريق دعم متواجد على مدار الساعة",
    color: "from-purple-500 to-violet-500",
  },
  {
    icon: Wrench,
    title: "أسعار منافسة",
    description: "أفضل الأسعار في السوق المصري",
    color: "from-orange-500 to-amber-500",
  },
  {
    icon: Award,
    title: "منتجات أصلية",
    description: "وكيل معتمد لأشهر الماركات",
    color: "from-rose-500 to-pink-500",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background via-muted/30 to-background overflow-hidden relative">
      <div className="container mx-auto px-4 relative">
        {/* Section Title with Animation */}
        <div className="text-center mb-16">
          <div data-aos="zoom-in" className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            <span>مميزاتنا</span>
          </div>
          <h2 data-aos="fade-up" data-aos-delay="100" className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            ليه تختار <span className="text-secondary bg-secondary/10 px-3 py-1 rounded-lg">دريم</span>؟
          </h2>
          <p data-aos="fade-up" data-aos-delay="200" className="text-lg text-muted-foreground max-w-2xl mx-auto">
            نقدم لك أفضل الخدمات والمنتجات بأعلى جودة وأفضل سعر
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              data-aos="flip-up"
              data-aos-delay={index * 100}
              className="group relative text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-secondary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Glow effect on hover */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl`} />

              {/* Icon with animation */}
              <div className={`relative w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                <feature.icon className="h-8 w-8 text-white" />

                {/* Ring animation on hover */}
                <div className="absolute inset-0 rounded-2xl border-2 border-white/30 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500" />
              </div>

              {/* Title */}
              <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-secondary transition-colors duration-300">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Bottom accent line */}
              <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r ${feature.color} rounded-full group-hover:w-1/2 transition-all duration-500`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
