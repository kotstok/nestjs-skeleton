import { IsString, IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class SignupDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly passwd: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(240)
  name: string;
}
