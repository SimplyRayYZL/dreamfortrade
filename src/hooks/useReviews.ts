import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Review {
    id: string;
    product_id: string;
    user_id: string | null;
    user_name: string;
    rating: number;
    comment: string;
    created_at: string;
}

export interface CreateReviewData {
    product_id: string;
    user_name: string;
    rating: number;
    comment: string;
}

// Local storage key for reviews (temporary until database table is created)
const REVIEWS_STORAGE_KEY = "product_reviews";

// Get reviews from localStorage
const getStoredReviews = (): Review[] => {
    try {
        const stored = localStorage.getItem(REVIEWS_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

// Save reviews to localStorage
const saveReviews = (reviews: Review[]) => {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
};

// Fetch reviews for a product (using localStorage for now)
export const useProductReviews = (productId: string) => {
    return useQuery({
        queryKey: ["reviews", productId],
        queryFn: async (): Promise<Review[]> => {
            // Using localStorage until reviews table is created in Supabase
            const allReviews = getStoredReviews();
            return allReviews.filter(review => review.product_id === productId);
        },
        enabled: !!productId,
    });
};

// Create a new review (using localStorage for now)
export const useCreateReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (reviewData: CreateReviewData): Promise<Review> => {
            // Create new review object
            const newReview: Review = {
                id: crypto.randomUUID(),
                product_id: reviewData.product_id,
                user_id: null,
                user_name: reviewData.user_name,
                rating: reviewData.rating,
                comment: reviewData.comment,
                created_at: new Date().toISOString(),
            };

            // Save to localStorage
            const allReviews = getStoredReviews();
            allReviews.unshift(newReview);
            saveReviews(allReviews);

            return newReview;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["reviews", variables.product_id] });
        },
    });
};

// Get average rating for a product
export const getAverageRating = (reviews: Review[]) => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
};

/*
NOTE: To use with Supabase, create this table:

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  user_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read reviews
CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT USING (true);

-- Allow authenticated users to create reviews
CREATE POLICY "Users can create reviews" ON reviews FOR INSERT WITH CHECK (true);
*/
