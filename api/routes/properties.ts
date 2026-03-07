import { Router, Request, Response } from "express";
import { fetchProperties, getPropertyBySlug, getPropertyById, fetchPropertiesByIds } from "../services/propertyService";

const router = Router();

/**
 * GET /api/properties
 */
router.get("/", async (req: Request, res: Response) => {
    try {
        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const limit = Math.min(24, Math.max(1, parseInt(req.query.limit as string) || 6));
        const bedrooms = req.query.bedrooms ? parseInt(req.query.bedrooms as string) : undefined;
        const minPrice = req.query.minPrice ? parseInt(req.query.minPrice as string) : undefined;
        const maxPrice = req.query.maxPrice ? parseInt(req.query.maxPrice as string) : undefined;
        const status = req.query.status as string | undefined;
        const neighborhood = req.query.neighborhood as string | undefined;

        const result = await fetchProperties({ page, limit, bedrooms, minPrice, maxPrice, status, neighborhood });

        res.json(result);
    } catch (error) {
        console.error("[API] Error fetching properties:", error);
        res.status(500).json({ error: "Erro ao buscar imóveis. Tente novamente mais tarde." });
    }
});

/**
 * POST /api/properties/extract
 */
router.post("/extract", async (req: Request, res: Response) => {
    try {
        const { url } = req.body;
        if (!url || typeof url !== "string") {
            return res.status(400).json({ error: "A URL do imóvel é obrigatória." });
        }

        // Extract slug from URL if it's a full URL, or use as is
        let slug = url;
        const match = url.match(/\/imovel\/([^/?#]+)/);
        if (match && match[1]) {
            slug = match[1];
        }

        const property = await getPropertyBySlug(slug);
        res.json(property);
    } catch (error: any) {
        console.error("[API] Error extracting property:", error);
        res.status(400).json({ error: error.message || "Erro ao extrair imóvel." });
    }
});

router.get("/s/:slug", async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
        const property = await getPropertyBySlug(slug);
        res.json(property);
    } catch (error: any) {
        console.error("[API] Error fetching property by slug:", error);
        res.status(404).json({ error: error.message || "Imóvel não encontrado." });
    }
});

router.get("/i/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const property = await getPropertyById(id);
        res.json(property);
    } catch (error: any) {
        console.error("[API] Error fetching property by ID:", error);
        res.status(404).json({ error: error.message || "Imóvel não encontrado." });
    }
});

router.post("/batch", async (req: Request, res: Response) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids)) {
            return res.status(400).json({ error: "Ids must be an array." });
        }
        const results = await fetchPropertiesByIds(ids);
        res.json({ properties: results });
    } catch (error: any) {
        console.error("[API] Error batch fetching properties:", error);
        res.status(500).json({ error: "Batch fetch failed." });
    }
});

export default router;
