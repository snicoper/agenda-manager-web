import { Type } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { SystemRole } from '../../../../../core/auth/roles/system-roles.type';
import { AllPermissions } from '../../../../directives/required-permission.directive';

export interface NavTab {
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
