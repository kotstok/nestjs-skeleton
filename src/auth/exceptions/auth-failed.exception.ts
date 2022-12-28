import { BadRequestException } from '@nestjs/common';

export class AuthFailedException extends BadRequestException {
  constructor(error?: string) {
    super('Authentication failed. Incorrect email or password', error);
  }
}
