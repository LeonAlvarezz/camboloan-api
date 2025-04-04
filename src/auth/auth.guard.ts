import { isAdminPath, JwtVerify } from '@/utils';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthJwt } from './entities/auth.type';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'decorators/public-route.decorator';
import { CookieUtil } from '@/utils/cookie';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private cookieUtil: CookieUtil,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: AuthJwt; admin: AuthJwt }>();

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const token = this.extractTokenFromHeader(request);
    const isAdminRoute = isAdminPath(request.originalUrl);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const auth = JwtVerify(token);
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      if (isAdminRoute) {
        request.admin = auth;
      } else {
        request.user = auth;
      }
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
