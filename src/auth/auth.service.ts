import { Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@project/prisma/prisma.service';
import { AuthDto } from '@project/auth/dto';
import { SignupDto } from '@project/auth/dto/signup.dto';
import {
  AuthFailedException,
  UserAlreadyExistException,
} from '@project/auth/exceptions';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signIn(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      select: {
        id: true,
        email: true,
        name: true,
        passwd: true,
      },
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new AuthFailedException();
    }

    const isValidPasswd = await argon.verify(user.passwd, dto.passwd);
    if (!isValidPasswd) {
      throw new AuthFailedException();
    }

    return this.signToken(user.id, user.email);
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
      if (e.code !== 'P2002') {
        // log if is not unique constraint error
        console.log(e);
      }

      throw new UserAlreadyExistException();
    }

    return { created: true };
  }

  async signToken(
    uid: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: uid,
      email,
    };

    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: this.config.get('JWT_EXPIRES_IN'),
      secret: this.config.get('JWT_SECRET'),
    });

    return { access_token };
  }
}
