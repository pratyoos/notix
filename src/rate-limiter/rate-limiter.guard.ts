import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

interface AuthenticatedRequest {
  user: {
    userId: number;
  };
}

@Injectable()
export class RateLimiterGuard implements CanActivate {
  private readonly logger = new Logger(RateLimiterGuard.name);
  private readonly limit = Number(process.env.RATE_LIMIT_MAX) ?? 5;
  private readonly window = Number(process.env.RATE_LIMIT_WINDOW) ?? 60;

  constructor(private redisService: RedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
      const user = request.user;

      if (!user || !user.userId) {
        this.logger.warn('Rate limiter: No user found in request');
        return true;
      }

      const key = `rate_limit:${user.userId}`;
      const redis = this.redisService.getClient();

      const current = await redis.incr(key);

      if (current === 1) {
        await redis.expire(key, this.window);
      }

      if (current > this.limit) {
        this.logger.warn(
          `Rate limit exceeded for user ${user.userId}: ${current}/${this.limit}`,
        );
        throw new HttpException(
          `Rate limit exceeded. Max ${this.limit} requests per ${this.window} seconds`,
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Rate limiter error:', error);
      return true;
    }
  }
}
