import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler, requestId } from './middleware/error.js';
import { serveUpload } from './middleware/upload.js';
import { aiEnabled } from './services/ai.js';
import routes, { open311Router } from './routes/index.js';
import { openApiSpec } from './config/openapi.js';

export function createApp() {
  const app = express();
  app.set('trust proxy', 1);
  app.use(requestId);
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } })); // images are loaded by the web/mobile apps
  app.use(cors({
    // requests with no Origin (mobile apps, curl) are allowed; browsers must be on the allowlist
    origin: (origin, cb) => cb(null, !origin || env.corsOrigins.includes(origin)),
  }));
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: false, limit: '100kb' })); // Open311 clients post form data
  app.use(rateLimit({ windowMs: 60 * 1000, limit: env.isTest ? 10000 : 300, standardHeaders: 'draft-8', legacyHeaders: false }));

  const healthPayload = () => ({
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'up' : 'down',
    ai: aiEnabled() ? 'gemini' : 'rules-fallback',
    time: new Date().toISOString(),
  });
  // Liveness answers only whether this process can serve requests; it must not
  // depend on MongoDB or another service recovering.
  app.get('/health/live', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));
  app.get('/health/ready', async (req, res) => {
    let database = 'down';
    try {
      if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
        await mongoose.connection.db.admin().ping();
        database = 'up';
      }
    } catch { /* return a safe dependency status without driver details */ }
    const ready = database === 'up';
    res.status(ready ? 200 : 503).json({ status: ready ? 'ok' : 'not_ready', db: database, time: new Date().toISOString() });
  });
  // Keep the original endpoint and response shape for existing monitors.
  app.get('/health', (req, res) => res.json(healthPayload()));
  app.get('/uploads/:key', serveUpload);
  app.get('/api/openapi.json', (req, res) => res.json(openApiSpec));

  // Swagger UI needs inline initialization scripts; relax CSP only on documentation routes.
  app.use(
    '/api/docs',
    helmet.contentSecurityPolicy({
      useDefaults: true,
      directives: {
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
      },
    }),
    swaggerUi.serve,
    swaggerUi.setup(openApiSpec, {
      explorer: true,
      customSiteTitle: 'NagriVanta API Documentation',
    }),
  );
  app.use('/api/v1', routes);
  app.use('/open311/v2', open311Router);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}

