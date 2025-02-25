import { Injectable } from '@nestjs/common';
import { UserDomain } from 'src/domains/user.domain';

@Injectable()
export class UserService {
  constructor(private readonly userDomain: UserDomain) {}

  async getMe(userId: string) {
    const resp = await this.userDomain.getUserThroughId(userId);

    return resp;
  }
}
