import { PartialType } from '@nestjs/mapped-types';
import { createUserDto } from './create-user.request';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { EGender } from 'src/enums/gender.enum';
import { ApiProperty } from '@nestjs/swagger';
import { UserAbout } from 'src/gen/user.service';

export class UpdateUserRequest extends PartialType(createUserDto) {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  @IsOptional()
  id?: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'https://example.com/image.png' })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({ example: '+84987654321' })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({ example: '123 Nguyen Van Linh' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: 'Ho Chi Minh, Viet Nam' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({
    example: { bio: 'Developer', interests: ['Coding', 'Music'] },
  })
  @IsOptional()
  about?: UserAbout;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: EGender.MALE })
  @IsEnum(EGender)
  @IsOptional()
  gender?: EGender;

  @ApiProperty({ example: '2024-01-01T12:00:00Z' })
  @IsDateString()
  @IsOptional()
  phoneVerifiedAt?: string;

  @ApiProperty({ example: '2024-01-01T12:00:00Z' })
  @IsDateString()
  @IsOptional()
  emailVerifiedAt?: string;

  @ApiProperty({ example: 'ACTIVE' })
  @IsString()
  @IsOptional()
  status?: string;
}
