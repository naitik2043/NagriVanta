# NagriVanta

**A civic issue reporting and resolution platform for residents and municipal teams.**

NagriVanta helps residents report local infrastructure and public-service issues, track progress, and share feedback. Municipal staff can review, classify, assign, and resolve reports through a role-based workflow. The current pilot focuses on **Ghaziabad and Noida, Uttar Pradesh**.

> **AI recommends. Rules validate. People decide.**
>
> Automated classification, priority suggestions, duplicate detection, and evidence checks assist the workflow. Authorised people remain responsible for operational decisions.

<p align="center">
  <a href="https://nagrivanta-web-topaz.vercel.app/"><strong>Open Web App</strong></a> ·
  <a href="https://nagrivanta-api-iota.vercel.app/api/docs"><strong>API Documentation</strong></a> ·
  <a href="https://github.com/naitik2043/NagriVanta"><strong>Source Code</strong></a>
</p>

---

## Contents

- [Live demo](#live-demo)
- [Demo access](#demo-access)
- [Features](#features)
- [How the system works](#how-the-system-works)
- [Technology stack](#technology-stack)
- [Project structure](#project-structure)
- [Run the project locally](#run-the-project-locally)
  - [Option A: Quick demo (recommended)](#option-a-quick-demo-recommended)
  - [Option B: Persistent local development](#option-b-persistent-local-development)
  - [Run the web client](#run-the-web-client)
  - [Run the mobile app](#run-the-mobile-app)
- [Demo walkthrough](#demo-walkthrough)
- [API and health checks](#api-and-health-checks)
- [Troubleshooting](#troubleshooting)
- [Development checks](#development-checks)
- [Security and data safety](#security-and-data-safety)
- [Limitations and responsible use](#limitations-and-responsible-use)
- [Contributing](#contributing)

## Live demo

| Service | Link |
| --- | --- |
| Web application | [nagrivanta-web-topaz.vercel.app](https://nagrivanta-web-topaz.vercel.app/) |
| Backend API | [nagrivanta-api-iota.vercel.app](https://nagrivanta-api-iota.vercel.app/) |
| Swagger / API docs | [Open API documentation](https://nagrivanta-api-iota.vercel.app/api/docs) |
| OpenAPI JSON | [OpenAPI specification](https://nagrivanta-api-iota.vercel.app/api/openapi.json) |
| Open311 service catalogue | [Open311 services](https://nagrivanta-api-iota.vercel.app/open311/v2/services.json) |
| Health check | [API health](https://nagrivanta-api-iota.vercel.app/health) |

The web and mobile applications use the same backend API. Sign in through the common sign-in page; the application routes users according to their account role. There are no separate admin and officer login pages.

**Demo availability note:** these are hosted deployment URLs, not a guarantee that every service or demo account is currently healthy. For a presentation where you need predictable sample data, use the local in-memory demo described below and verify the URLs before presenting.

NagriVanta is an independent civic-tech pilot. It is **not** an official government portal or an emergency-response service.

## Demo access

### Hosted demo

1. Open the [NagriVanta web app](https://nagrivanta-web-topaz.vercel.app/).
2. Select **Sign in**.
3. Use credentials supplied separately by the project maintainer or an authorised demo administrator.
4. The same account can be used in the mobile app.

The repository intentionally does **not** publish production staff passwords, temporary provisioning credentials, API keys, JWT secrets, MongoDB connection strings, or private deployment identifiers. Production demo accounts may be reset or rotated, so credentials from an old setup record should not be assumed to still work. If a hosted login fails, request an approved account reset from the maintainer; do not try local demo credentials against production.

### Local demo accounts

For the local in-memory demo only, the seed script creates these sample roles:

| Role | Local demo email |
| --- | --- |
| Administrator | `admin@nagrivanta.local` |
| Ghaziabad PWD officer | `pwd.officer@nagrivanta.local` |
| Ghaziabad Sanitation officer | `san.officer@nagrivanta.local` |
| Ghaziabad Water officer | `jal.officer@nagrivanta.local` |
| Ghaziabad Electrical officer | `ele.officer@nagrivanta.local` |
| Ghaziabad Drainage officer | `drn.officer@nagrivanta.local` |
| Noida PWD officer | `noida.pwd.officer@nagrivanta.local` |
| Noida Sanitation officer | `noida.san.officer@nagrivanta.local` |
| Noida Water officer | `noida.jal.officer@nagrivanta.local` |
| Noida Electrical officer | `noida.ele.officer@nagrivanta.local` |
| Noida Drainage officer | `noida.drn.officer@nagrivanta.local` |
| Citizen | `citizen1@nagrivanta.local` |

**Local demo password:** `Demo@12345` for the accounts created by the local seed script, unless `SEED_PASSWORD` is set in the local environment. This password is a public, disposable demo value; never reuse it for a hosted or shared account.

## Features

### Resident experience
- Register and sign in as a citizen.
- Submit civic complaints with a description, category, location, and supporting photos or video.
- View personal reports, reference IDs, status changes, and case history.
- Explore nearby reports and provide feedback on resolved work.
- Use location-aware reporting and supported offline draft/queue behaviour.

### Department and administrator workflow
- Role-based access for citizens, department officers, and administrators.
- Review reports and AI-assisted category and priority suggestions.
- Assign cases to the appropriate department and officer.
- Track service-level deadlines, overdue reports, and workload.
- Update case status, add staff notes, and attach resolution evidence.
- Inspect complaint history and integrity information.

### Public information and integrations
- View aggregate public scorecards and risk information.
- Access anonymised open-data exports and public complaint tracking.
- Integrate through the Open311 GeoReport v2-compatible endpoints.
- Use map-based views and analytical dashboards.

### AI-assisted triage
- Built-in local text classification supports English, Hindi, and common Hinglish descriptions.
- Optional Google Gemini analysis can provide additional suggestions.
- Rule-based logic remains available when Gemini is not configured or unavailable.
- AI results are advisory and remain subject to staff review.

## How the system works

```text
Resident (Web / Mobile)
         |
         v
     Express API
         |
         +------ Authentication and role checks
         |
         +------ Validation and media handling
         |
         +------ AI / local classifier + rules
         |
         v
       MongoDB
         |
         v
 Department / Admin workflow
         |
         v
 Status updates, history, notifications
         |
         v
 Resident tracking and feedback
```

At a high level, the React web client and Expo mobile client call the Express API. The API validates requests, applies authentication and role permissions, runs complaint and triage services, and persists application records through Mongoose in MongoDB.

## Technology stack

| Layer | Technologies |
| --- | --- |
| Web client | React, Vite, Tailwind CSS |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose |
| Mobile | Expo, React Native |
| Authentication | JWT, bcryptjs |
| Validation and security | Zod, Helmet, CORS, express-rate-limit |
| AI | Built-in local classifier, optional Google Gemini |
| Maps and visualisation | Leaflet, React Leaflet, Recharts |
| API documentation | OpenAPI, Swagger UI |
| Hosting | Vercel |
| Testing | Node.js test runner, Supertest, mongodb-memory-server |

## Project structure

```text
NagriVanta/
├── client/                 # React + Vite web application
│   ├── src/
│   │   ├── components/     # Reusable UI, maps, charts and shared components
│   │   ├── context/        # Authentication, preferences and theme state
│   │   ├── hooks/          # Reusable React hooks
│   │   └── pages/          # Application pages
│   └── .env.example
│
├── mobile/                 # Expo / React Native application
│   ├── app/                # Mobile screens and navigation
│   └── .env.example
│
├── server/                 # Express API
│   ├── api/                # Vercel serverless entry
│   ├── scripts/            # Demo, seed, evaluation and training scripts
│   ├── src/
│   │   ├── config/         # Environment, database, security and OpenAPI setup
│   │   ├── controllers/    # HTTP request handlers
│   │   ├── middleware/     # Authentication, errors and uploads
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API route definitions
│   │   ├── services/       # Business logic, AI, triage and workflow
│   │   └── validators/     # Request schemas
│   └── tests/              # API, unit and security tests
│
├── data/                   # Bundled synthetic/evaluation datasets
├── docs/                   # Project documentation
└── .github/workflows/      # CI workflow
```

## Run the project locally

### Requirements

- **Node.js 20 or newer** (Node.js 22 is used in CI).
- npm (included with Node.js).
- Git.
- For persistent development: a local MongoDB instance or MongoDB Atlas database.
- For mobile testing: Expo Go or an Android/iOS simulator.

First clone the repository:

```bash
git clone https://github.com/naitik2043/NagriVanta.git
cd NagriVanta
```

### Option A: Quick demo (recommended)

This is the easiest way to demonstrate NagriVanta on a fresh machine. It starts a temporary, in-memory MongoDB instance, seeds sample records, and launches the API. **No MongoDB installation, Atlas account, or Gemini API key is required for this demo mode.**

**Terminal 1 — Start the backend demo**

```bash
cd server
npm install
npm run demo
```

On the first run, `mongodb-memory-server` may need to download a MongoDB binary. Allow that download and ensure the machine has internet access. Keep this terminal open while using the application.

The demo data is temporary and is lost when the process stops. Restarting `npm run demo` creates a fresh demo dataset.

**Terminal 2 — Start the web client**

```bash
cd client
npm install
npm run dev
```

Open the local URL printed by Vite (normally [http://localhost:5173](http://localhost:5173/)).

**Sign in to the local demo**

Use one of the local demo emails in the [local demo accounts](#local-demo-accounts) table and password `Demo@12345`. The development sign-in screen also shows the local demo account hints.

> **Important:** Run `npm run demo` from the `server` directory. Do not run `npm run seed` for the quick demo. The in-memory demo is designed to avoid modifying a persistent database.

### Option B: Persistent local development

Use this option when you need data to remain available after restarting the server.

**1. Configure the backend**

```bash
cd server
npm install
```

Create a local environment file by copying the example:

**Windows PowerShell**
```powershell
Copy-Item .env.example .env
```

**macOS / Linux**
```bash
cp .env.example .env
```

Edit `server/.env` and set at least:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/nagrivanta
JWT_SECRET=replace-with-a-long-random-string
CORS_ORIGINS=http://localhost:5173,http://localhost:8081
```

Generate a strong local JWT secret rather than using the placeholder:

```bash
node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
```

Make sure MongoDB is running and that `MONGODB_URI` points to the database you intend to use.

**2. Create local sample data (optional)**

Only when the target database is a disposable local development database:

```bash
npm run seed
```

The seed script deletes the NagriVanta collections in the database specified by `MONGODB_URI` before inserting sample users, departments, complaints, and history. **Never run it against production, a shared database, or any database containing data you need to keep.**

For a shared test database, set a private `SEED_PASSWORD` in `server/.env` before seeding and share it only with authorised testers.

**3. Start the backend**

```bash
npm run dev
```

The API listens on [http://localhost:5000](http://localhost:5000).

### Run the web client

The Vite development server proxies `/api`, `/uploads`, and `/health` to the backend at `http://localhost:5000`.

In a new terminal:

```bash
cd client
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

For a different API host, copy `client/.env.example` to `client/.env` and set:

```env
VITE_API_URL=https://your-api-host
```

Use the deployed API URL only when you intend to use the hosted backend; local demo accounts exist only in the local demo database.

### Run the mobile app

Start the API first. Then:

```bash
cd mobile
npm install
```

Copy `mobile/.env.example` to `mobile/.env` and set `EXPO_PUBLIC_API_URL`.

Examples:

| Where the mobile app runs | API URL |
| --- | --- |
| Android emulator | `http://10.0.2.2:5000` |
| iOS simulator / Expo web | `http://localhost:5000` |
| Physical phone on the same Wi-Fi | `http://YOUR_COMPUTER_LAN_IP:5000` |

For a physical phone, use your computer's LAN IPv4 address (Windows: `ipconfig`; macOS/Linux: `hostname -I`). Do not use `localhost` from a physical phone: it points to the phone itself. Ensure both devices are on the same network and your firewall allows the development port.

Start Expo:

```bash
npx expo start
```

Use the QR code or Expo development tools to open the app on a device or simulator.

## Demo walkthrough

For a clear end-to-end presentation, follow this sequence:

1. **Open the application:** show the resident landing page and explain the civic issue reporting problem it addresses.
2. **Resident account:** sign in using the local citizen demo account, or register a new local citizen account.
3. **Submit a complaint:** enter a realistic issue description, choose the location, and attach sample evidence if available.
4. **Show triage:** explain how the local classifier/rules suggest a category and priority; Gemini is optional.
5. **Administrator review:** sign out and sign in as the local admin. Open the staff queue and review/assign a complaint.
6. **Officer workflow:** sign in as the relevant department officer, open the assigned complaint, and update its status with an appropriate note/evidence.
7. **Resident tracking:** return to the citizen account and show the updated report timeline and status.
8. **Analytics and public views:** demonstrate aggregate scorecards, maps, and public tracking where available.

For a predictable walkthrough, use the seeded local demo data. Do not demonstrate with real residents' private information.

## API and health checks

When the local backend is running, these routes are useful for verification:

| Endpoint | Purpose |
| --- | --- |
| `GET /health` | Basic API status, database status, and AI mode |
| `GET /health/live` | Process liveness check |
| `GET /health/ready` | Readiness check including a MongoDB ping |
| `GET /api/docs` | Interactive Swagger documentation |
| `GET /api/openapi.json` | OpenAPI specification |
| `GET /open311/v2/services.json` | Open311 service catalogue |

Local examples:

- [http://localhost:5000/health](http://localhost:5000/health)
- [http://localhost:5000/health/ready](http://localhost:5000/health/ready)
- [http://localhost:5000/api/docs](http://localhost:5000/api/docs)

For `/health/ready`, expect HTTP 200 and `db: "up"` when the database is connected. A database-down response means the backend is not ready for normal database-backed requests.

## Troubleshooting

| Problem | What to check |
| --- | --- |
| Web page opens but API requests fail | Make sure the backend is running on port 5000. Check `/health` and the Vite proxy configuration. |
| Backend exits with `MONGODB_URI is not set` | Use `npm run demo`, or configure `MONGODB_URI` in `server/.env` for persistent mode. |
| Backend reports a JWT configuration error | Set a non-placeholder `JWT_SECRET` in `server/.env`. |
| MongoDB connection times out | Check that MongoDB is running, the URI is correct, and Atlas network access allows your IP. |
| Local login fails | Confirm that `npm run demo` is still running, or seed the intended disposable local database. Use the local demo email and password exactly as documented. |
| Hosted staff login fails | Confirm the production URL and email spelling; ask the maintainer to reset/rotate the account. Local demo credentials do not authenticate against production. |
| Gemini is unavailable | This is optional. Leave `GEMINI_API_KEY` empty and use the built-in local classifier/rules fallback. |
| Physical phone cannot reach the API | Set `EXPO_PUBLIC_API_URL` to the computer's LAN IP, not `localhost`; check Wi-Fi and firewall settings. |
| Port 5000 or 5173 is already in use | Stop the process using that port or update the relevant local port/proxy configuration. |
| First demo launch is slow or fails while starting MongoDB memory server | Check internet connectivity and allow the MongoDB binary download; retry after the download completes. |

## Development checks

Run backend tests:

```bash
cd server
npm ci
npm test
```

Lint and build the web application:

```bash
cd client
npm ci
npm run lint
npm run build
```

Export the mobile application for web:

```bash
cd mobile
npm ci
npx expo export --platform web
```

The repository's GitHub Actions workflow runs frontend lint/build, backend tests, and mobile web export on pushes and pull requests targeting `main`.

## Security and data safety

- Never commit `.env` files, API keys, JWT/cron secrets, MongoDB URIs/passwords, or production credentials.
- Keep hosted secrets in the hosting provider's environment-variable settings and local secrets in ignored local environment files.
- Rotate any credential that has been exposed in a chat, log, screenshot, commit, or public location.
- Production staff passwords and private deployment/team identifiers are intentionally excluded from this README.
- Do not publish resident records, private complaint data, access tokens, deployment logs, or screenshots containing confidential information.
- **Never run `npm run seed` against production or a shared database.** It deletes the application's existing collections before inserting demo data.
- Use synthetic or explicitly authorised data for demos and tests.

### Environment variables

The backend reads its configuration from `server/.env`. The variable names and safe example defaults are documented in [server/.env.example](server/.env.example).

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string (required for persistent backend mode) |
| `JWT_SECRET` | Secret used to sign authentication tokens |
| `CRON_SECRET` | Protects the scheduled SLA job endpoint |
| `GEMINI_API_KEY` | Optional Gemini integration key |
| `SEED_PASSWORD` | Optional password override for accounts created by the seed script |
| `CORS_ORIGINS` | Allowed browser origins |
| `PORT` | Local API port |

Do not put real values in this README or in example files. The web client uses `VITE_API_URL`; the mobile app uses `EXPO_PUBLIC_API_URL`.

## Limitations and responsible use

- NagriVanta is an independent pilot and is not an official municipal/government service.
- It must not be used to report emergencies.
- AI suggestions and evidence checks can be wrong; staff must review them with the available evidence.
- Public tracking and aggregate views are designed to avoid exposing reporter contact details. Avoid entering unnecessary personal information.
- Uploaded photos and videos may contain sensitive data; share only what is needed to explain the issue.

## Contributing

Contributions are welcome. Before opening a pull request:

1. Describe the issue and the proposed change.
2. Keep changes focused and include tests where appropriate.
3. Run the relevant lint, build, and test commands.
4. Do not include private resident information, credentials, database connection strings, or production account details in issues, commits, screenshots, or pull requests.

---

<p align="center">
  Built to make civic reporting more transparent, accountable, and accessible.
</p>
