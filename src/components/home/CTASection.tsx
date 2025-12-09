import { Button } from "@/components/ui/button";
import { Phone, MessageCircle } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-hero" />

      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-secondary/10 blur-2xl" />
      <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-accent/10 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground">
            هل تحتاج مساعدة في
            <br />
            <span className="text-secondary">اختيار التكييف المناسب؟</span>
          </h2>
          <p className="text-lg text-primary-foreground/80">
            فريقنا المتخصص جاهز لمساعدتك في اختيار أفضل تكييف يناسب احتياجاتك وميزانيتك
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button asChild className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-lg h-14 px-8 gap-2 font-bold">
              <a href="tel:01289006310">
                <Phone className="h-5 w-5" />
                اتصل بنا الآن
              </a>
            </Button>
            <Button asChild className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white hover:text-primary text-lg h-14 px-8 gap-2 font-medium">
              <a href="https://wa.me/201289006310" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" />
                واتساب
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
