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
import { Conversation, User } from 'src/gen/chat.service';
import { CustomThrottlerGuard } from 'src/guards/custom-throttler.guard';
import { JwtAccessTokenGuard } from 'src/guards/jwt-access-token.guard';
import { UploadMessageRequest } from 'src/models/request/upload-message.request';
import { FindAndCountResponse } from 'src/models/response/find-and-count.response';
import { ChatService } from 'src/services/chat.service';
import { Blob } from 'buffer';

@ApiBearerAuth(SessionType.ACCESS)
@ApiTags('Chats')
@UseGuards(JwtAccessTokenGuard)
@Controller({
  path: 'chat',
  version: '1',
})
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiResponse({ type: () => () => FindAndCountResponse<User> })
  @HttpCode(HttpStatus.OK)
  @SkipVerification()
  @Get('/online-users')
  async getOnlineUsers(
    @CurrentUserId() userId: string,
  ): Promise<FindAndCountResponse<User>> {
    const result = await this.chatService.getOnlineUser(userId);
    return result;
  }

  @ApiResponse({ type: () => FindAndCountResponse<Conversation> })
  @HttpCode(HttpStatus.OK)
  @SkipVerification()
  @Get('/conversations')
  async getConversations(
    @CurrentUserId() userId: string,
  ): Promise<FindAndCountResponse<Conversation>> {
    const result = await this.chatService.getConversations(userId);
    return result;
  }

  @HttpCode(HttpStatus.OK)
  @SkipVerification()
  @Get('/conversations/:id')
  async getConversation(
    @CurrentUserId() userId: string,
    @Param('id') conversationId: string,
  ): Promise<Conversation> {
    const result = await this.chatService.getConversationDetail(
      userId,
      conversationId,
    );
    return result;
  }

  @HttpCode(HttpStatus.OK)
  @SkipVerification()
  @Post('/conversations')
  async addNewConversation(
    @CurrentUserId() userId: string,
    @Body() payload: UploadMessageRequest,
  ): Promise<{ id: string }> {
    const result = await this.chatService.addNewConversation(userId, payload);
    return { id: result };
  }

  @HttpCode(HttpStatus.OK)
  @SkipVerification()
  @Delete('/conversations/:conversationId/messages/:messageId')
  async deleteConversation(
    @CurrentUserId() userId: string,
    @Param('conversationId') conversationId: string,
    @Param('messageId') messageId: string,
  ): Promise<{ success: boolean }> {
    const result = await this.chatService.deleteConversation(
      userId,
      conversationId,
      messageId,
    );
    return { success: result };
  }

  @HttpCode(HttpStatus.OK)
  @SkipVerification()
  @Get('/conversations/:conversationId/stream/token')
  async getStreamToken(
    @CurrentUserId() userId: string,
    @Param('conversationId') conversationId: string,
  ): Promise<{ token: string }> {
    const result = await this.chatService.getStreamToken(
      userId,
      conversationId,
    );
    return { token: result };
  }

  @HttpCode(HttpStatus.OK)
  @SkipVerification()
  @Get('/conversations/:conversationId/permission')
  async checkMeetingAllowance(
    @CurrentUserId() userId: string,
    @Param('conversationId') conversationId: string,
  ): Promise<{ isAllowed: boolean }> {
    const result = await this.chatService.checkMeetingAllowance(
      userId,
      conversationId,
    );
    return { isAllowed: result };
  }

  @UseGuards(CustomThrottlerGuard)
  @Throttle({ default: { ttl: 60, limit: 5 } })
  @Post('/media/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @CurrentUserId() userId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1000 * 1000 }),
          new FileTypeValidator({
            fileType: '.(png|jpeg|jpg|webp)',
          }),
        ],
      }),
    )
    file,
    @Body('conversationId') conversationId: string,
    @Body('fileName') fileName: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const response = await this.chatService.uploadImageToConversation(
        conversationId,
        userId,
        file,
        fileName,
        {
          mimetype: file.mimetype,
          originalname: file.originalname,
        },
        req,
      );
      return response;
    } catch (error) {
      console.error('Error uploading file:', error);

      return { success: false, error: 'File upload failed' };
    }
  }
}
