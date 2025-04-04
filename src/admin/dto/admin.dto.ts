import { IsString, IsUUID, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseModelDto } from '@/shared/dto/base.dto';
import { AuthAccessToken } from '@/shared/dto/auth.dto';

export class CreateAdmin {
  @IsString()
  @Length(0, 50)
  username: string;

  @IsUUID()
  auth_id: string;
}

export class AdminDto extends BaseModelDto {
  @ApiProperty()
  username: string;
  @ApiProperty({ type: 'string', nullable: true })
  auth_id: string | null;
}

export class AuthenticatedAdminDto extends AuthAccessToken {}
