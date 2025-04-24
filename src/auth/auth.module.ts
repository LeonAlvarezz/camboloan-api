import { forwardRef, Module } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { AdminModule } from '@/admin/admin.module';

@Module({
  providers: [AuthRepository],
  exports: [AuthRepository],
  imports: [forwardRef(() => AdminModule)],
})
export class AuthModule {}
