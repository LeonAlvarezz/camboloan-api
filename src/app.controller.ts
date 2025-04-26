import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from '@/decorators/public-route.decorator';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Health Check' })
  @Public()
  @Get()
  getHello() {
    const data = {
      uptime: process.uptime(),
      message: 'OK',
      date: new Date(),
    };
    return data;
  }
}
