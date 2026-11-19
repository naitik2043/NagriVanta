# NagriVanta — Demo Walkthrough

This guide is designed for a classroom presentation, project evaluation, or a short product demonstration. For predictable data and repeatable steps, use the local in-memory demo.

## 1. Start the demo

Follow [Local Development Setup](LOCAL_SETUP.md#3-quick-demo-recommended).

**Terminal 1 — Backend**
```bash
cd server
npm install
npm run demo
```

**Terminal 2 — Web client**
```bash
cd client
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173/).

Do not close the backend terminal during the demonstration.

## 2. Local demo accounts

The local demo seed creates these users with the same disposable password:

```text
Demo@12345
```

| Role | Email |
| --- | --- |
| Citizen | `citizen1@nagrivanta.local` |
| Admin | `admin@nagrivanta.local` |
| Ghaziabad PWD officer | `pwd.officer@nagrivanta.local` |
| Noida PWD officer | `noida.pwd.officer@nagrivanta.local` |

Other department officers are listed in [Local Setup](LOCAL_SETUP.md#local-demo-accounts).

These credentials work only against the local in-memory demo database. Hosted production accounts use separately managed credentials and are intentionally not listed here.

## 3. Suggested presentation sequence

### Part A — Introduce the product (30–45 seconds)

Explain the problem:

- Residents often do not know where to report everyday civic issues.
- They need a way to track whether a report has been reviewed and resolved.
- Municipal teams need a shared queue, assignment, deadlines and an auditable history.

Then introduce NagriVanta as a civic issue reporting and resolution platform for the Ghaziabad and Noida pilot.

### Part B — Show the resident journey (1–2 minutes)

1. Sign in with the local citizen account, or register a fresh local citizen.
2. Open the report form.
3. Enter a realistic title and description, such as a pothole affecting a neighbourhood road.
4. Select the city and location. A valid location is required.
5. Optionally attach a sample image or short video.
6. Submit the report and point out its reference ID and initial status.
7. Open My Reports or the complaint detail page to show the timeline.

### Part C — Explain AI-assisted triage (45–60 seconds)

Explain what happens after a report is submitted:

1. The server validates the submitted fields and media.
2. The complaint is saved with its reference ID and initial `submitted` history event.
3. The local classifier and deterministic rules provide a category suggestion, summary and priority score.
4. If Gemini is configured, it can refine the text and first-image analysis in the background.
5. If Gemini is unavailable or not configured, the local result remains usable.
6. AI output is advisory; authorised staff can review and correct it.

The quick demo works without a Gemini key, so do not promise a live Gemini response during a local demo unless you have configured and verified the key.

### Part D — Show the admin workflow (1–2 minutes)

1. Sign out from the citizen account.
2. Sign in as `admin@nagrivanta.local`.
3. Open the staff queue.
4. Review the complaint, its suggested category and priority.
5. Assign it to the relevant department/officer.
6. Explain the purpose of service-level deadlines and the audit history.

### Part E — Show the officer workflow (1–2 minutes)

1. Sign out from admin.
2. Sign in using the matching officer account.
3. Open the officer queue and select the assigned complaint.
4. Move the case into progress using an allowed state transition.
5. Add notes as needed.
6. To demonstrate resolution, provide a resolution note and a new after-photo. The backend requires both.

### Part F — Return to the resident view (30–60 seconds)

1. Sign back in as the citizen who created the report.
2. Open the report timeline.
3. Show the updated status and visible history.
4. When appropriate, demonstrate feedback after resolution.

### Part G — Close with platform-level capabilities (30–60 seconds)

Show relevant public scorecards, maps, analytics, risk information, Open311 service catalogue, or API docs. Mention that aggregate and public views are designed to avoid exposing reporter contact information.

## 4. Useful local URLs

| Service | URL |
| --- | --- |
| Web app | [http://localhost:5173](http://localhost:5173/) |
| API health | [http://localhost:5000/health](http://localhost:5000/health) |
| Database readiness | [http://localhost:5000/health/ready](http://localhost:5000/health/ready) |
| Swagger UI | [http://localhost:5000/api/docs](http://localhost:5000/api/docs) |
| OpenAPI JSON | [http://localhost:5000/api/openapi.json](http://localhost:5000/api/openapi.json) |
| Open311 services | [http://localhost:5000/open311/v2/services.json](http://localhost:5000/open311/v2/services.json) |

## 5. Pre-demo checklist

- [ ] Run the local demo once before the presentation.
- [ ] Wait for the backend to print that the API is listening.
- [ ] Open the web app and verify sign-in works.
- [ ] Test one citizen login, one admin login and one department officer login.
- [ ] Confirm that the complaint location can be selected.
- [ ] Keep one or two sample complaint descriptions ready.
- [ ] Keep a small sample after-photo available if demonstrating resolution.
- [ ] Keep the backend terminal visible for troubleshooting.
- [ ] Avoid real resident data and personal photos.
- [ ] Do not rely on hosted production credentials for the local demo.

## 6. Demo safety and reset

The quick demo uses an in-memory MongoDB database. Stopping the process removes all its sample records. Restarting `npm run demo` creates a fresh set.

Do not run `npm run seed` against a production or shared database. That script clears the NagriVanta collections in the database selected by `MONGODB_URI` before inserting seed records.

For a presentation, avoid changing environment variables or deploying code at the last minute. Use the previously tested local demo setup.
