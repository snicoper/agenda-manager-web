import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { CalendarSelectorStateService } from './services/state/calendar-selector-state.service';

@Component({
  selector: 'am-calendar-selector',
  imports: [MatFormFieldModule, MatSelectModule, MatProgressSpinnerModule],
  templateUrl: './calendar-selector.component.html',
  styleUrl: './calendar-selector.component.scss',
})
export class CalendarSelectorComponent {
  private readonly calendarSelectorState = inject(CalendarSelectorStateService);

  readonly calendarState = this.calendarSelectorState.state;

  handleSelectCalendar(calendarId: string): void {
    this.calendarSelectorState.selectCalendar(calendarId);
  }
}
