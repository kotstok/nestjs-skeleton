import { ForbiddenException } from '@nestjs/common';

export class AccessResourceDeniedError extends ForbiddenException {
  constructor(error?: string) {
    super('Access to resources denied', error);
  }
}
