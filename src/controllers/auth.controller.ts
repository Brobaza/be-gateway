import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { CurrentSessionId, CurrentToken, CurrentUserId } from 'src/decorators';
import { SessionType } from 'src/enums/session-type.enum';
import { CreateUserRequest } from 'src/gen/user.service';
import { JwtAccessTokenGuard } from 'src/guards/jwt-access-token.guard';
import { LoginRequest } from 'src/models/request/login.request';
import { LoginResponse } from 'src/models/response/login.response';
import { OkResponse } from 'src/models/response/ok.response';
import { RegisterResponse } from 'src/models/response/register.response';
import { AuthService } from 'src/services/auth.service';

@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({ type: () => LoginResponse })
  @HttpCode(HttpStatus.OK)
  @Post('/sign-in')
  async login(@Body() body: LoginRequest): Promise<LoginResponse> {
    const result = await this.authService.login(body);
    return result;
  }

  @ApiOkResponse({ type: () => RegisterResponse })
  @HttpCode(HttpStatus.OK)
  @Post('/sign-up')
  async register(@Body() dto: CreateUserRequest): Promise<RegisterResponse> {
    const result = await this.authService.register(dto);
    return result;
  }

  @ApiBearerAuth(SessionType.ACCESS)
  @ApiOkResponse({ type: () => OkResponse })
  @UseGuards(JwtAccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/sign-out')
  async logout(
    @CurrentUserId() userId: string,
    @CurrentSessionId() sessionId: string,
    @CurrentToken() token: string,
  ): Promise<OkResponse> {
    const result = await this.authService.logout(userId, sessionId, token);
    return result;
  }
}
