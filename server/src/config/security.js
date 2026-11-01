export function assertProductionSecurityConfig(config) {
  if (config.nodeEnv !== 'production') return;

  const errors = [];

  if (
    typeof config.jwtSecret !== 'string' ||
    config.jwtSecret.length < 32 ||
    /^replace[-_]/i.test(config.jwtSecret)
  ) {
    errors.push('JWT_SECRET must contain at least 32 characters.');
  }

  if (
    typeof config.mongoUri !== 'string' ||
    !/^mongodb(?:\+srv)?:\/\//i.test(config.mongoUri)
  ) {
    errors.push('A valid MONGODB_URI must be configured.');
  }

  const origins = Array.isArray(config.corsOrigins)
    ? config.corsOrigins
    : [];

  if (origins.length === 0) {
    errors.push('CORS_ORIGINS must contain at least one HTTPS origin.');
  }

  const invalidOrigins = origins.filter((origin) => {
    try {
      const url = new URL(origin);

      return (
        url.protocol !== 'https:' ||
        url.origin !== origin.replace(/\/$/, '') ||
        Boolean(url.username || url.password)
      );
    } catch {
      return true;
    }
  });

  if (invalidOrigins.length > 0) {
    errors.push(
      `Invalid production CORS origins: ${invalidOrigins.join(', ')}`
    );
  }

  if (errors.length > 0) {
    throw new Error(
      `Production security configuration failed:\n- ${errors.join('\n- ')}`
    );
  }
}
