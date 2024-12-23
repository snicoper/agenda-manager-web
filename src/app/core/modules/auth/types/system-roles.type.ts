import { SystemRoles } from '../constants/system-roles.const';

export type SystemRole = (typeof SystemRoles)[keyof typeof SystemRoles];
