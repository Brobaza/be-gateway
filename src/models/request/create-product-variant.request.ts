import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateProductVariantRequest {
  @ApiProperty({ example: 'SALE' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 10 })
  @Min(1)
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ example: 9 })
  @Min(1)
  @IsNumber()
  @IsNotEmpty()
  salePrice: number;

  @ApiProperty({ example: 1 })
  @Min(1)
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
