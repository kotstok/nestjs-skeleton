import { Controller, Get, Param } from '@nestjs/common';

@Controller('post')
export class PostController {
  @Get()
  findById(@Param(':id') id: number) {
    return id;
  }
}
