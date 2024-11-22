import { computed, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isLoggedIn$ = signal(false);

  isLoggedIn = computed(() => this.isLoggedIn$());
}
