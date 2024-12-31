import { Permission, SystemPermissionsType } from '../models/system-permissions.model';

export type AllPermissions = {
  [K in keyof SystemPermissionsType]: SystemPermissionsType[K][keyof Permission];
}[keyof SystemPermissionsType];
