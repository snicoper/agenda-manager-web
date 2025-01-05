import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { CalendarSelectedStateService } from './services/state/calendar-selected-state.service';

@Component({
  selector: 'am-calendar-selector',
  imports: [MatFormFieldModule, MatSelectModule, MatProgressSpinnerModule],
  templateUrl: './calendar-selector.component.html',
  styleUrl: './calendar-selector.component.scss',
})
export class CalendarSelectorComponent {
  private readonly calendarSelectedState = inject(CalendarSelectedStateService);

  readonly calendarState = this.calendarSelectedState.state;

  handleSelectCalendar(calendarId: string): void {
    this.calendarSelectedState.selectCalendar(calendarId);
  }
}
