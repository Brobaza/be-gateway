import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
  Post,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUserId, SkipVerification } from 'src/decorators';
import { SessionType } from 'src/enums/session-type.enum';
import { CreatePostResponse } from 'src/gen/post.service';
import { JwtAccessTokenGuard } from 'src/guards/jwt-access-token.guard';
import { FindAndCountResponse } from 'src/models/response/find-and-count.response';
import { PostService } from 'src/services/post.service';
@ApiBearerAuth(SessionType.ACCESS)
@ApiTags('Posts')
@UseGuards(JwtAccessTokenGuard)
@Controller({
  path: 'posts',
  version: '1',
})
export class PostController {
  constructor(private readonly postService: PostService) { }

  @ApiResponse({ type: () => FindAndCountResponse<CreatePostResponse> })
  @HttpCode(HttpStatus.OK)
  @SkipVerification()
  @Get('/')
  async getPostOnDashBoard(
    @CurrentUserId() userId: string,
    @Body('limit') limit: number,
    @Body('page') page: number,
  ): Promise<FindAndCountResponse<CreatePostResponse>> {
    const result = await this.postService.getPostOnDashBoard(userId, limit, page);
    return result;
  }

  @ApiResponse({ type: () => FindAndCountResponse<CreatePostResponse> })
  @HttpCode(HttpStatus.OK)
  @SkipVerification()
  @Get('/user/:id')
  async getListPostOnOtherUser(
    @CurrentUserId() userId: string,
    @Param('id') friendId: string,
    @Body('limit') limit: number,
    @Body('page') page: number,
  ): Promise<FindAndCountResponse<CreatePostResponse>> {
    if (userId === friendId) {
      return this.postService.getListPostByUserId(userId, limit, page);
    } else {
      return this.postService.getListPostOnOtherUser(userId, friendId, limit, page);
    }
  }
  @ApiResponse({ type: () => FindAndCountResponse<CreatePostResponse> })
  @HttpCode(HttpStatus.OK)
  @SkipVerification()
  @Get('/:id')
  async getPostDetail(
    @Param('id') postId: string,
  ): Promise<CreatePostResponse> {
    try {
      const response = await this.postService.getPostDetail(postId);
      return response;
    } catch (error) {
      return {
        authorId: '',
        content: '',
        hashtags: [],
        links: [],
        taggedUserIds: [],
        images: [],
        postParentId: '',
        postId: '',
        postType: '',
        createdAt: '',
        comment: [],
        metaData: {
          respcode: '500',
          message: 'Failed to get post detail',
        },
      };
    }
  }

  @ApiResponse({ type: () => FindAndCountResponse<CreatePostResponse> })
  @HttpCode(HttpStatus.OK)
  @SkipVerification()
  @Post('/create')
  async createPost(
    @CurrentUserId() authorId: string,
    @Body('content') content: string,
    @Body('taggedUserIds') taggedUserIds: string[],
    @Body('images') images: string[],
    @Body('postParentId') postParentId: string,
    @Body('postType') postType: string,
  ): Promise<CreatePostResponse> {
    try {
      const response = await this.postService.createPost(
        authorId,
        content,
        taggedUserIds,
        images,
        postParentId,
        postType,
      );
      return response;
    } catch (error) {
      return {
        authorId: '',
        content: '',
        hashtags: [],
        links: [],
        taggedUserIds: [],
        images: [],
        postParentId: '',
        postId: '',
        postType: '',
        createdAt: '',
        comment: [],
        metaData: {
          respcode: '500',
          message: 'Failed to create post',
        },
      };
    }
  }
}
