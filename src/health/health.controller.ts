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
    const start = Date.now();
    const dbHealth = await this.prismaService.isHealthy();
    const responseTime = Date.now() - start;
    
    return {
      status: 'ok',
      service: 'CVision API',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: this.configService.get<string>('app.nodeEnv'),
      version: '1.0.0',
      database: dbHealth ? 'connected' : 'disconnected',
      performance: {
        dbResponseTime: `${responseTime}ms`,
        status: responseTime < 1000 ? 'good' : responseTime < 3000 ? 'slow' : 'critical',
      },
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

  @Get('performance')
  @Public()
  async checkPerformance() {
    const results = {
      timestamp: new Date().toISOString(),
      tests: {},
    };

    // Test database ping multiple times
    const dbPings = [];
    for (let i = 0; i < 3; i++) {
      const start = Date.now();
      try {
        await this.prismaService.$queryRaw`SELECT 1 as performance_test`;
        const responseTime = Date.now() - start;
        dbPings.push({ success: true, responseTime });
      } catch (error) {
        const responseTime = Date.now() - start;
        dbPings.push({ success: false, responseTime });
      }
      
      // Small delay between pings
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    results.tests = {
      database: {
        pings: dbPings,
        average: Math.round(dbPings.reduce((sum, ping) => sum + ping.responseTime, 0) / dbPings.length),
        min: Math.min(...dbPings.map(ping => ping.responseTime)),
        max: Math.max(...dbPings.map(ping => ping.responseTime)),
        allSuccessful: dbPings.every(ping => ping.success),
      },
      application: {
        uptime: process.uptime(),
        memoryUsage: {
          heapUsed: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
          heapTotal: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
        },
      },
    };

    return results;
  }
}
