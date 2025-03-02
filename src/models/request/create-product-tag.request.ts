import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductTagRequest {
  @ApiProperty({ example: 'Smartphone' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
