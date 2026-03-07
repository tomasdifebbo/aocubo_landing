import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

interface FavoritesContextType {
    favorites: string[];
    toggleFavorite: (id: string) => void;
    isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_KEY = "aocubo_favs";

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
    const { user, openLogin } = useAuth();
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem(FAVORITES_KEY);
        if (saved) {
            try {
                setFavorites(JSON.parse(saved));
            } catch (e) {
                console.error("Error parsing favorites", e);
            }
        }
    }, []);

    const toggleFavorite = (id: string) => {
        if (!user) {
            openLogin();
            return;
        }

        setFavorites((prev) => {
            const next = prev.includes(id)
                ? prev.filter((i) => i !== id)
                : [...prev, id];
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
            return next;
        });
    };

    const isFavorite = (id: string) => favorites.includes(id);

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavoritesContext() {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error("useFavoritesContext must be used within a FavoritesProvider");
    }
    return context;
}
