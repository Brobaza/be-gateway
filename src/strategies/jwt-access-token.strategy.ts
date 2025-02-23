import {
  ForbiddenException,
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
import { Role } from 'src/enums/role.enum';
import { SessionType } from 'src/enums/session-type.enum';
import { AUTH_SERVICE_NAME, AuthServiceClient } from 'src/gen/auth.service';
import { USER_SERVICE_NAME, UserServiceClient } from 'src/gen/user.service';
import { MICROSERVICE_SERVICE_NAME } from 'src/libs/constants/microservice.name';
import { AppRequest } from 'src/models/interfaces/app-request.interface';
import { TokenPayload } from 'src/models/interfaces/token-payload.interface';

@Injectable()
export class JwtAccessTokenStrategy
  extends PassportStrategy(Strategy)
  implements OnModuleInit
{
  private authenDomain: AuthServiceClient;
  private userDomain: UserServiceClient;
  private accessTokenPublicKey: string;

  constructor(
    @Inject(MICROSERVICE_SERVICE_NAME.AUTH_SERVICE)
    private clientAuth: ClientGrpcProxy,
    @Inject(MICROSERVICE_SERVICE_NAME.USER_SERVICE)
    private clientUser: ClientGrpcProxy,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      // secretOrKey: ACCESS_TOKEN_PUBLIC_KEY,
      secretOrKeyProvider: async (_, __, done) => {
        try {
          if (!this.accessTokenPublicKey) {
            const { key: publicKey } = await firstValueFrom(
              this.authenDomain.getPublicKey({ key: SessionType.ACCESS }),
            );
            this.accessTokenPublicKey = publicKey;
          }
          done(null, this.accessTokenPublicKey);
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
    this.userDomain =
      this.clientUser.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  async validate(req: AppRequest, { id }: TokenPayload) {
    const { data, metadata } = await firstValueFrom(
      this.authenDomain.verifySession({
        id,
        type: SessionType.ACCESS,
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

    const { decodedUserId: userId, id: sessionId } = data;

    if (req.adminRoute || !req.skipVerification) {
      const user = await firstValueFrom(
        this.userDomain.getUser({ id: userId }),
      );

      if (!isEmpty(user?.id)) {
        throw new UnauthorizedException({
          code: ErrorDictionary.USER_NOTFOUND,
        });
      }

      if (!req.skipVerification) {
        if (!user) {
          throw new UnauthorizedException({
            code: ErrorDictionary.USER_NOTFOUND,
          });
        }

        // if (!user.emailVerifiedAt && !user.phoneVerifiedAt) {
        //   throw new UnauthorizedException({
        //     code: ErrorDictionary.EMAIL_AND_PHONE_NOT_VERIFIED,
        //   });
        // }
      }

      if (req.adminRoute) {
        if (user.role !== Role.ADMIN) {
          throw new ForbiddenException({
            code: ErrorDictionary.FORBIDDEN,
          });
        }
      }
    }

    req.currentUserId = userId;
    req.currentSessionId = sessionId;

    return true;
  }
}
