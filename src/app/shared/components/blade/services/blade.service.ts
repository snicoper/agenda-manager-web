import { computed, effect, Injectable, signal, Type } from '@angular/core';
import { Subject } from 'rxjs';
import { BladeOptions } from '../interfaces/blade-options.interface';
import { BladeState } from '../interfaces/blade-state.interface';

@Injectable({ providedIn: 'root' })
export class BladeService {
  private readonly isVisible$ = signal(false);
  private readonly component$ = signal<Type<unknown> | null>(null);
  private readonly options$ = signal<BladeOptions>({ width: '700px' });

  private readonly resultSubject$ = new Subject<unknown>();
  readonly result = this.resultSubject$.asObservable();

  readonly bladeState: BladeState = {
    isVisible: computed(() => this.isVisible$()),
    component: computed(() => this.component$()),
    options: computed(() => this.options$()),
  };

  constructor() {
    // Manejar el scroll basado en el estado de visibilidad.
    effect(() => {
      document.body.style.overflow = this.isVisible$() ? 'hidden' : '';
    });
  }

  show<TData>(component: Type<unknown>, options?: BladeOptions<TData>): void {
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
  }

  emitResult<TResult>(result: TResult): void {
    this.resultSubject$.next(result);
    this.hide();
  }
}
