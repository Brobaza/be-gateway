// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v5.28.3
// source: chat.service.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export const protobufPackage = 'chatProtoService';

export interface MetadataDTO {
  message: string;
  code: string;
  errMessage: string;
}

export interface UserIdRequest {
  userId: string;
  limit: number;
  page: number;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  phoneNumber: string;
  country: string;
  address: string;
  state: string;
  city: string;
  zipCode: string;
  about: string;
  role: string;
  isPublic: boolean;
  email: string;
  gender: string;
}

export interface Mention {
  userId: string;
  displayName: string;
  startIndex: number;
  endIndex: number;
}

export interface Url {
  url: string;
  thumbnailImage: string;
  startIndex: number;
  endIndex: number;
  title: string;
  description: string;
}

export interface Emoji {
  emoji: string;
  userId: string;
}

export interface Message {
  id: string;
  senderId: string;
  body: string;
  contentType: string;
  mentions: Mention[];
  previewUrl: Url[];
  emojis: Emoji[];
  /** date time */
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  preview: string;
  senderId: string;
  name: string;
  type: string;
}

export interface Attachments {
  attachments: Attachment[];
  total: number;
}

export interface Links {
  total: number;
  links: Url[];
}

export interface Conversation {
  id: string;
  type: string;
  participants: User[];
  messages: Message[];
  lastActivity: string;
  /** date time */
  createdAt: string;
  updatedAt: string;
  /** other */
  attachments: Attachments | undefined;
  links: Links | undefined;
}

export interface GetOnlineUsersResponse {
  onlineUsers: User[];
  total: number;
  metadata: MetadataDTO | undefined;
}

export interface GetRelatedConversationsResponse {
  conversation: Conversation[];
  total: number;
  metadata: MetadataDTO | undefined;
}

export interface ConversationDetailRequest {
  conversationId: string;
  userId: string;
}

export interface GetConversationDetailResponse {
  data: Conversation | undefined;
  metadata: MetadataDTO | undefined;
}

export interface AddNewConversationRequest {
  userId: string;
  message: string;
  participants: string[];
}

export interface AddNewConversationResponse {
  conversationId: string;
  metadata: MetadataDTO | undefined;
}

export const CHAT_PROTO_SERVICE_PACKAGE_NAME = 'chatProtoService';

export interface ChatServiceClient {
  getOnlineUsers(request: UserIdRequest): Observable<GetOnlineUsersResponse>;

  getRelatedConversations(
    request: UserIdRequest,
  ): Observable<GetRelatedConversationsResponse>;

  getConversationDetail(
    request: ConversationDetailRequest,
  ): Observable<GetConversationDetailResponse>;

  addNewConversation(
    request: AddNewConversationRequest,
  ): Observable<AddNewConversationResponse>;
}

export interface ChatServiceController {
  getOnlineUsers(
    request: UserIdRequest,
  ):
    | Promise<GetOnlineUsersResponse>
    | Observable<GetOnlineUsersResponse>
    | GetOnlineUsersResponse;

  getRelatedConversations(
    request: UserIdRequest,
  ):
    | Promise<GetRelatedConversationsResponse>
    | Observable<GetRelatedConversationsResponse>
    | GetRelatedConversationsResponse;

  getConversationDetail(
    request: ConversationDetailRequest,
  ):
    | Promise<GetConversationDetailResponse>
    | Observable<GetConversationDetailResponse>
    | GetConversationDetailResponse;

  addNewConversation(
    request: AddNewConversationRequest,
  ):
    | Promise<AddNewConversationResponse>
    | Observable<AddNewConversationResponse>
    | AddNewConversationResponse;
}

export function ChatServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'getOnlineUsers',
      'getRelatedConversations',
      'getConversationDetail',
      'addNewConversation',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('ChatService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcStreamMethod('ChatService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const CHAT_SERVICE_NAME = 'ChatService';
