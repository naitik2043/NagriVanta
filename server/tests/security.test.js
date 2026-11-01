import assert from 'node:assert/strict';
import { test } from 'node:test';
import { assertProductionSecurityConfig } from '../src/config/security.js';

const validConfig = {
  nodeEnv: 'production',
  jwtSecret: 'a'.repeat(48),
  mongoUri: 'mongodb+srv://user:password@cluster.example.mongodb.net/nagrivanta',
  corsOrigins: ['https://nagrivanta-web.vercel.app'],
};

test('development and test environments skip production validation', () => {
  assert.doesNotThrow(() =>
    assertProductionSecurityConfig({
      nodeEnv: 'development',
      jwtSecret: '',
      mongoUri: '',
      corsOrigins: [],
    })
  );
});

test('valid production configuration passes', () => {
  assert.doesNotThrow(() =>
    assertProductionSecurityConfig(validConfig)
  );
});

test('production rejects weak JWT secrets', () => {
  assert.throws(
    () => assertProductionSecurityConfig({
      ...validConfig,
      jwtSecret: 'short',
    }),
    /JWT_SECRET/
  );
});

test('production requires a MongoDB connection URI', () => {
  assert.throws(
    () => assertProductionSecurityConfig({
      ...validConfig,
      mongoUri: '',
    }),
    /MONGODB_URI/
  );
});

test('production rejects wildcard and insecure CORS origins', () => {
  assert.throws(
    () => assertProductionSecurityConfig({
      ...validConfig,
      corsOrigins: ['*'],
    }),
    /CORS/
  );

  assert.throws(
    () => assertProductionSecurityConfig({
      ...validConfig,
      corsOrigins: ['http://example.com'],
    }),
    /CORS/
  );
});
