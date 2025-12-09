import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator to get the authenticated user from the request context.
 *
 * Example:
 * ```ts
 * @Get('me')
 * getProfile(@CurrentUser() user: User) {
 *   return user;
 * }
 * ```
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);