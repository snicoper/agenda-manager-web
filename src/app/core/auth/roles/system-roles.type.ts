import { SystemRoles } from './system-roles.const';

export type SystemRole = (typeof SystemRoles)[keyof typeof SystemRoles];
