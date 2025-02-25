import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUserId, SkipVerification } from 'src/decorators';
import { SessionType } from 'src/enums/session-type.enum';
import { JwtAccessTokenGuard } from 'src/guards/jwt-access-token.guard';
import { GetMeResponse } from 'src/models/response/get-me.response';
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
}
