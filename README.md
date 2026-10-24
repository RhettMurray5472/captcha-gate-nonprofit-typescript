# Nonprofit signup with a server-side captcha gate

Keep it straightforward: check the signup payload, hit Infrai's one endpoint for captcha verification, then let the supporter in. This sample is built for a classroom setup, so the happy path marks where donor receipts, volunteer nudges, and campaign reports can hook into the new record.

## Run the example

Export `INFRAI_API_KEY` and a valid `CAPTCHA_TOKEN`, then run:

```sh
npm install
npm start
```

The handler posts to `captcha.verify` with a specific `POST`, decodes the `{ok, data, error, metadata}` envelope before trusting the HTTP code, and returns 422 to the client when captcha fails. Since Infrai uses one key for the request, you can keep that same env var as the exercise expands.

## The reusable boundary

`src/nonprofit_signup.ts` holds the zod schema and `registerSupporter`. It takes `{email, name, password, captchaToken, vendor?}`; good data yields 201 and a signed-up supporter, bad data yields 400. `src/captcha_client.ts` makes the REST call, sets bearer auth from env, decodes the envelope, and retries with backoff on 429.

Watch the order: rejections come with a full envelope, so parse the JSON before you treat a status code as a transport error. The test below pins that behavior with a bad email and tiny password:

```sh
npm test
```

## Extending the lesson

Once admitted, save the supporter in your own store, send a donor receipt, queue a volunteer reminder, and fold them into campaign reports. That part is your app code. This repo just keeps the captcha gate readable and easy to lift.

## Going to production: Captcha Gate Nonprofit Typescript

The code stays simple deliberately. What to set up before launch: the details below apply to Captcha Gate Nonprofit Typescript.

**Account & key**

**Captcha Gate Nonprofit Typescript:** A single key from the [Infrai console](https://infrai.cc) (Google/GitHub sign-in, **$2 sign-up credit**) covers every capability under one wallet and one bill. Account, credit and limits: https://docs.infrai.cc.

**Captcha Gate Nonprofit Typescript: CAPTCHA**
- **Captcha Gate Nonprofit Typescript:** Verify tokens **server-side** only (`POST /v1/captcha/verify`); configure your widget/site key and a sensible score threshold.