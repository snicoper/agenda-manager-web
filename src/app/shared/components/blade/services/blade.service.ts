import { computed, Injectable, signal, Type } from '@angular/core';
import { Subject } from 'rxjs';
import { BladeOptions } from '../interfaces/blade-options.interface';

@Injectable({ providedIn: 'root' })
export class BladeService {
  private readonly isVisible$ = signal(false);
  private readonly component$ = signal<Type<unknown> | null>(null);
  private readonly options$ = signal<BladeOptions>({ width: '480px' });

  private readonly resultSubject$ = new Subject<unknown>();
  readonly result = this.resultSubject$.asObservable();

  readonly bladeState = computed(() => ({
    isVisible: this.isVisible$(),
    component: this.component$(),
    options: this.options$(),
  }));

  show<TData = unknown>(component: Type<unknown>, options?: BladeOptions<TData>): void {
    this.component$.set(component);

    if (options) {
      this.options$.set({ ...this.options$(), ...options });
    }

    if (options?.data) {
      this.options$.set({ ...this.options$(), ...options.data });
    }

    this.isVisible$.set(true);
  }

  hide(): void {
    this.isVisible$.set(false);
    this.component$.set(null);
    this.options$.set({ width: '480px' });
  }

  emitResult(result: unknown): void {
    this.resultSubject$.next(result);
    this.hide();
  }
}
