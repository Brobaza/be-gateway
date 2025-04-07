import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ChatDomain } from 'src/domains/chat.domain';
import { UploadMessageRequest } from 'src/models/request/upload-message.request';

@Injectable()
export class ChatService {
  logger = new Logger(ChatService.name);

  constructor(private readonly chatDomain: ChatDomain) {}

  async getOnlineUser(userId: string) {
    const { onlineUsers, metadata, total } = await firstValueFrom(
      this.chatDomain
        .getChatDomain()
        .getOnlineUsers({ userId, limit: 10, page: 1 }),
    );

    if (metadata.code !== '200') {
      this.logger.error(metadata.errMessage);

      throw new InternalServerErrorException({
        message: metadata.message,
        code: metadata.code,
      });
    }

    return {
      items: onlineUsers,
      total: total,
    };
  }

  async getConversations(userId: string) {
    const { conversation, total, metadata } = await firstValueFrom(
      this.chatDomain
        .getChatDomain()
        .getRelatedConversations({ userId, limit: 10, page: 1 }),
    );

    if (metadata.code !== '200') {
      this.logger.error(metadata.errMessage);

      throw new InternalServerErrorException({
        message: metadata.message,
        code: metadata.code,
      });
    }

    return {
      items: conversation,
      total: total,
    };
  }

  async getConversationDetail(userId: string, conversationId: string) {
    const { data, metadata } = await firstValueFrom(
      this.chatDomain
        .getChatDomain()
        .getConversationDetail({ conversationId, userId }),
    );

    if (metadata.code !== '200') {
      this.logger.error(metadata.errMessage);

      throw new InternalServerErrorException({
        message: metadata.message,
        code: metadata.code,
      });
    }

    return data;
  }

  async addNewConversation(userId: string, payload: UploadMessageRequest) {
    const { conversationId, metadata } = await firstValueFrom(
      this.chatDomain.getChatDomain().addNewConversation({
        userId,
        message: payload.message,
        participants: payload.targetIds,
      }),
    );

    if (metadata.code !== '200') {
      this.logger.error(metadata.errMessage);

      throw new InternalServerErrorException({
        message: metadata.message,
        code: metadata.code,
      });
    }

    return conversationId;
  }

  async uploadImageToConversation(
    conversationId: string,
    userId: string,
    file: Buffer,
    fileName: string,
  ) {
    
  }
}
