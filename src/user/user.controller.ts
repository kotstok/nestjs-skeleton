import { Controller, Get, Patch, UseGuards, Body } from '@nestjs/common';
import { JwtGuard } from '@project/auth/guard';
import { Getuser } from '@project/auth/decorator';
import { User } from '@prisma/client';
import { EditUserDto } from '@project/user/dto';
import { UserService } from '@project/user/user.service';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  aboutMe(@Getuser() user: User) {
    return user;
  }

  @Patch()
  editUser(@Getuser('id') uid: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(uid, dto);
  }
}
