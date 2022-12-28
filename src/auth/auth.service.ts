import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project/prisma/prisma.service';
import { AuthDto } from '@project/auth/dto';
import * as argon from 'argon2';
import { SignupDto } from '@project/auth/dto/signup.dto';
import { Prisma } from '@prisma/client';
import {AuthFailedException, UserAlreadyExistException} from '@project/auth/exceptions';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async signIn(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      select: {
        email: true,
        name: true,
        passwd: true,
      },
      where: {
        email: dto.email,
      },
    });

    const isValidPasswd = await argon.verify(user.passwd, dto.passwd);
    if (!isValidPasswd) {
      throw new AuthFailedException();
    }

    delete user.passwd;

    return user;
  }

  async signup(dto: SignupDto) {
    const now = new Date();

    const data = {
      passwd: await argon.hash(dto.passwd),
      createdAt: now,
      updatedAt: now,
    };
    const user: Prisma.UserCreateInput = { ...dto, ...data };

    try {
      await this.prisma.user.create({ data: user });
    } catch (e) {
      throw new UserAlreadyExistException();
    }

    return { created: true };
  }
}
