import React, { createContext, useContext, useState, ReactNode } from 'react';

export type AdminRole = 'admin' | 'viewer' | null;

interface AdminAuthContextType {
    isAuthenticated: boolean;
    role: AdminRole;
    login: (username: string, password: string) => boolean;
    logout: () => void;
    canEdit: () => boolean;
    canDelete: () => boolean;
    canViewOnly: () => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Admin credentials with roles
const ADMIN_USERS = [
    { username: 'ahmed', password: 'ahmed', role: 'admin' as AdminRole },
    { username: 'dream', password: 'dream', role: 'admin' as AdminRole },
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

    const login = (username: string, password: string): boolean => {
        const user = ADMIN_USERS.find(
            u => u.username === username && u.password === password
        );

        if (user) {
            setIsAuthenticated(true);
            setRole(user.role);
            localStorage.setItem('adminAuth', 'true');
            localStorage.setItem('adminRole', user.role || '');
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        setRole(null);
        localStorage.removeItem('adminAuth');
        localStorage.removeItem('adminRole');
    };

    // Permission helpers
    const canEdit = () => role === 'admin';
    const canDelete = () => role === 'admin';
    const canViewOnly = () => role === 'viewer';

    return (
        <AdminAuthContext.Provider value={{
            isAuthenticated,
            role,
            login,
            logout,
            canEdit,
            canDelete,
            canViewOnly
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
