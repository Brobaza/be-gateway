import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { PUBLIC_ROUTE_KEY, SKIP_VERIFICATION_KEY } from 'src/decorators';
import { ADMIN_ROUTE_KEY } from 'src/decorators/admin-route.decorator';
import { AppRequest } from 'src/models/interfaces/app-request.interface';

@Injectable()
export class JwtAccessTokenGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic =
      this.reflector.getAllAndOverride<boolean>(PUBLIC_ROUTE_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || false;

    const skipVerification =
      this.reflector.getAllAndOverride<boolean>(SKIP_VERIFICATION_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || false;

    const adminRoute =
      this.reflector.getAllAndOverride<boolean>(ADMIN_ROUTE_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || false;

    const request = context.switchToHttp().getRequest<AppRequest>();
    request.skipVerification = skipVerification;
    request.adminRoute = adminRoute;

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
