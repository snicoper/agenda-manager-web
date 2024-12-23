import { SystemRole } from '../types/system-roles.type';

export interface RouteAuthConfig {
  permissions?: string[];
  roles?: SystemRole[];
  requiresAll?: boolean;
}
