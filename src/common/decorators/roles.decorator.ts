import { SetMetadata } from '@nestjs/common';

/**
 * Constant that defines the key of the roles in the Nest metadata.
 */
export const ROLES_KEY = 'roles';

/**
 * Decorator to set the roles allowed in a handler.
 *
 * Usage: `@Roles('admin', 'technician')`
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);