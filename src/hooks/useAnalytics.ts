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

export type TimePeriod = 'today' | 'week' | 'month' | 'year';

// Helper to get date range based on period
const getDateRange = (period: TimePeriod): { start: string; end: string } => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const endDate = `${today}T23:59:59`;

    switch (period) {
        case 'today':
            return { start: `${today}T00:00:00`, end: endDate };
        case 'week': {
            const weekAgo = new Date(now);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return { start: `${weekAgo.toISOString().split("T")[0]}T00:00:00`, end: endDate };
        }
        case 'month': {
            const monthAgo = new Date(now);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return { start: `${monthAgo.toISOString().split("T")[0]}T00:00:00`, end: endDate };
        }
        case 'year': {
            const yearAgo = new Date(now);
            yearAgo.setFullYear(yearAgo.getFullYear() - 1);
            return { start: `${yearAgo.toISOString().split("T")[0]}T00:00:00`, end: endDate };
        }
        default:
            return { start: `${today}T00:00:00`, end: endDate };
    }
};

// Fetch analytics for a specific time period
export const useAnalyticsWithPeriod = (period: TimePeriod = 'today') => {
    return useQuery({
        queryKey: ["analytics-period", period],
        queryFn: async (): Promise<TodayStats> => {
            try {
                const { start, end } = getDateRange(period);

                const { data, error } = await (supabase
                    .from("analytics_events") as any)
                    .select("event_type, order_total, visitor_id, created_at");

                if (error) {
                    console.error("[Analytics] Error fetching stats:", error);
                    return { visitors: 0, addToCart: 0, checkout: 0, purchases: 0, revenue: 0 };
                }

                // Filter by date in JS to avoid timezone issues
                const startDate = new Date(start);
                const endDate = new Date(end);

                const events = (data || []).filter((e: any) => {
                    const eventDate = new Date(e.created_at);
                    return eventDate >= startDate && eventDate <= endDate;
                });

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
        refetchInterval: 1000 * 60 * 5, // Auto-refresh every 5 minutes
    });
};

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

// Fetch today's stats (kept for backward compatibility)
export const useTodayStats = () => {
    return useAnalyticsWithPeriod('today');
};

