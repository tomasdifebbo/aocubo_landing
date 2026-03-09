import { useState, useEffect } from "react";
import type { PropertyData } from "./useProperties";

export function useProperty(slug: string | undefined, id: string | undefined) {
    const [data, setData] = useState<PropertyData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!slug && !id) return;

        let cancelled = false;

        async function load() {
            setLoading(true);
            setError(null);
            try {
                // Try fetching by ID first if available as it's more precise
                const endpoint = id ? `/api/properties/i/${id}` : `/api/properties/s/${slug}`;
                const res = await fetch(endpoint);

                if (!res.ok) throw new Error("Imóvel não encontrado");
                const json = await res.json();
                if (!cancelled) setData(json);
            } catch (err: any) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => { cancelled = true; };
    }, [slug, id]);

    return { data, loading, error };
}
