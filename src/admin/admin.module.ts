import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UserModule } from 'src/user/user.module';
import { AdminRepository } from './admin.repository';
import { AuthModule } from '@/auth/auth.module';
import { UtilModule } from '@/utils/util.module';
@Module({
  controllers: [AdminController],
  providers: [AdminService, AdminRepository],
  exports: [AdminService],
  imports: [UserModule, AuthModule, UtilModule],
})
export class AdminModule {}
