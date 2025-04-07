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
        // path: '/admins/refresh',
        maxAge: 1000 * 60 * 60 * 24 * 15,
      };
      res.cookie(Cookie.REFRESH_TOKEN, value, options);
    } catch (error) {
      console.log(error);
    }
  }

  setAccessTokenCookie(
    @Res({ passthrough: true }) res: Response,
    value: string,
  ) {
    try {
      const options: CookieOptions = {
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        // path: '/admins/refresh',
        maxAge: 1000 * 60 * 60 * 24 * 15,
      };
      res.cookie(Cookie.ACCESS_TOKEN, value, options);
    } catch (error) {
      console.log(error);
    }
  }

  getCookie(@Req() req: Request, key: Cookie): string {
    return req.cookies[key];
  }

  deleteCookie(res: Response, name: string) {
    res.clearCookie(name, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
    });
  }
}

export enum Cookie {
  REFRESH_TOKEN = 'refresh_token',
  ACCESS_TOKEN = 'access_token',
}
