import { isAdminPath } from '@/utils';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthResponse } from './entities/auth.type';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@/decorators/public-route.decorator';
import { CookieUtil } from '@/utils/cookie';
import { AdminService } from '@/admin/admin.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private cookieUtil: CookieUtil,
    private adminService: AdminService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: AuthResponse; admin: AuthResponse }>();

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;
    const token = this.cookieUtil.getAdminCookie(request);
    const isAdminRoute = isAdminPath(request.originalUrl);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const auth = await this.adminService.getMe(token);
      if (isAdminRoute) {
        request.admin = {
          auth_id: auth.auth_id,
          sub: auth.id,
        };
      }
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  // private extractTokenFromHeader(request: Request): string | undefined {
  //   const [type, token] = request.headers.authorization?.split(' ') ?? [];
  //   return type === 'Bearer' ? token : undefined;
  // }
}
