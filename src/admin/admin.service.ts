import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service'; // Adjust the path as needed
import { AdminRepository } from './admin.repository';
import { AuthRepository } from '@/auth/auth.repository';
import { Login, Signup } from '@/shared/dto/auth.dto';
import { db } from '@/db';
import { verifyTOTP } from '@oslojs/otp';
import { config } from '@/config';
import {
  JwtSign,
  JwtVerify,
  decrypt,
  hashPassword,
  verifyPassword,
} from '@/utils';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly authRepository: AuthRepository,
    private readonly userService: UserService,
  ) {}

  async getAdmins() {
    return await this.adminRepository.findAll();
  }

  async signup(payload: Signup) {
    const existingAdmin = await this.authRepository.findByEmail(payload.email);
    if (existingAdmin) {
      throw new ForbiddenException('Admin Already Registered');
    }

    return db.transaction(async (tx) => {
      const hashedPassword = await hashPassword(payload.password);

      const auth = await this.authRepository.create(
        {
          email: payload.email,
          password: hashedPassword,
        },
        tx,
      );
      const admin = await this.adminRepository.create(
        {
          username: payload.username,
          auth_id: auth.id,
        },
        tx,
      );
      return admin;
    });
  }

  async login(payload: Login) {
    const auth = await this.authRepository.findByEmail(payload.email);
    if (!auth) {
      throw new NotFoundException('Admin Cannot Be Found');
    }
    const isPasswordValid = await verifyPassword(
      payload.password,
      auth.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid User Credentials');
    }

    if (auth.totp_key) {
      const key = decrypt(Uint8Array.from(auth.totp_key));
      if (!verifyTOTP(key, 30, 6, String(payload.otp))) {
        throw new UnauthorizedException('Invalid Code');
      }
    } else {
      if (payload.otp !== Number(config.defaultOTPCode)) {
        throw new UnauthorizedException('Invalid Code');
      }
    }
    if (!auth.admin) throw new NotFoundException('Admin Cannot Be Found');
    const access_token = JwtSign({ auth_id: auth.id, sub: auth.admin.id });
    const refresh_token = JwtSign(
      { auth_id: auth.id, sub: auth.admin.id },
      '3 Days',
    );

    const data = {
      ...auth.admin,
      access_token,
    };
    return {
      data,
      refresh_token,
    };
  }

  refreshToken(token: string) {
    const decoded = JwtVerify(token);
    return JwtSign(decoded);
  }
}
