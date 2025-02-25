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
import { USER_SERVICE_NAME, UserServiceClient } from 'src/gen/user.service';
import { MICROSERVICE_SERVICE_NAME } from 'src/libs/constants/microservice.name';

@Injectable()
export class UserDomain implements OnModuleInit {
  private userDomain: UserServiceClient;

  constructor(
    @Inject(MICROSERVICE_SERVICE_NAME.USER_SERVICE)
    private clientUser: ClientGrpcProxy,
  ) {}

  async onModuleInit() {
    this.userDomain =
      await this.clientUser.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  async getUserThroughId(userId: string) {
    const resp = await firstValueFrom(this.userDomain.getUser({ id: userId }));

    if (isEmpty(resp.id)) {
      throw new UnauthorizedException({
        code: ErrorDictionary.USER_NOTFOUND,
      });
    }

    return resp;
  }
}
