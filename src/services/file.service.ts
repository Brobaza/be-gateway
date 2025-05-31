import { Injectable } from '@nestjs/common';
import { S3Domain } from 'src/domains/aws.domain';
import { S3BucketType } from 'src/enums/s3.enum';

@Injectable()
export class FileService {
  constructor(private readonly s3Domain: S3Domain) {}

  async uploadImageToConversation(
    userId: string,
    file: Buffer,
    fileName: string,
  ) {
    const urlImage = await this.s3Domain.upload(
      userId,
      file,
      S3BucketType.Message,
      fileName,
    );

    return {
      image: urlImage,
    };
  }

  async uploadVideoToConversation(
    userId: string,
    file: Buffer,
    fileName: string,
  ) {
    const url = await this.s3Domain.upload(
      userId,
      file,
      S3BucketType.Message,
      fileName,
    );

    return {
      video: url,
    };
  }
}
