import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
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
  constructor(private readonly postService: PostService) {}

  @ApiResponse({ type: () => FindAndCountResponse<CreatePostResponse> })
  @HttpCode(HttpStatus.OK)
  @SkipVerification()
  @Get('/')
  async getPostOnDashBoard(
    @CurrentUserId() userId: string,
  ): Promise<FindAndCountResponse<CreatePostResponse>> {
    const result = await this.postService.getPostOnDashBoard(userId);
    return result;
  }

  @ApiResponse({ type: () => FindAndCountResponse<CreatePostResponse> })
  @HttpCode(HttpStatus.OK)
  @SkipVerification()
  @Get('/:id')
  async getListPostOnOtherUser(
    @CurrentUserId() userId: string,
    @Param('id') friendId: string,
  ): Promise<FindAndCountResponse<CreatePostResponse>> {
    if (userId === friendId) {
      return this.postService.getListPostByUserId(userId);
    } else {
      return this.postService.getListPostOnOtherUser(userId, friendId);
    }
  }
}
