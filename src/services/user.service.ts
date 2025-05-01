import { ConflictException, Injectable } from '@nestjs/common';
import { get, isEmpty, omit } from 'lodash';
import { firstValueFrom } from 'rxjs';
import { UserDomain } from 'src/domains/user.domain';
import { Address } from 'src/gen/user.service';
import { BaseFindAndCountRequest } from 'src/models/request/base-find-and-count.request';
import { CreateAddrestRequest } from 'src/models/request/create-address.request';
import { UpdateAddressRequest } from 'src/models/request/update-address.request';
import { UpdateUserRequest } from 'src/models/request/update-user.request';
import {
  convertToUserAboutProto,
  convertToUserProto,
} from 'src/utils/converters';

@Injectable()
export class UserService {
  constructor(private readonly userDomain: UserDomain) {}

  async getMe(userId: string) {
    const resp = await this.userDomain.getUserThroughId(userId);

    return resp;
  }

  async getAddresses(
    userId: string,
    query: BaseFindAndCountRequest,
  ): Promise<{
    items: Address[];
    total: number;
  }> {
    const userGrpc = this.userDomain.getUserDomain();

    const { limit, page } = query;

    const resp = await firstValueFrom(
      userGrpc.getAddresses({
        userId,
        limit,
        page,
      }),
    );

    const { addresses, total, metadata } = resp;

    const { message, code, errMessage } = metadata;

    if (code !== '200' || !isEmpty(errMessage)) {
      throw new ConflictException({
        code,
        message,
        errMessage,
      });
    }

    return {
      items: addresses,
      total,
    };
  }

  async getAddress(userId: string, id: string) {
    const userGrpc = this.userDomain.getUserDomain();

    const resp = await firstValueFrom(
      userGrpc.getAddress({
        userId,
        id,
      }),
    );

    const { address, metadata } = resp;

    const { message, code, errMessage } = metadata;

    if (code !== '200' || !isEmpty(errMessage)) {
      throw new ConflictException({
        code,
        message,
        errMessage,
      });
    }

    return address;
  }

  async createAddress(userId: string, body: CreateAddrestRequest) {
    const userGrpc = this.userDomain.getUserDomain();

    const { title, address, type } = body;

    const resp = await firstValueFrom(
      userGrpc.createAddress({
        userId,
        title,
        address,
        type,
        isDefault: get(body, 'isDefault', false),
      }),
    );

    const { id: addressId, metadata } = resp;

    const { message, code, errMessage } = metadata;

    if (code !== '200' || !isEmpty(errMessage)) {
      throw new ConflictException({
        code,
        message,
        errMessage,
      });
    }

    return {
      id: addressId,
    };
  }

  async updateAddress(userId: string, id: string, body: UpdateAddressRequest) {
    const userGrpc = this.userDomain.getUserDomain();

    const resp = await firstValueFrom(
      userGrpc.updateAddress({
        userId,
        id,
        title: get(body, 'title', ''),
        address: get(body, 'address', ''),
        type: get(body, 'type', ''),
        isDefault: get(body, 'isDefault', false),
      }),
    );

    const { metadata } = resp;

    const { message, code, errMessage } = metadata;

    if (code !== '200' || !isEmpty(errMessage)) {
      throw new ConflictException({
        code,
        message,
        errMessage,
      });
    }

    return {
      message,
    };
  }

  async deleteAddress(userId: string, id: string) {
    const userGrpc = this.userDomain.getUserDomain();

    const resp = await firstValueFrom(
      userGrpc.deleteAddress({
        userId,
        id,
      }),
    );

    const { metadata } = resp;

    const { message, code, errMessage } = metadata;

    if (code !== '200' || !isEmpty(errMessage)) {
      throw new ConflictException({
        code,
        message,
        errMessage,
      });
    }

    return {
      message,
    };
  }

  async getDefaultAddress(userId: string) {
    const userGrpc = this.userDomain.getUserDomain();

    const resp = await firstValueFrom(
      userGrpc.getDefaultAddress({
        userId,
      }),
    );

    const { address, metadata } = resp;

    const { message, code, errMessage } = metadata;

    if (code !== '200' || !isEmpty(errMessage)) {
      throw new ConflictException({
        code,
        message,
        errMessage,
      });
    }

    return address;
  }

  async updateMe(userId: string, req: UpdateUserRequest) {
    const userGrpc = this.userDomain.getUserDomain();

    const resp = await firstValueFrom(
      userGrpc.updateUser({
        ...omit(convertToUserProto(req), ['role']),
        id: userId,
      }),
    );

    const { id, message, errMessage, code } = resp;

    if (code !== '200' || !isEmpty(errMessage) || isEmpty(id)) {
      throw new ConflictException({
        code,
        message,
        errMessage,
      });
    }

    return {
      message,
    };
  }
}
