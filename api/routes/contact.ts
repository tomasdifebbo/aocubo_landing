import { Router, Request, Response } from "express";
import { Resend } from "resend";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("[Contact] RESEND_API_KEY not set, skipped email sending.");
      return res.json({ success: true, message: "Lead recebido (e-mail pulado por falta de configuração)." });
    }
    const resend = new Resend(apiKey);
    const { name, email, phone, message, favorites } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Nome e e-mail são obrigatórios." });
    }

    const { data, error } = await resend.emails.send({
      from: "ADJ'S Imóveis <onboarding@resend.dev>",
      to: ["marketing@aocubo.com"], // You can change this to your preferred email
      subject: `Novo Lead: ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
          <h2 style="color: #0f172a; border-bottom: 2px solid #0f172a; padding-bottom: 10px;">Novo Interesse em Imóvel</h2>
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>E-mail:</strong> ${email}</p>
          <p><strong>Telefone:</strong> ${phone || "Não informado"}</p>
          <p><strong>Mensagem:</strong> ${message || "Sem mensagem"}</p>
          
          ${favorites && favorites.length > 0 ? `
            <h3 style="margin-top: 30px; color: #0f172a;">Imóveis Favoritados:</h3>
            <ul style="list-style: none; padding: 0;">
              ${favorites.map((fav: any) => `
                <li style="margin-bottom: 15px; padding: 10px; background: #f8fafc; border-radius: 8px;">
                  <strong style="display: block;">${fav.title}</strong>
                  <span style="color: #64748b; font-size: 0.9em;">${fav.neighborhood} - ${fav.priceFormatted}</span><br>
                  <a href="${fav.url}" style="color: #0f172a; font-size: 0.8em; text-decoration: underline;">Ver imóvel no site</a>
                </li>
              `).join('')}
            </ul>
          ` : '<p><i>Nenhum imóvel favoritado.</i></p>'}
          
          <div style="margin-top: 30px; font-size: 0.8em; color: #94a3b8; text-align: center; border-top: 1px solid #eee; pt-10;">
            Este e-mail foi gerado automaticamente pelo portal ADJ'S Imóveis.
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
      return res.status(500).json({ error: "Erro ao enviar e-mail." });
    }

    res.json({ success: true, data });
  } catch (err: any) {
    console.error("Contact API error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
