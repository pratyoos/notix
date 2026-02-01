import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service';

@Injectable()
export class CacheService {
  constructor(private readonly redisService: RedisService) {}
  
  async get(key: string): Promise<string | null> {
    const client = this.redisService.getClient();
    return client.get(key);
  }

    async set(key: string, value: string, ttl?: number): Promise<void> {
    const client = this.redisService.getClient();
    if (ttl) {
      await client.setex(key, ttl, value);
    }
    else {
        await client.set(key, value);
        }

    }
    async del(key: string): Promise<void> {
    const client = this.redisService.getClient();
    await client.del(key);
    }
}