import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { TOKEN_VERIFY_USECASE, TokenVerifyUsecase } from '../usecase/token.verify.usecase';
import { UnauthorizedUserException } from '../../common/error/unauthorized.user.exception';

@Injectable()
export class UserDetailJwtGuard implements CanActivate {

  constructor(
    @Inject(TOKEN_VERIFY_USECASE)
    private readonly tokenVerifyUsecase: TokenVerifyUsecase,
  ) {
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const accessToken = this.extractToken(request);
    const payload = this.tokenVerifyUsecase.verify(accessToken);
    const bodyUserId = +request.body?.userId;
    const paramUserId = +request.params?.userId;
    const queryUserId = +request.query?.userId;
    this.verifyUserId(bodyUserId, payload, paramUserId, queryUserId);

    return true;
  }

  private verifyUserId(bodyUserId, payload: Record<string, any>, paramUserId, queryUserId) {
    if (bodyUserId && +payload.userId !== bodyUserId) {
      throw new UnauthorizedUserException();
    }

    if (paramUserId && +payload.userId !== paramUserId) {
      throw new UnauthorizedUserException();
    }

    if (queryUserId && +payload.userId !== queryUserId) {
      throw new UnauthorizedUserException();
    }

    if (!queryUserId && !paramUserId && !bodyUserId) {
      throw new UnauthorizedUserException();
    }
  }

  private extractToken(request): string {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer') {
      throw new UnauthorizedUserException();
    }
    return token;
  }

}