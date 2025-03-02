import { PartialType } from '@nestjs/mapped-types';
import { CreateAddrestRequest } from './create-address.request';

export class UpdateAddressRequest extends PartialType(CreateAddrestRequest) {}
