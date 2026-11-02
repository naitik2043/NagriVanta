# NagriVanta

**AI-assisted civic issue reporting, resolution tracking, and public accountability for Indian cities.**

NagriVanta is a multi-channel civic issue management platform designed for an independent pilot covering **Ghaziabad and Noida, Uttar Pradesh**. It connects residents with municipal teams through a transparent workflow: citizens submit local problems, the platform helps classify and route them, officers manage resolution, and residents can follow progress with a reference ID.

> **AI recommends. Rules validate. People decide.**
>
> AI-generated categories, priorities, duplicate matches, and evidence checks are decision-support signals. Authorised staff remain responsible for operational decisions.

<p align="center">
  <a href="https://nagrivanta-web-topaz.vercel.app/"><strong>Open Web App</strong></a> ·
  <a href="https://nagrivanta-api-iota.vercel.app/api/docs"><strong>API Documentation</strong></a> ·
  <a href="docs/NagriVanta-User-Guide.pdf"><strong>User Guide</strong></a>
</p>

## Project at a Glance

| Area                | Details                                                                |
| ------------------- | ---------------------------------------------------------------------- |
| Project Type        | Full-stack civic-tech platform                                         |
| Web Application     | React 19 + Vite + Tailwind CSS                                         |
| Backend             | Node.js + Express 5                                                    |
| Database            | MongoDB + Mongoose                                                     |
| AI                  | Offline Naive Bayes and explainable rules, with optional Google Gemini |
| Mobile Application  | Expo + React Native                                                    |
| Deployment          | Separate Vercel deployments for web and API                            |
| Pilot Coverage      | Ghaziabad and Noida                                                    |
| Interface Languages | English and Hindi                                                      |

## Live Project

| Resource              | Link                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------ |
| Web Application       | [NagriVanta Web](https://nagrivanta-web-topaz.vercel.app/)                           |
| Backend API           | [NagriVanta API](https://nagrivanta-api-iota.vercel.app/)                            |
| API Health            | [Health Endpoint](https://nagrivanta-api-iota.vercel.app/health)                     |
| Swagger Documentation | [API Docs](https://nagrivanta-api-iota.vercel.app/api/docs)                          |
| OpenAPI Specification | [OpenAPI JSON](https://nagrivanta-api-iota.vercel.app/api/openapi.json)              |
| Open311 Catalogue     | [Service Catalogue](https://nagrivanta-api-iota.vercel.app/open311/v2/services.json) |
| User Guide            | [NagriVanta User Guide](docs/NagriVanta-User-Guide.pdf)                              |

The application is an independent pilot, not an official government portal or emergency-response service. Demo records are synthetic unless explicitly identified otherwise.

## The Problem

Residents often have no single, clear way to report everyday civic problems, identify the responsible department, and follow a complaint until it is resolved.

On the administration side, reports can be difficult to categorise, prioritise, assign, and monitor consistently.

NagriVanta brings these activities into one workflow. It aims to make civic reporting easier for residents and case management more traceable for municipal teams.

## Core Features

### 1. Multi-Channel Issue Reporting

* Submit issues through the web application or companion mobile app.
* Describe an issue using text or voice input.
* Attach photos and short videos.
* Pin the issue on a map, use device location, or use location metadata from a photo.
* Look up an area using an Indian PIN code.
* Use the Open311-compatible API as an integration channel.

### 2. AI-Assisted Classification and Prioritisation

* Classify reports into categories such as roads, garbage, water, streetlights, drainage, and other.
* Generate a short report summary and priority suggestion.
* Understand English, Hindi, and common Hinglish descriptions through the local classifier and rules.
* Use the offline Naive Bayes model and keyword rules when Gemini is not configured or unavailable.
* Optionally use Google Gemini for richer text and photo analysis.

AI output is advisory. It does not independently approve, reject, or resolve a complaint.

### 3. Duplicate Detection and Smart Routing

* Identify potentially related reports using text similarity, geographic distance, category, and image perceptual hashes.
* Suggest the department responsible for a report.
* When the category is sufficiently reliable and automatic assignment is enabled, route the case to the least-loaded eligible officer.
* Leave uncertain cases for staff review instead of blindly assigning them.

### 4. Case Tracking and Service-Level Deadlines

* Give each submitted report a unique reference ID.
* Show status milestones and a case timeline.
* Notify residents about important status changes.
* Calculate target dates using department and priority-based SLA settings.
* Provide overdue-case filters and escalation workflows.

### 5. Resolution Evidence and Accountability

* Require a resolution note and a fresh after-photo before a case can be marked resolved.
* Check available image hashes, upload reuse, photo capture time, and GPS proximity.
* Optionally request an AI visual comparison of before-and-after photos.
* Record status changes in a SHA-256 hash-linked complaint history.
* Allow resident feedback, ratings, and reopening of eligible cases.

Evidence checks are supporting signals for review; they are not infallible proof that physical work was completed.

### 6. Community Participation

* Browse nearby civic reports.
* Support an existing report using a "Me too" vote.
* Use community support as one input to prioritisation.
* Share a public tracking link without exposing the reporter's private details.

### 7. Analytics and Public Transparency

* Review reports by status, category, ward, time period, and intake channel.
* View officer workload and overdue cases.
* Explore recurring issue hotspots on maps.
* Display rule-based risk alerts using weather forecasts and complaint history.
* Publish aggregate ward scorecards and open data in CSV/JSON formats.
* Suppress small groups and round public locations to reduce privacy risks.

### 8. Accessibility and Low-Connectivity Support

* English and Hindi interface.
* Installable Progressive Web App (PWA).
* Offline app-shell caching and a queued report outbox that syncs when connectivity returns.
* Lite mode to reduce data usage and avoid map-tile loading.
* Responsive web interface and a companion React Native application.

## User Roles

| Role          | Main Responsibilities                                                                                 |
| ------------- | ----------------------------------------------------------------------------------------------------- |
| Resident      | Create reports, attach evidence, track cases, support nearby reports, and provide feedback            |
| Officer       | View assigned or departmental cases, update statuses, add notes, and submit resolution evidence       |
| Administrator | Review AI suggestions, manage assignments and staff, configure department SLAs, and inspect analytics |

Access control is enforced by the API; hiding a page in the web interface is not treated as a security boundary.

## Technology Stack

| Layer             | Technology                                | Purpose                                                        |
| ----------------- | ----------------------------------------- | -------------------------------------------------------------- |
| Web Frontend      | React 19                                  | Component-based user interface                                 |
| Build Tool        | Vite 8                                    | Development server and production bundling                     |
| Styling           | Tailwind CSS v4                           | Responsive utility-first styling                               |
| Routing           | React Router                              | Client-side page navigation and role-aware layouts             |
| Maps              | Leaflet, React Leaflet                    | Interactive issue maps, pins, clusters, and heat layers        |
| Charts            | Recharts                                  | Operational and ward-level visualisations                      |
| Icons             | Lucide React                              | Consistent interface icons                                     |
| Backend Runtime   | Node.js 20+                               | JavaScript server runtime                                      |
| API Framework     | Express 5                                 | REST API and backend routing                                   |
| Database          | MongoDB + Mongoose 9                      | Persistent users, complaints, workflow, and supporting records |
| Validation        | Zod 4                                     | Request and AI-output validation                               |
| Authentication    | JWT + bcryptjs                            | Token-based authentication and password hashing                |
| Upload Processing | Multer + Sharp                            | File handling and image processing                             |
| Image Metadata    | Exifr                                     | Extract available photo time and GPS metadata                  |
| AI Integration    | Google Gemini via `@google/genai`         | Optional text and image analysis                               |
| Offline AI        | JavaScript Naive Bayes + keyword rules    | Local classification when external AI is unavailable           |
| Mobile            | Expo SDK 58 + React Native                | Companion mobile application                                   |
| API Documentation | OpenAPI / Swagger UI                      | API documentation and exploration                              |
| Interoperability  | Open311 GeoReport v2-compatible endpoints | Standardised civic-service integration                         |
| Hosting           | Vercel                                    | Web and serverless API deployment                              |
| CI                | GitHub Actions                            | Frontend lint/build, backend tests, and Expo web export        |

## System Architecture

The repository is organised as a small monorepo with separate web, API, and mobile applications.

```text
NagriVanta/
│
├── client/                 # React web application
│   ├── public/             # PWA manifest, icons, service worker
│   └── src/
│       ├── components/     # Shared UI, maps, charts, assistant
│       ├── context/        # Authentication, preferences, theme
│       ├── hooks/          # Motion and speech hooks
│       ├── pages/          # Reporting, tracking, queue, analytics
│       ├── services/       # API client
│       └── utils/          # Formatting, media, offline queue
│
├── server/                 # Express API
│   ├── api/                # Vercel serverless entry point
│   ├── scripts/            # Demo seed, model training, evaluation
│   ├── src/
│   │   ├── ai/             # Trained offline model
│   │   ├── config/         # Environment, database, constants, OpenAPI
│   │   ├── controllers/    # HTTP request handlers
│   │   ├── jobs/           # SLA background job
│   │   ├── middleware/     # Authentication, uploads, errors
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API routes
│   │   ├── services/       # AI, routing, workflow, analytics
│   │   └── validators/     # Zod schemas
│   └── tests/              # API, unit, and security tests
│
├── mobile/                 # Expo / React Native application
├── data/                   # Evaluation and demo datasets
└── docs/                   # User guide and project documentation
```

### Complaint Lifecycle

1. A resident submits a report with a description and location.
2. The API validates the request and stores the complaint.
3. Local classification and rules provide an immediate category and priority suggestion.
4. Optional Gemini analysis can refine the suggestion in the background.
5. Duplicate detection and department routing support staff triage.
6. An eligible case is assigned, receives a target date, and enters the officer workflow.
7. The officer updates progress and provides a resolution note with a fresh after-photo.
8. Evidence checks and the audit history are stored with the case.
9. The resident follows the public milestones and can provide feedback.

## Local Installation and Setup

### Prerequisites

* Node.js 20 or newer
* npm
* MongoDB for persistent local development

The quick demo uses an in-memory MongoDB server, so a local MongoDB installation is not required for that mode.

### 1. Start the Backend API

Open a terminal:

```bash
cd server
npm install
npm run demo
```

The API starts at:

```text
http://localhost:5000
```

The in-memory database is seeded with sample accounts and data. Demo data is discarded when the process stops.

### 2. Start the Frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

During development, Vite proxies API requests to the local backend.

### Local Demo Accounts

All demo accounts use the password:

```text
Demo@12345
```

| Role                | Email                                |
| ------------------- | ------------------------------------ |
| Administrator       | `admin@nagrivanta.local`             |
| Resident            | `citizen1@nagrivanta.local`          |
| Officer — Ghaziabad | `pwd.officer@nagrivanta.local`       |
| Officer — Noida     | `noida.pwd.officer@nagrivanta.local` |

These accounts are strictly for the disposable local demo. Do not reuse these credentials in a shared or production environment.

### 3. Configure a Persistent Backend (Optional)

Create a local environment file:

```bash
cp server/.env.example server/.env
```

On Windows PowerShell:

```powershell
Copy-Item server/.env.example server/.env
```

Set at least:

* `MONGODB_URI`: Your MongoDB connection string.
* `JWT_SECRET`: A long, random signing secret.

Then run:

```bash
cd server
npm install
npm run dev
```

To populate a persistent development database, use `npm run seed` only after checking its script and confirming the target database can safely be recreated.

**Do not run the seed script against data you need to keep.**

### 4. Configure the Frontend

For a separately hosted API, copy `client/.env.example` to `client/.env` and set:

```env
VITE_API_URL=https://your-api-domain.example
```

Keep private credentials on the server. Never expose database credentials, JWT secrets, Gemini keys, or webhook secrets through client-side variables.

### 5. Run the Mobile Application

Set `EXPO_PUBLIC_API_URL` in `mobile/.env` to an API URL reachable from your phone.

A physical device generally needs your computer's LAN IP address rather than `localhost`.

```bash
cd mobile
npm install
npx expo start
```

## Environment Variables

The example files contain the full variable list and development notes.

| Variable                | Purpose                                                     |
| ----------------------- | ----------------------------------------------------------- |
| `MONGODB_URI`           | MongoDB connection                                          |
| `JWT_SECRET`            | Authentication token signing secret                         |
| `JWT_EXPIRES_IN`        | Authentication token expiry                                 |
| `CORS_ORIGINS`          | Allowed browser origins                                     |
| `GEMINI_API_KEY`        | Optional Gemini integration                                 |
| `GEMINI_MODEL`          | Primary Gemini model                                        |
| `GEMINI_FALLBACK_MODEL` | Fallback AI model                                           |
| `AI_TIMEOUT_MS`         | AI request timeout                                          |
| `AUTO_ASSIGN`           | Enables or disables eligible automatic assignments          |
| `CRON_SECRET`           | Protects the scheduled SLA endpoint                         |
| `SLA_CHECK_MINUTES`     | SLA checking interval configuration                         |
| `OPEN311_API_KEYS`      | API keys for Open311 partner access                         |
| `WEBHOOK_URL`           | Outbound event webhook                                      |
| `WEBHOOK_SECRET`        | HMAC webhook signing secret                                 |
| `RISK_WEATHER`          | Enables weather-assisted risk signals                       |
| `APP_TZ_OFFSET`         | Application timezone offset                                 |
| `SEED_PASSWORD`         | Password for accounts created by the persistent seed script |
| `VITE_API_URL`          | API origin used by the web client                           |
| `EXPO_PUBLIC_API_URL`   | API origin reachable by the mobile app                      |

Do not commit real `.env` files or credentials.

## Testing and Model Evaluation

### Run Backend Tests

```bash
cd server
npm test
```

### Evaluate the Offline Classifier

```bash
npm run eval
```

### Train the Offline Classifier

```bash
npm run train
```

The repository includes a GitHub Actions workflow that runs frontend linting and production build, backend tests, and an Expo web export for the mobile project.

### Dataset Notes

* The NYC 311 sample is sourced from NYC Open Data and is used for classifier evaluation and sample analytics.
* The Indian civic report dataset is synthetic and is used for demonstration and evaluation.
* Synthetic sample records and test-set metrics must not be presented as actual deployment outcomes or evidence of real-world model accuracy.

See [data/README.md](data/README.md) for dataset provenance, licences, and limitations.

## Deployment

The web client and API are deployed as separate Vercel projects.

At a high level:

1. Deploy `client/` as a Vite static application.
2. Deploy `server/` using the included Vercel serverless entry point and configuration.
3. Configure production environment variables in the relevant Vercel project.
4. Set the production API origin in `VITE_API_URL`.
5. Configure database access, allowed CORS origins, JWT signing, and the SLA cron secret.
6. Add `GEMINI_API_KEY` only to the API project's server-side environment when enabling Gemini.

Check the deployment-specific configuration and Vercel project settings before deploying. The values in this README and the example files are not substitutes for checking the actual production environment.

## Important Limitations

* NagriVanta is an independent pilot and is not connected to or endorsed by a municipal authority.
* It is not an emergency service. Contact the appropriate emergency services for immediate danger.
* AI outputs and automated checks can be wrong and require human oversight.
* Some public/demo records and the India-specific labelled dataset are synthetic.
* The companion mobile app is part of the repository; its availability on app stores or verification on physical devices should not be assumed.

## Maintainer

**Naitik Gupta**

* GitHub: [@naitik2043](https://github.com/naitik2043)
* Portfolio: [naitikgupta.vercel.app](https://naitikgupta.vercel.app/)
* Email: [naitikgupta2043@gmail.com](mailto:naitikgupta2043@gmail.com)

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
