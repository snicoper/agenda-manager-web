import { CommonModule } from '@angular/common';
import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, FormGroup, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { getTimeZones } from '@vvo/tzdb';
import { FormState } from '../../../../../../core/modules/forms/interfaces/form-state.interface';
import { SelectOnFocusDirective } from '../../../../../directives/select-on-focus.directive';
import { FieldErrorComponent } from '../../../errors/field-error/field-error.component';
import { FormTimeZoneField } from './models/form-time-zone-field.interface';

/* eslint-disable  @typescript-eslint/no-empty-function */

@Component({
  selector: 'am-form-time-zone-selector',
  templateUrl: './form-time-zone-selector.component.html',
  styleUrl: './form-time-zone-selector.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormTimeZoneSelectorComponent),
      multi: true,
    },
  ],
  imports: [
    FormsModule,
    CommonModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    FieldErrorComponent,
    SelectOnFocusDirective,
  ],
})
export class FormTimeZoneSelectorComponent implements ControlValueAccessor {
  formState = input.required<FormState>();
  fieldName = input.required<string>();
  label = input.required<string>();
  placeholder = input('');

  value = '';
  items: FormTimeZoneField[];
  itemsFiltered: FormTimeZoneField[];
  isDisabled = false;

  // Generate unique id for each instance of the component.
  private static nextId = 0;
  id = `time-zone-field-${(FormTimeZoneSelectorComponent.nextId += 1)}`;

  constructor() {
    this.items = getTimeZones().map((tz) => {
      return { id: tz.name, name: tz.name };
    });

    this.itemsFiltered = this.items;
  }

  onChange = (_: string): void => {};

  onTouch = (): void => {};

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onChangeValue(value: string): void {
    this.itemsFiltered = this.filter(value) ?? Array<string>;

    this.onChange(value);
    this.onTouch();
  }

  isInvalid(): boolean {
    const control = this.formState().form.get(this.fieldName()) as FormGroup;

    return !!(
      ((this.formState().isSubmitted && control.invalid) || this.formState().badRequest?.errors?.[this.fieldName()]) ??
      false
    );
  }

  private filter(value: string): FormTimeZoneField[] {
    const filterValue = value.toLocaleLowerCase();
    const filterResult = this.items.filter((item) => item.name.toLocaleLowerCase().includes(filterValue));

    return filterResult;
  }
}
