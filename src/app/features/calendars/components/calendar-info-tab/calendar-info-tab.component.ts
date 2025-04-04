import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { finalize, take } from 'rxjs';
import { SiteUrls } from '../../../../core/config/site-urls';
import { logError } from '../../../../core/errors/logger/logger';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { DateTimeFormatPipe } from '../../../../shared/pipes/date-time-format.pipe';
import { CalendarApiService } from '../../services/api/calendar-api.service';
import { CalendarSelectedStateService } from '../../services/state/calendar-selected-state.service';
import { CalendarUpdateBladeComponent } from '../calendar-update-blade/calendar-update-blade.component';

@Component({
  selector: 'am-calendar-info-tab',
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    DateTimeFormatPipe,
  ],
  templateUrl: './calendar-info-tab.component.html',
  styleUrl: './calendar-info-tab.component.scss',
})
export class CalendarInfoTabComponent {
  private readonly apiService = inject(CalendarApiService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly calendarSelectedStateService = inject(CalendarSelectedStateService);
  private readonly bladeService = inject(BladeService);

  readonly siteUrls = SiteUrls;
  readonly calendarState = this.calendarSelectedStateService.state;

  handleOpenUpdateCalendarBlade(): void {
    this.bladeService.open(CalendarUpdateBladeComponent);

    this.bladeService.result.pipe(take(1)).subscribe({
      next: () => {
        this.calendarSelectedStateService.load(this.calendarState.calendarId()!);
      },
    });
  }

  handleChangeStateIsActive(): void {
    if (!this.calendarState.calendar()) {
      logError('CalendarInfoTabComponent.handleChangeStateIsActive', 'Calendar is not loaded');

      return;
    }

    this.calendarSelectedStateService.setLoadingState(true);

    this.apiService
      .toggleIsActive(this.calendarState.calendarId()!)
      .pipe(
        take(1),
        finalize(() => this.calendarSelectedStateService.setLoadingState(false)),
      )
      .subscribe({
        next: () => {
          this.snackBarService.success('Estado del calendario actualizado correctamente');
          this.calendarSelectedStateService.refresh();
        },
        error: () => {
          this.snackBarService.error('Error al actualizar el estado del calendario');
        },
      });
  }
}
