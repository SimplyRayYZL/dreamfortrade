import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  name: string;
  brand: string;
  brand_id: string;
  price: number;
  oldPrice: number | null;
  rating: number;
  reviews: number;
  capacity: string | null;
  type: string | null;
  features: string[];
  model: string | null;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  stock: number | null; // null means unlimited stock
}

export interface Brand {
  id: string;
  name: string;
  name_ar: string;
  logo_url: string | null;
  product_count: number;
  is_active: boolean;
}

// Fetch all products with brand info
export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          name,
          price,
          old_price,
          rating,
          image_url,
          is_active,
          created_at,
          capacity,
          type,
          features,
          brand_id,
          description,
          stock,
          brands (
            id,
            name,
            name_ar
          )
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }

      return (data || []).map((item) => ({
        id: item.id,
        name: item.name,
        brand: (item.brands as any)?.name || "غير محدد",
        brand_id: item.brand_id || "",
        price: item.price,
        oldPrice: item.old_price,
        rating: item.rating || 4.5,
        reviews: Math.floor(Math.random() * 100) + 10, // Generate random reviews for now
        capacity: item.capacity,
        type: item.type,
        features: item.features || [],
        model: item.model,
        description: item.description,
        image_url: item.image_url,
        is_active: item.is_active || true,
        stock: (item as any).stock ?? null, // null means unlimited stock
      }));
    },
  });
};

// Fetch single product by ID
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async (): Promise<Product | null> => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          brands (
            id,
            name,
            name_ar
          )
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching product:", error);
        throw error;
      }

      if (!data) return null;

      return {
        id: data.id,
        name: data.name,
        brand: (data.brands as any)?.name || "غير محدد",
        brand_id: data.brand_id || "",
        price: data.price,
        oldPrice: data.old_price,
        rating: data.rating || 4.5,
        reviews: Math.floor(Math.random() * 100) + 10,
        capacity: data.capacity,
        type: data.type,
        features: data.features || [],
        model: data.model,
        description: data.description,
        image_url: data.image_url,
        is_active: data.is_active || true,
        stock: (data as any).stock || 0,
      };
    },
    enabled: !!id,
  });
};

// Fetch all brands
export const useBrands = () => {
  return useQuery({
    queryKey: ["brands"],
    queryFn: async (): Promise<Brand[]> => {
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (error) {
        console.error("Error fetching brands:", error);
        throw error;
      }

      return (data || []).map((item) => ({
        id: item.id,
        name: item.name,
        name_ar: item.name_ar,
        logo_url: item.logo_url,
        product_count: item.product_count || 0,
        is_active: item.is_active || true,
      }));
    },
  });
};

// Fetch related products by brand
export const useRelatedProducts = (brandId: string, excludeProductId: string) => {
  return useQuery({
    queryKey: ["related-products", brandId, excludeProductId],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          brands (
            id,
            name,
            name_ar
          )
        `)
        .eq("brand_id", brandId)
        .eq("is_active", true)
        .neq("id", excludeProductId)
        .limit(4);

      if (error) {
        console.error("Error fetching related products:", error);
        throw error;
      }

      return (data || []).map((item) => ({
        id: item.id,
        name: item.name,
        brand: (item.brands as any)?.name || "غير محدد",
        brand_id: item.brand_id || "",
        price: item.price,
        oldPrice: item.old_price,
        rating: item.rating || 4.5,
        reviews: Math.floor(Math.random() * 100) + 10,
        capacity: item.capacity,
        type: item.type,
        features: item.features || [],
        model: item.model,
        description: item.description,
        image_url: item.image_url,
        is_active: item.is_active || true,
        stock: (item as any).stock || 0,
      }));
    },
    enabled: !!brandId,
  });
};

// Fetch ALL products for admin panel (including inactive)
export const useAllProducts = () => {
  return useQuery({
    queryKey: ["all-products"],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          brands (
            id,
            name,
            name_ar
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching all products:", error);
        throw error;
      }

      return (data || []).map((item) => ({
        id: item.id,
        name: item.name,
        brand: (item.brands as any)?.name || "غير محدد",
        brand_id: item.brand_id || "",
        price: item.price,
        oldPrice: item.old_price,
        rating: item.rating || 4.5,
        reviews: Math.floor(Math.random() * 100) + 10,
        capacity: item.capacity,
        type: item.type,
        features: item.features || [],
        model: item.model,
        description: item.description,
        image_url: item.image_url,
        is_active: item.is_active ?? true,
        stock: (item as any).stock || 0,
      }));
    },
  });
};
