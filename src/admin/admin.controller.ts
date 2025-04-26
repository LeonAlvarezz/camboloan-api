import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Login, Signup } from '../shared/dto/auth.dto';
import { Auth } from '@/decorators/auth.decorator';
import { AuthResponse } from '@/auth/entities/auth.type';
import { Public } from '@/decorators/public-route.decorator';
import { Response, Request } from 'express';
import { CookieUtil } from '@/utils/cookie';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { AdminDto, AuthenticatedAdminDto } from './dto/admin.dto';
import { ApiEnvelopResponse } from '@/decorators/response-data.decorator';
import { SimpleSuccess } from '@/shared/types/base.type';

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
  @ApiEnvelopResponse(AuthResponse)
  @ApiBearerAuth()
  @Get('me')
  getMe(@Auth() admin: AuthResponse) {
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
    const data = await this.adminService.login(payload);
    this.cookieUtil.setAdminCookie(res, data.token);
    return data;
  }

  @ApiOperation({ summary: 'Admin Logout' })
  @ApiEnvelopResponse(SimpleSuccess)
  @Public()
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
    const token = this.cookieUtil.getAdminCookie(req);
    await this.adminService.logout(token);
    this.cookieUtil.deleteAdminCookie(res);
    return res.json({
      message: 'Logout Successful',
    });
  }
}
