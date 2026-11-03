# NagriVanta

**A civic issue reporting and resolution platform for residents and municipal teams.**

NagriVanta helps people report local infrastructure and service issues, follow progress, and share feedback. Staff can review, route, and manage reports through a role-based workflow. The current pilot focuses on Ghaziabad and Noida, Uttar Pradesh.

> AI recommends. Rules validate. People decide.
>
> Automated classifications, priorities, duplicate suggestions, and evidence checks support staff review. Authorised people remain responsible for decisions.

## Try NagriVanta

- **Web app:** https://nagrivanta-web-topaz.vercel.app/
- **API documentation:** https://nagrivanta-api-iota.vercel.app/api/docs
- **OpenAPI specification:** https://nagrivanta-api-iota.vercel.app/api/openapi.json
- **Open311 services:** https://nagrivanta-api-iota.vercel.app/open311/v2/services.json

NagriVanta is an independent civic-tech pilot. It is not an official government portal or an emergency-response service. For emergencies, contact the appropriate local emergency service.

## What it does

### Resident reporting

- Create reports from the web app or companion mobile app.
- Add descriptions, photos, short videos, and location details.
- Track progress with a reference ID and case milestones.
- Support nearby reports and provide feedback on completed work.
- Continue preparing reports offline; queued submissions sync when connectivity returns.

### Staff workflow

- Review reports and suggested categories, priorities, and departments.
- Assign cases and track service-level targets and overdue work.
- Update progress, add notes, and document resolutions with supporting evidence.
- Review a tamper-evident history of case status changes.

### Public information

- Explore aggregate ward scorecards and open-data exports.
- Use public tracking links that omit reporters' private details.
- Access Open311-compatible service catalogue and request endpoints.

### AI-assisted tools

NagriVanta combines local language classification and explainable rules with optional Google Gemini analysis. The local classifier supports English, Hindi, and common Hinglish descriptions. AI output is advisory and does not independently approve or resolve reports.

## Applications and technology

| Area | Technologies |
| --- | --- |
| Web | React, Vite, Tailwind CSS |
| API | Node.js, Express, MongoDB, Mongoose |
| Mobile | Expo, React Native |
| Mapping and charts | Leaflet, React Leaflet, Recharts |
| Validation and security | Zod, JWT, bcrypt, Helmet |
| Optional AI | Google Gemini API |
| Hosting | Vercel |

## Repository layout

```text
client/   Web application
server/   Express API, data models, and tests
mobile/   Expo / React Native application
data/     Synthetic and evaluation data
docs/     User and project documentation
```

## Run locally

### Requirements

- Node.js 20 or newer
- npm
- MongoDB for persistent local development

### API

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

Configure local environment values in `server/.env`. Never commit real credentials or production secrets. See `server/.env.example` for variable names and safe defaults.

### Web app

In a second terminal:

```bash
cd client
npm install
npm run dev
```

Vite prints the local web address when it starts. To point the web app at a different API, configure `VITE_API_URL` using `client/.env.example`.

### Mobile app

```bash
cd mobile
npm install
npx expo start
```

Use the Expo development tools to open the app on a simulator or device. Configure `EXPO_PUBLIC_API_URL` using `mobile/.env.example` when the API is not available at the configured default.

### Local demo data

The server includes a demo mode for local evaluation. Its sample data and demo credentials are intended for a disposable local environment only. Do not run destructive seed or demo-data scripts against a shared or production database. The public web and mobile apps do not publish local demo credentials.

## Development checks

Run backend tests:

```bash
cd server
npm test
```

Check the web app:

```bash
cd client
npm run lint
npm run build
```

Export the mobile app for web:

```bash
cd mobile
npm run export:web
```

## Privacy and responsible use

- Public tracking and open-data views are designed to avoid exposing reporter contact details.
- Public locations may be rounded and small groups suppressed in aggregate views.
- Uploaded media can contain sensitive information; share only what is needed to report an issue.
- AI and image checks can be wrong. Staff should review their results alongside the available evidence.
- Do not submit emergency incidents through this pilot.

## Contributing

Contributions are welcome. Before opening a pull request, describe the problem and the proposed change, keep changes focused, and run the relevant checks above. Do not include private resident information, access tokens, database credentials, or production account details in issues, commits, or screenshots.

