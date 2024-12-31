import { Component } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'am-calendar-year',
  imports: [MatDatepickerModule],
  templateUrl: './calendar-year.component.html',
  styleUrl: './calendar-year.component.scss',
})
export class CalendarYearComponent {}
