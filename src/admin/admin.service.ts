import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AdminRepository } from './admin.repository';
import { AuthRepository } from '@/auth/auth.repository';
import { Login, Signup } from '@/shared/dto/auth.dto';
import { db } from '@/db';
import { verifyTOTP } from '@oslojs/otp';
import { env } from '@/config';
import {
  decodeToSessionId,
  decrypt,
  generateSessionToken,
  hashPassword,
  verifyPassword,
} from '@/utils';
import { SessionRepository } from '@/session/session.repository';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly authRepository: AuthRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  async getAdmins() {
    return await this.adminRepository.findAll();
  }

  async getMe(token: string) {
    const sessionId = decodeToSessionId(token);
    const result = await this.sessionRepository.findById(sessionId);
    if (result === null || !result?.auth) {
      throw new UnauthorizedException();
    }
    const { auth, ...session } = result;

    if (!auth.admin) {
      throw new UnauthorizedException();
    }
    const time = session.expires_at.getTime();
    await this.sessionRepository.updateSession(sessionId, time);
    return auth.admin;
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
      if (payload.otp !== Number(env.defaultOTPCode)) {
        throw new UnauthorizedException('Invalid Code');
      }
    }
    if (!auth.admin) throw new NotFoundException('Admin Cannot Be Found');
    const sessionToken = generateSessionToken();
    const expires_at = this.sessionRepository.create({
      auth_id: auth.id,
      token: sessionToken,
      two_factor_verified: !!auth.totp_key,
    });

    return {
      ...auth.admin,
      token: sessionToken,
      expires_at: expires_at,
    };
  }
  async logout(token: string) {
    const sessionId = decodeToSessionId(token);
    return await this.sessionRepository.deleteSessionById(sessionId);
  }
}
