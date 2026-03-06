import { useState, useEffect } from "react";

export interface PropertyUnit {
    id: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    livingArea: number;
    parkingSlots: number;
    attachments?: { url: string }[];
    type: string;
}

export interface PropertyData {
    id: string;
    title: string;
    slug: string;
    description?: string;
    price: number;
    priceFormatted: string;
    neighborhood: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    parkingSlots: number;
    status: "Pronto" | "Em obras" | "Breve lançamento";
    images: string[];
    url: string;
    developer?: string;
    characteristics: string[];
    units: PropertyUnit[];
    type: string;
}

export interface PropertiesResult {
    properties: PropertyData[];
    total: number;
    page: number;
    totalPages: number;
}

export interface UsePropertiesOptions {
    page?: number;
    limit?: number;
    bedrooms?: number;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
    neighborhood?: string;
}

export interface UsePropertiesReturn {
    data: PropertiesResult | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useProperties(options: UsePropertiesOptions = {}): UsePropertiesReturn {
    const { page = 1, limit = 6, bedrooms, minPrice, maxPrice } = options;

    const [data, setData] = useState<PropertiesResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tick, setTick] = useState(0);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams();
            params.set("page", String(page));
            params.set("limit", String(limit));
            if (bedrooms !== undefined) params.set("bedrooms", String(bedrooms));
            if (minPrice !== undefined) params.set("minPrice", String(minPrice));
            if (maxPrice !== undefined) params.set("maxPrice", String(maxPrice));
            if (options.status) params.set("status", options.status);
            if (options.neighborhood) params.set("neighborhood", options.neighborhood);

            try {
                const res = await fetch(`/api/properties?${params.toString()}`);
                if (!res.ok) throw new Error(`Erro ${res.status}`);
                const json: PropertiesResult = await res.json();
                if (!cancelled) setData(json);
            } catch (err) {
                if (!cancelled) setError(err instanceof Error ? err.message : "Erro desconhecido");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => { cancelled = true; };
    }, [page, limit, bedrooms, minPrice, maxPrice, options.status, options.neighborhood, tick]);

    const refetch = () => setTick((t) => t + 1);

    return { data, loading, error, refetch };
}
