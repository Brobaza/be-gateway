import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { PostType } from 'src/enums/post-type.enum';

export class CreatePostRequest {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  hashtags: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  links: string[];

  @IsString()
  @IsOptional()
  postParentId: string;

  @IsEnum(PostType)
  @IsString()
  @IsOptional()
  postType: PostType;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  taggedUserIds: string[];
}
