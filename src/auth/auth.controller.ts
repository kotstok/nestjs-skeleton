import { Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post()
  login() {
    return 'login function';
  }

  @Post('signup')
  signup() {
    return 'signup function';
  }
}
