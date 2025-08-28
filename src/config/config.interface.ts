export interface AppConfig {
  nodeEnv: string;
  port: number;
  apiPrefix: string;
  apiVersion: string;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface SecurityConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
}

export interface ExternalServicesConfig {
  aiModelApiUrl: string;
  aiModelApiKey: string;
}

export interface LoggingConfig {
  logLevel: string;
  enableRequestLogging: boolean;
}

export interface PerformanceConfig {
  rateLimitWindowMs?: number;
  rateLimitMaxRequests?: number;
}
