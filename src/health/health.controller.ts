import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('health')
export class HealthController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  checkHealth() {
    return {
      status: 'ok',
      service: 'CVision API',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: this.configService.get<string>('app.nodeEnv'),
      version: '1.0.0',
    };
  }

  @Get('detailed')
  checkDetailedHealth() {
    const nodeEnv = this.configService.get<string>('app.nodeEnv');
    const isDevelopment = nodeEnv === 'development';

    const baseInfo = {
      status: 'ok',
      service: 'CVision API',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: nodeEnv,
      version: '1.0.0',
      services: {
        api: 'operational',
        database: 'not_configured', // Update when database is added
        aiService: 'not_configured', // Update when AI service is added
      },
      configuration: {
        port: this.configService.get<number>('app.port'),
        apiPrefix: this.configService.get<string>('app.apiPrefix'),
        apiVersion: this.configService.get<string>('app.apiVersion'),
        logLevel: this.configService.get<string>('logging.logLevel'),
      },
    };

    // Add system information only in development
    if (isDevelopment) {
      return {
        ...baseInfo,
        system: {
          nodeVersion: process.version,
          platform: process.platform,
          architecture: process.arch,
          memory: {
            used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
            total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
            external: Math.round((process.memoryUsage().external / 1024 / 1024) * 100) / 100,
          },
          cpuUsage: process.cpuUsage(),
        },
        environment_variables: {
          aiModelApiUrl: this.configService.get<string>('externalServices.aiModelApiUrl'),
          enableRequestLogging: this.configService.get<boolean>('logging.enableRequestLogging'),
        },
      };
    }

    return baseInfo;
  }
}
