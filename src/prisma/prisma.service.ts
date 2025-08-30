import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private configService: ConfigService) {
    const databaseUrl = configService.get<string>('database.url');
    
    super({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
      log: configService.get<string>('app.nodeEnv') === 'development' 
        ? ['query', 'info', 'warn', 'error'] 
        : ['error'],
      // Performance optimizations for serverless
      errorFormat: 'minimal',
      transactionOptions: {
        maxWait: 5000, // 5 seconds
        timeout: 10000, // 10 seconds
      },
    });
    
    // Setup graceful shutdown handler
    process.on('SIGTERM', this.gracefulShutdown.bind(this));
    process.on('SIGINT', this.gracefulShutdown.bind(this));
  }

  private async gracefulShutdown() {
    console.log('🔄 Gracefully shutting down database connections...');
    await this.$disconnect();
  }

  async onModuleInit() {
    try {
      console.log('🔄 Initializing database connection...');
      const start = Date.now();
      
      // Use a faster connection test instead of $connect
      await this.$queryRaw`SELECT 1 as health_check`;
      
      const duration = Date.now() - start;
      console.log(`🗄️ Database connected successfully in ${duration}ms`);
      
      // Warm up the connection pool
      await this.warmUpConnections();
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    console.log('🔄 Closing database connections...');
    await this.$disconnect();
    console.log('🗄️ Database disconnected');
  }

  // Warm up connections to reduce cold start
  private async warmUpConnections() {
    try {
      console.log('🔥 Warming up database connections...');
      
      // Execute multiple lightweight queries to establish connection pool
      const promises = Array(3).fill(null).map(() => 
        this.$queryRaw`SELECT 1 as warmup`
      );
      
      await Promise.all(promises);
      console.log('🔥 Connection pool warmed up');
    } catch (error) {
      console.warn('⚠️ Connection warmup failed:', error);
    }
  }

  // Utility method to handle database transactions
  async transaction<T>(fn: (prisma: PrismaClient) => Promise<T>): Promise<T> {
    return this.$transaction(fn);
  }

  // Fast health check method with timeout
  async isHealthy(): Promise<boolean> {
    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database health check timeout')), 3000)
      );
      
      const queryPromise = this.$queryRaw`SELECT 1 as health`;
      
      await Promise.race([queryPromise, timeoutPromise]);
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }

  // Connection status check (faster than full health check)
  isConnected(): boolean {
    return this.$connect !== undefined;
  }
}
