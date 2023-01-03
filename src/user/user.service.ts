import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project/prisma/prisma.service';
import { EditUserDto } from '@project/user/dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async editUser(uid: number, dto: EditUserDto) {
    const user = await this.prisma.user.update({
      where: { id: uid },
      data: { ...dto },
    });

    delete user.passwd;

    return user;
  }
}
