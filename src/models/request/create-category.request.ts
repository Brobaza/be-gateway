import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { IsSlug } from 'src/validations/is-slug.validation';

export class CreateCategoryRequest {
  @ApiProperty({ example: 'Smartphone' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'smartphone' })
  @IsSlug()
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'https://example.com/image.png' })
  @IsString()
  @IsOptional()
  image: string;

  @ApiProperty({ example: 'Pro Smartphone' })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ example: '81bc6f83-f5c9-47de-89c3-d0ddd31d0a28' })
  @IsUUID()
  @IsOptional()
  parentId: string;
}
