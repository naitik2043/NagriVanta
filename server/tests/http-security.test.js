import assert from 'node:assert/strict';
import { test } from 'node:test';
import request from 'supertest';
import { createApp } from '../src/app.js';

const app = createApp();
const ALLOWED_ORIGIN = 'https://allowed.example';
const BLOCKED_ORIGIN = 'https://blocked.example';

test('HTTP responses include request IDs and security headers', async () => {
  const res = await request(app).get('/health');

  assert.equal(res.status, 200);
  assert.ok(res.headers['x-request-id']);
  assert.equal(res.headers['x-content-type-options'], 'nosniff');
  assert.equal(res.body.status, 'ok');
});

test('liveness is independent of dependencies and readiness reports database status', async () => {
  const live = await request(app).get('/health/live');
  assert.equal(live.status, 200);
  assert.equal(live.body.status, 'ok');

  const ready = await request(app).get('/health/ready');
  assert.equal(ready.status, 503);
  assert.equal(ready.body.status, 'not_ready');
  assert.equal(ready.body.db, 'down');
  assert.equal(JSON.stringify(ready.body).includes('mongodb://'), false);
});

test('CORS allows configured frontend origins', async () => {
  const res = await request(app)
    .get('/health')
    .set('Origin', ALLOWED_ORIGIN);

  assert.equal(res.status, 200);
  assert.equal(res.headers['access-control-allow-origin'], ALLOWED_ORIGIN);
});

test('CORS does not authorize untrusted origins', async () => {
  const res = await request(app)
    .get('/health')
    .set('Origin', BLOCKED_ORIGIN);

  assert.equal(res.status, 200);
  assert.equal(res.headers['access-control-allow-origin'], undefined);
});

test('CORS handles browser preflight requests', async () => {
  const res = await request(app)
    .options('/api/v1/auth/login')
    .set('Origin', ALLOWED_ORIGIN)
    .set('Access-Control-Request-Method', 'POST')
    .set('Access-Control-Request-Headers', 'Authorization,Content-Type');

  assert.equal(res.status, 204);
  assert.equal(res.headers['access-control-allow-origin'], ALLOWED_ORIGIN);
  assert.match(res.headers['access-control-allow-methods'], /POST/);
});

test('unknown API routes return a structured 404 response', async () => {
  const res = await request(app).get('/this-route-does-not-exist');

  assert.equal(res.status, 404);
  assert.equal(res.body.success, false);
  assert.equal(res.body.error.code, 'NOT_FOUND');
  assert.equal(res.body.requestId, res.headers['x-request-id']);
});

test('OpenAPI JSON endpoint returns the NagriVanta specification', async () => {
  const res = await request(app).get('/api/openapi.json');

  assert.equal(res.status, 200);
  assert.equal(res.body.openapi, '3.1.0');
  assert.equal(res.body.info.title, 'NagriVanta API');

  assert.ok(res.body.paths['/api/v1/auth/login']);
  assert.ok(res.body.paths['/api/v1/complaints']);
  assert.ok(res.body.paths['/open311/v2/requests.json']);
});

test('Swagger UI documentation page is accessible', async () => {
  const res = await request(app).get('/api/docs/');

  assert.equal(res.status, 200);
  assert.match(res.text, /swagger-ui/i);
});

test('Swagger UI stylesheet is served successfully', async () => {
  const res = await request(app).get('/api/docs/swagger-ui.css');

  assert.equal(res.status, 200);
  assert.match(res.headers['content-type'], /text\/css/);
});
