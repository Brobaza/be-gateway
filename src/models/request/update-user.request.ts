import { PartialType } from '@nestjs/mapped-types';
import { createUserDto } from './create-user.request';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EGender } from 'src/enums/gender.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserRequest extends PartialType(createUserDto) {
    @ApiProperty({ example: 'https://example.com/image.png' })
    @IsString()
    @IsOptional()
    avatar?: string;

    @ApiProperty({ example: 'Viet Nam ' })
    @IsString()
    @IsOptional()
    country?: string;

    @ApiProperty({ example: 'Ho Chi Minh' })
    @IsString()
    @IsOptional()
    city?: string;

    @ApiProperty({ example: '123 Nguyen Van Linh' })
    @IsString()
    @IsOptional()
    address?: string;

    @ApiProperty({ example: '700000' })
    @IsString()
    @IsOptional()
    state?: string;

    @ApiProperty({ example: '700000' })
    @IsString()
    @IsOptional()
    zipCode?: string;

    @ApiProperty({ example: 'About me' })
    @IsString()
    @IsOptional()
    about?: string;

    @ApiProperty({ example: EGender.UNKNOWN })
    @IsEnum(EGender)
    @IsOptional()
    gender?: EGender;
}
