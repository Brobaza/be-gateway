import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ProductLabelTypes } from 'src/enums/product_labels.enums';

export class CreateProductLabelRequest {
  @ApiProperty({ example: 'New', enum: ProductLabelTypes })
  @IsEnum(ProductLabelTypes)
  @IsNotEmpty()
  type: ProductLabelTypes;

  @ApiProperty({ example: '#000000' })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({ example: 'SALE' })
  @IsString()
  @IsOptional()
  content?: string;
}
