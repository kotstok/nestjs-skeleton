import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtGuard } from '@project/auth/guard';
import { Getuser } from '@project/auth/decorator';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  @Get('me')
  aboutMe(@Getuser() user: User) {
    return user;
  }

  @Patch()
  editUser() {
    return '';
  }
}
