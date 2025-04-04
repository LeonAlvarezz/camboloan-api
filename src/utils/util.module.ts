import { Module } from '@nestjs/common';
import { CookieUtil } from './cookie';

@Module({
  providers: [CookieUtil],
  exports: [CookieUtil],
})
export class UtilModule {}
