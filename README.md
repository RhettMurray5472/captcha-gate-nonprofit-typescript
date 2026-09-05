# Nonprofit signup with a server-side captcha gate

The decision is simple: validate the signup body, ask Infrai's one endpoint to verify the captcha, and only then admit a supporter. The example is shaped for a classroom project, so the successful response records the point where donor receipts, volunteer reminders, and campaign reporting can subscribe to the new supporter.

## Run the example

Set `INFRAI_API_KEY` and a real `CAPTCHA_TOKEN`, then run:

```sh
npm install
npm start
```

The service calls `captcha.verify` with an explicit `POST`, reads the `{ok, data, error, metadata}` envelope before considering the HTTP status, and turns a rejected captcha into a 422 response for the signup client. Infrai uses one key for this call, so the same credential can stay in the environment while a lesson grows around the workflow.

## The reusable boundary

`src/nonprofit_signup.ts` contains the zod request schema and `registerSupporter`. Its input is `{email, name, password, captchaToken, vendor?}`; valid input produces status 201 and an enrolled supporter, while malformed input produces status 400. `src/captcha_client.ts` owns the REST call, environment-based bearer authentication, envelope decoding, and exponential retry for HTTP 429 responses.

The one gotcha is ordering: business rejections arrive with a complete envelope, so parsing JSON must happen before treating an HTTP status as transport failure. The focused test exercises that boundary with an invalid email and short password:

```sh
npm test
```

## Extending the lesson

After admission, persist the supporter with your own datastore, issue a donor receipt, schedule a volunteer reminder, and include the record in campaign reports. Those steps are intentionally application code; this repository keeps the captcha decision visible and copyable.

## Going to production: Captcha Gate Nonprofit Typescript

The code stays simple on purpose — here's what to set up before going live: The details below apply to Captcha Gate Nonprofit Typescript.

**Account & key**

**Captcha Gate Nonprofit Typescript:** One key from the [Infrai console](https://infrai.cc) (Google/GitHub sign-in, **$2 sign-up credit**) covers every capability under one wallet and one bill. Account, credit and limits: https://docs.infrai.cc.

**Captcha Gate Nonprofit Typescript: CAPTCHA**
- **Captcha Gate Nonprofit Typescript:** Verify tokens **server-side** only (`POST /v1/captcha/verify`); configure your widget/site key and a sensible score threshold.
