import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ErrorDictionary } from 'src/enums/error.dictionary';
import { AppRequest } from 'src/models/interfaces/app-request.interface';

export const CurrentUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const { currentUserId } = ctx.switchToHttp().getRequest<AppRequest>();

    if (!currentUserId) {
      throw new UnauthorizedException({
        code: ErrorDictionary.UNAUTHORIZED,
      });
    }

    return currentUserId;
  },
);
