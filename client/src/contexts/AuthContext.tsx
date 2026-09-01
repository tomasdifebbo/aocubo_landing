import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    isAdmin: boolean;
    isMasterMode: boolean;
    toggleMasterMode: (enabled?: boolean) => void;
    signOut: () => Promise<void>;
    authModal: { open: boolean; mode: "login" | "register" };
    openLogin: () => void;
    openRegister: () => void;
    closeAuth: () => void;
    setAuthModalMode: (mode: "login" | "register") => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [isMasterMode, setIsMasterMode] = useState<boolean>(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("aocubo_master_mode") === "true";
        }
        return false;
    });
    const [authModal, setAuthModal] = useState<{ open: boolean; mode: "login" | "register" }>({
        open: false,
        mode: "login"
    });

    const toggleMasterMode = (enabled?: boolean) => {
        setIsMasterMode((prev) => {
            const next = enabled !== undefined ? enabled : !prev;
            if (typeof window !== "undefined") {
                localStorage.setItem("aocubo_master_mode", String(next));
            }
            return next;
        });
    };

    const isAdmin = isMasterMode || !!(user && (
        user.email?.toLowerCase().includes("admin") ||
        user.email?.toLowerCase().includes("master") ||
        user.email?.toLowerCase() === "tomasdife@gmail.com" ||
        user.user_metadata?.role === "admin" ||
        user.user_metadata?.role === "master"
    ));

    useEffect(() => {
        // Check active sessions and sets the user
        supabase.auth.getSession()
            .then(({ data: { session } }) => {
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Erro ao verificar sessão do Supabase:', err);
                setLoading(false);
            });

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    const openLogin = () => setAuthModal({ open: true, mode: "login" });
    const openRegister = () => setAuthModal({ open: true, mode: "register" });
    const closeAuth = () => setAuthModal(prev => ({ ...prev, open: false }));
    const setAuthModalMode = (mode: "login" | "register") => setAuthModal(prev => ({ ...prev, mode }));

    const value = {
        user,
        session,
        loading,
        isAdmin,
        isMasterMode,
        toggleMasterMode,
        signOut,
        authModal,
        openLogin,
        openRegister,
        closeAuth,
        setAuthModalMode
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
