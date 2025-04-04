import type { CookieOptions, Request, Response } from 'express';
import { Injectable, Req, Res } from '@nestjs/common';
@Injectable()
export class CookieUtil {
  setRefreshTokenCookie(
    @Res({ passthrough: true }) res: Response,
    value: string,
  ) {
    try {
      const options: CookieOptions = {
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        path: '/admins/refresh',
        maxAge: 1000 * 60 * 60 * 24 * 15,
      };
      res.cookie('refresh_token', value, options);
    } catch (error) {
      console.log(error);
    }
  }

  getRefreshTokenCookie(@Req() req: Request): string {
    return req.cookies['refresh_token'];
  }

  deleteCookie(res: Response, name: string) {
    res.clearCookie(name, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
    });
  }
}
