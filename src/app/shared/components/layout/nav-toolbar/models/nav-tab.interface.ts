import { Type } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { SystemRole } from '../../../../../core/types/system-roles';
import { AllPermissions } from '../../../../directives/required-permission.directive';

export interface NavTab {
  label: string;
  icon?: string;
  component: Type<unknown>;
  inputs?: Record<string, unknown>;
  disabled?: boolean;
  role?: SystemRole | SystemRole[];
  permission?: AllPermissions | AllPermissions[];
  badge?: {
    value: string | number;
    color?: ThemePalette;
  };
}
