import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ErrorDictionary } from 'src/enums/error.dictionary';
import { AppRequest } from 'src/models/interfaces/app-request.interface';

export const CurrentSessionId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const { currentSessionId } = ctx.switchToHttp().getRequest<AppRequest>();
    if (!currentSessionId) {
      throw new UnauthorizedException({
        code: ErrorDictionary.UNAUTHORIZED,
      });
    }
    return currentSessionId;
  },
);
