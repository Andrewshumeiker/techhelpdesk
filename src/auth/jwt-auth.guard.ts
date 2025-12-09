import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/** 
 * Guard that protects routes using the JWT strategy.  Should be used
 * conjuntamente with the RolesGuard for validating permissions.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}