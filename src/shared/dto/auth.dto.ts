import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';

export class Signup {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsString()
  @Length(8, 20)
  password: string;
}

export class Login {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @Length(8, 20)
  password: string;

  @ApiProperty({
    description: 'OTP Pin Code',
    default: 666666,
  })
  @IsNumber()
  otp: number;
}

export class AuthAccessToken {
  @ApiProperty()
  token: string;
  @IsDate()
  expires_at: Date;
}
