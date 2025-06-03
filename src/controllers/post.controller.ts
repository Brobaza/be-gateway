import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUserId, SkipVerification } from 'src/decorators';
import { SessionType } from 'src/enums/session-type.enum';
import { CreatePostResponse } from 'src/gen/post.service';
import { JwtAccessTokenGuard } from 'src/guards/jwt-access-token.guard';
import { BaseFindAndCountRequest } from 'src/models/request/base-find-and-count.request';
import { CreateCommentRequest } from 'src/models/request/create-comment.request';
import { CreateEmotionRequest } from 'src/models/request/create-emotion.request';
import { CreatePostRequest } from 'src/models/request/create-post.request';
import { FindAndCountResponse } from 'src/models/response/find-and-count.response';
import { OkResponse } from 'src/models/response/ok.response';
import { PostService } from 'src/services/post.service';

@ApiBearerAuth(SessionType.ACCESS)
@ApiTags('Posts')
@UseGuards(JwtAccessTokenGuard)
@Controller({
  path: 'posts',
  version: '1',
})
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiResponse({ type: () => FindAndCountResponse<CreatePostResponse> })
  @HttpCode(HttpStatus.OK)
  @SkipVerification()
  @Get('/')
  async getPostOnDashBoard(
    @CurrentUserId() userId: string,
    @Query() query: BaseFindAndCountRequest,
  ): Promise<FindAndCountResponse<CreatePostResponse>> {
    const result = await this.postService.getPostOnDashBoard(userId, query);
    return result;
  }

  @ApiResponse({ type: () => FindAndCountResponse<CreatePostResponse> })
  @HttpCode(HttpStatus.OK)
  @SkipVerification()
  @Get('/me')
  async getMyPost(
    @CurrentUserId() userId: string,
    @Query() query: BaseFindAndCountRequest,
  ): Promise<FindAndCountResponse<CreatePostResponse>> {
    return this.postService.getListPostByUserId(userId, query);
  }

  @ApiResponse({ type: () => FindAndCountResponse<CreatePostResponse> })
  @HttpCode(HttpStatus.OK)
  @SkipVerification()
  @Get('/:id')
  async getListPostOnOtherUser(
    @CurrentUserId() userId: string,
    @Param('id') friendId: string,
    @Query() query: BaseFindAndCountRequest,
  ): Promise<FindAndCountResponse<CreatePostResponse>> {
    return this.postService.getListPostOnOtherUser(userId, friendId, query);
  }

  @ApiResponse({ type: () => OkResponse })
  @HttpCode(HttpStatus.OK)
  @SkipVerification()
  @Post('')
  async createPost(
    @CurrentUserId() userId: string,
    @Body() createPostRequest: CreatePostRequest,
  ): Promise<OkResponse> {
    return this.postService.createPost(userId, createPostRequest);
  }

  @ApiResponse({ type: () => OkResponse })
  @HttpCode(HttpStatus.OK)
  @SkipVerification()
  @Post('/comment')
  async likePost(
    @CurrentUserId() userId: string,
    @Body() createCommentRequest: CreateCommentRequest,
  ): Promise<OkResponse> {
    return this.postService.createComment(userId, createCommentRequest);
  }

  @ApiResponse({ type: () => OkResponse })
  @HttpCode(HttpStatus.OK)
  @SkipVerification()
  @Post('/emotion')
  async createEmotion(
    @CurrentUserId() userId: string,
    @Body() createEmotionRequest: CreateEmotionRequest,
  ): Promise<OkResponse> {
    return this.postService.createEmotion(userId, createEmotionRequest);
  }
}
