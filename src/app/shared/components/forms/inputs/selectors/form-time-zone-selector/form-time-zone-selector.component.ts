import { CommonModule } from '@angular/common';
import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, FormGroup, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { getTimeZones } from '@vvo/tzdb';
import { FormState } from '../../../../../../core/forms/models/form-state.model';
import { SelectOnFocusDirective } from '../../../../../directives/select-on-focus.directive';
import { FieldErrorComponent } from '../../../errors/field-error/field-error.component';
import { FormIconPosition } from '../../../types/form-icon-position.enum';
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
  readonly formState = input.required<FormState>();
  readonly fieldName = input.required<string>();
  readonly label = input.required<string>();
  readonly placeholder = input('');
  readonly icon = input('');
  readonly formIconPosition = input(FormIconPosition.prefix);

  readonly value = signal('');
  readonly items = signal<FormTimeZoneField[]>([]);
  readonly itemsFiltered = signal<FormTimeZoneField[]>([]);
  readonly isDisabled = signal(false);
  readonly iconPositions = FormIconPosition;

  // Generate unique id for each instance of the component.
  private static nextId = 0;
  id = `time-zone-field-${(FormTimeZoneSelectorComponent.nextId += 1)}`;

  constructor() {
    this.items.set(
      getTimeZones().map((tz) => {
        return { id: tz.name, name: tz.name };
      }),
    );

    this.itemsFiltered = this.items;
  }

  onChange = (_: string): void => {};

  onTouch = (): void => {};

  writeValue(value: string): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  handleChangeValue(value: string): void {
    this.itemsFiltered.set(this.filter(value) ?? Array<string>);
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
    const filterResult = this.items().filter((item) => item.name.toLocaleLowerCase().includes(filterValue));

    return filterResult;
  }
}
