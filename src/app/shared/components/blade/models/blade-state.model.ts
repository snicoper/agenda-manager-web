import { Signal } from '@angular/core';
import { BladeOptions } from './blade-options.model';

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface BladeState {
  isVisible: Signal<boolean>;
  component: Signal<any>;
  options: Signal<BladeOptions>;
}
