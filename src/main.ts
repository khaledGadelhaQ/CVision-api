import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Get configuration values
  const port = configService.get<number>('app.port');
  const apiPrefix = configService.get<string>('app.apiPrefix');
  const nodeEnv = configService.get<string>('app.nodeEnv');
  const enableRequestLogging = configService.get<boolean>('logging.enableRequestLogging');

  // Enable CORS for Flutter app integration
  app.enableCors({
    origin: nodeEnv === 'production' ? false : true, // Configure based on environment
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global validation pipe for request validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: nodeEnv === 'production',
    }),
  );

  // Global response interceptor for consistent responses
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Note: Global exception filter is configured in AppModule via APP_FILTER

  // Set global prefix for API routes
  app.setGlobalPrefix(apiPrefix);

  await app.listen(port);

  console.log(`🚀 CVision API is running on: http://localhost:${port}/${apiPrefix}`);
  console.log(`📊 Health check available at: http://localhost:${port}/${apiPrefix}/health`);
  console.log(`🌍 Environment: ${nodeEnv}`);
  console.log(`📝 Request logging: ${enableRequestLogging ? 'enabled' : 'disabled'}`);
}

bootstrap();
