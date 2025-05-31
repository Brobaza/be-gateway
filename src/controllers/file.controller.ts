import {
  Body,
  Controller,
  FileTypeValidator,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { CurrentUserId, SkipVerification } from 'src/decorators';
import { SessionType } from 'src/enums/session-type.enum';
import { CustomThrottlerGuard } from 'src/guards/custom-throttler.guard';
import { JwtAccessTokenGuard } from 'src/guards/jwt-access-token.guard';
import { OkResponse } from 'src/models/response/ok.response';
import { FileService } from 'src/services/file.service';

@ApiBearerAuth(SessionType.ACCESS)
@ApiTags('File')
@UseGuards(JwtAccessTokenGuard)
@SkipVerification()
@Controller({
  version: '1',
  path: 'media',
})
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @UseGuards(CustomThrottlerGuard)
  @Throttle({ default: { ttl: 60, limit: 10 } })
  @ApiOkResponse({
    type: () => OkResponse,
  })
  @ApiConsumes('multipart/form-data')
  @Post('/images')
  @HttpCode(HttpStatus.OK)
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
    @Body('fileName') fileName: string,
  ) {
    return await this.fileService.uploadImageToConversation(
      userId,
      file.buffer,
      fileName,
    );
  }

  @Post('/videos')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ type: () => OkResponse })
  @UseGuards(CustomThrottlerGuard)
  @Throttle({ default: { ttl: 60, limit: 5 } })
  async uploadVideo(
    @CurrentUserId() userId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100 * 1024 * 1024 }),
          new FileTypeValidator({
            fileType: '.(mp4|mov|avi|webm|mkv)',
          }),
        ],
      }),
    )
    file,
    @Body('fileName') fileName: string,
  ) {
    return await this.fileService.uploadVideoToConversation(
      userId,
      file.buffer,
      fileName,
    );
  }
}
