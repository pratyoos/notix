import { Module } from '@nestjs/common';
import { RateLimiterGuard } from './rate-limiter.guard';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [RateLimiterGuard],
  exports: [RateLimiterGuard],
})
export class RateLimiterModule {}
