import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { AddressType } from 'src/enums/address-type.enum';

export class CreateAddrestRequest {
  @ApiProperty({ example: 'Home' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: AddressType.HOME, enum: AddressType })
  @Transform(({ value }) => ('' + value).toLowerCase())
  @IsEnum(Object.values(AddressType))
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  isDefault: boolean;
}
