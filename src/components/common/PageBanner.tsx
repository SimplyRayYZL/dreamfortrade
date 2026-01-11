import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

interface PageBannerProps {
  title: string;
  subtitle?: string;
  backgroundImage: string;
  showCTA?: boolean;
  ctaText?: string;
  ctaLink?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

const PageBanner = ({
  title,
  subtitle,
  backgroundImage,
  showCTA = false,
  ctaText = "تسوق الآن",
  ctaLink = "/products",
  breadcrumbs,
}: PageBannerProps) => {
  return (
    <section className="relative min-h-[280px] md:min-h-[350px] overflow-hidden">
      {/* Background with parallax effect */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed scale-105"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {/* Multi-layer overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />

        {/* Animated pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 py-12 flex flex-col justify-center">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-6">
            <Link to="/" className="hover:text-white transition-colors">الرئيسية</Link>
            {breadcrumbs.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                {item.href ? (
                  <Link to={item.href} className="hover:text-white transition-colors">{item.label}</Link>
                ) : (
                  <span className="text-white">{item.label}</span>
                )}
              </div>
            ))}
          </nav>
        )}

        <div className="max-w-2xl">
          {/* Decorative line */}
          <div className="w-20 h-1 bg-secondary rounded-full mb-6 animate-[scale-in_0.6s_ease-out]" />

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight opacity-0 animate-[slide-up_0.8s_ease-out_forwards]">
            {title}
          </h1>

          {subtitle && (
            <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed opacity-0 animate-[slide-up_0.8s_ease-out_0.2s_forwards]">
              {subtitle}
            </p>
          )}

          {showCTA && (
            <Link to={ctaLink}>
              <Button
                size="lg"
                className="bg-secondary hover:bg-secondary/90 text-white rounded-full px-8 gap-2 opacity-0 animate-[slide-up_0.8s_ease-out_0.4s_forwards] hover:scale-105 transition-transform"
              >
                {ctaText}
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Modern wave separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 80V40C120 60 240 70 360 60C480 50 600 30 720 25C840 20 960 30 1080 40C1200 50 1320 60 1380 65L1440 70V80H0Z"
            fill="hsl(var(--background))"
          />
          <path
            d="M0 80V50C120 65 240 75 360 70C480 65 600 50 720 45C840 40 960 45 1080 55C1200 65 1320 70 1380 72L1440 75V80H0Z"
            fill="hsl(var(--background))"
            opacity="0.5"
          />
        </svg>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-1/4 left-10 w-32 h-32 bg-secondary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
    </section>
  );
};

export default PageBanner;
