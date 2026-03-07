import express from "express";
import { Router, Request, Response } from "express";
import { Resend } from "resend";

// ─── TYPES (Inline for safety) ──────────────────────────────────────────────
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
  units: any[];
  type: string;
  address?: string;
}

// ─── SERVICES ─────────────────────────────────────────────────────────────
const AOCUBO_API_BASE = "https://api.aocubo.com/api/v1/aocubo/properties";

// ─── CACHE ────────────────────────────────────────────────────────────────
const cache = new Map<string, { data: any, timestamp: number }>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

async function fetchAocubo(endpoint: string, params: Record<string, string | number> = {}) {
  const url = new URL(`${AOCUBO_API_BASE}${endpoint}`);
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined) url.searchParams.set(key, String(val));
  });

  const cacheKey = url.toString();
  const cached = cache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    return cached.data;
  }

  const response = await fetch(url.toString(), {
    headers: {
      "Accept": "application/json",
      "X-Platform": "web"
    }
  });

  if (!response.ok) {
    if (cached) return cached.data; // Serve stale if error
    throw new Error(`AoCubo API error: ${response.status}`);
  }

  const data = await response.json();
  cache.set(cacheKey, { data, timestamp: Date.now() });
  return data;
}

function parseDescription(desc: any): string {
  if (!desc) return "";
  if (typeof desc !== "string") return "";
  // Try to parse Quill Delta JSON format
  if (desc.startsWith("[{") || desc.startsWith('{"')) {
    try {
      const parsed = JSON.parse(desc);
      if (Array.isArray(parsed)) {
        return parsed.map((op: any) => op.insert ?? "").join("").trim();
      }
    } catch { }
  }
  return desc;
}

function normalizeProperty(raw: any): PropertyData {
  const units = Array.isArray(raw.units) ? raw.units : [];
  const mainUnit = units[0] || {};

  const getString = (val: any, fallback: string): string => {
    if (typeof val === 'string') return val;
    if (val && typeof val === 'object') return val.name || val.title || fallback;
    return fallback;
  };

  // Normalize units with proper type name
  const normalizedUnits = units.map((u: any) => ({
    id: String(u.id),
    price: parseFloat(String(u.price)) || 0,
    bedrooms: u.bedrooms ?? 0,
    bathrooms: u.bathrooms ?? 0,
    livingArea: u.livingArea ?? 0,
    parkingSlots: u.parkingSlots ?? 0,
    type: (() => {
      const rawType = u.unitType?.name;
      // Map unknown/coded types to proper names
      if (!rawType || rawType === "NR" || rawType === "N/A" || rawType === "undefined") {
        return u.bedrooms === 0 ? "Studio" : "Apartamento";
      }
      return rawType;
    })(),
    slug: u.slug || "",
    attachments: Array.isArray(u.attachments) ? u.attachments.filter((a: any) => {
      const url = typeof a === 'string' ? a : a?.url;
      return typeof url === 'string' && /\.(jpg|jpeg|png|webp|gif)/i.test(url);
    }).map((a: any) => ({ id: a.id, url: typeof a === 'string' ? a : a.url })) : []
  }));

  // Find cheapest unit for reference price (ignoring zeros)
  const pricedUnits = normalizedUnits.filter((u: any) => u.price > 0);
  const refUnit = pricedUnits.length > 0
    ? pricedUnits.reduce((min: any, curr: any) => curr.price < min.price ? curr : min)
    : (normalizedUnits[0] || { price: 0, bedrooms: 0, bathrooms: 0, livingArea: 0, parkingSlots: 0 });

  const pVal = Number(refUnit.price || raw.price || mainUnit.price || 0);

  // Collect images with metadata for better filtering
  const propertyImages: { url: string, name: string }[] = [];
  const unitImages: { url: string, name: string }[] = [];
  const urlSet = new Set<string>();

  const processAttachment = (a: any, isUnit: boolean) => {
    const url = typeof a === 'string' ? a : a?.url;
    const name = (typeof a === 'object' && a?.name) ? String(a.name) : "";
    if (typeof url === 'string' && /\.(jpg|jpeg|png|webp|gif)/i.test(url)) {
      if (!urlSet.has(url)) {
        urlSet.add(url);
        if (isUnit) {
          unitImages.push({ url, name });
        } else {
          propertyImages.push({ url, name });
        }
      }
    }
  };

  // Property-level attachments usually have real photos (FACADE, LEISURE, DECORATED)
  if (Array.isArray(raw.attachments)) {
    raw.attachments.forEach((a: any) => processAttachment(a, false));
  }

  // Unit-level attachments are almost ALWAYS floor plans
  units.forEach((u: any) => {
    if (Array.isArray(u.attachments)) {
      u.attachments.forEach((a: any) => processAttachment(a, true));
    }
    if (Array.isArray(u.images)) {
      u.images.forEach((a: any) => processAttachment(a, true));
    }
  });

  // Surgical image categorization
  const catFacade: string[] = [];
  const catInterior: string[] = [];
  const catLeisure: string[] = [];
  const catPlans: string[] = [];
  const catOther: string[] = [];

  const planKeywords = ["planta", "pavimento", "implanta", "floorplan", "layout", "humanizada", "unidade", "unid-", "unid_", "loca", "impl", "plant", "floor", "layo", "croqui"];
  const leisureKeywords = ["academia", "fitness", "ginastica", "kids", "brinquedo", "play", "piscina", "pool", "lazer", "salao", "jogos", "quadra", "churrasqueira", "festa", "pet", "solarium", "deck", "fire", "recre", "bike", "sauna", "gourmet", "spa", "coworking", "lavanderia", "esporte"];
  const facadeKeywords = ["fachada", "perspectiva", "vista", "frente", "externa", "aerea", "drone", "predio"];
  const interiorKeywords = ["living", "sala", "dormitorio", "quarto", "suite", "cozinha", "banheiro", "hall", "decorado", "interior", "varanda", "sacada", "dorm", "wc", "area de servico"];

  const allAttachments = [...propertyImages, ...unitImages];
  allAttachments.forEach(item => {
    const text = (item.url + " " + item.name).toLowerCase();

    if (planKeywords.some(k => text.includes(k))) {
      catPlans.push(item.url);
    } else if (leisureKeywords.some(k => text.includes(k))) {
      catLeisure.push(item.url);
    } else if (facadeKeywords.some(k => text.includes(k))) {
      catFacade.push(item.url);
    } else if (interiorKeywords.some(k => text.includes(k))) {
      catInterior.push(item.url);
    } else {
      catOther.push(item.url);
    }
  });

  // Unique arrays
  const uFacade = [...new Set(catFacade)];
  const uInterior = [...new Set(catInterior)];
  const uLeisure = [...new Set(catLeisure)];
  const uPlans = [...new Set(catPlans)];
  const uOther = [...new Set(catOther)];

  // Smart variety filter: Pick high-value categories for the first slots
  const images: string[] = [];

  // 1. First image MUST be a Facade or Interior if possible
  if (uFacade.length > 0) images.push(uFacade.shift()!);
  else if (uInterior.length > 0) images.push(uInterior.shift()!);

  // 2. Add variety for the next slots (Interiors and Facades only)
  if (uInterior.length > 0) images.push(uInterior.shift()!);
  if (uFacade.length > 0) images.push(uFacade.shift()!);
  if (uInterior.length > 0) images.push(uInterior.shift()!);

  // 3. Fill with remaining interiors, facades, and other uncategorized real photos
  images.push(...uInterior);
  images.push(...uFacade);
  images.push(...uOther);

  // 4. Add Leisure images BEFORE plans
  images.push(...uLeisure);

  // 5. Final slot: ALL Plans are DEFINITELY the last ones
  images.push(...uPlans);

  // Limit and unique result
  const finalImages = [...new Set(images)].slice(0, 40);

  // Map status
  const statusRaw = raw.constructionStatus || raw.status || "";
  let status: "Pronto" | "Em obras" | "Breve lançamento" = "Em obras";
  if (statusRaw === "READY" || statusRaw === "ready" || statusRaw === "COMPLETE") status = "Pronto";
  else if (statusRaw === "UNDER_CONSTRUCTION") status = "Em obras";
  else if (statusRaw === "NEW_DEVELOPMENT") status = "Breve lançamento";

  // Characteristics
  const characteristics = Array.isArray(raw.characteristics)
    ? raw.characteristics.map((c: any) => getString(c, ""))
    : (Array.isArray(raw.features) ? raw.features.map((f: any) => getString(f, "")) : []);

  return {
    id: String(raw.id),
    title: getString(raw.title || raw.name, "Imóvel Premium"),
    slug: raw.slug || String(raw.id),
    description: parseDescription(raw.description),
    price: pVal,
    priceFormatted: pVal.toLocaleString("pt-BR"),
    neighborhood: getString(raw.neighborhood || raw.address?.neighborhood, "São Paulo"),
    bedrooms: Number(refUnit.bedrooms ?? raw.bedrooms ?? mainUnit.bedrooms ?? 0),
    bathrooms: Number(refUnit.bathrooms ?? raw.bathrooms ?? mainUnit.bathrooms ?? 0),
    area: Number(refUnit.livingArea ?? raw.area ?? mainUnit.livingArea ?? 0),
    parkingSlots: Number(refUnit.parkingSlots ?? raw.parkingSlots ?? mainUnit.parkingSlots ?? 0),
    status,
    images: images.length > 0 ? images : ["https://d2xsxph8kpxj0f.cloudfront.net/310519663366689293/jsiKnDEmDWyHsAZxshzkFX/apartment-interior-AsrdjbkKxpBi7u6wHztwSk.webp"],
    url: `https://www.aocubo.com/imovel/${raw.slug || raw.id}/${raw.id}`,
    developer: getString(raw.developer, ""),
    characteristics,
    units: normalizedUnits,
    type: raw.propertyType?.name || (refUnit.bedrooms === 0 ? "Studio" : "Apartamento"),
    address: (() => {
      const addr = raw.address || {};
      const street = addr.address || addr.street || addr.publicPlace || "";
      const number = addr.number || addr.streetNumber || "";
      return street ? (number ? `${street}, ${number}` : street) : "";
    })()
  };
}

// ─── ROUTERS ──────────────────────────────────────────────────────────────

const propertiesRouter = Router();
propertiesRouter.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 6;

    const params: any = {
      page: page, // Fixed: AoCubo 0/1 are both page 1. Using 1-indexed fixes page 2.
      size: limit,
      "_t": Date.now().toString(),
      "search[state.code][value]": "sp",
      "search[state.code][type]": "ILIKE",
      "search[city.name][value]": "sao-paulo",
      "search[city.name][type]": "EQUAL_UNACCENT",
      "order[property.views]": "DESC"
    };

    if (req.query.bedrooms) {
      params["search[units.bedrooms][value]"] = req.query.bedrooms;
      params["search[units.bedrooms][type]"] = "EQUAL";
    }

    if (req.query.neighborhood) {
      const nbh = String(req.query.neighborhood).trim();
      // Ignore city-level terms — all results are already from São Paulo
      const ignoredTerms = ["são paulo", "sao paulo", "sp", "são paulo - sp", "sao paulo - sp", "são paulo/sp", "sao paulo/sp"];
      if (!ignoredTerms.includes(nbh.toLowerCase())) {
        params["search[neighborhood.name][value]"] = nbh;
        params["search[neighborhood.name][type]"] = "ILIKE";
      }
    }

    const priceMin = req.query.minPrice || 0;
    const priceMax = req.query.maxPrice || req.query.price || 99999999;
    if (req.query.minPrice || req.query.maxPrice || req.query.price) {
      params["search[units.price][value]"] = `${priceMin},${priceMax}`;
      params["search[units.price][type]"] = "BETWEEN";
    }

    if (req.query.status) {
      let statusCode = "";
      if (req.query.status === "Em obras") statusCode = "UNDER_CONSTRUCTION";
      else if (req.query.status === "Breve lançamento") statusCode = "NEW_DEVELOPMENT";

      if (req.query.status === "Pronto") {
        params["search[property.constructionStatus][value]"] = "COMPLETE,READY";
        params["search[property.constructionStatus][type]"] = "IN";
      } else if (statusCode) {
        params["search[property.constructionStatus][value]"] = statusCode;
        params["search[property.constructionStatus][type]"] = "EQUAL";
      }
    }

    const data = await fetchAocubo("", params);

    const rawItems = data.content || data.items || data.data || [];
    const total = data.totalElements || data.total || rawItems.length || 0;
    const currentPage = data.page ?? data.currentPage ?? page;
    const totalPages = data.totalPages || Math.ceil(total / limit) || 1;

    // Fetch full details for items with missing price/area OR too few images for cycling
    const properties = await Promise.all(rawItems.map(async (raw: any) => {
      let normalized = normalizeProperty(raw);
      // Only trigger full fetch if data is incomplete or if we have very few images (less than 3)
      if (normalized.price === 0 || normalized.area === 0 || normalized.images.length < 3) {
        try {
          const fullData = await fetchAocubo(`/${raw.id}`);
          return normalizeProperty(fullData);
        } catch {
          return normalized;
        }
      }
      return normalized;
    }));

    res.json({
      properties,
      total,
      page: currentPage,
      totalPages
    });
  } catch (error: any) {
    console.error("Properties Error:", error);
    res.status(500).json({ error: error.message });
  }
});

propertiesRouter.get("/s/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;

    // Search AoCubo by property slug
    const searchData = await fetchAocubo("", {
      page: 0,
      size: 1,
      "search[property.slug][value]": slug,
      "search[property.slug][type]": "EQUAL"
    });

    const items = searchData.content || [];
    if (items.length === 0) {
      return res.status(404).json({ error: "Imóvel não encontrado" });
    }

    const basicProperty = items[0];

    // Now fetch full details by ID to get all images and units
    try {
      const fullData = await fetchAocubo(`/${basicProperty.id}`);
      return res.json(normalizeProperty(fullData));
    } catch {
      // If full fetch fails, return basic data
      return res.json(normalizeProperty(basicProperty));
    }
  } catch (error: any) {
    console.error("Property slug lookup error:", error);
    res.status(404).json({ error: "Imóvel não encontrado" });
  }
});

propertiesRouter.get("/:slug", async (req, res) => {
  try {
    const data = await fetchAocubo(`/${req.params.slug}`);
    res.json(normalizeProperty(data));
  } catch (error: any) {
    res.status(404).json({ error: "Imóvel não encontrado" });
  }
});

propertiesRouter.post("/batch", async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids)) return res.json({ properties: [] });
    // For simplicity, we fetch a large page and filter. 
    // Ideally AoCubo has a batch API, but we'll fallback to this.
    const data = await fetchAocubo("", { limit: 100 });
    const content = data.content || [];
    const filtered = content.filter((p: any) => ids.includes(String(p.id))).map(normalizeProperty);
    res.json({ properties: filtered });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

const contactRouter = Router();
contactRouter.post("/", async (req, res) => {
  try {
    const { name, email, phone, message, favorites } = req.body;
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return res.json({ success: true, message: "No API Key" });

    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: "ADJ'S Imóveis <onboarding@resend.dev>",
      to: ["marketing@aocubo.com"],
      subject: `Novo Lead: ${name}`,
      html: `
        <div style="font-family: sans-serif; color: #333;">
          <h2>Novo Lead Recebido</h2>
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>Telefone:</strong> ${phone}</p>
          <p><strong>E-mail:</strong> ${email}</p>
          <p><strong>Favoritos:</strong> ${favorites?.length || 0} imóveis</p>
          <hr />
          <p><strong>Mensagem:</strong></p>
          <p>${message}</p>
        </div>
      `
    });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ─── APP ──────────────────────────────────────────────────────────────────

const app = express();
app.use(express.json());
app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.use("/api/properties", propertiesRouter);
app.use("/api/contact", contactRouter);
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

export default app;
