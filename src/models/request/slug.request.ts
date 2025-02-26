import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsSlug } from 'src/validations/is-slug.validation';

export class SlugRequest {
  @ApiProperty({ example: 'event-1' })
  @IsSlug()
  @IsString()
  @IsNotEmpty()
  slug: string;
}
