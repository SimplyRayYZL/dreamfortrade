import { Button } from "@/components/ui/button";
import { ArrowLeft, Snowflake } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/banners/hero-banner.jpg";

const HeroBanner = () => {
  return (
    <section className="relative min-h-[650px] lg:min-h-[750px] overflow-hidden">
      {/* Background Image with parallax effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 animate-[slow-zoom_20s_ease-in-out_infinite_alternate]"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-primary/80" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-20"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.5}s`,
            }}
          >
            <Snowflake className="h-8 w-8 md:h-12 md:w-12 text-white" />
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 h-full relative z-10">
        <div className="flex items-center justify-center min-h-[650px] lg:min-h-[750px] py-16">
          {/* Centered Content with staggered animations */}
          <div className="text-center space-y-8 max-w-4xl">
            {/* Main Heading with slide-up animation */}
            <h1 
              className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-relaxed tracking-wide font-tajawal opacity-0 animate-[slide-up_0.8s_ease-out_0.2s_forwards]"
            >
              استمتع بالبرودة
              <span className="text-secondary mx-3 inline-block animate-[pulse-glow_2s_ease-in-out_infinite]">المثالية</span>
              في كل لحظة
            </h1>

            {/* Subtitle with delayed animation */}
            <p 
              className="text-xl md:text-2xl lg:text-3xl text-white/90 leading-loose tracking-wider max-w-2xl mx-auto opacity-0 animate-[slide-up_0.8s_ease-out_0.5s_forwards]"
            >
              وكيلك المعتمد لأكبر الماركات العالمية
            </p>

            {/* CTA Button with bounce animation */}
            <div className="pt-4 opacity-0 animate-[slide-up_0.8s_ease-out_0.8s_forwards]">
              <Link to="/products">
                <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-xl md:text-2xl px-12 md:px-16 h-16 md:h-20 gap-4 font-bold shadow-2xl tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(59,130,246,0.5)]">
                  تسوق الآن
                  <ArrowLeft className="h-6 w-6 md:h-7 md:w-7 transition-transform group-hover:-translate-x-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Animated wave at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg 
          viewBox="0 0 1440 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full animate-[wave_8s_ease-in-out_infinite]"
          preserveAspectRatio="none"
        >
          <path 
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroBanner;
