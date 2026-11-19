# NagriVanta — Documentation Index

This file used to contain a point-in-time project snapshot. Some deployment links, verification counts, setup notes and operational details in that snapshot could become stale as the code and hosting configuration change. It is now a stable index to the maintained project documentation.

## Start here

- [Project overview and quick start](../README.md)
- [Homepage screenshot](assets/nagrivanta-homepage.webp)

## Developer documentation

| Guide | Contents |
| --- | --- |
| [System Architecture](ARCHITECTURE.md) | Application boundaries, request flow, authentication, AI triage, routing, case lifecycle, audit history, and data models |
| [API Documentation](API_DOCUMENTATION.md) | Route catalogue, permissions, examples, response envelopes, and API errors |
| [Local Setup](LOCAL_SETUP.md) | Quick in-memory demo, persistent MongoDB setup, web and mobile startup, and troubleshooting |
| [Demo Walkthrough](DEMO_GUIDE.md) | A presentation flow for citizen, admin, and officer roles |
| [Deployment Guide](DEPLOYMENT.md) | Vercel project configuration, environment variables, production verification, and secret rotation |
| [User Guide](NagriVanta-User-Guide.pdf) | User-facing application guidance |
| [OpenAPI YAML](../server/src/config/openapi.yaml) | Checked-in API specification |

## Documentation maintenance

The source code is authoritative when implementation details change. Update the relevant guide, validators, routes, tests, and OpenAPI definition together.

## Security

Do not add production staff passwords, private deployment identifiers, API keys, JWT/cron secrets, MongoDB connection strings, resident records, or operational logs to public documentation. Keep current credentials in the authorised secret manager and rotate any value that may have been exposed.
