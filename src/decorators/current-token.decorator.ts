import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { last, split, trim } from 'lodash';
import { AppRequest } from 'src/models/interfaces/app-request.interface';

export const CurrentToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AppRequest>();
    const token = trim(last(split(request.headers['authorization'], ' ')));
    return token || '';
  },
);
