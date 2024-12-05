import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { TOKEN_VERIFY_USECASE, TokenVerifyUsecase } from '../usecase/token.verify.usecase';
import { UnauthorizedUserException } from '../../common/error/unauthorized.user.exception';

@Injectable()
export class CommonJwtGuard implements CanActivate {

  constructor(@Inject(TOKEN_VERIFY_USECASE)
              private readonly tokenVerifyUsecase: TokenVerifyUsecase) {
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const accessToken = this.extractToken(request);
    this.tokenVerifyUsecase.verify(accessToken);
    return true;
  }

  private extractToken(request): string {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer') {
      throw new UnauthorizedUserException();
    }
    return token;
  }
}