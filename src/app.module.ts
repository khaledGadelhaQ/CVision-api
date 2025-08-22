import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, HttpAdapterHost } from '@nestjs/core';
import { HealthModule } from './health/health.module';
import { CatchEverythingFilter } from '@/common/filters/catch-everything.filter';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';

@Module({
  imports: [HealthModule],
  controllers: [],
  providers: [
    HttpAdapterHost,
    {
      provide: APP_FILTER,
      useClass: CatchEverythingFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
