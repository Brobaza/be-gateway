import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUserId, SkipVerification } from 'src/decorators';
import { SessionType } from 'src/enums/session-type.enum';
import { JwtAccessTokenGuard } from 'src/guards/jwt-access-token.guard';
import { BaseFindAndCountRequest } from 'src/models/request/base-find-and-count.request';
import { CreateAddrestRequest } from 'src/models/request/create-address.request';
import { IdRequest } from 'src/models/request/id.request';
import { UpdateAddressRequest } from 'src/models/request/update-address.request';
import { AddressResponse } from 'src/models/response/address.response';
import { CreatedResponse } from 'src/models/response/created.response';
import { FindAndCountResponse } from 'src/models/response/find-and-count.response';
import { GetMeResponse } from 'src/models/response/get-me.response';
import { OkResponse } from 'src/models/response/ok.response';
import { UserService } from 'src/services/user.service';

@ApiBearerAuth(SessionType.ACCESS)
@ApiTags('Users')
@UseGuards(JwtAccessTokenGuard)
@Controller({
  path: 'users',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({ type: () => () => GetMeResponse })
  @HttpCode(HttpStatus.OK)
  @SkipVerification()
  @Get('/me')
  async getMe(@CurrentUserId() userId: string): Promise<GetMeResponse> {
    const result = await this.userService.getMe(userId);
    return result;
  }

  @ApiResponse({ type: () => FindAndCountResponse<AddressResponse> })
  @HttpCode(HttpStatus.OK)
  @Get('/addresses')
  async getAddresses(
    @CurrentUserId() userId: string,
    @Query() query: BaseFindAndCountRequest,
  ): Promise<FindAndCountResponse<AddressResponse>> {
    const result = await this.userService.getAddresses(userId, query);
    return result;
  }

  @ApiResponse({ type: () => AddressResponse })
  @HttpCode(HttpStatus.OK)
  @Get('/addresses/:id')
  async getAddress(
    @CurrentUserId() userId: string,
    @Param() { id }: IdRequest,
  ): Promise<AddressResponse> {
    const result = await this.userService.getAddress(userId, id);
    return result;
  }

  @ApiResponse({ type: () => AddressResponse })
  @HttpCode(HttpStatus.OK)
  @Get('/addresses/default')
  async getDefaultAddress(
    @CurrentUserId() userId: string,
  ): Promise<AddressResponse> {
    const result = await this.userService.getDefaultAddress(userId);
    return result;
  }

  @ApiResponse({ type: () => CreatedResponse })
  @HttpCode(HttpStatus.OK)
  @Post('/addresses')
  async createAddress(
    @CurrentUserId() userId: string,
    @Body() body: CreateAddrestRequest,
  ): Promise<CreatedResponse> {
    const result = await this.userService.createAddress(userId, body);
    return result;
  }

  @ApiResponse({ type: () => OkResponse })
  @HttpCode(HttpStatus.OK)
  @Patch('/addresses/:id')
  async updateAddress(
    @CurrentUserId() userId: string,
    @Param() { id }: IdRequest,
    @Body() body: UpdateAddressRequest,
  ): Promise<OkResponse> {
    await this.userService.updateAddress(userId, id, body);
    return {
      success: true,
    };
  }

  @ApiResponse({ type: () => OkResponse })
  @HttpCode(HttpStatus.OK)
  @Delete('/addresses/:id')
  async deleteAddress(
    @CurrentUserId() userId: string,
    @Param() { id }: IdRequest,
  ): Promise<OkResponse> {
    await this.userService.deleteAddress(userId, id);
    return {
      success: true,
    };
  }
}
