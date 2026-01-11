import React, { createContext, useContext, useState, ReactNode } from 'react';

export type AdminRole = 'admin' | 'editor' | 'viewer' | null;

interface AdminAuthContextType {
    isAuthenticated: boolean;
    role: AdminRole;
    username: string | null;
    login: (username: string, password: string) => boolean;
    logout: () => void;
    canEdit: () => boolean;
    canDelete: () => boolean;
    canViewOnly: () => boolean;
    canAccessSettings: () => boolean;
    isFullAdmin: () => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Admin credentials with roles
// admin = full access to everything
// editor = products, orders, brands only (no settings)
const ADMIN_USERS = [
    { username: 'target', password: 'target', role: 'editor' as AdminRole },
    { username: 'ahmed', password: 'ahmed', role: 'admin' as AdminRole },
    { username: 'dream', password: 'dream', role: 'editor' as AdminRole },
    // Keep old admin for backward compatibility
    { username: 'hossam', password: 'ahmed0100', role: 'admin' as AdminRole },
];

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        return localStorage.getItem('adminAuth') === 'true';
    });

    const [role, setRole] = useState<AdminRole>(() => {
        return (localStorage.getItem('adminRole') as AdminRole) || null;
    });

    const [username, setUsername] = useState<string | null>(() => {
        return localStorage.getItem('adminUsername') || null;
    });

    const login = (inputUsername: string, password: string): boolean => {
        const user = ADMIN_USERS.find(
            u => u.username === inputUsername && u.password === password
        );

        if (user) {
            setIsAuthenticated(true);
            setRole(user.role);
            setUsername(user.username);
            localStorage.setItem('adminAuth', 'true');
            localStorage.setItem('adminRole', user.role || '');
            localStorage.setItem('adminUsername', user.username);
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        setRole(null);
        setUsername(null);
        localStorage.removeItem('adminAuth');
        localStorage.removeItem('adminRole');
        localStorage.removeItem('adminUsername');
    };

    // Permission helpers
    const canEdit = () => role === 'admin' || role === 'editor';
    const canDelete = () => role === 'admin' || role === 'editor';
    const canViewOnly = () => role === 'viewer';
    const isFullAdmin = () => role === 'admin';
    const canAccessSettings = () => role === 'admin';

    return (
        <AdminAuthContext.Provider value={{
            isAuthenticated,
            role,
            username,
            login,
            logout,
            canEdit,
            canDelete,
            canViewOnly,
            canAccessSettings,
            isFullAdmin
        }}>
            {children}
        </AdminAuthContext.Provider>
    );
};

export const useAdminAuth = () => {
    const context = useContext(AdminAuthContext);
    if (context === undefined) {
        throw new Error('useAdminAuth must be used within an AdminAuthProvider');
    }
    return context;
};
