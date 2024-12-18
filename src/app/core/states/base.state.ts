import { computed, Signal, signal } from '@angular/core';
import { StateService } from './state.service';

// TODO: In development...

// @Injectable({ providedIn: 'root' })
// export class AppSettingsState extends BaseState<AppSettings> {
//   private readonly settingsApi = inject(AppSettingsApiService);

//   constructor() {
//     super();
//     this.refresh();
//   }

//   override refresh() {
//     this.settingsApi
//       .getSettings()
//       .pipe(take(1))
//       .subscribe((settings) => this.set(settings));
//   }
// }

export abstract class BaseState<T> implements StateService<T> {
  protected state$ = signal<T | null>(null);

  readonly value: Signal<T | null> = computed(() => this.state$());

  abstract refresh(): void;

  get(): T | null {
    return this.state$();
  }

  clean(): void {
    this.state$.set(null);
  }

  protected set(newState: T): void {
    if (newState !== this.state$()) {
      this.state$.set(newState);
    }
  }
}
