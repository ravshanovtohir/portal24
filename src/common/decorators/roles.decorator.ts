import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const IS_PUBLIC_KEY = 'isPublic';
export const Roles = (...roles: any[]) => SetMetadata(ROLES_KEY, roles);
export const IsPublic = (...args: string[]) => SetMetadata(IS_PUBLIC_KEY, args);
