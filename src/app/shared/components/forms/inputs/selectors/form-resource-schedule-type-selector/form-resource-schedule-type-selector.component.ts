/* eslint-disable  @typescript-eslint/no-empty-function */
import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormState } from '../../../../../../core/forms/models/form-state.model';
import { ResourceScheduleTypeUtils } from '../../../../../../core/modules/resource-management/resource-schedule-type/resource-schedule-type.const';
import { ResourceScheduleType } from '../../../../../../core/modules/resource-management/resource-schedule-type/resource-schedule-type.enum';
import { SelectOnFocusDirective } from '../../../../../directives/select-on-focus.directive';
import { FieldErrorComponent } from '../../../errors/field-error/field-error.component';
import { FormIconPosition } from '../../../types/form-icon-position.enum';

@Component({
  selector: 'am-form-resource-schedule-type-selector',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
    MatAutocompleteModule,
    FieldErrorComponent,
    SelectOnFocusDirective,
  ],
  templateUrl: './form-resource-schedule-type-selector.component.html',
  styleUrl: './form-resource-schedule-type-selector.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormResourceScheduleTypeSelectorComponent),
      multi: true,
    },
  ],
})
export class FormResourceScheduleTypeSelectorComponent implements ControlValueAccessor {
  readonly formState = input.required<FormState>();
  readonly fieldName = input.required<string>();
  readonly label = input.required<string>();
  readonly readonly = input(false);
  readonly placeholder = input('');
  readonly icon = input('');
  readonly formIconPosition = input(FormIconPosition.prefix);

  readonly value = signal<ResourceScheduleType | null>(null);
  readonly isDisabled = signal(false);
  readonly iconPositions = FormIconPosition;
  readonly resourceScheduleTypeUtils = ResourceScheduleTypeUtils;

  // Generate unique id for each instance of the component.
  private static nextId = 0;
  id = `form-resource-schedule-type-selector-${(FormResourceScheduleTypeSelectorComponent.nextId += 1)}`;

  onChange = (_: ResourceScheduleType): void => {};

  onTouch = (): void => {};

  displayFn = (value: ResourceScheduleType): string => {
    const option = this.resourceScheduleTypeUtils.getOptions().find((opt) => opt.value === value);

    return option ? option.description : '';
  };

  writeValue(value: ResourceScheduleType): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: ResourceScheduleType) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  onChangeValue(value: ResourceScheduleType): void {
    this.onChange(value);
    this.onTouch();
  }
}
