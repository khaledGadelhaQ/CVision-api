import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { Public } from '../common/decorators/public.decorator';

@Controller('health')
@Public()
export class HealthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  @Get()
  @Public()
  async checkHealth() {
    const dbHealth = await this.prismaService.isHealthy();
    
    return {
      status: 'ok',
      service: 'CVision API',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: this.configService.get<string>('app.nodeEnv'),
      version: '1.0.0',
      database: dbHealth ? 'connected' : 'disconnected',
    };
  }

  @Get('detailed')
  @Public()
  async checkDetailedHealth() {
    const nodeEnv = this.configService.get<string>('app.nodeEnv');
    const isDevelopment = nodeEnv === 'development';
    const dbHealth = await this.prismaService.isHealthy();

    const baseInfo = {
      status: dbHealth ? 'ok' : 'degraded',
      service: 'CVision API',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: nodeEnv,
      version: '1.0.0',
      services: {
        api: 'operational',
        database: dbHealth ? 'operational' : 'down',
        firebase: 'operational', // TODO: Add Firebase health check
        aiService: 'not_configured', // TODO: Add AI service check
      },
      configuration: {
        port: this.configService.get<number>('app.port'),
        apiPrefix: this.configService.get<string>('app.apiPrefix'),
        apiVersion: this.configService.get<string>('app.apiVersion'),
        logLevel: this.configService.get<string>('logging.logLevel'),
        databaseUrl: isDevelopment 
          ? this.configService.get<string>('database.url')?.replace(/:[^:]*@/, ':***@')
          : 'hidden',
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
          firebaseConfigured: !!this.configService.get<string>('firebase.projectId'),
          uploadPath: this.configService.get<string>('upload.path'),
          maxFileSize: this.configService.get<number>('upload.maxFileSize'),
          allowedFileTypes: this.configService.get<string[]>('upload.allowedTypes'),
        },
      };
    }

    return baseInfo;
  }
}
