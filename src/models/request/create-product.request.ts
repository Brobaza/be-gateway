import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateProductLabelRequest } from './create-product-label.request';
import { Type } from 'class-transformer';
import { InventoryType } from 'src/enums/inventory-type.enum';

export class CreateProductRequest {
  @ApiProperty({ example: 'Product name' })
  @IsString()
  @IsNotEmpty()
  name: string;

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

  @ApiProperty({
    example: [
      'https://example.com/image.png',
      'https://example.com/image2.png',
    ],
  })
  @IsString({ each: true })
  @IsArray()
  @MinLength(3)
  images: string[];

  @ApiProperty({
    example: 'https://example.com/image.png',
  })
  @IsString()
  @IsNotEmpty()
  cover: string;

  @ApiProperty({
    example: ['kids'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  genders: string[];

  @ApiProperty({
    example: ['7', '8'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  sizes: string[];

  @ApiProperty({
    example: ['red', 'yellow'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  colors: string[];

  @ApiProperty({ example: 'New', enum: InventoryType })
  @IsEnum(InventoryType)
  @IsOptional()
  inventoryStatus: InventoryType;

  @ApiProperty({ example: 'Product description' })
  @IsString()
  @IsOptional()
  subDescription: string;

  @ApiProperty({ example: 'PUBLIC' })
  @IsString()
  @IsOptional()
  socialType: string;

  @ApiProperty({ example: 'Product description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    type: [CreateProductLabelRequest],
    example: [
      { type: 'New', color: '#ff0000', content: 'SALE' },
      { type: 'Limited', color: '#00ff00', content: 'EXCLUSIVE' },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductLabelRequest)
  @IsOptional()
  labels?: CreateProductLabelRequest[];

  @ApiProperty({ example: '4510c78a-2d61-41b5-93e3-d43a2422f3d8' })
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ example: 'iphone-16' })
  @IsString()
  @IsNotEmpty()
  slug: string;
}
