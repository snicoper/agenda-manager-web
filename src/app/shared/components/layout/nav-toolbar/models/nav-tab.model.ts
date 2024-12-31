import { Type } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { AllPermissions } from '../../../../../core/modules/auth/types/all-permissions.type';
import { SystemRole } from '../../../../../core/modules/auth/types/system-roles.type';

export interface NavTab {
  index: number;
  name: string;
  label: string;
  icon?: string;
  component: Type<unknown>;
  inputs?: Record<string, unknown>;
  disabled?: boolean;
  roles?: SystemRole | SystemRole[] | undefined;
  permissions?: AllPermissions | AllPermissions[] | undefined;
  badge?: {
    value: string | number;
    color?: ThemePalette;
  };
}
