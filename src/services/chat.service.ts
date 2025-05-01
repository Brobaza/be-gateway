import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { ChatDomain } from 'src/domains/chat.domain';
import { UploadMessageRequest } from 'src/models/request/upload-message.request';
import * as FormData from 'form-data';
import { ConfigService } from '@nestjs/config';
import { toNumber } from 'lodash';
import { Readable } from 'stream';

@Injectable()
export class ChatService {
  logger = new Logger(ChatService.name);

  constructor(
    private readonly chatDomain: ChatDomain,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async checkMeetingAllowance(
    userId: string,
    conversationId: string,
  ): Promise<boolean> {
    const { metadata, isAllowed } = await firstValueFrom(
      this.chatDomain.getChatDomain().checkMeetingAllowance({
        userId,
        conversationId,
      }),
    );

    if (metadata.code !== '200') {
      this.logger.error(metadata.errMessage);

      throw new InternalServerErrorException({
        message: metadata.message,
        code: metadata.code,
      });
    }

    return isAllowed;
  }

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

  bufferToStream(file: Express.Multer.File): Readable {
    const stream = new Readable();
    stream.push(file.buffer);
    stream.push(null);
    return stream;
  }

  async uploadImageToConversation(
    conversationId: string,
    userId: string,
    file: Express.Multer.File,
    fileName: string,
    metadata: {
      mimetype: string;
      originalname: string;
    },
    req: Request,
  ) {
    const formData = new FormData();

    const fileStream = this.bufferToStream(file);

    formData.append('file', fileStream, {
      filename: metadata.originalname,
      contentType: metadata.mimetype,
    });

    const targetHost = `${this.configService.get<string>('services.chat.container_name')}`;
    const targetPort = `${this.configService.get<string>('services.chat.port')}`;
    const targetUrl = `http://${targetHost}:${toNumber(targetPort) - 1}`;
    const path = `/api/v1/chat/media/upload`;

    const response = await lastValueFrom(
      this.httpService.post(targetUrl + path, formData, {
        headers: {
          'x-user-id': userId,
          'x-conversation-id': conversationId,
          'x-file-name': fileName,
          'Content-Type': `multipart/form-data;`,
          Authorization: req.headers['authorization'],
        },
      }),
    );

    return response;
  }

  async deleteConversation(
    userId: string,
    conversationId: string,
    messageId?: string,
  ) {
    const { metadata } = await firstValueFrom(
      this.chatDomain.getChatDomain().deleteMessage({
        userId,
        conversationId,
        messageId,
      }),
    );

    if (metadata.code !== '200') {
      this.logger.error(metadata.errMessage);

      throw new InternalServerErrorException({
        message: metadata.message,
        code: metadata.code,
      });
    }

    return true;
  }

  async getStreamToken(userId: string, conversationId: string) {
    const { token, metadata } = await firstValueFrom(
      this.chatDomain.getChatDomain().getStreamToken({
        userId,
        conversationId,
      }),
    );

    if (metadata.code !== '200') {
      this.logger.error(metadata.errMessage);

      throw new InternalServerErrorException({
        message: metadata.message,
        code: metadata.code,
      });
    }

    return token;
  }
}
