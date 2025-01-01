import { Component, effect, input, output, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { DateTime } from 'luxon';

@Component({
  selector: 'am-year-selector',
  imports: [MatDatepickerModule, MatIconModule, MatButtonModule],
  templateUrl: './year-selector.component.html',
  styleUrl: './year-selector.component.scss',
})
export class YearSelectorComponent {
  year = input.required<number>();
  yearSelected = output<DateTime>();

  @ViewChild('picker') private readonly picker!: MatDatepicker<DateTime>;

  protected readonly selectedYear = signal<number | null>(null);

  constructor() {
    effect(() => {
      this.selectedYear.set(this.year());
    });
  }

  handleYearSelected(date: DateTime): void {
    this.selectedYear.set(date.year);
    this.yearSelected.emit(date);
    this.picker.close();
  }

  handleDecrementYear(): void {
    const currentYear = this.selectedYear();

    if (currentYear) {
      const newDate = DateTime.fromObject({ year: currentYear }).minus({ years: 1 });
      this.yearSelected.emit(newDate);
      this.selectedYear.set(newDate.year);
    }
  }

  handleIncrementYear(): void {
    const currentYear = this.selectedYear();

    if (currentYear) {
      const newDate = DateTime.fromObject({ year: currentYear }).plus({ years: 1 });
      this.yearSelected.emit(newDate);
      this.selectedYear.set(newDate.year);
    }
  }
}
