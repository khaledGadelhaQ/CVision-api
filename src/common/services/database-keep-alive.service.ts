import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseKeepAliveService implements OnModuleInit, OnModuleDestroy {
  private keepAliveInterval: NodeJS.Timeout | null = null;
  private readonly KEEP_ALIVE_INTERVAL = 4 * 60 * 1000; // 4 minutes

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    // Only enable keep-alive in development to prevent cold starts
    const isDevelopment = this.configService.get<string>('app.nodeEnv') === 'development';
    
    if (isDevelopment) {
      this.startKeepAlive();
    }
  }

  onModuleDestroy() {
    this.stopKeepAlive();
  }

  private startKeepAlive() {
    console.log('🔄 Starting database keep-alive service...');
    
    this.keepAliveInterval = setInterval(async () => {
      try {
        await this.prismaService.$queryRaw`SELECT 1 as keep_alive`;
        console.log('❤️ Database keep-alive ping successful');
      } catch (error) {
        console.warn('⚠️ Database keep-alive ping failed:', error.message);
      }
    }, this.KEEP_ALIVE_INTERVAL);
  }

  private stopKeepAlive() {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
      console.log('⏹️ Database keep-alive service stopped');
    }
  }

  // Manual ping method for testing
  async ping(): Promise<{ success: boolean; responseTime: number }> {
    const start = Date.now();
    
    try {
      await this.prismaService.$queryRaw`SELECT 1 as ping`;
      const responseTime = Date.now() - start;
      
      return { success: true, responseTime };
    } catch (error) {
      const responseTime = Date.now() - start;
      console.error('Database ping failed:', error);
      
      return { success: false, responseTime };
    }
  }
}
