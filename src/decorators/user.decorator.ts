import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export interface UserToken {
  idx: number;
  id: string;
  name: string;
  phone: string;
  iat: number;
  exp: number;
}

export const User = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user as UserToken;
    if (!data) return user;
    return user?.[data];
  },
);
