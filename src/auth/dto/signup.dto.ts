import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class SignupDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly passwd: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
