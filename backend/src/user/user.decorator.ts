import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type UserFragment = { userId: string };

export const AuthorizedUser = createParamDecorator<any, any, UserFragment>((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
