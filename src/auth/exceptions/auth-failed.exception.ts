import { ForbiddenException } from '@nestjs/common';

export class AuthFailedException extends ForbiddenException {
  constructor(error?: string) {
    super('Authentication failed. Incorrect email or password', error);
  }
}
