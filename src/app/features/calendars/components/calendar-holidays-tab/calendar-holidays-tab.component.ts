import { Component } from '@angular/core';
import { DateTime } from 'luxon';
import { CalendarItem } from '../../../../shared/components/calendars/year-calendar/models/calendar-event.model';
import { YearCalendarComponent } from '../../../../shared/components/calendars/year-calendar/year-calendar.component';

@Component({
  selector: 'am-calendar-holidays-tab',
  imports: [YearCalendarComponent],
  templateUrl: './calendar-holidays-tab.component.html',
  styleUrl: './calendar-holidays-tab.component.scss',
})
export class CalendarHolidaysTabComponent {
  day = DateTime.local().minus({ days: 10 }).startOf('day');
  year = 2024;

  items: CalendarItem[] = [
    {
      period: {
        start: this.day,
        end: this.day,
      },
    },
  ];
}
