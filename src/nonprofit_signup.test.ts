import assert from "node:assert/strict";
import { registerSupporter } from "./nonprofit_signup.ts";

const rejected = await registerSupporter({ email: "bad", name: "", password: "short", captchaToken: "" });
assert.equal(rejected.status, 400);
assert.equal((rejected.body as any).error.code, "INVALID_ARGUMENT");
console.log("signup boundary test passed");
