import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(to: string, verifyUrl: string) {
  await resend.emails.send({
    from: process.env.EMAIL_FROM || "VidemIA <onboarding@resend.dev>",
    to,
    subject: "Confirme ton adresse email — VidemIA",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Bienvenue sur VidemIA</h2>
        <p>Clique sur le bouton ci-dessous pour confirmer ton adresse email et débloquer ta vidéo gratuite.</p>
        <a href="${verifyUrl}" style="display:inline-block;background:#2ea5ff;color:#04121f;
           padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">
          Confirmer mon email
        </a>
        <p style="color:#888;font-size:12px;margin-top:24px;">
          Ce lien expire dans 1 heure. Si tu n'es pas à l'origine de cette inscription, ignore cet email.
        </p>
      </div>
    `,
  });
}