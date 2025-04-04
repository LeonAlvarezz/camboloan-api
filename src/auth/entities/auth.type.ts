import { ApiProperty } from '@nestjs/swagger';

export class AuthJwt {
  @ApiProperty({ type: String, nullable: true })
  sub: string | null;
  @ApiProperty()
  auth_id: string;
}
