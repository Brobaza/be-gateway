import {
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientGrpcProxy } from '@nestjs/microservices';
import { isEmpty } from 'lodash';
import { firstValueFrom } from 'rxjs';
import { ErrorDictionary } from 'src/enums/error.dictionary';
import { AUTH_SERVICE_NAME, AuthServiceClient } from 'src/gen/auth.service';
import {
  CreateUserRequest,
  USER_SERVICE_NAME,
  UserServiceClient,
} from 'src/gen/user.service';
import { MICROSERVICE_SERVICE_NAME } from 'src/libs/constants/microservice.name';
import { LoginRequest } from 'src/models/request/login.request';

@Injectable()
export class AuthService implements OnModuleInit {
  private authenDomain: AuthServiceClient;
  private userDomain: UserServiceClient;

  constructor(
    @Inject(MICROSERVICE_SERVICE_NAME.AUTH_SERVICE)
    private clientAuth: ClientGrpcProxy,
    @Inject(MICROSERVICE_SERVICE_NAME.USER_SERVICE)
    private clientUser: ClientGrpcProxy,
  ) {}

  onModuleInit() {
    this.authenDomain =
      this.clientAuth.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
    this.userDomain =
      this.clientUser.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  async login(body: LoginRequest) {
    const resp = await firstValueFrom(this.authenDomain.login(body));

    const { data, metadata } = resp;

    if (isEmpty(data.accessToken) || isEmpty(data.refreshToken)) {
      throw new UnauthorizedException({
        code: ErrorDictionary.USERNAME_INCORRECT,
      });
    }

    if (metadata?.code !== '200' && !isEmpty(metadata?.errMessage)) {
      throw new UnauthorizedException({
        code: metadata?.errMessage,
      });
    }

    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      accessExpiresAt: new Date(data.accessTokenExpireAt),
      refreshExpiresAt: new Date(data.refreshTokenExpireAt),
    };
  }

  async register(dto: CreateUserRequest) {
    const resp = await firstValueFrom(this.authenDomain.register(dto));

    const { data, metadata } = resp;

    if (isEmpty(data.accessToken) || isEmpty(data.refreshToken)) {
      throw new UnauthorizedException({
        code: ErrorDictionary.USERNAME_INCORRECT,
      });
    }

    if (metadata?.code !== '200' && !isEmpty(metadata?.errMessage)) {
      throw new UnauthorizedException({
        code: metadata?.errMessage,
      });
    }

    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      accessExpiresAt: new Date(data.accessTokenExpireAt),
      refreshExpiresAt: new Date(data.refreshTokenExpireAt),
      verifyToken: data.verifyToken,
    };
  }

  async logout(userId: string, sessionId: string, token: string) {
    const resp = await firstValueFrom(
      this.authenDomain.logout({
        userId,
        sessionId,
        token,
      }),
    );

    const { errMessage, code } = resp;

    if (code !== '200' && !isEmpty(errMessage)) {
      throw new UnauthorizedException({
        code: errMessage,
      });
    }

    return {
      success: true,
    };
  }
}
