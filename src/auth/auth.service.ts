import { Injectable, UnauthorizedException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  /** 
 * Validates the credentials of a user.  Returns the user without password if they are correct.
 */
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _pwd, ...result } = user as any;
      return result;
    }
    return null;
  }

  /**
   * Logs in and generates a JWT if the credentials are valid.
   */
  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Credentials invalidas');
    }
    const isValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Credentials invalidas');
    }
    const payload = { sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * Registers a new user and returns the created data (without password).
   */
  async register(dto: RegisterDto) {
    // SECURITY: Prevent public registration of admin accounts
    if (dto.role === 'admin') {
      throw new ForbiddenException('Registration as admin is not allowed publicly');
    }

    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new BadRequestException('Email already registered');
    }
    return this.usersService.createWithProfile(dto);
  }
}