import { useState, useEffect } from "react";
import type { PropertyData } from "./useProperties";

export function useProperty(slug: string | undefined) {
    const [data, setData] = useState<PropertyData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!slug) return;

        let cancelled = false;

        async function load() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/properties/s/${slug}`);
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
    }, [slug]);

    return { data, loading, error };
}
