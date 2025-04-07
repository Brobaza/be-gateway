import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpcProxy } from '@nestjs/microservices';
import { CHAT_SERVICE_NAME, ChatServiceClient } from 'src/gen/chat.service';
import { MICROSERVICE_SERVICE_NAME } from 'src/libs/constants/microservice.name';

@Injectable()
export class ChatDomain implements OnModuleInit {
  private chatDomain: ChatServiceClient;

  constructor(
    @Inject(MICROSERVICE_SERVICE_NAME.CHAT_SERVICE)
    private clientChat: ClientGrpcProxy,
  ) {}

  async onModuleInit() {
    this.chatDomain =
      await this.clientChat.getService<ChatServiceClient>(CHAT_SERVICE_NAME);
  }

  getChatDomain() {
    return this.chatDomain;
  }
}
