# Staz AI — Production readiness (paid launch gate)

Identity key for meetings, plan, PayPal `custom_id`, OTP, and library: **normalized lowercase email**.

Production domain: `https://1stazai.com`  
Google callback: `https://1stazai.com/api/auth/callback/google`  
PayPal return: `https://1stazai.com/settings?subscription=success`  
PayPal cancel: `https://1stazai.com/settings?subscription=cancel`  
PayPal webhook: `https://1stazai.com/api/paypal/webhook`

Local disk (`data/` or `/tmp`) is allowed only when **not** hosted on Vercel. On Vercel production/preview, missing Blob **fails explicitly** (Hebrew). There is no silent “saved in cloud” behavior.

Health (non-secret):

- `GET /api/health/paypal` — PayPal auth + live plan amount
- `GET /api/health/ops` — Resend / Blob / Google flags
- `GET /api/health` — Blob reachability + STT keys (no secrets)

`ok` is never forced true. If PayPal token auth fails, `authOk=false` and `billing=null`.

---

## Environment usage (no secret values)

| Variable | Read in | Required (prod paid path) | Client-safe? | Expected format | Failure |
| --- | --- | --- | --- | --- | --- |
| `AUTH_SECRET` | `src/auth.ts` | Yes | **No** | Long random (`openssl rand -base64 32`) | Sessions fail |
| `AUTH_URL` | NextAuth, `getAppBaseUrl()` | Yes | Public URL | `https://1stazai.com` no trailing slash | Wrong OAuth/PayPal return URLs |
| `GOOGLE_CLIENT_ID` (aliases: `AUTH_GOOGLE_ID`, `GOOGLE_ID`, `NEXT_PUBLIC_GOOGLE_CLIENT_ID`) | `src/lib/auth-oauth.ts`, `src/auth.ts` | For Google button only | ID yes, **secret no** | `….apps.googleusercontent.com` | Placeholder → Google hidden; `placeholderDetected` |
| `GOOGLE_CLIENT_SECRET` (aliases: `AUTH_GOOGLE_SECRET`, `GOOGLE_SECRET`) | `auth-oauth.ts`, `auth.ts` | With Google ID | **No** | Google Cloud secret | Google OAuth disabled |
| `PAYPAL_MODE` | `src/lib/paypal-plan-inspect.ts` | Yes | Public enum | exactly `live` (trimmed) | Any other value → **sandbox** host `api-m.sandbox.paypal.com` |
| `PAYPAL_CLIENT_ID` | `src/lib/paypal.ts` | Yes | Prefer via `NEXT_PUBLIC_*` only | Live REST app client ID | `configured=false` / token fail |
| `PAYPAL_CLIENT_SECRET` | `src/lib/paypal.ts` | Yes | **No** | Live REST secret matching **same** Live app as the client ID | `authOk=false` (typical sandbox/live mix) |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | Browser SDK, health `clientIdMatch` | Yes | Yes (must equal server ID) | Same string as `PAYPAL_CLIENT_ID` | Checkout UI / `clientIdMatch=false` |
| `PAYPAL_REGULAR_PLAN_ID` or `PAYPAL_PLAN_ID` | `getSubscriptionPlanId()` | Strongly recommended | Plan ID is not a secret but do not paste secrets | **Live** Billing Plan ID (`P-…`) | Auto-create/cache in Blob; may be wrong price — health must compare |
| `PAYPAL_WEBHOOK_ID` | `src/app/api/paypal/webhook/route.ts` | Yes for cancel/sync | **No** (treat as secret) | Webhook ID from **Live** app | Unsigned events **never** change plan |
| `PAYPAL_PRODUCT_ID` | `paypal-subscriptions.ts` | Optional | Catalog ID | Live product ID | Auto-create cached product |
| `PAYPAL_LAUNCH_PLAN_ID` | launch-week path only | No (week ended 2026-06-29) | Plan ID | Unused when launch week off | Ignore |
| `RESEND_API_KEY` | `request-otp/route.ts`, digest mail | Yes for email OTP | **No** | `re_…` | 503 Hebrew; no OTP in JSON |
| `RESEND_FROM_EMAIL` | same | Yes with key | Public From | Verified domain, e.g. `Staz AI <noreply@1stazai.com>` | 503 |
| `BLOB_READ_WRITE_TOKEN` | meetings, users, OTP, usage | **Yes on Vercel** | **No** | Vercel Blob token | Explicit storage error; no fake “saved” |
| `OPENAI_API_KEY` | analysis / Whisper | Yes | **No** | `sk-…` | Processing fails |
| `ASSEMBLYAI_API_KEY` | STT jobs | Yes prod STT | **No** | AssemblyAI key | Job fail / weaker fallback |
| `ASSEMBLYAI_WEBHOOK_SECRET` | AssemblyAI webhook | Optional | **No** | Falls back to `AUTH_SECRET` | Webhook auth fail |

Do not mix **Sandbox** PayPal client/secret/plan/webhook with `PAYPAL_MODE=live`. The server cannot fingerprint a mixed pair from ID shape; failed `authOk` is the signal. The Live plan ID must exist in the **same** Live account as the REST app.

---

## Required Vercel configuration

Set on **Production** (then redeploy). Do not put real secret values in git or this file.

```
PAYPAL_MODE=live
PAYPAL_CLIENT_ID=<real live REST client ID>
PAYPAL_CLIENT_SECRET=<real live REST secret for that same app>
NEXT_PUBLIC_PAYPAL_CLIENT_ID=<same live client ID>
PAYPAL_REGULAR_PLAN_ID=<real live billing plan P-…>   # or PAYPAL_PLAN_ID=
PAYPAL_WEBHOOK_ID=<real live webhook id>
RESEND_API_KEY=<real key>
RESEND_FROM_EMAIL=<verified sender>
BLOB_READ_WRITE_TOKEN=<real blob token>
GOOGLE_CLIENT_ID=<real ….apps.googleusercontent.com>
GOOGLE_CLIENT_SECRET=<real secret>
AUTH_SECRET=<real>
AUTH_URL=https://1stazai.com
OPENAI_API_KEY=<real>
ASSEMBLYAI_API_KEY=<real>
```

Google redirect URI: `https://1stazai.com/api/auth/callback/google`  
PayPal webhook URL: `https://1stazai.com/api/paypal/webhook`

After deploy, `GET /api/health/paypal` must show `authOk=true` and `billing` from the PayPal API (`planId`, `cycle`, `billedAmount`, `currency`, `priceMatchesUi`). UI price is $24.90 USD / month. If `priceMatchesUi` is false, **stop** — do not change the UI.

---

## Environment and services (ops notes)

| Item | Required for paid journey? | Used where | Missing behavior | Safe failure? | Production config | Manual verification |
| --- | --- | --- | --- | --- | --- | --- |
| `AUTH_SECRET` | Yes | NextAuth JWT/session | Auth fails / app mis-signs cookies | Yes — no session | Random 32+ bytes in Vercel Production | Sign in, refresh, second device |
| `AUTH_URL` | Yes | OAuth callbacks, PayPal return URLs, emails | Wrong callback / cookie domain | Fail at provider or redirect | `https://1stazai.com` (no slash) | Google redirect URI matches |
| `OPENAI_API_KEY` | Yes | Analysis / Whisper fallback | Processing fails | Explicit job/API error | Live key, no placeholder | Hebrew meeting → brief |
| `ASSEMBLYAI_API_KEY` | Yes (prod STT) | Jobs, diarization, URL transcribe | STT fails or weaker fallback | Job `failed` | Production key + webhook secret | Upload completes |
| `BLOB_READ_WRITE_TOKEN` | **Yes on Vercel** | Meetings JSON, media, OTP, usage, users | Hosted: 503 Hebrew, no fake save | Yes | Vercel Blob connected to project | Second device `/history` |
| `RESEND_API_KEY` | **Yes for email login** | `POST /api/auth/request-otp` | 503 Hebrew — **OTP is not issued as success** | Yes — no `devCode` | Resend production key | Request OTP, check inbox, no code in JSON |
| `RESEND_FROM_EMAIL` | **Yes with API key** | Same | 503 Hebrew | Yes | Verified domain sender | SPF/DKIM, From header |
| `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` | Required for Google button | NextAuth Google + GIS credential | Button hidden / Google sign-in fails | Yes | Authorized JS origin + redirect URI | Same email as OTP user → same library |
| `PAYPAL_CLIENT_ID` + `PAYPAL_CLIENT_SECRET` | Yes to pay | Create/activate subscription | Hebrew checkout error | Yes | Live app credentials | Sandbox vs live: `PAYPAL_MODE` |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | Yes | Browser PayPal SDK | Checkout UI broken | Visible | **Same value as server client id** | `/api/health/paypal` `clientIdMatch` |
| `PAYPAL_MODE` | Yes | live vs sandbox API host | Charging sandbox in prod | Must be `live` for real money | `live` | Health `mode: live` |
| `PAYPAL_REGULAR_PLAN_ID` | Optional | Pins billing plan (do not recreate casually) | Auto-create/cache in Blob `meetscribe/paypal-plans.json` | Cache may be **old price** | Set after confirming $24.90 | Health `billedAmount` + `priceMatchesUi` |
| `PAYPAL_LAUNCH_PLAN_ID` | No (launch week ended 2026-06-29) | Legacy intro plan | Ignored when launch week inactive | N/A | Leave unset unless supporting old subs | Confirm UI is monthly $24.90 |
| `PAYPAL_PRODUCT_ID` | Optional | Catalog product | Auto-created and cached | Do not delete in PayPal | Document live product id | PayPal dashboard |
| `PAYPAL_WEBHOOK_ID` | **Required for live cancel/past_due sync** | `POST /api/paypal/webhook` | Unsigned live events **ignored** (no plan mutation) | Yes — no forged Pro | Dashboard webhook + id in env | Cancel sub → plan becomes free |
| `NEXT_PUBLIC_APP_URL` / `NEXT_PUBLIC_SITE_URL` | Optional | SEO / fallback base URL | Falls back to `AUTH_URL` / `VERCEL_URL` | Prefer `AUTH_URL` | Same as production domain | Absolute links |
| Session cookies | Yes | `auth()` on all paid APIs | 401 Hebrew | Yes | HTTPS, `AUTH_URL` host | Incognito still needs login |
| `PRO_GRANTED_EMAILS` | No | Comp Pro | Those emails skip PayPal | Ops-only | Empty in public launch unless intended | Confirm list |

---

## OTP

- Sent only via Resend after `assertResendReady()`.
- Response is `{ ok: true }` only. **Never** `devCode`.
- Stored as SHA-256 hash; TTL 10 minutes; consumed on success; 5 verify attempts; 60s resend cooldown; 5 sends/hour.
- Hosted without Blob: OTP store cannot survive instances → explicit storage error.
- Credentials `authorize` returns null unless OTP verifies. Unverified email cannot become a session.

---

## Google

- Session `token.sub` and `token.email` are lowercase email (same key as meetings/PayPal).
- `allowDangerousEmailAccountLinking` links Google to existing email user.

---

## PayPal

Public offer: **Pro — $24.90/month**.

Checkout: authenticated `POST /api/paypal/create-subscription` sets `custom_id` and subscriber email from **session only**. Browser cannot choose the account.

Activation: `POST /api/paypal/activate-subscription` requires session; PayPal `custom_id` (or subscriber email if custom missing) must match session; subscription cannot be linked to another stored user.

Webhooks: live/production apply mutations **only** after PayPal signature verification with `PAYPAL_WEBHOOK_ID`. Duplicate events re-apply the same status (idempotent enough). Cancellation/failure do not grant Pro.

**RELEASE BLOCKER if live plan REGULAR amount ≠ 24.90.** Check `GET /api/health/paypal` → `billing.billedAmount`, `billing.priceMatchesUi`, `billing.planId`. Do not recreate plans in a way that orphans existing subscribers; pin `PAYPAL_REGULAR_PLAN_ID` once verified.

Legacy: lifetime `$19`, launch intro, Enterprise strings remain in unused/legacy modules (`PayPalCheckout`, constants). Public UI/JsonLd use monthly $24.90.

---

## Blob / library

- Writes go to `meetscribe/meetings/{email}/{uuid}.json` (private) plus private media blob.
- Media is **not** a public URL; served via `GET /api/meetings/[id]/media` after session + ownership (60s private cache).
- `persistStatus`: `complete` | `media_missing` | `failed_recoverable`.
- Analysis failure: meeting row kept with media when blob exists.
- Library save failure after analysis: job marked failed; no fake “saved”.
- Sync transcribe **does not delete** the upload blob.

---

## Quotas

Enforced in `canServerTranscribe` / `incrementServerUsage` (Blob `meetscribe/usage/...`). Clearing localStorage does not bypass. Hosted without Blob: transcribe returns storage error (fail closed), not unlimited.

Free: 10 meetings/month, 25 MB. Pro: 100/month, 500 MB. Demo on landing remains anonymous (no quota).

---

## Ownership

`GET/DELETE /api/meetings`, `GET /api/meetings/[id]`, `GET /api/meetings/[id]/media` use `auth()` email. Records live under that email prefix — guessing another user’s UUID does not read their file.

---

## Manual gates (not claimed PASS from code review)

1. Resend delivers OTP in production; network tab has no code.
2. PayPal live charge is **$24.90**.
3. Device A upload → Device B `/history` identical brief/media.
4. Mobile LANDING → DEMO → ACCOUNT → UPLOAD → BRIEF → PRICING → CHECKOUT → LIBRARY without a desktop-only trap.
5. PayPal cancel + return + refresh after success.

Wave 2 `/live` remains out of primary nav; not improved in this phase.

---

## Live production verification — 2026-08-19

Source: public `https://1stazai.com` only. No secrets printed. No live checkout, OTP inbox, phone, or second device was available in this session.

### `GET https://1stazai.com/api/health/paypal`

Observed JSON (abridged, no credentials):

- `configured`: true
- `publicClientId`: true
- `mode`: `"live"`
- `clientIdMatch`: true
- `authOk`: **false**
- `baseUrl`: `https://1stazai.com`
- `blobStorage`: true
- `assemblyai`: true
- `openai`: true
- `billing`: **null** (not loaded because PayPal OAuth token failed)
- `ok`: **false**
- `webhookUrl`: `https://1stazai.com/api/paypal/webhook`

| Field | Required | Observed | Status |
| --- | --- | --- | --- |
| live plan ID | required to compare price | not returned | FAIL |
| billing cycle | REGULAR monthly | not returned | FAIL |
| actual amount | `24.90` | not returned | FAIL |
| currency | USD | not returned from live plan | FAIL |
| UI amount | `$24.90` | code/UI source of truth remains `24.90` | n/a (not compared to live) |
| `priceMatchesUi` | true | **not present** (`billing` is null) | FAIL |

**STOP:** Do not treat UI `$24.90` as the live PayPal charge. Live Billing Plans API was unreachable (`authOk: false`). Typical cause: Live `PAYPAL_CLIENT_ID`/`SECRET` rejected by `https://api-m.paypal.com` (sandbox keys with `PAYPAL_MODE=live`, rotated secret, or whitespace). After deploy, re-check this endpoint; `billedAmount` must be `"24.90"` and `priceMatchesUi` true.

### Other public probes

| Probe | Result |
| --- | --- |
| `GET /api/health` | `ok: true`. Persistence message: Vercel Blob reachable. OpenAI + AssemblyAI keys accepted. Webhook **route** reachable via unsigned HEALTHCHECK probe — this is **not** proof of `PAYPAL_WEBHOOK_ID` or signed PayPal events. |
| `GET /api/auth/config` | `google: true`, `clientId` was the placeholder `your-google-client-id` (not a real Google OAuth client). Google login on production is not a real identity provider until a real client ID is set. |
| `GET /api/paypal/subscription-plan` | HTTP 401 (expected without session) |
| Live PayPal checkout / capture | **NOT TESTED** |
| Signed webhook (success, cancel, failed payment, duplicate) | **NOT TESTED** |
| `/api/user/plan` after payment | **NOT TESTED** |
| Cancel/fail/refresh/duplicate activation | **NOT TESTED** |
| Resend OTP inbox + consume-once | **NOT TESTED** (`resendConfigured` was not on the live health payload until the next deploy) |
| Real Hebrew meeting + media round-trip | **NOT TESTED** |
| Second device `/history` | **NOT TESTED** |
| Real phone QA | **NOT TESTED** |
| User A vs User B IDOR on production | **NOT TESTED** (unit tests only) |
| Production log leak review (OTP/transcripts) | **NOT TESTED** (no log access) |

### After next production deploy (ops checklist)

1. Fix PayPal **Live** REST credentials so `authOk` is true.
2. Confirm `billing.billedAmount === "24.90"` and `billing.priceMatchesUi === true`. If amount differs, **do not change the UI**.
3. Confirm `webhookIdConfigured: true` and run a real subscribe + cancel in PayPal.
4. Replace Google placeholder with a real client ID (or leave Google off).
5. Run OTP, Hebrew upload, second device, and one real phone.

## Live credential verification (ops machine — 2026-08-20)

Using `.env.paypal.paste` against `https://api-m.paypal.com` (secrets not logged):

- OAuth token: **PASS** (`authOk` against Live API)
- Plan `P-6S363313S0138591YNI4UXPQ`: **ACTIVE**
- REGULAR amount: **24.9 USD / MONTH** → matches UI $24.90
- Script: `node scripts/verify-paypal-live.mjs`

Vercel Production env updated for PayPal Client ID/Secret/Mode/Plan IDs.
Placeholder Google Client ID/Secret removed from Production (Google button stays off until a real `….apps.googleusercontent.com` is set).
Resend keys already present on Vercel Production.

After git push / Redeploy, re-check `GET https://1stazai.com/api/health/paypal`.

## Remaining manual production tests

These cannot be certified from the repo:

1. Real OTP inbox
2. Real Hebrew meeting
3. PayPal controlled payment
4. Payment refresh
5. Payment cancellation
6. Second device
7. Media persistence
8. Mobile phone
9. Production IDOR


