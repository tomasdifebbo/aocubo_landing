import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const FAVORITES_KEY = "aocubo_favs";

export function useFavorites() {
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

    return { favorites, toggleFavorite, isFavorite };
}
