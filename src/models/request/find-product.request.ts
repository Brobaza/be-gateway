import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseFindAndCountRequest } from './base-find-and-count.request';
import { IsOptional, IsString } from 'class-validator';

export class FindProductRequest extends BaseFindAndCountRequest {
  @ApiPropertyOptional({ example: '' })
  @IsString()
  @IsOptional()
  category?: string;
}
