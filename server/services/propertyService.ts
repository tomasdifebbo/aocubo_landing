import type {
    Property,
    PropertiesResponse,
    RawProperty,
    RawPropertiesResponse,
} from "../types/property";

const AOCUBO_API_BASE = "https://api.aocubo.com/api/v1/aocubo/properties";

// ─── In-memory cache ───────────────────────────────────────────────────────
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

interface CacheEntry {
    data: PropertiesResponse;
    expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

function getCached(key: string): PropertiesResponse | null {
    const entry = cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
        cache.delete(key);
        return null;
    }
    return entry.data;
}

function setCache(key: string, data: PropertiesResponse) {
    cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

// ─── Normaliser ────────────────────────────────────────────────────────────
function mapStatus(raw: string): Property["status"] {
    switch (raw) {
        case "COMPLETE":
        case "READY":
            return "Pronto";
        case "UNDER_CONSTRUCTION":
            return "Em obras";
        case "NEW_DEVELOPMENT":
        default:
            return "Breve lançamento";
    }
}

function formatPrice(price: number): string {
    return price.toLocaleString("pt-BR");
}

function parseDescription(desc: any): string {
    if (!desc) return "";
    if (typeof desc === "string") {
        if (desc.startsWith("[{") || desc.startsWith('{"')) {
            try {
                const parsed = JSON.parse(desc);
                if (Array.isArray(parsed)) {
                    return parsed.map((op: any) => op.insert ?? "").join("");
                }
            } catch (e) {
                return desc;
            }
        }
        return desc;
    }
    return "";
}

function normalise(raw: RawProperty): Property {
    const units = Array.isArray((raw as any).units) ? (raw as any).units : [];

    const mappedUnits: any[] = units.map((u: any) => {
        const filteredAttachments = (u.attachments ?? [])
            .filter((a: any) => {
                const url = typeof a === 'string' ? a : a.url;
                return typeof url === 'string' && /\.(jpg|jpeg|png|webp|gif)$/i.test(url);
            })
            .map((a: any) => ({
                id: a.id,
                url: extractUrl(a)
            }));

        return {
            id: String(u.id),
            price: parseFloat(String(u.price)) || 0,
            bedrooms: u.bedrooms ?? 0,
            bathrooms: u.bathrooms ?? 0,
            livingArea: u.livingArea ?? 0,
            parkingSlots: u.parkingSlots ?? 0,
            attachments: filteredAttachments,
            type: u.unitType?.name || (u.bedrooms === 0 ? "Studio" : "Apartamento"),
        };
    });

    let refUnit: any = mappedUnits.length > 0
        ? mappedUnits.reduce((min: any, curr: any) => (curr.price < min.price && curr.price > 0) ? curr : min, mappedUnits[0])
        : { price: 0, bedrooms: 0, bathrooms: 0, livingArea: 0, parkingSlots: 0 };

    let propertyTypeName = (raw as any).propertyType?.name || "Apartamento";
    if (propertyTypeName === "Apartamento" && refUnit.bedrooms === 0) {
        propertyTypeName = "Studio";
    }

    const price = refUnit.price;

    const neighborhood =
        typeof (raw as any).neighborhood === "object"
            ? ((raw as any).neighborhood?.name ?? "")
            : String((raw as any).neighborhood ?? (raw.address?.neighborhood as any)?.name ?? raw.address?.neighborhood ?? "");

    // Strong deduplication for images
    const imagePaths = new Set<string>();

    const extractUrl = (a: any) => {
        if (!a) return null;
        let url = typeof a === "string" ? a : (a.url || a.originalUrl);
        if (typeof url !== "string") return null;

        // AoCubo High Quality Trick: 
        // Removing .webp from .jpg.webp often returns a higher bitrate/cleaner original.
        if (url.toLowerCase().endsWith(".jpg.webp")) {
            url = url.substring(0, url.length - 5);
        } else if (url.toLowerCase().endsWith(".png.webp")) {
            url = url.substring(0, url.length - 5);
        }

        // Ensure it's an absolute URL
        if (url.startsWith("http")) return url;
        if (url.startsWith("//")) return `https:${url}`;
        if (url.startsWith("/")) return `https://5m7fnp.stackhero-network.com${url}`;

        return null;
    };

    // 1. Add development attachments
    (raw.attachments ?? []).forEach((a: any) => {
        // Only add if explicitly an IMAGE type or has an image extension
        const isImage = a.type === "IMAGE" ||
            (typeof a.url === 'string' && /\.(jpg|jpeg|png|webp|gif)$/i.test(a.url)) ||
            (typeof a === 'string' && /\.(jpg|jpeg|png|webp|gif)$/i.test(a));

        if (!isImage) return;

        let url = extractUrl(a);
        if (url) {
            // Some URLs might be double-encoded or have special characters
            try {
                // If it contains %2F but not as a protocol separator, it might need decoding
                // but usually, we should keep it encoded for the browser.
                // However, let's at least ensure no spaces are present.
                url = url.trim().replace(/\s/g, '%20');
                imagePaths.add(url);
            } catch (e) {
                imagePaths.add(url);
            }
        }
    });

    // 2. Add unit attachments
    units.forEach((u: any) => {
        (u.attachments ?? []).forEach((a: any) => {
            const isImage = a.type === "IMAGE" ||
                (typeof a.url === 'string' && /\.(jpg|jpeg|png|webp|gif)$/i.test(a.url)) ||
                (typeof a === 'string' && /\.(jpg|jpeg|png|webp|gif)$/i.test(a));

            if (!isImage) return;

            const url = extractUrl(a);
            if (url) imagePaths.add(url.trim().replace(/\s/g, '%20'));
        });
    });

    const images = Array.from(imagePaths).slice(0, 40);

    const characteristics = ((raw as any).characteristics ?? []).map((c: any) =>
        typeof c === "string" ? c : c.name ?? ""
    );

    return {
        id: String(raw.id),
        title: raw.name ?? (raw as any).title ?? "",
        slug: raw.slug ?? "",
        description: parseDescription(raw.description),
        price,
        priceFormatted: formatPrice(price),
        neighborhood,
        bedrooms: refUnit.bedrooms ?? 0,
        bathrooms: refUnit.bathrooms ?? 0,
        area: refUnit.livingArea ?? 0,
        parkingSlots: refUnit.parkingSlots ?? 0,
        status: mapStatus(raw.constructionStatus ?? (raw as any).status ?? ""),
        images: images.length > 0 ? images : ["https://d2xsxph8kpxj0f.cloudfront.net/310519663366689293/jsiKnDEmDWyHsAZxshzkFX/apartment-interior-AsrdjbkKxpBi7u6wHztwSk.webp"],
        url: `https://www.aocubo.com/imovel/${raw.slug}/${raw.id}`,
        developer: (raw as any).developer?.name ?? (raw as any).developer ?? undefined,
        characteristics,
        units: mappedUnits,
        type: propertyTypeName,
    };
}

// ─── Fetch ─────────────────────────────────────────────────────────────────
interface FetchOptions {
    page: number;
    limit: number;
    bedrooms?: number;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
    neighborhood?: string;
}

export async function fetchProperties(opts: FetchOptions): Promise<PropertiesResponse> {
    const { page, limit, bedrooms, minPrice, maxPrice } = opts;

    // Build query string for aocubo API
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("size", String(limit));
    params.set("_cache_bust", Date.now().toString());
    params.set("search[state.code][value]", "sp");
    params.set("search[state.code][type]", "ILIKE");
    params.set("search[city.name][value]", "sao-paulo");
    params.set("search[city.name][type]", "EQUAL_UNACCENT");
    params.set("order[property.views]", "DESC");

    // Price filter
    const priceMin = minPrice ?? 100000;
    const priceMax = maxPrice ?? 99999999;
    params.set("search[units.price][value]", `${priceMin},${priceMax}`);
    params.set("search[units.price][type]", "BETWEEN");

    // Bedrooms filter
    if (bedrooms !== undefined) {
        params.set("search[units.bedrooms][value]", String(bedrooms));
        params.set("search[units.bedrooms][type]", "EQUAL");
    }

    // Status filter
    if (opts.status) {
        let statusCode = "";
        if (opts.status === "Pronto") statusCode = "COMPLETE";
        else if (opts.status === "Em obras") statusCode = "UNDER_CONSTRUCTION";
        else if (opts.status === "Breve lançamento") statusCode = "NEW_DEVELOPMENT";

        if (statusCode) {
            params.set("search[property.constructionStatus][value]", statusCode);
            params.set("search[property.constructionStatus][type]", "EQUAL");
        }
    }

    // Neighborhood filter
    if (opts.neighborhood) {
        params.set("search[neighborhood.name][value]", opts.neighborhood);
        params.set("search[neighborhood.name][type]", "ILIKE");
    }

    const url = `${AOCUBO_API_BASE}?${params.toString()}`;
    console.log("[PropertyService] Fetching:", url);

    const response = await fetch(url, {
        headers: {
            "Accept": "application/json",
            "User-Agent": "Mozilla/5.0 (compatible; ADJSImoveisLanding/1.0)",
        },
    });

    if (!response.ok) {
        throw new Error(`AoCubo API responded with ${response.status}: ${await response.text()}`);
    }

    const raw: RawPropertiesResponse = await response.json();

    const result: PropertiesResponse = {
        properties: (raw.content ?? []).map(normalise),
        total: raw.totalElements ?? 0,
        page: raw.page ?? (raw.number !== undefined ? raw.number + 1 : opts.page),
        totalPages: raw.totalPages ?? 1,
    };

    console.log(`[PropertyService] Fetched ${result.properties.length} properties (total: ${result.total})`);

    return result;
}

export async function getPropertyBySlug(slug: string): Promise<Property> {
    console.log(`[PropertyService] Fetching property by slug: ${slug}`);

    const params = new URLSearchParams();
    params.set("page", "0");
    params.set("size", "1");
    params.set("search[property.slug][value]", slug);
    params.set("search[property.slug][type]", "EQUAL");

    const url = `${AOCUBO_API_BASE}?${params.toString()}`;

    const response = await fetch(url, {
        headers: {
            "Authorization": "Bearer undefined",
            "Accept": "application/json",
            "User-Agent": "Mozilla/5.0 (compatible; ADJSImoveisLanding/1.0)",
        },
    });

    if (!response.ok) {
        throw new Error(`AoCubo API responded with ${response.status}`);
    }

    const raw: RawPropertiesResponse = await response.json();

    if (!raw.content || raw.content.length === 0) {
        throw new Error("Imóvel não encontrado.");
    }

    const basicProperty = raw.content[0];

    // Supplement with full data from the direct ID endpoint to get ALL images
    try {
        console.log(`[PropertyService] Supplementing slug fetch with full ID fetch for: ${basicProperty.id}`);
        return await getPropertyById(String(basicProperty.id));
    } catch (e) {
        console.error("[PropertyService] Failed to supplement fetch, returning basic data:", e);
        return normalise(basicProperty);
    }
}

export async function getPropertyById(id: string): Promise<Property> {
    const url = `${AOCUBO_API_BASE}/${id}`;
    console.log("[PropertyService] Fetching full property details:", url);

    const response = await fetch(url, {
        headers: {
            "Authorization": "Bearer undefined",
            "Accept": "application/json",
            "User-Agent": "Mozilla/5.0 (compatible; ADJSImoveisLanding/1.0)",
        },
    });

    if (!response.ok) {
        // Fallback to search if direct ID fails (some items might not exist in the direct endpoint)
        console.warn(`[PropertyService] Direct ID fetch failed (${response.status}), falling back to search`);
        const params = new URLSearchParams();
        params.set("page", "0");
        params.set("size", "1");
        params.set("search[property.id][value]", id);
        params.set("search[property.id][type]", "EQUAL");

        const searchUrl = `${AOCUBO_API_BASE}?${params.toString()}`;
        const searchResp = await fetch(searchUrl, {
            headers: {
                "Authorization": "Bearer undefined",
                "Accept": "application/json",
            }
        });
        if (!searchResp.ok) throw new Error("Property not found");
        const sr = await searchResp.json();
        if (!sr.content || sr.content.length === 0) throw new Error("Not found");
        return normalise(sr.content[0]);
    }

    const raw: RawProperty = await response.json();
    return normalise(raw);
}

export async function fetchPropertiesByIds(ids: string[]): Promise<Property[]> {
    if (ids.length === 0) return [];
    const promises = ids.map(id => getPropertyById(id).catch(() => null));
    const results = await Promise.all(promises);
    return results.filter((p): p is Property => p !== null);
}

export async function fetchPropertiesBySlugs(slugs: string[]): Promise<Property[]> {
    if (slugs.length === 0) return [];

    // For now, let's fetch them sequentially or in parallel 
    // because doing batch fetch that depends on OR logic on slugs might be complex for this API
    const promises = slugs.map(slug => getPropertyBySlug(slug).catch(() => null));
    const results = await Promise.all(promises);
    return results.filter((p): p is Property => p !== null);
}
