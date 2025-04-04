import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Login, Signup } from '../shared/dto/auth.dto';
import { Auth } from 'decorators/auth.decorator';
import { AuthJwt } from '@/auth/entities/auth.type';
import { Public } from 'decorators/public-route.decorator';
import { Response, Request } from 'express';
import { CookieUtil } from '@/utils/cookie';

@Controller('admins')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly cookieUtil: CookieUtil,
  ) {}

  @Public()
  @Get()
  getAll() {
    return this.adminService.getAdmins();
  }

  @Get('me')
  getMe(@Auth() admin: AuthJwt) {
    return admin;
  }

  @Public()
  @Post('signup')
  signup(@Body() payload: Signup) {
    return this.adminService.signup(payload);
  }

  @Public()
  @Post('login')
  async login(
    @Body() payload: Login,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { data, refresh_token } = await this.adminService.login(payload);
    this.cookieUtil.setRefreshTokenCookie(res, refresh_token);
    return data;
  }

  //TODO: Store the refresh token in Redis, so we can easily revoke it later
  @Post('refresh')
  refresh(@Req() req: Request) {
    const refresh_token = this.cookieUtil.getRefreshTokenCookie(req);
    if (!refresh_token) {
      throw new UnauthorizedException(
        'Access Denied. No refresh token provided.',
      );
    }
    const newAccessToken = this.adminService.refreshToken(refresh_token);
    return {
      access_token: newAccessToken,
    };
  }
}
