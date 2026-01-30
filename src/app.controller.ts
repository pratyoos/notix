import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { Roles } from './auth/decorators/roles.decorator';
import { RateLimiterGuard } from './rate-limiter/rate-limiter.guard';

@Controller()
export class AppController {

  @UseGuards(JwtAuthGuard, RateLimiterGuard)
  @Get('protected-hello')
  getProtectedHello(@Req() req) {
    return {
      message: 'Hello authenticated user',
      user: req.user,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard, RateLimiterGuard)
  @Roles('admin')
  @Get('admin-only')
  getAdminOnly(@Req() req) {
    return {
      message: 'Hello admin user',
      user: req.user,
    };
  }
}