import { computed, Injectable, signal, Type } from '@angular/core';
import { BladeOptions } from '../interfaces/blade-options.interface';

@Injectable({ providedIn: 'root' })
export class BladeService {
  private readonly isVisible$ = signal(false);
  private readonly component$ = signal<Type<unknown> | null>(null);
  private readonly options$ = signal<BladeOptions>({ width: '480px' });

  readonly bladeState = computed(() => ({
    isVisible: this.isVisible$(),
    component: this.component$(),
    options: this.options$(),
  }));

  show(component: Type<unknown>, options?: BladeOptions): void {
    this.component$.set(component);

    if (options) {
      this.options$.set({ ...this.options$(), ...options });
    }

    this.isVisible$.set(true);
  }

  hide(): void {
    this.isVisible$.set(false);
    this.component$.set(null);
    this.options$.set({ width: '480px' });
  }
}
