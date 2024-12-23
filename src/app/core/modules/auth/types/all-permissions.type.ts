import { Permission, SystemPermissionsType } from '../interfaces/system-permissions.interface';

export type AllPermissions = {
  [K in keyof SystemPermissionsType]: SystemPermissionsType[K][keyof Permission];
}[keyof SystemPermissionsType];
