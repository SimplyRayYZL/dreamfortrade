import { Star, Quote } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
  {
    id: 1,
    name: "أحمد محمد",
    location: "مدينة نصر",
    rating: 5,
    text: "ممتازين جداً! ركبت تكييف شارب انفرتر من تارجت وفرق فاتورة الكهرباء واضح. الفريق محترم والتركيب كان سريع واحترافي.",
    date: "منذ أسبوع",
  },
  {
    id: 2,
    name: "منى السيد",
    location: "المعادي",
    rating: 5,
    text: "أفضل تجربة شراء تكييف. الأسعار أحسن من السوق والضمان 5 سنين. تكييف كاريير 2.25 حصان شغال زي الفل.",
    date: "منذ أسبوعين",
  },
  {
    id: 3,
    name: "عمر حسين",
    location: "الهرم",
    rating: 5,
    text: "اشتريت 4 تكييفات للشركة من تارجت. التوصيل كان في نفس اليوم والتركيب مجاني. خدمة عملاء ممتازة ومتابعة بعد البيع.",
    date: "منذ شهر",
  },
  {
    id: 4,
    name: "نورهان أحمد",
    location: "مصر الجديدة",
    rating: 5,
    text: "جربت أماكن كتير قبل ما ألاقي تارجت. صراحة الفرق واضح في الأسعار والمعاملة. الفني اللي جه كان محترف جداً.",
    date: "منذ 3 أسابيع",
  },
  {
    id: 5,
    name: "كريم عبدالله",
    location: "الشيراتون",
    rating: 5,
    text: "تكييف ميديا انفرتر ممتاز وموفر في الكهرباء. تارجت قدموا أحسن سعر وضمان شامل. شكراً للفريق المحترم.",
    date: "منذ أسبوعين",
  },
  {
    id: 6,
    name: "ياسمين فؤاد",
    location: "الدقي",
    rating: 5,
    text: "خدمة صيانة ممتازة! التكييف كان عنده مشكلة بسيطة وجم في نفس اليوم وصلحوه. بنصح الكل يتعامل مع تارجت.",
    date: "منذ شهر",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title">آراء عملائنا</h2>
          <p className="text-muted-foreground text-lg">
            ماذا يقول عملاؤنا عن تجربتهم معنا
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent className="-mr-4">
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="pr-4 md:basis-1/2 lg:basis-1/3">
                <div className="card-dream h-full flex flex-col">
                  <Quote className="h-8 w-8 text-secondary/30 mb-4" />

                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < testimonial.rating
                          ? "fill-dream-gold text-dream-gold"
                          : "text-muted"
                          }`}
                      />
                    ))}
                  </div>

                  <p className="text-foreground flex-1 leading-relaxed mb-4">
                    "{testimonial.text}"
                  </p>

                  <div className="border-t pt-4 mt-auto">
                    <p className="font-bold text-foreground">{testimonial.name}</p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{testimonial.location}</span>
                      <span>{testimonial.date}</span>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialsSection;
