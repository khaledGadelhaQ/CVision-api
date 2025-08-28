import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, HttpAdapterHost } from '@nestjs/core';
import { HealthModule } from './health/health.module';
import { TestModule } from './test/test.module';
import { CatchEverythingFilter } from '@/common/filters/catch-everything.filter';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      envFilePath: [
        `.env.${process.env.NODE_ENV || 'development'}`,
        '.env',
      ],
      expandVariables: true,
    }),
    HealthModule,
    TestModule,
  ],
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
