import { Type } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

export interface NavTab {
  label: string;
  icon?: string;
  component: Type<unknown>;
  inputs?: Record<string, unknown>;
  disabled?: boolean;
  badge?: {
    value: string | number;
    color?: ThemePalette;
  };
}
