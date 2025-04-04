import { IsString, IsUUID, Length } from 'class-validator';

export class CreateAdmin {
  @IsString()
  @Length(0, 50)
  username: string;

  @IsUUID()
  auth_id: string;
}
