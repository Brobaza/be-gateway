import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCommentRequest {
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
  @MaxLength(3)
  images: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  links: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  taggedUserIds: string[];

  @IsString()
  @IsNotEmpty()
  postId: string;

  @IsString()
  @IsOptional()
  commentParentId: string;
}
