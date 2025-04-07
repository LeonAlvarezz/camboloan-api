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
import { AuthAccessToken, Login, Signup } from '../shared/dto/auth.dto';
import { Auth } from 'decorators/auth.decorator';
import { AuthJwt } from '@/auth/entities/auth.type';
import { Public } from 'decorators/public-route.decorator';
import { Response, Request } from 'express';
import { Cookie, CookieUtil } from '@/utils/cookie';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { AdminDto, AuthenticatedAdminDto } from './dto/admin.dto';
import { ApiEnvelopResponse } from 'decorators/response-data.decorator';
import { Success, SuccessResponse } from '@/shared/response/response';

@Controller('admins')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly cookieUtil: CookieUtil,
  ) {}

  @ApiOperation({ summary: 'Get All Admins' })
  @ApiEnvelopResponse([AdminDto])
  @Public()
  @Get()
  getAll(): Promise<AdminDto[]> {
    return this.adminService.getAdmins();
  }

  @ApiOperation({ summary: 'Admin Get Me' })
  // @ApiCreatedResponse({ type: [AuthJwt] })
  @ApiEnvelopResponse(AuthJwt)
  @ApiBearerAuth()
  @Get('me')
  getMe(@Auth() admin: AuthJwt) {
    return admin;
  }

  @ApiOperation({ summary: 'Admin Signup' })
  // @ApiCreatedResponse({ description: 'Admin Signup', type: [AdminDto] })
  @ApiEnvelopResponse(AdminDto)
  @Public()
  @Post('signup')
  signup(@Body() payload: Signup): Promise<AdminDto> {
    return this.adminService.signup(payload);
  }

  @ApiOperation({ summary: 'Admin Login' })
  @ApiEnvelopResponse(AuthenticatedAdminDto)
  @Public()
  @ApiBody({ type: Login })
  @Post('login')
  async login(
    @Body() payload: Login,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { data, refresh_token } = await this.adminService.login(payload);
    this.cookieUtil.setAccessTokenCookie(res, data.access_token);
    this.cookieUtil.setRefreshTokenCookie(res, refresh_token);
    return data;
  }

  @ApiOperation({ summary: 'Admin Logout' })
  @ApiEnvelopResponse(SuccessResponse)
  @Post('logout')
  logout(@Res() res: Response) {
    this.cookieUtil.deleteCookie(res, Cookie.ACCESS_TOKEN);
    this.cookieUtil.deleteCookie(res, Cookie.REFRESH_TOKEN);
    return Success(res);
  }

  //TODO: Store the refresh token in Redis, so we can easily revoke it later
  @ApiOperation({ summary: 'Admin Refresh Token' })
  @ApiEnvelopResponse(AuthAccessToken)
  @Post('refresh')
  refresh(@Req() req: Request) {
    const refresh_token = this.cookieUtil.getCookie(req, Cookie.REFRESH_TOKEN);
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
