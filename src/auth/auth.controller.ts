import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

interface AuthDto {
  email: string;
  password: string;
  role: string;
}

interface RegisterResponse {
  id: number;
  email: string;
  role: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: AuthDto): Promise<RegisterResponse> {
    const user = await this.authService.register(
      body.email,
      body.password,
      body.role,
    );
    return { id: user.id, email: user.email, role: user.role };
  }

  @Post('login')
  async login(@Body() body: AuthDto): Promise<{ access_token: string }> {
    const user = await this.authService.validateUser(
      body.email,
      body.password,
      body.role,
    );
    return this.authService.login(user);
  }
}