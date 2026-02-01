import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
  };
}

@Injectable()
export class RateLimiterGuard implements CanActivate {
  private readonly logger = new Logger(RateLimiterGuard.name);
  private readonly limit = Number(process.env.RATE_LIMIT_MAX) || 5;
  private readonly window = Number(process.env.RATE_LIMIT_WINDOW) || 60;

  constructor(private redisService: RedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const redis = this.redisService.getClient();

    try {
      const userId = request.user?.userId;
      const ip =
        request.ip ||
        request.headers['x-forwarded-for']?.toString().split(',')[0] ||
        'unknown';

      const identifier = userId ? `user:${userId}` : `ip:${ip}`;
      const key = `rate_limit:${identifier}`;

      const current = await redis.incr(key);

      if (current === 1) {
        await redis.expire(key, this.window);
      }

      if (current > this.limit) {
        this.logger.warn(
          `Rate limit exceeded for ${identifier}: ${current}/${this.limit}`,
        );
        throw new HttpException(
          `Too many requests. Max ${this.limit} requests per ${this.window} seconds`,
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      return true;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error('Rate limiter internal error', error);
      return true;
    }
  }
}