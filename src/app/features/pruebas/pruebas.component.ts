import { Component } from '@angular/core';
import { DateTime } from 'luxon';
import { Period } from '../../core/models/period.model';
import { YearCalendarComponent } from '../../shared/components/calendars/year-calendar/year-calendar.component';

@Component({
  selector: 'am-pruebas',
  imports: [YearCalendarComponent],
  templateUrl: './pruebas.component.html',
  styleUrl: './pruebas.component.scss',
})
export class PruebasComponent {
  day = DateTime.local().minus({ days: 10 }).startOf('day');
  year = 2024;
  periods: Period[] = [
    {
      start: this.day,
      end: this.day,
    },
  ];
}
