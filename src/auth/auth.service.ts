import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.entity';

interface JwtPayload {
  sub: number;
  email: string;
  role: string;
}

interface LoginResponse {
  access_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(
    email: string,
    password: string,
    role: string,
  ): Promise<Omit<User, 'password'>> {
    if (!email || !password || !role) {
      throw new Error('Email, password, and role are required');
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await this.usersService.create(email, hashed, role);
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as Omit<User, 'password'>;
  }

  async validateUser(
    email: string,
    pass: string,
    role: string,
  ): Promise<User> {
    if (!email || !pass || !role) {
      throw new UnauthorizedException('Email, password, and role are required');
    }

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const match = await bcrypt.compare(pass, user.password);
    if (!match) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(user: User): Promise<LoginResponse> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
