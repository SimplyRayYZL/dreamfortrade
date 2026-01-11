import React, { useState, useEffect } from "react";
import { Star, Quote, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    id: 1,
    name: "أحمد محمد",
    location: "مدينة نصر",
    rating: 5,
    text: "ممتازين جداً! ركبت تكييف شارب انفرتر من دريم وفرق فاتورة الكهرباء واضح. الفريق محترم والتركيب كان سريع واحترافي.",
    date: "منذ أسبوع",
    avatar: "أ",
  },
  {
    id: 2,
    name: "منى السيد",
    location: "المعادي",
    rating: 5,
    text: "أفضل تجربة شراء تكييف. الأسعار أحسن من السوق والضمان 5 سنين. تكييف كاريير 2.25 حصان شغال زي الفل.",
    date: "منذ أسبوعين",
    avatar: "م",
  },
  {
    id: 3,
    name: "عمر حسين",
    location: "الهرم",
    rating: 5,
    text: "اشتريت 4 تكييفات للشركة من دريم. التوصيل كان في نفس اليوم والتركيب مجاني. خدمة عملاء ممتازة ومتابعة بعد البيع.",
    date: "منذ شهر",
    avatar: "ع",
  },
  {
    id: 4,
    name: "نورهان أحمد",
    location: "مصر الجديدة",
    rating: 5,
    text: "جربت أماكن كتير قبل ما ألاقي دريم. صراحة الفرق واضح في الأسعار والمعاملة. الفني اللي جه كان محترف جداً.",
    date: "منذ 3 أسابيع",
    avatar: "ن",
  },
  {
    id: 5,
    name: "كريم عبدالله",
    location: "الشيراتون",
    rating: 5,
    text: "تكييف ميديا انفرتر ممتاز وموفر في الكهرباء. دريم قدموا أحسن سعر وضمان شامل. شكراً للفريق المحترم.",
    date: "منذ أسبوعين",
    avatar: "ك",
  },
  {
    id: 6,
    name: "ياسمين فؤاد",
    location: "الدقي",
    rating: 5,
    text: "خدمة صيانة ممتازة! التكييف كان عنده مشكلة بسيطة وجم في نفس اليوم وصلحوه. بنصح الكل يتعامل مع دريم.",
    date: "منذ شهر",
    avatar: "ي",
  },
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-secondary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-60 h-60 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-12">
          <div data-aos="zoom-in" className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            <span>آراء العملاء</span>
          </div>
          <h2 data-aos="fade-up" data-aos-delay="100" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            ماذا يقول <span className="text-secondary">عملاؤنا</span>
          </h2>
          <p data-aos="fade-up" data-aos-delay="200" className="text-muted-foreground text-lg max-w-xl mx-auto">
            نفتخر بثقة أكثر من 50,000 عميل سعيد
          </p>
        </div>

        <div className="max-w-3xl mx-auto relative">
          {/* Navigation Arrows */}
          <Button
            variant="outline"
            size="icon"
            onClick={goToPrevious}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-14 z-10 rounded-full bg-card shadow-lg hover:bg-secondary hover:text-white border-0 h-12 w-12"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={goToNext}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-14 z-10 rounded-full bg-card shadow-lg hover:bg-secondary hover:text-white border-0 h-12 w-12"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          {/* Testimonial Card - Modern Design */}
          <div className="bg-card rounded-3xl shadow-xl p-8 md:p-12 mx-8 sm:mx-0 transition-all duration-500 relative">
            {/* Quote icon */}
            <div className="absolute -top-5 right-8 w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center shadow-lg">
              <Quote className="h-6 w-6 text-white" />
            </div>

            <div className="flex flex-col items-center text-center">
              {/* Stars */}
              <div className="flex items-center gap-1 mb-6 mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-6 w-6 ${i < currentTestimonial.rating
                      ? "fill-dream-gold text-dream-gold"
                      : "text-muted"
                      }`}
                  />
                ))}
              </div>

              {/* Quote text */}
              <p className="text-foreground text-lg md:text-xl leading-relaxed mb-8">
                "{currentTestimonial.text}"
              </p>

              {/* Author info */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-white text-2xl font-bold">
                  {currentTestimonial.avatar}
                </div>
                <div>
                  <p className="font-bold text-foreground text-lg">{currentTestimonial.name}</p>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <span>{currentTestimonial.location}</span>
                    <span>•</span>
                    <span>{currentTestimonial.date}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dots Indicator - Enhanced */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-3 rounded-full transition-all duration-300 ${index === currentIndex
                  ? "bg-secondary w-8"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50 w-3"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
