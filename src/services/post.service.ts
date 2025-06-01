import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { toNumber } from 'lodash';
import { firstValueFrom } from 'rxjs';
import { PostDomain } from 'src/domains/post.domain';
import {CreatePostResponse} from 'src/gen/post.service';
@Injectable()
export class PostService {
  logger = new Logger(PostService.name);

  constructor(private readonly postDomain: PostDomain) {}

  async getPostOnDashBoard(userId: string, limit:number, page :number): Promise<any> {
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
  async getListPostByUserId(userId: string, limit: number, page: number): Promise<any> {
    const { postResponse, metadata } = await firstValueFrom(
      this.postDomain.getPostDomain().getListPostByUserId({ userId, limit, page }),
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
  async getListPostOnOtherUser(userId: string, friendId: string, limit :number, page: number): Promise<any> {
    const { postResponse, metadata } = await firstValueFrom(
      this.postDomain
        .getPostDomain()
        .getListPostOnOtherUser({ userId, friendId, limit, page }),
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
  async getPostDetail(postId: string): Promise<any> {
    const response: CreatePostResponse = await firstValueFrom(
      this.postDomain.getPostDomain().getPostDetail({ postId }),
    );
  
    if (response.metaData?.respcode === '500') {
      this.logger.error(response.metaData?.message || 'Unknown error');
  
      throw new InternalServerErrorException({
        message: response.metaData?.message || 'Unknown error',
        code: response.metaData?.respcode || '500',
      });
    }
  
    return response;
  }  
  async createPost(
    authorId: string,
    content: string,
    taggedUserIds: string[],
    images: string[],
    postParentId: string,
    postType: string,
  ): Promise<any> {
    const response: CreatePostResponse  = await firstValueFrom(
        this.postDomain.getPostDomain().createPost({
          authorId,
          content,
          taggedUserIds,
          images,
          postParentId,
          postType,
        }),
      );
      if (response.metaData.respcode !== '200') {
        this.logger.error(response.metaData.message);
  
        throw new InternalServerErrorException({
          message: response.metaData.message,
          code: response.metaData.respcode,
        });
      }
     return response;
  }  
}
