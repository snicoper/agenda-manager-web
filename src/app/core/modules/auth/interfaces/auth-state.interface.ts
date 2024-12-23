import { Signal } from '@angular/core';

export interface AuthState {
  isLoading: Signal<boolean>;
  isLoggedIn: Signal<boolean>;
}
