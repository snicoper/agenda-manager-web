import { SystemRole } from '../roles/system-roles.type';

export interface RouteAuthConfig {
  permissions?: string[];
  roles?: SystemRole[];
  requiresAll?: boolean;
}
