import type { CookieOptions, Request, Response } from 'express';
import { Injectable, Req, Res } from '@nestjs/common';
const ADMIN_COOKIE = 'admin_cookie';
@Injectable()
export class CookieUtil {
  setAdminCookie(@Res({ passthrough: true }) res: Response, value: string) {
    try {
      const options: CookieOptions = {
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 15,
      };
      res.cookie(ADMIN_COOKIE, value, options);
    } catch (error) {
      console.log(error);
    }
  }

  getAdminCookie(@Req() req: Request): string {
    return req.cookies[ADMIN_COOKIE];
  }
  deleteAdminCookie(res: Response): void {
    this.deleteCookie(res, ADMIN_COOKIE);
  }

  deleteCookie(res: Response, name: string) {
    res.clearCookie(name, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
    });
  }
}
