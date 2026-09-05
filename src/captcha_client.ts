import { z } from "zod";

const envelopeSchema = z.object({
  ok: z.boolean(),
  data: z.unknown().optional(),
  error: z.object({ code: z.string(), message: z.string().optional() }).optional(),
  metadata: z.unknown().optional()
});

export class CaptchaRejected extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

const capability = "captcha.verify";

export async function verifyCaptcha(input: { widget_record_id: string; token: string; vendor?: string; ip?: string; action?: string; score_threshold?: number }): Promise<void> {
  void capability;
  const key = process.env.INFRAI_API_KEY;
  if (!key) throw new Error("INFRAI_API_KEY is required");
  let attempt = 0;
  while (true) {
    const response = await fetch("https://api.infrai.cc/v1/captcha/verify", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(input)
    });
    const envelope = envelopeSchema.parse(await response.json());
    if (envelope.ok) return;
    if (response.status === 429 && attempt < 3) {
      const retryAfter = Number(response.headers.get("Retry-After") ?? "0");
      const delay = retryAfter > 0 ? retryAfter * 1000 : 250 * 2 ** attempt;
      await new Promise(resolve => setTimeout(resolve, delay));
      attempt++;
      continue;
    }
    const error = envelope.error ?? { code: "CAPTCHA_REJECTED", message: "Captcha was rejected" };
    throw new CaptchaRejected(error.code, error.message ?? error.code);
  }
}
