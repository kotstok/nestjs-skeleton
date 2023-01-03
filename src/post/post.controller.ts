import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '@project/auth/guard';
import { Getuser } from '@project/auth/decorator';
import { PostService } from '@project/post/post.service';
import { CreatePostDto, EditPostDto } from '@project/post/dto';

@UseGuards(JwtGuard)
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get(':id?')
  getPosts(
    @Getuser('id') uid: number,
    @Param('id', new DefaultValuePipe(0), ParseIntPipe) postId: number,
  ) {
    return this.postService.getPosts(uid, postId > 0 ? postId : undefined);
  }

  @Post()
  createPost(@Getuser('id') uid: number, @Body() dto: CreatePostDto) {
    return this.postService.createPost(uid, dto);
  }

  @Patch(':id')
  editPostById(
    @Getuser('id') uid: number,
    @Param('id', ParseIntPipe) postId: number,
    @Body() dto: EditPostDto,
  ) {
    return this.postService.editPost(uid, postId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deletePostById(
    @Getuser('id') uid: number,
    @Param('id', ParseIntPipe) postId: number,
  ) {
    return this.postService.deletePost(uid, postId);
  }
}
