import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for Flutter app integration
  app.enableCors({
    origin: true, // Configure this based on your Flutter app's needs
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global validation pipe for request validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: process.env.NODE_ENV === 'production',
    }),
  );

  // Global response interceptor for consistent responses
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Note: Global exception filter is configured in AppModule via APP_FILTER

  // Set global prefix for API routes
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 CVision API is running on: http://localhost:${port}/api`);
  console.log(`📊 Health check available at: http://localhost:${port}/api/health`);
}

bootstrap();
