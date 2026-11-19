# NagriVanta — Local Development Setup

This guide explains how to run the web client and backend locally, with an optional Expo mobile client.

## 1. Prerequisites

- Node.js 20 or newer (Node.js 22 is used by the repository CI workflow).
- npm.
- Git.
- Internet access for package installation and, on the first quick-demo run, the temporary MongoDB binary download.
- MongoDB Community Server or MongoDB Atlas only for persistent local development.
- Expo Go or a supported simulator for mobile testing.

Check the installed tools:

```bash
node --version
npm --version
git --version
```

## 2. Clone the repository

```bash
git clone https://github.com/naitik2043/NagriVanta.git
cd NagriVanta
```

## 3. Quick demo (recommended)

The repository provides `npm run demo` in the `server` package. It starts a temporary MongoDB instance in memory, seeds sample departments, users and complaints, then starts the Express API.

No Atlas account, local MongoDB service, or Gemini key is required.

**Terminal 1 — backend**

```bash
cd server
npm install
npm run demo
```

Keep this terminal running. On the first launch, `mongodb-memory-server` may download a MongoDB binary; internet access is required for that first download.

**Terminal 2 — web app**

```bash
cd client
npm install
npm run dev
```

Open the Vite URL, normally [http://localhost:5173](http://localhost:5173/).

### Local demo accounts

All local demo users created by the demo seed use `Demo@12345`.

| Role | Email |
| --- | --- |
| Admin | `admin@nagrivanta.local` |
| Citizen | `citizen1@nagrivanta.local` |
| Ghaziabad PWD | `pwd.officer@nagrivanta.local` |
| Ghaziabad Sanitation | `san.officer@nagrivanta.local` |
| Ghaziabad Water | `jal.officer@nagrivanta.local` |
| Ghaziabad Electrical | `ele.officer@nagrivanta.local` |
| Ghaziabad Drainage | `drn.officer@nagrivanta.local` |
| Noida PWD | `noida.pwd.officer@nagrivanta.local` |
| Noida Sanitation | `noida.san.officer@nagrivanta.local` |
| Noida Water | `noida.jal.officer@nagrivanta.local` |
| Noida Electrical | `noida.ele.officer@nagrivanta.local` |
| Noida Drainage | `noida.drn.officer@nagrivanta.local` |

This password is for disposable local demo data only. Do not use it for hosted, production, or shared accounts.

**Data lifecycle:** all in-memory demo records disappear when the demo server stops. Restarting the command creates a fresh sample dataset.

## 4. Persistent local development

Use this mode when you want database data to remain after server restarts.

### Backend environment

```bash
cd server
npm install
```

Copy the environment example:

**Windows PowerShell**
```powershell
Copy-Item .env.example .env
```

**macOS / Linux**
```bash
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/nagrivanta
JWT_SECRET=replace-with-a-long-random-string
CORS_ORIGINS=http://localhost:5173,http://localhost:8081
```

Generate a strong local secret:

```bash
node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
```

Make sure the MongoDB service is running and the URI is correct.

### Optional: seed sample data into the local database

```bash
npm run seed
```

> **Destructive operation:** the seed script deletes the NagriVanta collections in the database referenced by `MONGODB_URI` before creating the sample data. Only run it against a disposable local development database. Never run it against production, a shared database, or a database containing data you need.

For a persistent shared test database, set a private `SEED_PASSWORD` in `server/.env` before seeding. Do not publish or reuse that password.

### Start the API

```bash
npm run dev
```

The backend listens on `http://localhost:5000`.

## 5. Start the web client

The Vite configuration proxies `/api`, `/uploads` and `/health` to `http://localhost:5000`.

```bash
cd client
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173/).

If the API is running on another host, copy `client/.env.example` to `client/.env` and set `VITE_API_URL` to the API origin, for example:

```env
VITE_API_URL=http://localhost:5000
```

Restart Vite after changing environment variables.

## 6. Start the mobile app

Start the backend first, then:

```bash
cd mobile
npm install
```

Copy `mobile/.env.example` to `mobile/.env` and configure the API address reachable from the device.

| Device / runtime | Example API URL |
| --- | --- |
| Android emulator | `http://10.0.2.2:5000` |
| iOS simulator | `http://localhost:5000` |
| Expo web on the same computer | `http://localhost:5000` |
| Physical phone on same Wi-Fi | `http://YOUR_COMPUTER_LAN_IP:5000` |

A physical phone's `localhost` is the phone itself, not your development computer. Use the computer's LAN IPv4 address (Windows: `ipconfig`; macOS/Linux: `hostname -I`). Keep both devices on the same network and allow the API port through the computer firewall.

Start Expo:

```bash
npx expo start
```

Use the QR code or Expo development tools to open the app on a device or simulator.

## 7. Optional Gemini integration

The application works without Gemini. The local Naive Bayes classifier and deterministic rules remain available as the fallback.

To enable Gemini for local development, create a key through the Google AI Studio dashboard and add it to the ignored local `server/.env` file:

```env
GEMINI_API_KEY=your-private-key
```

Never commit the actual key. Restart the backend after modifying the file.

## 8. Verify the local services

With the backend running, check:

| URL | Expected purpose |
| --- | --- |
| [http://localhost:5000/health](http://localhost:5000/health) | Basic API and dependency status |
| [http://localhost:5000/health/live](http://localhost:5000/health/live) | Process liveness |
| [http://localhost:5000/health/ready](http://localhost:5000/health/ready) | Database readiness |
| [http://localhost:5000/api/docs](http://localhost:5000/api/docs) | Swagger UI |
| [http://localhost:5000/api/openapi.json](http://localhost:5000/api/openapi.json) | OpenAPI JSON |
| [http://localhost:5000/open311/v2/services.json](http://localhost:5000/open311/v2/services.json) | Open311 service catalogue |

A successful `/health/ready` response means the database connection is ready for database-backed requests.

## 9. Run project checks

Backend tests:

```bash
cd server
npm ci
npm test
```

Web lint and production build:

```bash
cd client
npm ci
npm run lint
npm run build
```

Mobile web export:

```bash
cd mobile
npm ci
npx expo export --platform web
```

## 10. Troubleshooting

| Symptom | Checks / solution |
| --- | --- |
| `MONGODB_URI is not set` | Use the quick demo command, or set `MONGODB_URI` in `server/.env` for persistent mode. |
| JWT secret startup error | Set a non-placeholder `JWT_SECRET` in `server/.env`. |
| MongoDB connection timeout | Verify the local service is running or verify the Atlas URI and network access. |
| Login fails in local demo | Confirm the `npm run demo` process is still running and use the local demo email/password exactly. |
| Web UI loads but requests fail | Confirm the API is on port 5000 and Vite is using the expected proxy/API origin. |
| Port is already in use | Stop the process using the port or change local port and proxy settings consistently. |
| Gemini unavailable | Expected when no key is set or provider is unavailable; local fallback is designed to continue triage. |
| Expo phone cannot reach API | Use the computer's LAN IP rather than `localhost`; check same Wi-Fi and firewall. |
| First in-memory database launch fails | Check internet access for the initial MongoDB binary download, then retry. |
| Seeded data unexpectedly disappeared | In-memory demo data is temporary. Use persistent local MongoDB for data that must survive restarts. |

## Security reminders

- Keep all real credentials in local ignored environment files or the deployment secret store.
- Do not paste production passwords, MongoDB URIs, API keys or JWT secrets into the README, issues, screenshots or commits.
- Never run `npm run seed` against production or shared data.
- Use synthetic or authorised test data only.
