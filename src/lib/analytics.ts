import { supabase } from "@/integrations/supabase/client";

// Define event types for tracking
export type AnalyticsEvent =
    | "page_view"
    | "add_to_cart"
    | "view_cart"
    | "start_checkout"
    | "complete_purchase";

interface TrackEventParams {
    event: AnalyticsEvent;
    page?: string;
    productId?: string;
    productName?: string;
    orderId?: string;
    orderTotal?: number;

}

// Track an event and save to database
export const trackEvent = async (params: TrackEventParams) => {
    try {
        const { event, page, productId, productName, orderId, orderTotal } = params;

        // Get session ID from localStorage or create new one
        let sessionId = localStorage.getItem("analytics_session_id");
        if (!sessionId) {
            sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
            localStorage.setItem("analytics_session_id", sessionId);
        }

        // Get visitor ID (persistent)
        let visitorId = localStorage.getItem("analytics_visitor_id");
        if (!visitorId) {
            visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
            localStorage.setItem("analytics_visitor_id", visitorId);
        }

        const eventData = {
            event_type: event,
            session_id: sessionId,
            visitor_id: visitorId,
            page_url: page || window.location.pathname,
            product_id: productId || null,
            product_name: productName || null,
            order_id: orderId || null,
            order_total: orderTotal || 0,
            user_agent: navigator.userAgent,
            device_type: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop',
        };

        // Save to Supabase
        const { error } = await (supabase
            .from("analytics_events") as any)
            .insert(eventData);

        if (error) {
            console.error("[Analytics] Failed to track event:", error);
        } else {
            console.log("[Analytics] Event tracked:", event);
        }

        // Also push to GTM dataLayer if available
        if (typeof window !== "undefined" && (window as any).dataLayer) {
            (window as any).dataLayer.push({
                event: event,
                ...eventData,
            });
        }

    } catch (e) {
        console.error("[Analytics] Error tracking event:", e);
    }
};

// Track page view
export const trackPageView = (pageName?: string) => {
    trackEvent({
        event: "page_view",
        page: pageName || window.location.pathname,
    });
};

// Track add to cart
export const trackAddToCart = (productId: string, productName: string) => {
    trackEvent({
        event: "add_to_cart",
        productId,
        productName,
    });
};

// Track cart view
export const trackViewCart = () => {
    trackEvent({
        event: "view_cart",
        page: "/cart",
    });
};

// Track checkout start
export const trackStartCheckout = () => {
    trackEvent({
        event: "start_checkout",
        page: "/checkout",
    });
};

// Track purchase complete
export const trackCompletePurchase = (orderId: string, orderTotal: number) => {
    trackEvent({
        event: "complete_purchase",
        orderId,
        orderTotal,
    });
};
