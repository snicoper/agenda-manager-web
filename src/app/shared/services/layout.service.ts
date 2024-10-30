import { computed, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private navbarState$ = signal(true);
  private sidebarState$ = signal(true);
  private footerState$ = signal(true);

  navbarState = computed(() => this.navbarState$());
  sidebarState = computed(() => this.sidebarState$());
  footerState = computed(() => this.footerState$());

  navbarToggle() {
    this.navbarState$.update((value) => !value);
  }

  navbarSetState(value: boolean) {
    return this.navbarState$.set(value);
  }

  sidebarToggle() {
    this.sidebarState$.update((value) => !value);
  }

  sidebarSetState(value: boolean) {
    return this.sidebarState$.set(value);
  }

  footerToggle() {
    this.footerState$.update((value) => !value);
  }

  footerSetState(value: boolean) {
    return this.footerState$.set(value);
  }
}
