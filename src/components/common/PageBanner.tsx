import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface PageBannerProps {
  title: string;
  subtitle?: string;
  backgroundImage: string;
  showCTA?: boolean;
  ctaText?: string;
  ctaLink?: string;
}

const PageBanner = ({
  title,
  subtitle,
  backgroundImage,
  showCTA = false,
  ctaText = "تسوق الآن",
  ctaLink = "/products",
}: PageBannerProps) => {
  return (
    <section className="relative h-[300px] md:h-[400px] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-l from-primary/90 via-primary/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex items-center">
        <div className="max-w-2xl text-right">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg md:text-xl text-white/90 mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              {subtitle}
            </p>
          )}
          {showCTA && (
            <Link to={ctaLink}>
              <Button 
                size="lg" 
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground animate-fade-in"
                style={{ animationDelay: "0.2s" }}
              >
                {ctaText}
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Decorative Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 60V20C240 50 480 60 720 45C960 30 1200 0 1440 15V60H0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
};

export default PageBanner;
