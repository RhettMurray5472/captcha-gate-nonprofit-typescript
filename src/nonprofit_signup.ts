import { z } from "zod";
import { CaptchaRejected, verifyCaptcha } from "./captcha_client.ts";

export const signupSchema = z.object({
  email: z.string().email(), name: z.string().min(1), password: z.string().min(8),
  captchaToken: z.string().min(1), vendor: z.string().optional()
});
export type SignupInput = z.infer<typeof signupSchema>;

export async function registerSupporter(raw: unknown): Promise<{ status: number; body: object }> {
  const parsed = signupSchema.safeParse(raw);
  if (!parsed.success) return { status: 400, body: { ok: false, error: { code: "INVALID_ARGUMENT", message: "email, name, password and captchaToken are required" } } };
  const input = parsed.data;
  try {
    await verifyCaptcha({ widget_record_id: process.env.CAPTCHA_WIDGET_RECORD_ID ?? "nonprofit_signup", token: input.captchaToken, vendor: input.vendor, action: "nonprofit_signup" });
  } catch (error) {
    if (error instanceof CaptchaRejected) return { status: 422, body: { ok: false, error: { code: error.code, message: error.message } } };
    throw error;
  }
  return { status: 201, body: { ok: true, data: { email: input.email, name: input.name, enrolled: true }, metadata: { next: "donor_receipt_and_volunteer_reminder" } } };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = await registerSupporter({ email: "learner@example.org", name: "Asha", password: "classroom-pass", captchaToken: process.env.CAPTCHA_TOKEN ?? "demo-token", vendor: "turnstile" });
  console.log(JSON.stringify(result, null, 2));
}
