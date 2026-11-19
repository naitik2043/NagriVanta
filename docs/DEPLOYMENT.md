# NagriVanta — Deployment Guide

The repository contains separate Vercel configurations for the React web client and the Express API. This guide describes the deployment shape and required configuration without exposing credentials or private account identifiers.

## 1. Deployment layout

| Application | Repository root directory | Vercel config | Runtime |
| --- | --- | --- | --- |
| Web client | `client/` | `client/vercel.json` | Vite-built static SPA |
| API | `server/` | `server/vercel.json` | Express handler on Vercel Functions |

Recorded application endpoints:

- Web: [https://nagrivanta-web-topaz.vercel.app](https://nagrivanta-web-topaz.vercel.app/)
- API: [https://nagrivanta-api-iota.vercel.app](https://nagrivanta-api-iota.vercel.app/)
- API docs: [https://nagrivanta-api-iota.vercel.app/api/docs](https://nagrivanta-api-iota.vercel.app/api/docs)

These URLs are taken from the maintained deployment reference. Check the Vercel dashboard and health endpoints before announcing a new deployment or demo.

## 2. Create or configure the Vercel projects

Connect the GitHub repository to two separate Vercel projects:

### Web project

- Set the Root Directory to `client`.
- Use the Vite framework preset or the detected Vite build settings.
- Build command: `npm run build`.
- Output directory: `dist`.
- Add `VITE_API_URL` as an environment variable for the Production environment. Its value must be the API origin, for example `https://nagrivanta-api-iota.vercel.app`.
- The checked-in `client/vercel.json` rewrites application routes to `index.html` for SPA navigation.

### API project

- Set the Root Directory to `server`.
- Use the Node.js / Other framework configuration supported by the project setup.
- The checked-in `server/vercel.json` routes requests to the serverless entry point `api/index.js`.
- It includes the AI model and OpenAPI definition as function files.
- The function max duration is configured as 60 seconds.
- A cron entry is configured for `/api/v1/jobs/sla`; protect this endpoint with `CRON_SECRET`.

Do not publish Vercel team IDs, project IDs, private preview URLs, deployment logs or account-specific access details in repository documentation.

## 3. API environment variables

Configure these in the API project's Vercel **Settings → Environment Variables**. Use separate values for Development, Preview and Production as appropriate.

| Variable | Requirement | Notes |
| --- | --- | --- |
| `MONGODB_URI` | Required | MongoDB connection string for the deployed database |
| `JWT_SECRET` | Required | At least 32 characters in production; use a cryptographically random value |
| `CORS_ORIGINS` | Required in production | Comma-separated exact HTTPS origins allowed to call the API |
| `CRON_SECRET` | Required for protected cron route | Long random secret used by the scheduled SLA endpoint |
| `GEMINI_API_KEY` | Optional | Enables Gemini refinement; local triage fallback remains available |
| `GEMINI_MODEL` | Optional | Defaults to the configured model in `server/src/config/env.js` |
| `GEMINI_FALLBACK_MODEL` | Optional | Secondary Gemini model |
| `AI_TIMEOUT_MS` | Optional | Gemini request timeout |
| `SLA_CHECK_MINUTES` | Optional | Local process SLA polling interval; Vercel cron schedule is in `server/vercel.json` |
| `AUTO_ASSIGN` | Optional | Set to `false` to disable automatic case assignment |
| `APP_TZ_OFFSET` | Optional | Time-zone offset used for date-only filters |
| `RISK_WEATHER` | Optional | Set to `off` to disable weather-based risk inputs |
| `OPEN311_API_KEYS` | Optional | Comma-separated partner API keys |
| `WEBHOOK_URL`, `WEBHOOK_SECRET` | Optional | Signed outbound webhook configuration |

The complete variable list and safe placeholders are in [server/.env.example](../server/.env.example).

### Production validation

The API's production configuration check enforces:

- A valid MongoDB connection URI.
- A JWT secret with at least 32 characters and no placeholder prefix.
- At least one valid HTTPS origin in `CORS_ORIGINS`.

Example origin value (replace with the real web origin for the deployment):

```env
CORS_ORIGINS=https://nagrivanta-web-topaz.vercel.app
```

Do not add trailing paths to allowed origins. Use the origin only.

## 4. MongoDB configuration

1. Create or select the database deployment intended for NagriVanta.
2. Create a database user with only the permissions the application needs.
3. Copy the connection URI into the API project's `MONGODB_URI` setting.
4. Configure Atlas network access for the deployed API environment using an appropriate secure network policy.
5. Confirm the API can connect by checking `/health/ready`.

Never place the actual MongoDB URI, database password, or an exported database snapshot in the repository.

## 5. Web client environment

The web client reads:

```env
VITE_API_URL=https://nagrivanta-api-iota.vercel.app
```

Vite embeds `VITE_*` variables in the built client. Do not place secrets in `VITE_*` variables; they are public to users of the browser application.

The web client uses the configured origin for its `/api/v1` requests and media URLs. Redeploy the web project after changing the value.

## 6. Deploy and verify

Deploy through the authorised Vercel project workflow. After each production deployment:

1. Inspect the deployment status and build output in the Vercel dashboard.
2. Check `https://YOUR_API_HOST/health`.
3. Check `https://YOUR_API_HOST/health/ready` and confirm the database is up.
4. Open `/api/docs` and `/api/openapi.json`.
5. Open the web application and verify login and a resident flow using an approved test account.
6. Verify the correct staff roles can access their queues and that role restrictions remain effective.
7. Verify upload/media access and any scheduled SLA job configuration.
8. Review application logs for runtime errors; do not paste logs containing sensitive values into public issues.

A successful frontend build alone does not prove that the API, database, authentication, uploads or role-based flows are working.

## 7. Credential rotation and incident response

If a secret has been shared in a chat, terminal recording, screenshot, deployment log, or Git commit:

1. Treat it as exposed.
2. Rotate the credential with its provider (MongoDB, Google AI Studio, or the relevant secret issuer).
3. Update the Vercel environment variable.
4. Redeploy the affected project.
5. Confirm the previous credential no longer works.
6. Review repository history and deployment logs for accidental exposure.

Vercel does not reveal saved secret values as ordinary plaintext after they have been stored. Issue a new value from the provider when rotation is required.

## 8. Production safety

- Do not run `npm run seed` against production. The seed script deletes NagriVanta collections before inserting sample data.
- Do not publish production passwords, private preview URLs, API keys, JWT/cron secrets, database URIs, team IDs or project IDs.
- Use a documented admin-approved account recovery process for staff login issues.
- Test changes in a separate environment before production.
- Treat AI classification, priority and evidence checks as decision support, not automatic authority.
