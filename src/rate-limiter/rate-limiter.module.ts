import { Module } from '@nestjs/common';
import { RateLimiterGuard } from './rate-limiter.guard';
import { RedisModule } from '../redis/redis.module';
import { RateLimiterService } from './rate-limiter.service';

@Module({
  imports: [RedisModule],
  providers: [RateLimiterGuard, RateLimiterService],
  exports: [RateLimiterGuard, RateLimiterService],
})
export class RateLimiterModule {}
