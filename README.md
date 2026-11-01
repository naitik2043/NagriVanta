# NagriVanta

NagriVanta is a civic issue reporting and resolution platform for Indian cities. It helps residents report local problems, helps municipal teams triage and resolve them, and gives communities transparent progress updates.

**AI recommends. Rules validate. People decide.** Reports receive an immediate result from the built-in classifier and routing rules. Optional Gemini analysis can refine the suggestion in the background; authorised staff remain responsible for decisions.

## Project links

- **Vercel web app and API:** Deployment links will be added after this repository's Vercel deployment is verified.
- **User guide:** [docs/NagriVanta-User-Guide.pdf](docs/NagriVanta-User-Guide.pdf)
- **Repository:** [github.com/naitik2043/NagriVanta](https://github.com/naitik2043/NagriVanta)

The demo is an independent pilot for Ghaziabad and Noida. Its sample data is synthetic; it is not an official government service or emergency service.

## What it does

- Submit civic reports with text, voice, location, photos, or short video.
- Classify and prioritise reports, identify possible duplicates, and route cases to municipal departments.
- Track case status, notifications, service-level deadlines, and an auditable history.
- Require resolution evidence and support resident feedback, ratings, and reopening.
- Provide role-based workflows for residents, officers, and administrators.
- Explore maps, ward analytics, public scorecards, and anonymised open data.
- Support English and Hindi, installable web/PWA use, and an offline submission queue.
- Offer a companion mobile app built with Expo and React Native.
- Expose an Open311 GeoReport v2-compatible API and signed outbound webhooks.

## Technology

| Component | Technologies |
|---|---|
| Web client (`client/`) | React 19, Vite, Tailwind CSS, React Router, Leaflet, Recharts |
| API (`server/`) | Node.js 20+, Express 5, MongoDB/Mongoose, Zod, JWT |
| AI and media | JavaScript Naive Bayes classifier, optional Google Gemini, Sharp, Exifr |
| Mobile (`mobile/`) | Expo SDK 58, React Native, Expo Router |
| Hosting | Vercel (separate web and API deployments) |

## Run locally

### Requirements

- Node.js 20 or newer and npm
- For the quick demo, no MongoDB installation is needed.
- For persistent local development, a MongoDB instance and connection URI are required.

### Quick demo

In one terminal:

```powershell
cd server
npm install
npm run demo
```

This starts the API at `http://localhost:5000` with an in-memory database and seeded sample accounts. All data is discarded when the process stops.

In a second terminal:

```powershell
cd client
npm install
npm run dev
```

Open `http://localhost:5173`. The Vite development server proxies API requests to the local server.

Demo accounts use the password `Demo@12345`:

| Role | Email |
|---|---|
| Administrator | `admin@nagrivanta.local` |
| Resident | `citizen1@nagrivanta.local` |
| Officer (Ghaziabad) | `pwd.officer@nagrivanta.local` |
| Officer (Noida) | `noida.pwd.officer@nagrivanta.local` |

These credentials are for the disposable local demo only. Never use them for a shared or production deployment.

### Persistent API setup

Copy `server/.env.example` to `server/.env`, set `MONGODB_URI` and a strong `JWT_SECRET`, then install and start the API:

```powershell
cd server
npm install
npm run seed
npm run dev
```

**Warning:** `npm run seed` recreates the NagriVanta database collections. Do not run it against a database containing data you need to keep.

The web app can use the local API through the development proxy. To point it elsewhere, copy `client/.env.example` to `client/.env` and set `VITE_API_URL`.

### Optional integrations

| Variable | Purpose |
|---|---|
| `GEMINI_API_KEY` | Enables background Gemini text/photo analysis. The offline classifier works without it. |
| `GEMINI_MODEL`, `GEMINI_FALLBACK_MODEL` | Configure the primary and fallback Gemini models. |
| `CORS_ORIGINS` | Comma-separated browser origins permitted to call the API. |
| `SEED_PASSWORD` | Sets the password used for seeded accounts on a persistent database. |
| `CRON_SECRET` | Protects the scheduled SLA endpoint in a deployment. |
| `OPEN311_API_KEYS` | Comma-separated partner API keys for creating Open311 requests. |
| `WEBHOOK_URL`, `WEBHOOK_SECRET` | Configure signed outbound case-event webhooks. |
| `AUTO_ASSIGN`, `RISK_WEATHER`, `APP_TZ_OFFSET` | Configure routing, weather-based risk alerts, and the application time zone. |

See `server/.env.example`, `client/.env.example`, and `mobile/.env.example` for the complete settings and examples. Keep `.env` files and all credentials out of version control.

## Mobile app

Copy `mobile/.env.example` to `mobile/.env` and set `EXPO_PUBLIC_API_URL` to the API address reachable from the device. For a physical phone, use your computer's LAN IP rather than `localhost`.

```powershell
cd mobile
npm install
npx expo start
```

Use Expo Go to open the app during development. Android emulator users can typically reach the host machine at `http://10.0.2.2:5000`.

## Tests and data

From `server/`:

```powershell
npm test
npm run eval
npm run train
```

- `npm test` runs the API and unit test suites.
- `npm run eval` evaluates the offline classifier against held-out sample data.
- `npm run train` regenerates `server/src/ai/model.json`.

The bundled NYC 311 data comes from NYC Open Data. The Indian civic-report dataset is synthetic and intended for demos and evaluation. See [data/README.md](data/README.md) for sources, licences, and dataset limitations. Results from sample datasets should not be presented as real-world performance.

## Deployment

The web client and API are configured as separate Vercel projects. Deploy `client/` as a static Vite app and `server/` as the API project. Configure the production environment variables in the hosting provider, including `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGINS`, and `VITE_API_URL` as applicable. Set `CRON_SECRET` for the scheduled SLA job.

Do not expose database credentials, signing secrets, or private API keys in client-side environment variables. Review the Vercel configuration in each project before deployment.

## Contact

NagriVanta is maintained by **Naitik Gupta**.

- **GitHub:** [github.com/naitik2043](https://github.com/naitik2043)
- **Portfolio:** [naitikgupta.vercel.app](https://naitikgupta.vercel.app/)
- **Email:** [naitikgupta2043@gmail.com](mailto:naitikgupta2043@gmail.com)

## License

This project is licensed under the MIT License.

Copyright (c) 2026 Naitik Gupta

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
