import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { get, isEmpty, isNil, toNumber } from 'lodash';
import { firstValueFrom } from 'rxjs';
import { PostDomain } from 'src/domains/post.domain';
import { PostType } from 'src/enums/post-type.enum';
import { BaseFindAndCountRequest } from 'src/models/request/base-find-and-count.request';
import { CreateCommentRequest } from 'src/models/request/create-comment.request';
import { CreateEmotionRequest } from 'src/models/request/create-emotion.request';
import { CreatePostRequest } from 'src/models/request/create-post.request';
import { OkResponse } from 'src/models/response/ok.response';

@Injectable()
export class PostService {
  logger = new Logger(PostService.name);

  constructor(private readonly postDomain: PostDomain) {}

  async getPostOnDashBoard(
    userId: string,
    query: BaseFindAndCountRequest,
  ): Promise<any> {
    const { page = 1, limit = 10 } = query;
    const { postResponse, metadata } = await firstValueFrom(
      this.postDomain
        .getPostDomain()
        .getListPostOnDashBoard({ userId, page, limit }),
    );

    if (metadata.respcode !== '200') {
      this.logger.error(metadata.message);

      throw new InternalServerErrorException({
        message: metadata.message,
        code: metadata.respcode,
      });
    }

    console.log('postResponse', postResponse);

    return {
      items: isNil(postResponse) ? [] : postResponse,
      page: toNumber(page),
      limit: toNumber(limit),
    };
  }
  async getListPostByUserId(
    userId: string,
    query: BaseFindAndCountRequest,
  ): Promise<any> {
    const { page = 1, limit = 10 } = query;
    const { postResponse, metadata } = await firstValueFrom(
      this.postDomain
        .getPostDomain()
        .getListPostByUserId({ userId, page, limit }),
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
    params: BaseFindAndCountRequest,
  ): Promise<any> {
    const { page = 1, limit = 10 } = params;
    const { postResponse, metadata } = await firstValueFrom(
      this.postDomain
        .getPostDomain()
        .getListPostOnOtherUser({ userId, friendId, page, limit }),
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

  async createPost(
    userId: string,
    createPostRequest: CreatePostRequest,
  ): Promise<OkResponse> {
    if (isEmpty(createPostRequest.content)) {
      throw new InternalServerErrorException({
        message: 'Content cannot be empty',
        code: '400',
      });
    }

    const { metaData } = await firstValueFrom(
      this.postDomain.getPostDomain().createPost({
        authorId: userId,
        content: createPostRequest.content,
        images: get(createPostRequest, 'images', []),
        postParentId: get(createPostRequest, 'postParentId', null),
        postType: get(createPostRequest, 'postType', PostType.PUBLIC),
        taggedUserIds: get(createPostRequest, 'taggedUserIds', []),
      }),
    );

    if (metaData.respcode !== '200') {
      this.logger.error(metaData.message);

      throw new InternalServerErrorException({
        message: metaData.message,
        code: metaData.respcode,
      });
    }

    return { success: true };
  }

  async createComment(
    userId: string,
    createCommentRequest: CreateCommentRequest,
  ): Promise<OkResponse> {
    if (isEmpty(createCommentRequest.content)) {
      throw new InternalServerErrorException({
        message: 'Content cannot be empty',
        code: '400',
      });
    }

    const { metaData } = await firstValueFrom(
      this.postDomain.getPostDomain().createComment({
        authorId: userId,
        content: createCommentRequest.content,
        images: get(createCommentRequest, 'images', []),
        taggedUserIds: get(createCommentRequest, 'taggedUserIds', []),
        postId: get(createCommentRequest, 'postId', null),
        commentParentId: get(createCommentRequest, 'commentParentId', null),
      }),
    );

    if (metaData.respcode !== '200') {
      this.logger.error(metaData.message);

      throw new InternalServerErrorException({
        message: metaData.message,
        code: metaData.respcode,
      });
    }

    return { success: true };
  }

  async createEmotion(
    userId: string,
    createEmotionRequest: CreateEmotionRequest,
  ): Promise<OkResponse> {
    const { postId, emotionType } = createEmotionRequest;

    if (isEmpty(postId) || isEmpty(emotionType)) {
      throw new InternalServerErrorException({
        message: 'Post ID and Emotion Type cannot be empty',
        code: '400',
      });
    }

    const metaData = await firstValueFrom(
      this.postDomain.getPostDomain().createReactionPost({
        userId,
        postId,
        reactionType: String(emotionType),
      }),
    );

    if (metaData.respcode !== '200') {
      this.logger.error(metaData.message);

      throw new InternalServerErrorException({
        message: metaData.message,
        code: metaData.respcode,
      });
    }

    return { success: true };
  }
}
