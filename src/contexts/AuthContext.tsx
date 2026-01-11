import { createContext, useContext, useEffect, useState } from "react";
import { User, AuthError, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
    id: string;
    full_name: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    city: string | null;
}

interface AuthContextType {
    user: User | null;
    profile: Profile | null;
    isLoading: boolean;
    signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
    signInWithGoogle: () => Promise<{ error: AuthError | null }>;
    signUp: (email: string, password: string, metadata?: { full_name?: string; phone?: string }) => Promise<{ error: AuthError | null; data?: any }>;
    signOut: () => Promise<void>;
    updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
    resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProfile = async (userId: string) => {
        try {
            const { data, error } = await (supabase
                .from("profiles") as any)
                .select("*")
                .eq("id", userId)
                .single();

            if (error && error.code !== "PGRST116") {
                console.error("Error fetching profile:", error);
            }
            setProfile(data || null);
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            }
            setIsLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setUser(session?.user ?? null);
                if (session?.user) {
                    fetchProfile(session.user.id);
                } else {
                    setProfile(null);
                }
                setIsLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { error };
    };

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin,
            },
        });
        return { error };
    };

    const signUp = async (
        email: string,
        password: string,
        metadata?: { full_name?: string; phone?: string }
    ) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: metadata,
                    emailRedirectTo: window.location.origin,
                },
            });

            // Check if user already exists (identities array will be empty or null)
            if (data?.user && (!data.user.identities || data.user.identities.length === 0)) {
                return {
                    error: {
                        message: "هذا البريد الإلكتروني مسجل بالفعل!",
                        name: "AuthApiError",
                        status: 400,
                    } as AuthError,
                    data: null,
                };
            }

            // Check for error from Supabase
            if (error) {
                return { error, data: null };
            }

            return { error, data };
        } catch (err: any) {
            return {
                error: {
                    message: err?.message || "حدث خطأ أثناء إنشاء الحساب",
                    name: "AuthApiError",
                    status: 500,
                } as AuthError,
                data: null,
            };
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
    };

    const updateProfile = async (updates: Partial<Profile>) => {
        if (!user) return { error: new Error("No user logged in") };

        const { error } = await (supabase
            .from("profiles") as any)
            .update(updates)
            .eq("id", user.id);

        if (!error) {
            setProfile((prev) => (prev ? { ...prev, ...updates } : null));
        }

        return { error };
    };

    const resetPassword = async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });
        return { error };
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                profile,
                isLoading,
                signIn,
                signInWithGoogle,
                signUp,
                signOut,
                updateProfile,
                resetPassword,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
