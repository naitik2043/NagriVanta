# NagriVanta — API Reference

This is a developer-oriented route guide based on the Express route declarations and Zod validators in the repository. The interactive Swagger UI and checked-in OpenAPI YAML are also available, but the YAML describes a selected subset of the API.

## Base URLs

| Environment | Base URL |
| --- | --- |
| Local | `http://localhost:5000` |
| Recorded production API | `https://nagrivanta-api-iota.vercel.app` |

All application endpoints are under `/api/v1`, except health, upload serving, and Open311 routes.

- [Interactive Swagger UI](https://nagrivanta-api-iota.vercel.app/api/docs)
- [OpenAPI JSON](https://nagrivanta-api-iota.vercel.app/api/openapi.json)
- [OpenAPI YAML in this repository](../server/src/config/openapi.yaml)

Hosted endpoints are documented configuration values, not a live availability guarantee. Check the health endpoints before a presentation.

## Authentication

Protected routes accept a JWT bearer token:

```http
Authorization: Bearer <JWT>
```

### Register a citizen

```http
POST /api/v1/auth/register
Content-Type: application/json
```

```json
{
  "name": "Demo Citizen",
  "email": "citizen@example.com",
  "password": "replace-with-a-strong-password"
}
```

Registration creates a citizen account and returns an authentication token with the safe user representation.

### Log in

```http
POST /api/v1/auth/login
Content-Type: application/json
```

```json
{
  "email": "citizen@example.com",
  "password": "replace-with-a-strong-password"
}
```

The response contains `data.token` and `data.user`. Send the token as a bearer token to protected endpoints.

### Current user and logout

| Method | Endpoint | Access |
| --- | --- | --- |
| `GET` | `/api/v1/auth/me` | Authenticated |
| `POST` | `/api/v1/auth/logout` | Authenticated |

The API uses stateless JWTs; the client clears its stored token on logout.

## Roles

| Role | Typical permissions |
| --- | --- |
| Guest | Public department/city information, public scorecards, risk alerts, open data, public tracking and Open311 catalogue |
| Citizen | Create and view own complaints, browse the community feed, vote, reopen eligible cases and submit feedback |
| Officer | Access cases assigned to the officer or their department, update permitted workflow states, add notes and view staff analytics |
| Admin | Review and assign complaints, manage staff and department SLA settings, and access administrative views |

The server is authoritative for permissions. Hiding a button in the client is not an access-control mechanism.

## Route catalogue

### Health and infrastructure

| Method | Endpoint | Authentication | Purpose |
| --- | --- | --- | --- |
| `GET` | `/health` | Public | Basic process, database and AI mode status |
| `GET` | `/health/live` | Public | Process liveness |
| `GET` | `/health/ready` | Public | Database readiness/ping |
| `GET` | `/uploads/:key` | Public URL | Serve an uploaded media object |
| `GET` | `/api/openapi.json` | Public | OpenAPI JSON |
| `GET` | `/api/docs` | Public | Swagger UI |

### Authentication

| Method | Endpoint | Access |
| --- | --- | --- |
| `POST` | `/api/v1/auth/register` | Public; creates citizen |
| `POST` | `/api/v1/auth/login` | Public |
| `POST` | `/api/v1/auth/logout` | Authenticated |
| `GET` | `/api/v1/auth/me` | Authenticated |

### Public information and geolocation

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/v1/departments` | Public | Department catalogue |
| `GET` | `/api/v1/cities` | Public | Configured city/ward data |
| `GET` | `/api/v1/public/scorecard` | Public | Aggregate civic scorecard |
| `GET` | `/api/v1/public/risk-alerts` | Public | Public risk alerts |
| `GET` | `/api/v1/public/open-data.csv` | Public | CSV export |
| `GET` | `/api/v1/public/open-data.json` | Public | JSON export |
| `GET` | `/api/v1/public/track/:ref` | Public | Privacy-limited complaint tracking |
| `GET` | `/api/v1/geo/pincode/:pin` | Public | Pincode lookup |
| `GET` | `/api/v1/geo/reverse?lat=...&lng=...` | Public | Reverse geocoding |
| `GET` | `/api/v1/geo/search?q=...` | Public | Place search |

### Profile

| Method | Endpoint | Access |
| --- | --- | --- |
| `GET` | `/api/v1/profile` | Authenticated |
| `PATCH` | `/api/v1/profile` | Authenticated |
| `POST` | `/api/v1/profile/password` | Authenticated |

### Complaints

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/v1/complaints` | Citizen | Create report (multipart form) |
| `GET` | `/api/v1/complaints/mine` | Authenticated | Current user's reports |
| `GET` | `/api/v1/complaints/nearby` | Authenticated | Nearby report/duplicate suggestions |
| `GET` | `/api/v1/complaints` | Authenticated | Filtered complaint feed/queue |
| `GET` | `/api/v1/complaints/:id` | Authenticated + ownership/assignment checks | Complaint detail, timeline and integrity summary |
| `GET` | `/api/v1/complaints/:id/integrity` | Authenticated | Verify history-chain integrity |
| `PATCH` | `/api/v1/complaints/:id` | Admin | Review category, priority or ward |
| `PATCH` | `/api/v1/complaints/:id/status` | Officer or admin | Apply permitted status transition; evidence may be required |
| `PATCH` | `/api/v1/complaints/:id/assign` | Admin | Assign department/officer |
| `POST` | `/api/v1/complaints/:id/notes` | Officer or admin | Add staff note |
| `POST` | `/api/v1/complaints/:id/feedback` | Citizen | Rate resolved work |
| `POST` | `/api/v1/complaints/:id/reopen` | Citizen | Reopen an eligible case |
| `POST` / `DELETE` | `/api/v1/complaints/:id/upvote` | Citizen | Add/remove community vote |

For complaint lists, supported query filters include status, category, priority, ward, department, city, overdue flag, text query, date range, page/limit and sort. See `listQuerySchema` for accepted values.

### Assistant, administration and notifications

| Method | Endpoint | Access |
| --- | --- | --- |
| `POST` | `/api/v1/assistant/chat` | Optional authentication |
| `GET` | `/api/v1/admin/analytics` | Officer or admin |
| `GET` | `/api/v1/admin/workload` | Admin |
| `GET` | `/api/v1/admin/users` | Admin |
| `POST` | `/api/v1/admin/users` | Admin |
| `PATCH` | `/api/v1/admin/departments/:id` | Admin |
| `GET` | `/api/v1/notifications` | Authenticated |
| `POST` | `/api/v1/notifications/read-all` | Authenticated |
| `PATCH` | `/api/v1/notifications/:id/read` | Authenticated |
| `GET` | `/api/v1/jobs/sla` | Bearer `CRON_SECRET` |

### Open311 GeoReport v2 routes

These routes are mounted outside `/api/v1`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/open311/v2/services.json` | Service catalogue |
| `GET` | `/open311/v2/requests.json` | List requests |
| `GET` | `/open311/v2/requests/:id.json` | Request detail |
| `POST` | `/open311/v2/requests.json` | Create a service request |

Open311 request creation validates the partner API key and required GeoReport fields.

## Create a complaint: request example

The application endpoint accepts `multipart/form-data`. Required fields include a title, description and a location (latitude/longitude, or location data from a photo with GPS metadata). Category can be selected or set to `auto`.

Example using `curl` with an already-issued local JWT:

```bash
curl -X POST http://localhost:5000/api/v1/complaints \
  -H "Authorization: Bearer YOUR_LOCAL_JWT" \
  -F "title=Road pothole near market" \
  -F "description=Large pothole is making the road difficult to use." \
  -F "category=auto" \
  -F "city=Ghaziabad" \
  -F "lat=28.6460" \
  -F "lng=77.3695" \
  -F "locationSource=gps"
```

Optional media fields are `images` (up to three) and `videos` (up to one). The client uses an idempotency key for complaint creation so an identical retry does not create another report.

## Response format and errors

Successful application responses use a JSON envelope with a `success` flag and data payload; paginated responses may include metadata. Errors use a structured `error.code` and `error.message`, with a request ID where available.

Common HTTP outcomes:

| Status | Meaning |
| --- | --- |
| `200` | Request succeeded |
| `201` | Resource created |
| `400` | Invalid request or disallowed state transition |
| `401` | Missing/invalid authentication |
| `403` | User role or assignment is insufficient |
| `404` | Resource not found or deliberately hidden by ownership checks |
| `409` | Conflict, e.g. duplicate account or idempotency-key mismatch |
| `429` | Rate limit reached |
| `500` / `503` | Server or dependency problem |

## Source of truth

- Route access and handler mapping: `server/src/routes/index.js`.
- Request validation: `server/src/validators/schemas.js`.
- State transitions: `server/src/config/constants.js`.
- Interactive documentation: `/api/docs`.

When an endpoint's behaviour changes, update its route, validator, tests, OpenAPI definition and this reference together.
