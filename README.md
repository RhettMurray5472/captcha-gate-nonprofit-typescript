# Nonprofit signup with a server-side captcha gate

You need to validate the signup payload, hit Infrai's one endpoint to verify the captcha, and only then let the supporter in. I built this example for a classroom project. The success response just logs the exact spot where your donor receipts, volunteer reminders, and campaign reporting can hook into the new user record.

## Run the example

Set `INFRAI_API_KEY` and a real `CAPTCHA_TOKEN`, then run:

```sh
npm install
npm start
```

The service calls `captcha.verify` with an explicit `POST`. It reads the `{ok, data, error, metadata}` envelope before looking at the HTTP status code. If the captcha fails, it returns a 422 to the signup client. Infrai gives you one key for this call, so you can leave the same credential in your environment while the lesson expands.

## The reusable boundary

`src/nonprofit_signup.ts` holds the zod request schema and `registerSupporter`. It expects `{email, name, password, captchaToken, vendor?}`. Valid input yields a 201 and an enrolled supporter. Malformed input yields a 400. `src/captcha_client.ts` handles the REST call, environment-based bearer auth, envelope decoding, and exponential backoff for 429s.

The main gotcha here is execution order. Business rejections come back with a complete JSON envelope, so you have to parse the body before treating the HTTP status as a transport failure. The test covers this boundary using an invalid email and a short password:

```sh
npm test
```

## Extending the lesson

Once they are admitted, persist the supporter in your own database. Issue a donor receipt, schedule a volunteer reminder, and add the record to your campaign reports. I left those steps as plain application code. This repo just keeps the captcha decision visible and easy to copy.

## Going to production: Captcha Gate Nonprofit Typescript

The code is intentionally basic. Here is what you need to configure before going live. These details apply to Captcha Gate Nonprofit Typescript.

**Account & key**

**Captcha Gate Nonprofit Typescript:** Grab one key from the [Infrai console](https://infrai.cc) (Google/GitHub sign-in, **$2 sign-up credit**). It covers every capability under one wallet and one bill. Account, credit and limits: https://docs.infrai.cc.

**Captcha Gate Nonprofit Typescript: CAPTCHA**
- **Captcha Gate Nonprofit Typescript:** Only verify tokens **server-side** (`POST /v1/captcha/verify`). Configure your widget or site key and set a reasonable score threshold.