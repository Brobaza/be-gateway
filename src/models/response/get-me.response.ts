import { UserAbout } from 'src/gen/user.service';

export class GetMeResponse {
  id: string;
  name: string;
  avatar: string;
  phoneNumber: string;
  address: string;
  location: string;
  about: UserAbout;
  isPublic: boolean;
  email: string;
  gender: string;
  phoneVerifiedAt: string;
  emailVerifiedAt: string;
  status: string;
  role: string;
}
