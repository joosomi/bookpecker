import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

import { IsPublicKey } from '../decorators/public.decorator';
import { AuthInfo, JwtUser } from '../types/jwt.type';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  getRequest(context: ExecutionContext): Request {
    if (context.getType() === 'http') {
      return context.switchToHttp().getRequest();
    }
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IsPublicKey, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic === true) {
      return true;
    }
    return super.canActivate(context); //jwt 유효성 검사
  }

  handleRequest<TUser extends JwtUser>(err: Error, user: TUser, info: AuthInfo): TUser {
    if (err || !user) {
      // 토큰이 만료된 경우
      if (info && info.name === 'TokenExpiredError') {
        throw new UnauthorizedException('만료된 토큰입니다. 다시 로그인 해주세요.');
      }

      // 토큰이 유효하지 않은 경우
      if (info && info.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('사용자 인증에 실패하였습니다. 다시 로그인 해주세요.');
      }

      throw new UnauthorizedException('사용자 인증에 실패하였습니다. 다시 로그인 해주세요.');
    }

    return user; //인증된 사용자 정보는 request.user로 설정됨
  }
}
