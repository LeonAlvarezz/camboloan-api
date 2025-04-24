import { IsBoolean, IsUUID } from 'class-validator';

export class CreateSessionDto {
  @IsUUID()
  token: string;
  @IsUUID()
  auth_id: string;
  @IsBoolean()
  two_factor_verified: boolean;
}
