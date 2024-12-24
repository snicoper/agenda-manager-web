import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { finalize, take } from 'rxjs';
import { SiteUrls } from '../../../../core/config/site-urls';
import { SnackBarService } from '../../../../core/services/snackbar.service';
import { BladeService } from '../../../../shared/components/blade/services/blade.service';
import { DateTimeFormatPipe } from '../../../../shared/pipes/date-time-format.pipe';
import { CalendarApiService } from '../../services/api/calendar-api.service';
import { CalendarDetailsService } from '../../services/calendar-details.service';

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
  private readonly calendarDetailsService = inject(CalendarDetailsService);
  private readonly bladeService = inject(BladeService);

  readonly siteUrls = SiteUrls;
  readonly calendarState = this.calendarDetailsService.state;

  handleOpenUpdateCalendarBlade(): void {}

  handleChangeStateIsActive(): void {
    if (!this.calendarState.calendar()) {
      return;
    }

    this.calendarDetailsService.setLoadingState(true);

    this.calendarApi
      .toggleIsActive(this.calendarState.calendarId()!)
      .pipe(
        take(1),
        finalize(() => this.calendarDetailsService.setLoadingState(false)),
      )
      .subscribe({
        next: () => {
          this.snackBarService.success('Estado del calendario actualizado correctamente');
          this.calendarDetailsService.load(this.calendarState.calendarId()!);
        },
        error: () => {
          this.snackBarService.error('Error al actualizar el estado del calendario');
        },
      });
  }
}
