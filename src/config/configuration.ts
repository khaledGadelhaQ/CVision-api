export default () => ({
  app: {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 3000,
    apiPrefix: process.env.API_PREFIX || 'api',
    apiVersion: process.env.API_VERSION || 'v1',
  },
  database: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/cvision_dev',
  },
  firebase: {
    // Firebase configuration is now loaded from firebase.json file
    // Fallback environment variables for deployment environments that don't support file uploads
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  security: {
    jwtSecret: process.env.JWT_SECRET || 'default-secret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  externalServices: {
    aiModelApiUrl: process.env.AI_MODEL_API_URL || 'http://localhost:8000',
    aiModelApiKey: process.env.AI_MODEL_API_KEY || 'default-key',
    adzunaApiId: process.env.ADZUNA_API_ID,
    adzunaApiKey: process.env.ADZUNA_API_KEY,
    joobleApiKey: process.env.JOOBLE_API_KEY,
  },
  upload: {
    path: process.env.UPLOAD_PATH || './uploads',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 10485760, // 10MB
    allowedTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || ['pdf', 'doc', 'docx'],
    cloudStorageBucket: process.env.CLOUD_STORAGE_BUCKET,
  },
  logging: {
    logLevel: process.env.LOG_LEVEL || 'info',
    enableRequestLogging: process.env.ENABLE_REQUEST_LOGGING === 'true',
  },
  performance: {
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000,
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  },
  monitoring: {
    sentryDsn: process.env.SENTRY_DSN,
  },
});
