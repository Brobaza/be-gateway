import {
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientGrpcProxy } from '@nestjs/microservices';
import { PassportStrategy } from '@nestjs/passport';
import { isEmpty } from 'lodash';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { firstValueFrom } from 'rxjs';
import { ErrorDictionary } from 'src/enums/error.dictionary';
import { SessionType } from 'src/enums/session-type.enum';
import { AUTH_SERVICE_NAME, AuthServiceClient } from 'src/gen/auth.service';
import { MICROSERVICE_SERVICE_NAME } from 'src/libs/constants/microservice.name';
import { AppRequest } from 'src/models/interfaces/app-request.interface';
import { TokenPayload } from 'src/models/interfaces/token-payload.interface';

@Injectable()
export class JwtRefreshTokenStrategy
  extends PassportStrategy(Strategy, 'jwt-refresh-token')
  implements OnModuleInit
{
  private authenDomain: AuthServiceClient;
  private refreshTokenPublicKey: string;

  constructor(
    @Inject(MICROSERVICE_SERVICE_NAME.AUTH_SERVICE)
    private clientAuth: ClientGrpcProxy,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      // secretOrKey: REFRESH_TOKEN_PUBLIC_KEY,
      secretOrKeyProvider: async (_, __, done) => {
        try {
          if (!this.refreshTokenPublicKey) {
            const { key: publicKey } = await firstValueFrom(
              this.authenDomain.getPublicKey({ key: SessionType.REFRESH }),
            );
            this.refreshTokenPublicKey = publicKey;
          }
          done(null, this.refreshTokenPublicKey);
        } catch (error) {
          done(error, null);
        }
      },
      passReqToCallback: true,
    });
  }

  onModuleInit() {
    this.authenDomain =
      this.clientAuth.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  async validate(req: AppRequest, { id }: TokenPayload) {
    const { data, metadata } = await firstValueFrom(
      this.authenDomain.verifySession({
        id,
        type: SessionType.REFRESH,
      }),
    );

    if (isEmpty(data?.id) || isEmpty(data?.decodedUserId)) {
      throw new UnauthorizedException({
        code: ErrorDictionary.INVALID_TOKEN,
      });
    }

    if (metadata?.code !== '200' && !isEmpty(metadata?.errMessage)) {
      throw new UnauthorizedException({
        code: ErrorDictionary.INVALID_TOKEN,
      });
    }

    const { id: sessionId, decodedUserId: userId } = data;

    req.currentUserId = userId;
    req.currentSessionId = sessionId;

    return true;
  }
}
