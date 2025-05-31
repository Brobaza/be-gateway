import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { PostDomain } from 'src/domains/post.domain';
import { UploadMessageRequest } from 'src/models/request/upload-message.request';
import * as FormData from 'form-data';
import { ConfigService } from '@nestjs/config';
import { toNumber } from 'lodash';
import { Readable } from 'stream';


@Injectable()
export class PostService {
  logger = new Logger(PostService.name);

  constructor(
    private readonly postDomain: PostDomain,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}
  async getPostOnDashBoard(
    userId: string,limit = 10, page = 1,
  ): Promise<any> {
    const { postResponse, metadata } = await firstValueFrom(
      this.postDomain
        .getPostDomain()
        .getListPostOnDashBoard({ userId, limit, page }),
    );

    if (metadata.respcode !== '200') {
      this.logger.error(metadata.message);

      throw new InternalServerErrorException({
        message: metadata.message,
        code: metadata.respcode,
      });
    }

    return {
      items: postResponse,
      page: toNumber(page),
      limit: toNumber(limit),
    };
  }
  async getListPostByUserId(
    userId: string,
  ): Promise<any> {
    const { postResponse, metadata } = await firstValueFrom(
      this.postDomain
        .getPostDomain()
        .getListPostByUserId({ userId }),
    );

    if (metadata.respcode !== '200') {
      this.logger.error(metadata.message);

      throw new InternalServerErrorException({
        message: metadata.message,
        code: metadata.respcode,
      });
    }

    return {
      items: postResponse,
    };
  }
  async getListPostOnOtherUser(
    userId: string,
    friendId: string,
  ): Promise<any> {
    const { postResponse, metadata } = await firstValueFrom(
      this.postDomain
        .getPostDomain()
        .getListPostOnOtherUser({ userId, friendId }),
    );

    if (metadata.respcode !== '200') {
      this.logger.error(metadata.message);

      throw new InternalServerErrorException({
        message: metadata.message,
        code: metadata.respcode,
      });
    }

    return {
      items: postResponse,
    };
  }
}