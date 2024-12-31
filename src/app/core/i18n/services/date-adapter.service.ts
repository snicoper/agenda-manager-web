import { computed, effect, inject, Injectable } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { DateTime } from 'luxon';
import { logInfo } from '../../errors/logger/logger';
import { LocaleStateService } from './locale.state.service';

@Injectable({ providedIn: 'root' })
export class DateAdapterService {
  private readonly localeStateService = inject(LocaleStateService);
  private dateAdapter = inject(DateAdapter<DateTime>);

  private readonly value = computed(() => this.localeStateService.value());

  initialize(): void {
    effect(() => {
      const currentLocale = this.value();

      if (currentLocale) {
        this.dateAdapter.setLocale(this.value());

        logInfo('DateAdapterService.initialize', `Date adapter locale set to ${currentLocale}`);
      }
    });
  }
}
