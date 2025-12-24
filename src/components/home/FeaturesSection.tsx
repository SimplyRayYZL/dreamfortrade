import { Truck, Shield, Headphones, Wrench, Award } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "توصيل سريع",
    description: "توصيل مجاني لجميع أنحاء الجمهورية",
  },
  {
    icon: Shield,
    title: "ضمان شامل",
    description: "ضمان حتى 5 سنوات على جميع المنتجات",
  },
  {
    icon: Wrench,
    title: "تركيب مجاني",
    description: "فريق متخصص للتركيب والصيانة",
  },
  {
    icon: Headphones,
    title: "دعم فني 24/7",
    description: "فريق دعم متواجد على مدار الساعة",
  },
  {
    icon: Award,
    title: "منتجات أصلية",
    description: "وكيل معتمد لأشهر الماركات",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-muted/50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="text-center group opacity-0 animate-[slide-up_0.6s_ease-out_forwards]"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-secondary/20 to-accent/10 flex items-center justify-center group-hover:from-secondary group-hover:to-accent transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl">
                <feature.icon className="h-8 w-8 text-secondary group-hover:text-secondary-foreground transition-colors duration-300" />
              </div>
              <h3 className="font-bold text-foreground mb-2 group-hover:text-secondary transition-colors">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
