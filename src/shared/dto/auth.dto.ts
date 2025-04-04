import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';

export class Signup {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @Length(8, 20)
  password: string;
}

export class Login {
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 20)
  password: string;

  @IsNumber()
  otp: number;
}
