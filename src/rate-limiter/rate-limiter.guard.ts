import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { RateLimiterService } from './rate-limiter.service';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
  };
}

@Injectable()
export class RateLimiterGuard implements CanActivate {
  private readonly logger = new Logger(RateLimiterGuard.name);

  constructor(private rateLimiterService: RateLimiterService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    try {
      const userId = request.user?.userId;
      const ip =
        request.ip ||
        request.headers['x-forwarded-for']?.toString().split(',')[0] ||
        'unknown';

      const identifier = userId ? `user:${userId}` : `ip:${ip}`;
      const result = await this.rateLimiterService.checkLimit(identifier);

      if (!result.allowed) {
        this.logger.warn(
          `Rate limit exceeded for ${identifier}: ${result.current}/${result.limit}`,
        );
        throw new HttpException(
          `Too many requests. Max ${result.limit} requests per ${result.windowSeconds} seconds`,
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