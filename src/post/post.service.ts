import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project/prisma/prisma.service';
import { CreatePostDto, EditPostDto } from '@project/post/dto';
import { Prisma } from '@prisma/client';
import { AccessResourceDeniedError } from '@project/post/exceptions';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async createPost(authorId: number, dto: CreatePostDto) {
    const now = new Date();

    const data = {
      createdAt: now,
      updatedAt: now,
      authorId: authorId,
    };

    const post: Prisma.PostCreateInput = { ...dto, ...data };

    return this.prisma.post.create({ data: post });
  }

  async getPosts(authorId: number, postId: number) {
    const where: { authorId: number; id?: number } = { authorId: authorId };

    if (postId) where.id = postId;

    return this.prisma.post.findMany({ where: where });
  }

  async isAuthorPost(authorId: number, postId: number) {
    const post = await this.prisma.post.findUnique({
      select: { authorId: true },
      where: { id: postId },
    });

    return post && post.authorId === authorId;
  }

  async editPost(authorId: number, postId: number, dto: EditPostDto) {
    const isAuthorPost = await this.isAuthorPost(authorId, postId);

    if (!isAuthorPost) {
      throw new AccessResourceDeniedError();
    }

    return this.prisma.post.update({
      where: { id: postId },
      data: { ...dto, updatedAt: new Date() },
    });
  }

  async deletePost(authorId: number, postId: number) {
    const isAuthorPost = await this.isAuthorPost(authorId, postId);

    if (!isAuthorPost) {
      throw new AccessResourceDeniedError();
    }

    return this.prisma.post.delete({
      where: { id: postId },
    });
  }
}
