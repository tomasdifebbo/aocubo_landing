import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import propertiesRouter from "./routes/properties";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Parse JSON bodies
  app.use(express.json());

  // CORS for local development
  app.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  // ─── API Routes ──────────────────────────────────────────────────────────
  app.use("/api/properties", propertiesRouter);

  app.post("/api/contact", (req, res) => {
    console.log("[Contact API] Received lead:", req.body);
    // Here we could integrate with an email service or CRM
    res.status(200).json({ success: true, message: "Contato recebido com sucesso." });
  });

  // ─── Static / SPA ────────────────────────────────────────────────────────
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing — serve index.html for all non-API routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  // No changes needed for the routes logic, but we need the app to be accessible
  return app;
}

const appPromise = startServer();

// For Vercel serverless functions
export default async (req: any, res: any) => {
  const app = await appPromise;
  return app(req, res);
};

// Also keep the local listener for dev/prod local runs
appPromise.then(app => {
  const port = process.env.PORT || 4000;
  if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}/`);
      console.log(`API available at http://localhost:${port}/api/properties`);
    });
  }
}).catch(console.error);
