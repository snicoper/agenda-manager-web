import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { finalize, take } from 'rxjs';
import { SiteUrls } from '../../../../core/config/site-urls';
import { logError } from '../../../../core/errors/logger/logger.co';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { DateTimeFormatPipe } from '../../../../shared/pipes/date-time-format.pipe';
import { CalendarApiService } from '../../services/api/calendar-api.service';
import { CalendarDetailsStateService } from '../../services/calendar-details-state.service';
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
  private readonly calendarApi = inject(CalendarApiService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly calendarDetailsStateService = inject(CalendarDetailsStateService);
  private readonly bladeService = inject(BladeService);

  readonly siteUrls = SiteUrls;
  readonly calendarState = this.calendarDetailsStateService.state;

  handleOpenUpdateCalendarBlade(): void {
    this.bladeService.show(CalendarUpdateBladeComponent);

    this.bladeService.result.pipe(take(1)).subscribe({
      next: () => {
        this.calendarDetailsStateService.load(this.calendarState.calendarId()!);
      },
    });
  }

  handleChangeStateIsActive(): void {
    if (!this.calendarState.calendar()) {
      logError('CalendarInfoTabComponent.handleChangeStateIsActive', 'Calendar is not loaded');

      return;
    }

    this.calendarDetailsStateService.setLoadingState(true);

    this.calendarApi
      .toggleIsActive(this.calendarState.calendarId()!)
      .pipe(
        take(1),
        finalize(() => this.calendarDetailsStateService.setLoadingState(false)),
      )
      .subscribe({
        next: () => {
          this.snackBarService.success('Estado del calendario actualizado correctamente');
          this.calendarDetailsStateService.refresh();
        },
        error: () => {
          this.snackBarService.error('Error al actualizar el estado del calendario');
        },
      });
  }
}
