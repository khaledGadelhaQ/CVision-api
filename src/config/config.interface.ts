export interface AppConfig {
  nodeEnv: string;
  port: number;
  apiPrefix: string;
  apiVersion: string;
}

export interface DatabaseConfig {
  url: string;
}

export interface FirebaseConfig {
  projectId: string;
  clientEmail: string;
  privateKey: string;
  databaseURL: string;
}

export interface SecurityConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
}

export interface ExternalServicesConfig {
  aiModelApiUrl: string;
  aiModelApiKey: string;
  adzunaApiId?: string;
  adzunaApiKey?: string;
  joobleApiKey?: string;
}

export interface UploadConfig {
  path: string;
  maxFileSize: number;
  allowedTypes: string[];
  cloudStorageBucket?: string;
}

export interface LoggingConfig {
  logLevel: string;
  enableRequestLogging: boolean;
}

export interface PerformanceConfig {
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
}

export interface MonitoringConfig {
  sentryDsn?: string;
}
