import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
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
    const [authModal, setAuthModal] = useState<{ open: boolean; mode: "login" | "register" }>({
        open: false,
        mode: "login"
    });

    useEffect(() => {
        // Check active sessions and sets the user
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
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
