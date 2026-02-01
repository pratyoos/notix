import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { Roles } from './auth/decorators/roles.decorator';
import { RateLimiterGuard } from './rate-limiter/rate-limiter.guard';

declare global {
  namespace Express {
    interface Request {
      user?: User | undefined;
    }
  }
}

@Controller()
export class AppController {

  @UseGuards(RateLimiterGuard)
  @Get()
  getHello(): Record<string, string> {
    return { message: 'Hello World!' };
  }

  @UseGuards(JwtAuthGuard, RateLimiterGuard)
  @Get('protected-hello')
  getProtectedHello(@Req() req: Request): Record<string, any> {
    return {
      message: 'Hello authenticated user',
      user: req.user,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard, RateLimiterGuard)
  @Roles('admin')
  @Get('admin-only')
  getAdminOnly(@Req() req: Request): Record<string, any> {
    return {
      message: 'Hello admin user',
      user: req.user,
    };
  }
}