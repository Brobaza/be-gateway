import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddToWishListRequest {
  @ApiProperty({ example: '1' })
  @IsString()
  @IsNotEmpty()
  productId: string;
}
