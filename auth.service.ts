import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { Wallet } from '../wallet/wallet.entity';
import { UserRole, UserStatus } from '../common/enums';
import { LoginDto, RegisterDto, RefreshTokenDto, VerifyOtpDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userRepository.findOne({
      where: [{ email: dto.email }, { phone: dto.phone }],
    });

    if (existing) {
      throw new ConflictException('Email or phone already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = this.userRepository.create({
      fullName: dto.fullName,
      email: dto.email,
      phone: dto.phone,
      password: hashedPassword,
      role: dto.role || UserRole.CLIENT,
      status: UserStatus.ACTIVE,
    });

    await this.userRepository.save(user);

    const wallet = this.walletRepository.create({
      userId: user.id,
      balance: 0,
      heldBalance: 0,
      isActive: true,
    });

    await this.walletRepository.save(wallet);

    const tokens = await this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      select: ['id', 'email', 'password', 'fullName', 'phone', 'role', 'status', 'avatar', 'isMfaEnabled'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Account is not active');
    }

    await this.userRepository.update(user.id, {
      lastLoginAt: new Date(),
    });

    const tokens = await this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async refreshToken(dto: RefreshTokenDto) {
    try {
      const payload = this.jwtService.verify(dto.refreshToken, {
        secret: this.configService.get('JWT_SECRET'),
      });

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const tokens = await this.generateTokens(user);
      return tokens;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const user = await this.userRepository.findOne({
      where: { phone: dto.phone },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (dto.type === 'phone') {
      user.isPhoneVerified = true;
    } else if (dto.type === 'email') {
      user.isEmailVerified = true;
    }

    await this.userRepository.save(user);

    return { message: 'Verification successful' };
  }

  private async generateTokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION', '30d'),
    });

    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: User) {
    const { password, refreshToken, mfaSecret, ...sanitized } = user;
    return sanitized;
  }
}
