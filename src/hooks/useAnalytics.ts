import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AnalyticsSummary {
    date: string;
    unique_visitors: number;
    total_sessions: number;
    page_views: number;
    add_to_cart_count: number;
    view_cart_count: number;
    start_checkout_count: number;
    completed_purchases: number;
    total_revenue: number;
}

export interface TodayStats {
    visitors: number;
    addToCart: number;
    checkout: number;
    purchases: number;
    revenue: number;
}

// Fetch analytics summary for the last N days
export const useAnalyticsSummary = (days: number = 30) => {
    return useQuery({
        queryKey: ["analytics-summary", days],
        queryFn: async (): Promise<AnalyticsSummary[]> => {
            try {
                const { data, error } = await (supabase
                    .from("analytics_daily_summary") as any)
                    .select("*")
                    .limit(days);

                if (error) {
                    console.error("[Analytics] Error fetching summary:", error);
                    return [];
                }

                return data || [];
            } catch (e) {
                console.error("[Analytics] Exception:", e);
                return [];
            }
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

// Fetch today's stats
export const useTodayStats = () => {
    return useQuery({
        queryKey: ["analytics-today"],
        queryFn: async (): Promise<TodayStats> => {
            try {
                const today = new Date().toISOString().split("T")[0];

                const { data, error } = await (supabase
                    .from("analytics_events") as any)
                    .select("event_type, order_total, visitor_id")
                    .gte("created_at", `${today}T00:00:00`)
                    .lte("created_at", `${today}T23:59:59`);

                if (error) {
                    console.error("[Analytics] Error fetching today stats:", error);
                    return { visitors: 0, addToCart: 0, checkout: 0, purchases: 0, revenue: 0 };
                }

                const events = data || [];
                const uniqueVisitors = new Set(events.map((e: any) => e.visitor_id)).size;
                const addToCart = events.filter((e: any) => e.event_type === "add_to_cart").length;
                const checkout = events.filter((e: any) => e.event_type === "start_checkout").length;
                const purchases = events.filter((e: any) => e.event_type === "complete_purchase").length;
                const revenue = events
                    .filter((e: any) => e.event_type === "complete_purchase")
                    .reduce((sum: number, e: any) => sum + (e.order_total || 0), 0);

                return { visitors: uniqueVisitors, addToCart, checkout, purchases, revenue };
            } catch (e) {
                console.error("[Analytics] Exception:", e);
                return { visitors: 0, addToCart: 0, checkout: 0, purchases: 0, revenue: 0 };
            }
        },
        staleTime: 1000 * 60, // 1 minute
        refetchInterval: 1000 * 60, // Auto-refresh every minute
    });
};
