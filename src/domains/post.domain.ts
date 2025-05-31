import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpcProxy } from '@nestjs/microservices';
import { POST_SERVICE_NAME, PostServiceClient } from 'src/gen/post.service';
import { MICROSERVICE_SERVICE_NAME } from 'src/libs/constants/microservice.name';

@Injectable()
export class PostDomain implements OnModuleInit {
  private postDomain: PostServiceClient;

  constructor(
    @Inject(MICROSERVICE_SERVICE_NAME.POST_SERVICE)
    private clientPost: ClientGrpcProxy,
  ) {}

  async onModuleInit() {
    this.postDomain =
      await this.clientPost.getService<PostServiceClient>(POST_SERVICE_NAME);
  }

  getPostDomain() {
    return this.postDomain;
  }
}
