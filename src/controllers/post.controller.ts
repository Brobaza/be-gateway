import { HttpService } from '@nestjs/axios';
import {
    Body,
    Controller,
    Delete,
    FileTypeValidator,
    Get,
    HttpCode,
    HttpStatus,
    MaxFileSizeValidator,
    Param,
    ParseFilePipe,
    Post,
    Req,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { lastValueFrom } from 'rxjs';
import { CurrentUserId, SkipVerification } from 'src/decorators';
import { SessionType } from 'src/enums/session-type.enum';
import { CreatePostResponse} from 'src/gen/post.service';
import { CustomThrottlerGuard } from 'src/guards/custom-throttler.guard';
import { JwtAccessTokenGuard } from 'src/guards/jwt-access-token.guard';
import { UploadMessageRequest } from 'src/models/request/upload-message.request';
import { FindAndCountResponse } from 'src/models/response/find-and-count.response';
import { PostService } from 'src/services/post.service';
import { Blob } from 'buffer';

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
        const result = await this.postService.getPostOnDashBoard(userId)
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
        }
        else{
            return this.postService.getListPostOnOtherUser(userId,friendId);
        }
    }
    
}
