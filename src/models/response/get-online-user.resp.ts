import { User } from 'src/gen/chat.service';

export class GetOnlineUserResponse {
  items: User[];
  total: number;
}
