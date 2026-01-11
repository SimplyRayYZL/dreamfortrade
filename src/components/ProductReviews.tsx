import { useState } from "react";
import { Star, User, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useProductReviews, useCreateReview, getAverageRating } from "@/hooks/useReviews";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface ProductReviewsProps {
    productId: string;
}

const ProductReviews = ({ productId }: ProductReviewsProps) => {
    const { user } = useAuth();
    const { data: reviews = [], isLoading } = useProductReviews(productId);
    const createReview = useCreateReview();

    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [name, setName] = useState(user?.email?.split("@")[0] || "");
    const [comment, setComment] = useState("");
    const [showForm, setShowForm] = useState(false);

    const averageRating = getAverageRating(reviews);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("يرجى إدخال اسمك");
            return;
        }
        if (!comment.trim()) {
            toast.error("يرجى كتابة تعليق");
            return;
        }

        try {
            await createReview.mutateAsync({
                product_id: productId,
                user_name: name.trim(),
                rating,
                comment: comment.trim(),
            });
            toast.success("شكراً لتقييمك!");
            setComment("");
            setRating(5);
            setShowForm(false);
        } catch (error) {
            toast.error("حدث خطأ أثناء إرسال التقييم");
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("ar-EG", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="space-y-6">
            {/* Header with stats */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-2xl font-bold mb-2">تقييمات العملاء</h3>
                    {reviews.length > 0 && (
                        <div className="flex items-center gap-2">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-5 w-5 ${i < Math.round(averageRating)
                                                ? "text-yellow-400 fill-yellow-400"
                                                : "text-gray-300"
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="font-bold text-lg">{averageRating.toFixed(1)}</span>
                            <span className="text-muted-foreground">({reviews.length} تقييم)</span>
                        </div>
                    )}
                </div>

                <Button
                    onClick={() => setShowForm(!showForm)}
                    variant={showForm ? "outline" : "default"}
                    className="gap-2"
                >
                    {showForm ? "إلغاء" : "أضف تقييمك"}
                </Button>
            </div>

            {/* Review Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="bg-muted/50 rounded-2xl p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">تقييمك</label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="p-1 transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`h-8 w-8 transition-colors ${star <= (hoverRating || rating)
                                                ? "text-yellow-400 fill-yellow-400"
                                                : "text-gray-300"
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">اسمك</label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="أدخل اسمك"
                            className="bg-background"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">تعليقك</label>
                        <Textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="شاركنا تجربتك مع المنتج..."
                            rows={4}
                            className="bg-background resize-none"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={createReview.isPending}
                        className="w-full md:w-auto gap-2"
                    >
                        {createReview.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                        إرسال التقييم
                    </Button>
                </form>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
                    </div>
                ) : reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div
                            key={review.id}
                            className="bg-card border rounded-2xl p-5 space-y-3"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                        <User className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">{review.user_name}</h4>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDate(review.created_at)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${i < review.rating
                                                    ? "text-yellow-400 fill-yellow-400"
                                                    : "text-gray-300"
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                {review.comment}
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-muted/30 rounded-2xl">
                        <Star className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                        <h4 className="font-semibold mb-1">لا توجد تقييمات بعد</h4>
                        <p className="text-muted-foreground text-sm">
                            كن أول من يقيم هذا المنتج!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductReviews;
