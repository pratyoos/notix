import { Injectable, OnModuleInit, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;
  private readonly logger = new Logger(RedisService.name);

  onModuleInit(): void {
    const redisPort = process.env.REDIS_PORT
      ? Number(process.env.REDIS_PORT)
      : 6379;
    this.client = new Redis({
      host: process.env.REDIS_HOST ?? '127.0.0.1',
      port: redisPort,
      retryStrategy: (times) => Math.min(times * 50, 2000),
    });

    this.client.on('error', (error) => {
      this.logger.error('Redis connection error:', error);
    });

    this.client.on('connect', () => {
      this.logger.log('Redis connected successfully');
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.client?.quit();
    this.logger.log('Redis connection closed');
  }

  getClient(): Redis {
    return this.client;
  }
}
