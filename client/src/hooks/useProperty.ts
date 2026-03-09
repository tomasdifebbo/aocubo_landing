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
                let res = null;

                // 1. Try fetching by ID first if available
                if (id) {
                    res = await fetch(`/api/properties/i/${id}`);
                }

                // 2. Fallback to slug if ID's not available OR if it failed
                if (!res || !res.ok) {
                    res = await fetch(`/api/properties/s/${slug}`);
                }

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
