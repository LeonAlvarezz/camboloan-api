import { AuthJwt } from '@/auth/entities/auth.type';
import { isAdminPath } from '@/utils';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const Auth = createParamDecorator(
  (role: 'admin' | 'user', ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user: AuthJwt; admin: AuthJwt }>();
    const user = request.user;
    const admin = request.admin;
    return isAdminPath(request.originalUrl) ? admin : user;
  },
);
