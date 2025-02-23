import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
import { EGender } from 'src/enums/gender.enum';

export class createUserDto {
  @IsString()
  @IsNotEmpty()
  displayName: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  gender?: EGender;

  @IsStrongPassword()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
