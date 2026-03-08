import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserInfo } from './interfaces/auth.interfaces';

export const CurrentUser = createParamDecorator(
  (data: keyof UserInfo | undefined, ctx: ExecutionContext): any => {
    const req = ctx.switchToHttp().getRequest<{
      user: UserInfo;
    }>();

    if (!req.user) return null;

    if (data) return req.user[data]; 
    return req.user;
  },
);