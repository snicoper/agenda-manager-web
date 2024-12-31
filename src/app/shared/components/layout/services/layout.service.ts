import { computed, Injectable, signal } from '@angular/core';
import { LayoutState } from '../models/layout-state.model';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private navbarState$ = signal(true);
  private sidebarState$ = signal(true);
  private footerState$ = signal(true);

  readonly layoutState: LayoutState = {
    navbarState: computed(() => this.navbarState$()),
    sidebarState: computed(() => this.sidebarState$()),
    footerState: computed(() => this.footerState$()),
  };

  navbarToggle(): void {
    this.navbarState$.update((value) => !value);
  }

  navbarSetState(value: boolean): void {
    this.navbarState$.set(value);
  }

  sidebarToggle(): void {
    this.sidebarState$.update((value) => !value);
  }

  sidebarSetState(value: boolean): void {
    this.sidebarState$.set(value);
  }

  footerToggle(): void {
    this.footerState$.update((value) => !value);
  }

  footerSetState(value: boolean): void {
    this.footerState$.set(value);
  }
}
