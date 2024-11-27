import { CommonModule } from '@angular/common';
import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, FormGroup, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { getTimeZones } from '@vvo/tzdb';
import { FormState } from '../../../../../core/models/form-state';
import { FieldErrorComponent } from '../../errors/field-error/field-error.component';
import { FormTimeZoneItem } from './form-time-zone.item.model';

/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unused-vars */
/* eslint-disable  @typescript-eslint/no-empty-function */

@Component({
  selector: 'am-form-timezone',
  templateUrl: './form-timezone.component.html',
  styleUrl: './form-timezone.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormTimezoneComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [FormsModule, CommonModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule, FieldErrorComponent],
})
export class FormTimezoneComponent implements ControlValueAccessor {
  formState = input.required<FormState>();
  fieldName = input.required<string>();
  label = input.required<string>();
  id = input(Math.random().toString());
  placeholder = input('');

  value = '';
  items: FormTimeZoneItem[];
  itemsFiltered: FormTimeZoneItem[];
  isDisabled = false;

  constructor() {
    this.items = getTimeZones().map((tz) => {
      return { id: tz.name, name: tz.name };
    });

    this.itemsFiltered = this.items;
  }

  onChange = (_: string): void => {};

  onTouch = (): void => {};

  writeValue(value: string): void {
    if (value !== undefined && value !== this.value) {
      this.value = value || '';
      this.onChange(this.value);
    } else {
      this.value = '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onChangeValue(value: string): void {
    this.itemsFiltered = this.filter(value) ?? Array<string>;

    this.onChange(value);
  }

  isInvalid(): boolean {
    const control = this.formState().form.get(this.fieldName()) as FormGroup;

    return !!(
      (this.formState().isSubmitted && control.invalid) ||
      this.formState().badRequest?.errors[this.fieldName()]
    );
  }

  private filter(value: string): FormTimeZoneItem[] {
    const filterValue = value.toLocaleLowerCase();
    const filterResult = this.items.filter((item) => item.name.toLocaleLowerCase().includes(filterValue));

    return filterResult;
  }
}
