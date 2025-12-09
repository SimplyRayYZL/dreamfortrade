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
    name: "أحمد محمود",
    location: "القاهرة",
    rating: 5,
    text: "تعامل ممتاز وأسعار منافسة. اشتريت تكييف جنرال 3 حصان والتركيب كان في نفس اليوم. شكراً لفريق دريم للتجارة.",
    date: "منذ أسبوع",
  },
  {
    id: 2,
    name: "محمد علي",
    location: "الجيزة",
    rating: 5,
    text: "خدمة عملاء رائعة وضمان شامل. التكييف شغال من سنتين بدون أي مشاكل. أنصح الجميع بالتعامل معهم.",
    date: "منذ شهر",
  },
  {
    id: 3,
    name: "سارة أحمد",
    location: "الإسكندرية",
    rating: 5,
    text: "اشتريت 3 تكييفات للشقة الجديدة. الأسعار كانت أفضل من أي مكان تاني والتوصيل مجاني. شكراً جزيلاً!",
    date: "منذ 3 أسابيع",
  },
  {
    id: 4,
    name: "خالد إبراهيم",
    location: "المنصورة",
    rating: 4,
    text: "تكييف كاريير انفرتر ممتاز في توفير الكهرباء. الفاتورة نزلت تقريباً للنص. سعيد جداً بالشراء.",
    date: "منذ شهرين",
  },
  {
    id: 5,
    name: "فاطمة حسن",
    location: "طنطا",
    rating: 5,
    text: "التعامل محترم جداً والصيانة الدورية ممتازة. بنصح كل اللي عايز يشتري تكييف يتعامل معاهم.",
    date: "منذ أسبوعين",
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
                        className={`h-4 w-4 ${
                          i < testimonial.rating
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
