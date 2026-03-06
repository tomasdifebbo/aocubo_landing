import { useState, useEffect } from "react";
import { useFavorites } from "./useFavorites";
import type { PropertyData } from "./useProperties";

export function useFavoritesData() {
    const { favorites } = useFavorites();
    const [data, setData] = useState<PropertyData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (favorites.length === 0) {
            setData([]);
            return;
        }

        let cancelled = false;

        async function load() {
            setLoading(true);
            try {
                const res = await fetch("/api/properties/batch", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ids: favorites })
                });
                const json = await res.json();
                if (!cancelled) setData(json.properties || []);
            } catch (err: any) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => { cancelled = true; };
    }, [favorites]);

    return { data, loading, error };
}
